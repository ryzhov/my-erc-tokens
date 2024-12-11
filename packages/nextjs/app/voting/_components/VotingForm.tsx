import { Question } from "~~/app/lib/definitions";

export default function VotingForm({ question }: { question: Question }) {
  return (
    <div className="items-left mb-4">
      <div>{question.question}</div>
      {question.choices_array.map(choice => (
        <div className="flex items-center mb-4" key={choice}>
          <label className="label cursor-pointer ms-2">
            <input type="radio" name="radio-10" className="radio checked:bg-red-500" />
            <span className="ms-2">{choice}</span>
          </label>
        </div>
      ))}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-4 rounded">Submit</button>
    </div>
  );
}
