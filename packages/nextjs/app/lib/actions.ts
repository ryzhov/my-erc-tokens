"use server";

export default async function createAnswer(formData: FormData) {
  const rawFormData = {
    radio: formData.get("radio-0"),
  };
  // Test it out:
  console.log(rawFormData);
}
