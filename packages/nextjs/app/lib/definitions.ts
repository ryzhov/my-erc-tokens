export type Question = {
  id: string;
  question: string;
  is_active: number;
  choices_array: [Choice];
};

export type Choice = {
  id: string;
  choice: string;
  question_id: string;
};

export type Answer = {
  id: string;
  shareholder_id: string;
  question: string;
  choice: string;
  answer_time: string;
};
