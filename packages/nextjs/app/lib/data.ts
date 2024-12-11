"use server";

import { Question } from "./definitions";
import { sql } from "@vercel/postgres";

export async function fetchQuestions() {
  try {
    const questions = await sql<Question>`SELECT questions.*, json_agg(choices.choice) AS choices_array 
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
