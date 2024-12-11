import { Choice, Question } from "./definitions";
import { sql } from "@vercel/postgres";

export async function fetchQuestions() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const questions = await sql<Question>`SELECT * FROM questions`;

    const choices = await sql<Choice>`SELECT * FROM choices`;

    // const q_rows = questions.rows;

    // todo join questions and choices

    console.log("Questions fetched ", questions);
    console.log("Choices fetched ", choices);

    return questions.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
}
