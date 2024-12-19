import { atom } from "recoil";

export const spaceState = atom({
  key: "spaceState",
  default: null as string | null,
});
