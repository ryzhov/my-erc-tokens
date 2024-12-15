"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectedAddressKey } from "./definitions";
import { sql } from "@vercel/postgres";

export async function setAddressCookie(address: string) {
  const cookieStore = await cookies();
  cookieStore.set(connectedAddressKey, address);
}

export default async function createAnswer(formData: FormData) {
  const rawFormData = {
    question: formData.get("question"),
    answer: formData.get("radio-0"),
  };
  // todo get id for current user address:
  const sh_id = "d6e15727-9fe1-4961-8c5b-ea44a9bd8100";
  const cookieStore = await cookies();
  const connectedAddress = cookieStore.get(connectedAddressKey);
  console.log(rawFormData, connectedAddress?.value);

  await sql`
    INSERT INTO answers (sh_id, question_id, choice_id, answer_time)
    VALUES (${sh_id}, ${rawFormData.question?.toString()}, ${rawFormData.answer?.toString()}, now())
  `;
  redirect("/voting/results");
}
