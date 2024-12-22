export const connectedAddressKey = "scaffoldEth2.address";

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
  score: number;
};

export type Answer = {
  id: string;
  shareholder_id: string;
  question: string;
  choice: string;
  answer_time: string;
};

export type Result = {
  choice: string;
  score: number;
};
