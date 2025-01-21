import { cookies } from "next/headers";
import { fetchQuestions, fetchVotingResult } from "../lib/actions";
import { connectedAddressKey } from "../lib/definitions";
import { VotingForm } from "./_components/VotingForm";
import VotingResults from "./_components/VotingResults";

export default async function Page() {
  const questions = await fetchQuestions();
  const activeQuestion = questions[1];
  const votingResult = await fetchVotingResult(activeQuestion.id);

  const cookieStore = cookies();
  const connectedAddress = cookieStore.get(connectedAddressKey)?.value;
  if (connectedAddress) {
    return (
      <div className="container">
        <div className="card bg-base-100 border-base-300 border text-primary-content shadow-xl w-96 mx-8 my-4">
          <div className="card-body">
            <h2 className="card-title">{activeQuestion.question}</h2>
            <VotingForm question={activeQuestion} />
          </div>
        </div>

        <div className="card bg-base-100 border-base-300 border text-primary-content shadow-xl w-96 mx-8">
          <div className="card-body">
            <h2 className="card-title">Voting results</h2>
            <VotingResults voting_result={votingResult} />
          </div>
        </div>
      </div>
    );
  } else
    return (
      <>
        <h1>Connect to wallet for voting!</h1>
      </>
    );
}
