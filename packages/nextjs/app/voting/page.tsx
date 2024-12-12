import { fetchQuestions } from "../lib/data";
import VotingForm from "./_components/VotingForm";

export default async function Page() {
  const questions = await fetchQuestions();
  return (
    <>
      <VotingForm question={questions[2]} />
    </>
  );
}
