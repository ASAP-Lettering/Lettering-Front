import { atom } from "recoil";

export const toastState = atom({
  key: "toastState",
  default: {
    show: false,
    message: "",
    icon: false,
    close: false,
    top: "",
    bottom: "",
    left: "50%",
    right: "",
    padding: "",
  },
});
