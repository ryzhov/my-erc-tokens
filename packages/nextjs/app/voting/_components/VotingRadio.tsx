"use client";

import React, { useState } from "react";

const questions = [
  {
    id: 0,
    question: "Do you enjoy this voting application?",
    answers: [
      { title: "Yes", score: 0 },
      { title: "No", score: 1 },
    ],
  },
];

function VotingRadio() {
  const [checkBox, setCheckBox] = useState();

  const handleInputChange = (score: any) => {
    setCheckBox(score);
  };

  return (
    // <-- Here you need to return something from component
    <>
      <h1>{questions[0].question}</h1>
      {questions[0].answers.map(({ title, score }: any) => (
        <label key={score}>
          <div>
            <input
              type="radio"
              value={score}
              name={score}
              onChange={() => handleInputChange(score)}
              checked={score === checkBox}
            />
            {title}
          </div>
        </label>
      ))}
      <button
        onClick={() => {
          console.log(checkBox);
        }}
      >
        Vote!
      </button>
    </>
  );
}

export default VotingRadio;
