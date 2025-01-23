import Link from "next/link";
import { fetchQuestions } from "~~/app/lib/actions";

export default async function Page() {
  const questions = await fetchQuestions();
  return (
    <div>
      <div className="card bg-base-100 border-base-300 border text-primary-content shadow-xl mx-8 my-4">
        <div className="card-body">
          <div className="card-title">Questions</div>
          <ul>
            {questions.map((question, index) => (
              <li key={index}>
                <div className="m-8">
                  <Link href={`/voting/${question.id}`}>{question.question}</Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
