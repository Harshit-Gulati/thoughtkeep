import axios from "axios";
import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { contentsAtom } from "../store/contentsAtom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function useContent() {
  const setContents = useSetRecoilState(contentsAtom);

  const fetchContents = useCallback(
    async (type?: "youtube" | "twitter") => {
      try {
        const query = type ? `?type=${type}` : "";
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/content${query}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setContents(response.data.content);
      } catch (e) {
        console.error("Error fetching content:", e);
      }
    },
    [setContents]
  );

  return fetchContents;
}
