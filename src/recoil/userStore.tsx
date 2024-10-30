import { atom } from "recoil";
import { persistAtomEffect } from "./letterStore";

export const userState = atom({
  key: "userState",
  default: {
    name: "",
  },
  effects_UNSTABLE: [persistAtomEffect],
});
