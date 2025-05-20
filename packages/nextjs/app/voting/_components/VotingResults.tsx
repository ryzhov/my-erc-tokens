import { Result } from "~~/app/lib/definitions";

type VotingResultsProps = {
  results: Array<Result>;
};

function VotingResults({ results }: VotingResultsProps) {
  console.log("VotingResults::results =>", results);
  return (
    <>
      <div className="m-4">
        {results.map(({ choice_id, choice, weight }) => (
          <div key={choice_id}>
            <span>
              {choice} - {weight}%
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export default VotingResults;
