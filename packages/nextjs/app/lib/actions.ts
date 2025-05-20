"use server";

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

    return questions.rows?.[0] ?? null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
}

export async function createAnswer(formData: FormData) {
  const questionId = formData.get("question")?.toString();
  const choiceId = formData.get("choice")?.toString();
  const address = formData.get("address")?.toString();

  if (address && questionId && choiceId) {
    try {
      const weight = await fetchWeight(address);

      await sql`
      INSERT INTO answers (sh_id, question_id, choice_id, answer_time, weight)
      VALUES (${address}, ${questionId}, ${choiceId}, now(), ${weight})
    `;
    } catch (error) {
      console.log(error);
      return;
    }
  }
}

export async function fetchChoices(q_id: string) {
  const result = await sql<Choice>`SELECT * FROM choices WHERE question_id=${q_id}`;
  return result.rows;
}

async function fetchWeight(address: string): Promise<number> {
  const balanceOf: bigint = (await publicClient.readContract({
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi: abi,
    functionName: "balanceOf",
    args: [address],
  })) as bigint;

  const totalSupply: bigint = (await publicClient.readContract({
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi: abi,
    functionName: "totalSupply",
  })) as bigint;

  const weight = (balanceOf * 100n) / totalSupply;
  console.log("blockchain balanceOf: ", balanceOf, ", totalSupply: ", totalSupply, ", weight: ", weight);
  return Number(weight);
}
