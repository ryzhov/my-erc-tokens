import { cookies } from "next/headers";
import { fetchQuestions } from "../lib/data";
import { connectedAddressKey } from "../lib/definitions";
import VotingForm from "./_components/VotingForm";

export default async function Page() {
  const questions = await fetchQuestions();
  const cookieStore = cookies();

  const connectedAddress = cookieStore.get(connectedAddressKey)?.value;
  console.log(connectedAddress);
  if (connectedAddress) {
    return (
      <>
        <VotingForm question={questions[2]} />
      </>
    );
  } else
    return (
      <>
        <h1>Connect to wallet for voting!</h1>
      </>
    );
}
