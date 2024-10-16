import { atom } from "recoil";

export const planetRefState = atom<HTMLDivElement | null>({
  key: "planetRefState",
  default: null,
});
