"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Question, connectedAddressKey } from "./definitions";
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

export async function createAnswer(formData: FormData) {
  const rawFormData = {
    question: formData.get("question"),
    answer: formData.get("radio-0"),
  };

  const cookieStore = await cookies();
  const connectedAddress = cookieStore.get(connectedAddressKey)?.value;
  console.log(rawFormData, connectedAddress);

  await sql`
    INSERT INTO answers (sh_id, question_id, choice_id, answer_time)
    VALUES (${connectedAddress}, ${rawFormData.question?.toString()}, ${rawFormData.answer?.toString()}, now())
  `;

  revalidatePath("/voting");
}

export async function fetchVotingResult(q_id: string) {
  try {
    // 1 select all answers for this question from db
    const answers = await sql`SELECT * FROM answers WHERE question_id=${q_id} ORDER BY answer_time DESC LIMIT 1`;
    console.log(answers.rows);
    const choices = await sql`SELECT * FROM choices WHERE question_id=${q_id}`;
    console.log(choices.rows);
    // 2 get token balances for all voted users from blockchain
    const tokenBalance = 10;
    const totalTokens = 100;
    // 3 compute scores and return
    choices.rows.forEach(element => {
      element.score = 0;
      if (element.id == answers.rows[0].choice_id) {
        element.score = (tokenBalance / totalTokens) * 100;
      }
    });
    return choices.rows;
  } catch (error) {
    return [];
  }
}
