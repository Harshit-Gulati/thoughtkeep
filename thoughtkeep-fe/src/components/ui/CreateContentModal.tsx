import { useRef, useState } from "react";
import { CrossIcon } from "../../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { PlusIcon } from "../../icons/PlusIcon";
import { TickIcon } from "../../icons/TickIcon";
import axios from "axios";
import { useRecoilState } from "recoil";
import { modalAtom } from "../../store/modalAtom";
import { buttonLoadingAtom } from "../../store/buttonLoadingAtom";
import { toast } from "react-toastify";
import { useContent } from "../../hooks/useContent";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
}

export const CreateContentModal = () => {
  const [modalOpen, setModalOpen] = useRecoilState(modalAtom);
  const [loading, setIsLoading] = useRecoilState(buttonLoadingAtom);
  const titleRef = useRef<HTMLInputElement>();
  const linkRef = useRef<HTMLInputElement>();
  const [type, setType] = useState(ContentType.Youtube);

  const fetchContents = useContent();

  const handleFetchContent = (type?: "youtube" | "twitter") => {
    fetchContents(type);
  };

  function extractYoutubeUniqueId(link: string): string | null {
    if (!link) return null;
    if (link.includes("youtube.com")) {
      const id = link.split("v=")[1]?.split("&")[0];
      return id || null;
    } else if (link.includes("youtu.be")) {
      const id = link.split("/").pop()?.split("?")[0];
      return id || null;
    }
    return null;
  }

  function getLink(link: string, type: "youtube" | "twitter") {
    if (type === "youtube") return extractYoutubeUniqueId(link);
    else if (type === "twitter") return link.split(".com/")[1];
  }

  async function addContent() {
    setIsLoading(true);
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;
    if (!link || !title) {
      toast.error("Required fields missing!", {
        position: "top-center",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      throw new Error("title/link are required");
    }
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/content`,
        {
          link: getLink(link, type),
          type,
          title,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      toast.success("Content Added!", {
        position: "top-center",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setModalOpen(false);
      handleFetchContent();
    } catch (e) {
      console.error(e);
      toast.error("Couldn't add content!", {
        position: "top-center",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
    setIsLoading(false);
  }

  return (
    <div>
      {modalOpen && (
        <div className="w-screen h-screen bg-black bg-opacity-40 fixed top-0 left-0 flex justify-center">
          <div className="flex flex-col justify-center">
            <span className="bg-[#1A1D21] p-4 rounded-lg z-50 text-gray-300 border-purple-700 border flex flex-col justify-between items-center w-72">
              <div className="flex justify-end w-full mb-4">
                <span
                  onClick={() => {
                    setModalOpen(false);
                  }}
                  className="hover:text-purple-700 cursor-pointer transition-all duration-200"
                >
                  <CrossIcon size="xl" />
                </span>
              </div>
              <div>
                <Input reference={titleRef} placeholder="Title*" />
                <Input reference={linkRef} placeholder="Link*" />
              </div>
              <h1 className="text-left w-full mt-4 font-medium text-md">
                Select the link type:
              </h1>
              <div className="my-2 flex justify-around w-full">
                <Button
                  variant={
                    type === ContentType.Youtube ? "primary" : "secondary"
                  }
                  onClick={() => setType(ContentType.Youtube)}
                  size="md"
                  text="Youtube"
                  rounded="lg"
                  startIcon={
                    type === ContentType.Youtube ? (
                      <TickIcon size="lg" />
                    ) : (
                      <></>
                    )
                  }
                />
                <Button
                  variant={
                    type === ContentType.Twitter ? "primary" : "secondary"
                  }
                  onClick={() => setType(ContentType.Twitter)}
                  size="md"
                  text="Twitter"
                  rounded="lg"
                  startIcon={
                    type === ContentType.Twitter ? (
                      <TickIcon size="lg" />
                    ) : (
                      <></>
                    )
                  }
                />
              </div>
              <div className="my-2">
                <Button
                  variant="primary"
                  onClick={addContent}
                  size="md"
                  text="Add Content"
                  rounded="xl"
                  startIcon={<PlusIcon size="md" />}
                  loading={loading}
                />
              </div>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
