"use server";

import { redirect } from "next/navigation";
import { sql } from "@vercel/postgres";

export default async function createAnswer(formData: FormData) {
  const rawFormData = {
    question: formData.get("question"),
    answer: formData.get("radio-0"),
    connectedAddress: formData.get("address"),
  };
  // Test it out:
  const sh_id = "d6e15727-9fe1-4961-8c5b-ea44a9bd8100";
  console.log(rawFormData);

  // todo fix query to store ids
  await sql`
    INSERT INTO answers (sh_id, question_id, choice_id, answer_time)
    VALUES (${sh_id}, ${rawFormData.question?.toString()}, ${rawFormData.answer?.toString()}, now())
  `;
  redirect("/voting/results");
}
