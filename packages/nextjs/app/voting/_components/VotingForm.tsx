"use client";

import { ChangeEvent, useState } from "react";
import { Choice } from "~~/app/lib/definitions";

type VotingFormProps = {
  choices: Choice[];
  onSubmit: any;
};

export const VotingForm = ({ choices, onSubmit }: VotingFormProps) => {
  const [choiceId, setChoiceId] = useState("");
  const onChoiceChanged = (e: ChangeEvent<HTMLInputElement>) => setChoiceId(e.target.value);
  const handleSubmit = (formData: FormData) => onSubmit(formData.get("choice"));

  return (
    <form action={handleSubmit}>
      <div className="m-2">
        {choices.map(({ id, choice }) => (
          <div key={id}>
            <div className="flex items-center my-4">
              <label className="label items-left ms-2">
                <input
                  type="radio"
                  name="choice"
                  value={id}
                  onChange={onChoiceChanged}
                  checked={choiceId === id}
                  required={true}
                  className="radio checked:bg-red-500"
                />
                <span className="ms-2">{choice}</span>
              </label>
            </div>
          </div>
        ))}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded"
          disabled={!choiceId}
        >
          {choiceId ? "Vote!" : "Make your choice"}
        </button>
      </div>
    </form>
  );
};
