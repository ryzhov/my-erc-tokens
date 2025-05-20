"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { createAnswer, fetchAnswer, fetchQuestionById, fetchVoteResult } from "~~/app/lib/actions";
import { Question, Result } from "~~/app/lib/definitions";
import { VotingForm } from "~~/app/voting/_components/VotingForm";
import VotingResults from "~~/app/voting/_components/VotingResults";

type Params = {
  params: { id: string };
};

function Page({ params: { id: questionId } }: Params) {
  const address = useAccount().address;
  console.log("Page::address =>", address);

  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const [results, setResults] = useState<Array<Result>>([]);
  const [isVoted, setIsVoted] = useState<boolean>(false);

  useEffect(() => {
    fetchQuestionById(questionId).then(
      question => setQuestion(question),
      () => setQuestion(undefined),
    );
  }, [questionId]);

  useEffect(() => {
    fetchVoteResult(questionId).then(voteResult => setResults(voteResult));
  }, [questionId, isVoted]);

  useEffect(() => {
    if (address) {
      fetchAnswer(questionId, address).then(rows => setIsVoted(!!rows.length));
    }
  }, [questionId, address]);

  const onSubmit = (choiceId: string) => {
    if (address) {
      const answer = { questionId, choiceId, address };
      console.log("Page::onSubmit answer =>", answer);

      createAnswer(answer).then(({ success, error }) => {
        if (success) {
          console.log("Page::onSubmit success =>", success);
          setIsVoted(true);
        } else {
          console.log("Page::onSubmit error =>", error);
        }
      });
    }
  };

  return (
    <div className="card bg-base-100 border-base-300 border text-primary-content shadow-xl w-128 mx-8 my-4">
      <div className="card-body">
        <div className="card-title">{question?.question ?? "..."}</div>
      </div>
      {isVoted ? (
        question ? (
          <VotingResults results={results} />
        ) : null
      ) : question ? (
        <VotingForm choices={question.choices_array} onSubmit={onSubmit} />
      ) : null}
    </div>
  );
}

export default Page;
