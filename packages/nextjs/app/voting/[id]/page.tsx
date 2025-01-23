import { cookies } from "next/headers";
import { fetchQuestionById, fetchVotingResult } from "~~/app/lib/actions";
import { connectedAddressKey } from "~~/app/lib/definitions";
import { VotingForm } from "~~/app/voting/_components/VotingForm";
import VotingResults from "~~/app/voting/_components/VotingResults";

type Params = {
  params: { id: string };
};

export default async function Page({ params }: Params) {
  console.log(params);

  const activeQuestion = await fetchQuestionById(params.id);
  if (activeQuestion === undefined) {
    return (
      <>
        <h1>Error to fetch question</h1>
      </>
    );
  }
  const votingResult = await fetchVotingResult(activeQuestion.id);
  if (votingResult === undefined) {
    return (
      <>
        <h1>Error to fetch results</h1>
      </>
    );
  }
  const cookieStore = cookies();
  const connectedAddress = cookieStore.get(connectedAddressKey)?.value;
  if (connectedAddress) {
    return (
      <div className="container mx-auto grid grid-cols-2 gap-4">
        <div className="card bg-base-100 border-base-300 border text-primary-content shadow-xl w-128 mx-8 my-4">
          <div className="card-body">
            <div className="card-title">{activeQuestion.question}</div>
          </div>
          <VotingForm question={activeQuestion} />
        </div>

        <div className="card bg-base-100 border-base-300 border text-primary-content shadow-xl w-96 mx-8 my-4">
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
