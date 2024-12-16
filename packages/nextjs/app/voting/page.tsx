import { cookies } from "next/headers";
import { fetchQuestions } from "../lib/actions";
import { connectedAddressKey } from "../lib/definitions";
import VotingForm from "./_components/VotingForm";
import VotingResults from "./_components/VotingResults";

export default async function Page() {
  const questions = await fetchQuestions();
  const activeQuestion = questions[1];

  const cookieStore = cookies();
  const connectedAddress = cookieStore.get(connectedAddressKey)?.value;
  if (connectedAddress) {
    return (
      <>
        <details className="dropdown m-4">
          <summary className="btn m-1">{activeQuestion.question}</summary>
          <ul className="dropdown-content bg-base-100 rounded-box z-[1]p-2">
            <li>
              <VotingForm question={activeQuestion} />
            </li>
            <li>
              <VotingResults q_id={activeQuestion.id} />
            </li>
          </ul>
        </details>
      </>
    );
  } else
    return (
      <>
        <h1>Connect to wallet for voting!</h1>
      </>
    );
}
