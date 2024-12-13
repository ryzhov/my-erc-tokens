"use server";

import { sql } from "@vercel/postgres";

export default async function createAnswer(formData: FormData) {
  const rawFormData = {
    question: formData.get("question"),
    answer: formData.get("radio-0"),
  };
  // Test it out:
  console.log(rawFormData);

  // todo fix query to store ids
  await sql`
    INSERT INTO answers (sh_id, question_id, choice_id, answer_time)
    VALUES (${"d6e15727-9fe1-4961-8c5b-ea44a9bd8100"}, ${rawFormData.question?.toString()}, ${rawFormData.answer?.toString()}, ${Date.now()})
  `;
}
