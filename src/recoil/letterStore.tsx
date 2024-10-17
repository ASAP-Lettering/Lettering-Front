import { atom } from "recoil";

type DroppedItem = {
  tagId: string;
  name: string;
  isNew?: boolean;
};

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

export const droppedLetterState = atom<DroppedItem>({
  key: "droppedLetterState",
  default: {
    tagId: "",
    name: "",
  },
});
