export type VersusOption = {
  text: string;
  votes: number;
  percentage: number;
};

export type Versus = {
  id: number;
  category: string;
  optionA: VersusOption;
  optionB: VersusOption;
  totalVotes: number;
};
