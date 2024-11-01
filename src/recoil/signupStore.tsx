import { RegisterDataType } from "@/types/user";
import { atom } from "recoil";

export const userInfo = atom({
  key: "RegisterUser",
  default: {
    servicePermission: false,
    privatePermission: false,
    marketingPermission: false,
    birthday: "",
  },
});

export const signupState = atom({
  key: "registerToken",
  default: "",
});
