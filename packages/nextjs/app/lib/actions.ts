"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { abi } from "./abi";
import { publicClient } from "./client";
import { Choice, Question, connectedAddressKey } from "./definitions";
import { sql } from "@vercel/postgres";

export async function setAddressCookie(address: string) {
  const cookieStore = await cookies();
  cookieStore.set(connectedAddressKey, address);
}

export async function fetchQuestions() {
  try {
    const questions = await sql<Question>`SELECT questions.*, json_agg(choices) AS choices_array 
           FROM questions 
           LEFT JOIN choices ON questions.id = choices.question_id
           GROUP BY questions.id;
           `;

    // console.log("Questions fetched ", questions.rows);
    return questions.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
}

export async function fetchQuestionById(q_id: string) {
  console.log("fetching question by id", q_id);
  try {
    const questions = await sql<Question>`SELECT questions.*, json_agg(choices.*) AS choices_array 
           FROM questions 
           LEFT JOIN choices ON questions.id = choices.question_id
           WHERE questions.id = ${q_id}
           GROUP BY questions.id;
           `;

    console.log("Questions fetched ", questions.rows);
    return questions.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
}

export async function createAnswer(formData: FormData) {
  const question_id = formData.get("question")?.toString();
  const choice_id = formData.get("radio-0")?.toString();

  const cookieStore = await cookies();
  const connectedAddress = cookieStore.get(connectedAddressKey)?.value;

  if (connectedAddress && question_id && choice_id) {
    console.log(connectedAddress);
    try {
      await sql`
      INSERT INTO answers (sh_id, question_id, choice_id, answer_time)
      VALUES (${connectedAddress}, ${question_id}, ${choice_id}, now())
    `;
    } catch (error) {
      console.log(error);
      return;
    }

    await updateResults(choice_id);
  }

  revalidatePath("/voting");
}

export async function fetchVotingResult(q_id: string) {
  const result = await sql<Choice>`SELECT * FROM choices WHERE question_id=${q_id}`;
  return result.rows;
}

async function updateResults(choice_id: string) {
  try {
    const cookieStore = await cookies();
    const connectedAddress = cookieStore.get(connectedAddressKey)?.value;

    const tokenBalance = await publicClient.readContract({
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      abi: abi,
      functionName: "balanceOf",
      args: [connectedAddress],
    });

    const totalSupply = await publicClient.readContract({
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      abi: abi,
      functionName: "totalSupply",
    });

    console.log("blockchain tokenBalance: ", tokenBalance, "totalSupply: ", totalSupply);
    const tokenBalanceInNumber = parseInt(tokenBalance as string, 10);
    const totalSupplyInNumber = parseInt(totalSupply as string, 10);

    const vote_score = (tokenBalanceInNumber / totalSupplyInNumber) * 100;
    await sql`UPDATE choices SET score = score + ${vote_score} WHERE id=${choice_id}`;
  } catch (error) {
    console.log(error);
  }
}
