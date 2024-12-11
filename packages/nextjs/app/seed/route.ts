import { question_choices, questions, shareholder_question_answers, shareholders } from "./placeholder-data";
import { sha256 } from "@noble/hashes/sha2";
import { bytesToHex } from "@noble/hashes/utils";
import { db } from "@vercel/postgres";

const client = await db.connect();

async function seedShareholders() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS shareholders (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedShareholders = await Promise.all(
    shareholders.map(async sholder => {
      const hashedPassword = bytesToHex(sha256(sholder.password));
      return client.sql`
        INSERT INTO shareholders (id, name, email, password)
        VALUES (${sholder.id}, ${sholder.name}, ${sholder.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedShareholders;
}

async function seedQuestions() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS questions (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      question VARCHAR(255) NOT NULL,
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
      choice TEXT NOT NULL
    );
  `;

  const insertedChoices = await Promise.all(
    question_choices.map(
      choice => client.sql`
        INSERT INTO choices (id, question_id, choice)
        VALUES (${choice.id}, ${choice.question_id}, ${choice.text} )
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
      sh_id UUID NOT NULL,
      question_id UUID NOT NULL,
      choice_id VARCHAR(255) NOT NULL,
      answer_time TIMESTAMP NOT NULL
    );
  `;

  const insertedAnswers = await Promise.all(
    shareholder_question_answers.map(
      answer => client.sql`
        INSERT INTO answers (id, sh_id, question_id, choice_id, answer_time)
        VALUES (${answer.id}, ${answer.sh_id}, ${answer.q_id}, ${answer.choice_id}, now() )
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedAnswers;
}

export async function GET() {
  // return Response.json({
  //   message:
  //     'Uncomment this file and remove this line. You can delete this file when you are finished.',
  // });
  try {
    await client.sql`BEGIN`;
    await seedShareholders();
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
