export type Question = {
  id: string;
  question: string;
  is_active: number;
  choices_array: [string];
};

export type Answer = {
  id: string;
  shareholder_id: string;
  question: string;
  choice: string;
  answer_time: string;
};
