import { fetchVotingResult } from "~~/app/lib/actions";

export default async function Page() {
  const votingResult = await fetchVotingResult("question_id");
  return (
    <>
      <h1>Voting results</h1>
      {votingResult.map(result => (
        <div key={result.score}>
          <span>{result.choice} - </span>
          <span>{result.score} %</span>
        </div>
      ))}
    </>
  );
}
