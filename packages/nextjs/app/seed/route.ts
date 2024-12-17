import { question_choices, questions, shareholder_question_answers } from "./placeholder-data";
import { db } from "@vercel/postgres";

const client = await db.connect();

async function seedQuestions() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS questions (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      question TEXT NOT NULL,
      is_active INT NOT NULL
    );
  `;

  const insertedQuestions = await Promise.all(
    questions.map(
      question => client.sql`
        INSERT INTO questions (id, question, is_active)
        VALUES (${question.id}, ${question.question}, ${question.is_active} )
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedQuestions;
}

async function seedChoices() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS choices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      question_id UUID NOT NULL,
      choice TEXT NOT NULL,
      score NUMERIC DEFAULT 0
    );
  `;

  const insertedChoices = await Promise.all(
    question_choices.map(
      choice => client.sql`
        INSERT INTO choices (id, question_id, choice, score)
        VALUES (${choice.id}, ${choice.question_id}, ${choice.text}, ${0})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedChoices;
}

async function seedShareholderAnswers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS answers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      sh_id VARCHAR(255) NOT NULL,
      question_id UUID NOT NULL,
      choice_id UUID NOT NULL,
      answer_time TIMESTAMP NOT NULL
    );
  `;

  const insertedAnswers = await Promise.all(
    shareholder_question_answers.map(
      answer => client.sql`
        INSERT INTO answers (sh_id, question_id, choice_id, answer_time)
        VALUES (${answer.sh_id}, ${answer.q_id}, ${answer.choice_id}, now() )
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedAnswers;
}

async function clearTables() {
  try {
    await client.sql`DROP TABLE IF EXISTS shareholders, questions, choices, answers;`;
  } catch (error) {
    console.log(error);
  }
}

export async function GET() {
  // return Response.json({
  //   message:
  //     'Uncomment this file and remove this line. You can delete this file when you are finished.',
  // });
  try {
    await client.sql`BEGIN`;
    await clearTables();
    await seedQuestions();
    await seedChoices();
    await seedShareholderAnswers();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
