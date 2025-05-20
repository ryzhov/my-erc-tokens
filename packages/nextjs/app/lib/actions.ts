"use server";

import { cookies } from "next/headers";
import { abi } from "./abi";
import { publicClient } from "./client";
import { Answer, Choice, Question, Result, connectedAddressKey } from "./definitions";
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

export async function fetchAnswer(questionId: string, shareholderId: string) {
  console.log(`fetching answer by questionId: ${questionId} and shareholderId: ${shareholderId}`);
  try {
    const answers = await sql<Answer>`SELECT * FROM answers 
      WHERE question_id = ${questionId}
      AND sh_id = ${shareholderId}`;

    return answers.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
}

export async function fetchVoteResult(questionId: string) {
  console.log(`fetching results by questionId: ${questionId}`);
  try {
    const answers = await sql<Result>`
      SELECT answers.choice_id, choices.choice, sum(answers.weight) as weight FROM answers
      INNER JOIN choices ON answers.choice_id = choices.id
      WHERE answers.question_id = ${questionId}
      GROUP BY answers.choice_id, choices.choice
    `;

    return answers.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
}

export async function createAnswer({
  questionId,
  choiceId,
  address,
}: {
  questionId: string;
  choiceId: string;
  address: string;
}) {
  const result = { success: false, error: "" };

  try {
    const weight = await fetchWeight(address);

    await sql`
      INSERT INTO answers (sh_id, question_id, choice_id, answer_time, weight)
      VALUES (${address}, ${questionId}, ${choiceId}, now(), ${weight})
    `;
    result.success = true;
  } catch (error) {
    console.log(error);
    result.error = JSON.stringify(error);
  }

  return result;
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
