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
};

export type Answer = {
  id: string;
  sh_id: string;
  question_id: string;
  choice_id: string;
  answer_time: string;
  weight: number;
};

export type Result = {
  choice_id: string;
  choice: string;
  weight: number;
};
