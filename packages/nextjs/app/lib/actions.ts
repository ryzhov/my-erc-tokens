"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Question, connectedAddressKey } from "./definitions";
import { sql } from "@vercel/postgres";

export async function setAddressCookie(address: string) {
  const cookieStore = await cookies();
  cookieStore.set(connectedAddressKey, address);
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
  redirect("/voting/results");
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
