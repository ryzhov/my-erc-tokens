import { fetchVotingResult } from "~~/app/lib/actions";

export default async function VotingResults({ q_id }: { q_id: string }) {
  const votingResult = await fetchVotingResult(q_id);
  return (
    <>
      <div className="m-4">
        <h1>Voting results</h1>
        {votingResult.map(result => (
          <div key={result.score}>
            <span>{result.choice} - </span>
            <span>{result.score} %</span>
          </div>
        ))}
      </div>
    </>
  );
}
