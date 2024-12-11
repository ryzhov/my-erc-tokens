const shareholders = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "User",
    email: "user@nextmail.com",
    password: "123456",
  },
];

const questions = [
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd81a0",
    question: "Do you enjoy this voting application?",
    is_active: 1,
  },
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd81a1",
    question: "Who will be Chief Executive Officer in 2025?",
    is_active: 1,
  },
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd81a2",
    question: "Do you approve this financial report?",
    is_active: 1,
  },
];

const question_choices = [
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd8100",
    question_id: questions[0].id,
    text: "Yes",
  },
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd8101",
    question_id: questions[0].id,
    text: "No",
  },
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd8102",
    question_id: questions[1].id,
    text: "Donald Duck",
  },
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd8103",
    question_id: questions[1].id,
    text: "John Smith",
  },
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd8104",
    question_id: questions[1].id,
    text: "Billy Bones",
  },
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd8105",
    question_id: questions[2].id,
    text: "Yes",
  },
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd8106",
    question_id: questions[2].id,
    text: "No",
  },
];

const shareholder_question_answers = [
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd8107",
    sh_id: shareholders[0].id,
    q_id: question_choices[0].id,
    choice_id: question_choices[0].id,
    answer_time: "2024-12-8 12-34",
  },
];

export { shareholders, questions, question_choices, shareholder_question_answers };
