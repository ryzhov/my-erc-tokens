"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { fetchQuestionById } from "~~/app/lib/actions";
import { Question } from "~~/app/lib/definitions";
import { VotingForm } from "~~/app/voting/_components/VotingForm";

type Params = {
  params: { id: string };
};

export default function Page({ params: { id: questionId } }: Params) {
  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const { address } = useAccount();

  useEffect(() => {
    fetchQuestionById(questionId).then(
      question => setQuestion(question),
      () => setQuestion(undefined),
    );
  }, [questionId]);

  return (
    <div className="container mx-auto grid grid-cols-2 gap-4">
      <div className="card bg-base-100 border-base-300 border text-primary-content shadow-xl w-128 mx-8 my-4">
        <div className="card-body">
          <div className="card-title">{question?.question ?? "..."}</div>
        </div>
        {question && address ? <VotingForm question={question} address={address} /> : null}
      </div>
    </div>
  );
}
