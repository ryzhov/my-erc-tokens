import { createAnswer } from "~~/app/lib/actions";
import { Question } from "~~/app/lib/definitions";

type VotingFormProps = {
  question: Question;
};

interface ChoiceNames {
  [key: string]: string;
}

export const VotingForm = ({ question }: VotingFormProps) => {
  const choices = question.choices_array.map(choice => choice.id).sort();
  const choicesNames: ChoiceNames = {};
  question.choices_array.forEach(choice => {
    choicesNames[choice.id] = choice.choice;
  });
  console.log(choicesNames);

  return (
    <form action={createAnswer}>
      <div className="m-2">
        {choices.map(choice => (
          <div key={choice}>
            <div className="flex items-center my-4">
              <label className="label items-left ms-2">
                <input type="radio" name="radio-0" value={choice} className="radio checked:bg-red-500" />
                <span className="ms-2">{choicesNames[choice]}</span>
              </label>
            </div>
          </div>
        ))}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded">Submit</button>
      </div>
      <input className="hidden" name="question" value={question.id} readOnly></input>
    </form>
  );
};
