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
