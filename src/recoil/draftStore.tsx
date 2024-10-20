import { atom } from "recoil";

export const draftModalState = atom({
  key: "draftModalState",
  default: {
    id: null as string | null,
    isOpen: false,
  },
});
