import { atom } from "recoil";

export const loginAtom = atom({
  key: "loginAtom",
  default: localStorage.getItem("isLoggedIn") === "true",
});
