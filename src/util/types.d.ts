export type sex = "male" | "female";

export type member = {
  id: string;
  name: string;
  secondaryName: string;
  year: number;
  sex: sex;
  leader: boolean;
  active: boolean;
};
