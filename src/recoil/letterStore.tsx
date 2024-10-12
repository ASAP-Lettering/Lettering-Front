import { atom } from "recoil";

export const registerLetterState = atom({
  key: "registerLetterState",
  default: {
    senderName: "",
    content: "",
    images: [""],
    templateType: 0,
  },
});

export const sendLetterState = atom({
  key: "sendLetterState",
  default: {
    draftId: "",
    receiverName: "",
    content: "",
    images: [""],
    templateType: 0,
  },
});

export const draftState = atom({
  key: "draftState",
  default: "",
});
