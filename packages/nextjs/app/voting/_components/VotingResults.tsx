import { Choice } from "~~/app/lib/definitions";

type VotingResultsProps = {
  choices: Choice[];
};

export default async function VotingResults(props: VotingResultsProps) {
  console.log("VotingResults::props =>", props);
  return (
    <>
      <div className="m-4">
        {props.choices.map(result => (
          <div key={result.choice}>
            <span>{result.choice} - </span>
            <span>{result.score} %</span>
          </div>
        ))}
      </div>
    </>
  );
}
