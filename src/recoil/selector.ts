import { selector } from "recoil";
import {
  registerLetterState,
  sendLetterState,
} from "./letterStore"

export const registerLetterSelector = selector({
  key: "registerLetterSelector",
  get: ({ get }) => get(registerLetterState),
  set: ({ set }, newValue) => {
    set(registerLetterState, newValue);
  },
});

export const sendLetterSelector = selector({
  key: "sendLetterSelector",
  get: ({ get }) => get(sendLetterState),
  set: ({ set }, newValue) => {
    set(sendLetterState, newValue);
  },
});
