import { RegisterDataType } from "@/types/user";
import { atom } from "recoil";

export const userInfo = atom<RegisterDataType>({
  key: "RegisterUser",
  default: {
    registerToken: "",
    servicePermission: false,
    privatePermission: false,
    marketingPermission: false,
    birthday: "",
  },
});

export const signinState = atom({
  key: "registerToken",
  default: "",
});
