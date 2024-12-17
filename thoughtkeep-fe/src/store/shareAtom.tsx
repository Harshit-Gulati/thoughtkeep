import { atom } from "recoil";

export const shareAtom = atom({
  key: "shareAtom",
  default: localStorage.getItem("share") === "true" || false,
});
