import { atom } from "recoil";

export const registerLetterState = atom({
  key: "registerLetterState",
  default: {
    senderName: "",
    content: "",
    images: [] as string[],
    templateType: 0,
  },
});

export const sendLetterState = atom({
  key: "sendLetterState",
  default: {
    draftId: "",
    receiverName: "",
    content: "",
    images: [] as string[],
    templateType: 0,
  },
});

export const draftState = atom({
  key: "draftState",
  default: "",
});
