import { Choice } from "~~/app/lib/definitions";

type VotingResultsProps = {
  voting_result: Choice[];
};

export default async function VotingResults(props: VotingResultsProps) {
  return (
    <>
      <div className="m-4">
        {props.voting_result.map(result => (
          <div key={result.choice}>
            <span>{result.choice} - </span>
            <span>{result.score} %</span>
          </div>
        ))}
      </div>
    </>
  );
}
