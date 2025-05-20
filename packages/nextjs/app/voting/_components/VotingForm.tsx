"use client";

import { ChangeEvent, useState } from "react";
import { createAnswer } from "~~/app/lib/actions";
import { Question } from "~~/app/lib/definitions";

type VotingFormProps = {
  question: Question;
  address: string;
};

export const VotingForm = ({ question: { id, choices_array: choices }, address }: VotingFormProps) => {
  const [choiceId, setChoiceId] = useState("");
  const onChoiceChanged = (e: ChangeEvent<HTMLInputElement>) => setChoiceId(e.target.value);

  return (
    <form action={createAnswer}>
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
                  className="radio checked:bg-red-500"
                />
                <span className="ms-2">{choice}</span>
              </label>
            </div>
          </div>
        ))}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded">Submit</button>
      </div>
      <input className="hidden" name="question" value={id} readOnly></input>
      <input className="hidden" name="address" value={address} readOnly></input>
    </form>
  );
};
