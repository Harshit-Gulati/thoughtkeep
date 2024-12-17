import axios from "axios";
import { OpenIcon } from "../../icons/OpenIcon";
import { TrashIcon } from "../../icons/TrashIcon";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { useSetRecoilState } from "recoil";
import { contentsAtom } from "../../store/contentsAtom";
import { toast } from "react-toastify";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface CardProps {
  title: string;
  link: string;
  type: "twitter" | "youtube";
  _id: string;
}

export const Card = (props: CardProps) => {
  const setContents = useSetRecoilState(contentsAtom);

  async function removeThought(id: string) {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/content`, {
        data: { contentId: id },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      toast.success("Content deleted!", {
        position: "top-center",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setContents((prevContents) =>
        prevContents.filter((card: any) => String(card._id) !== id)
      );
    } catch (e) {
      console.error(e);
      toast.error("Couldn't delete content!", {
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
  }

  return (
    <div>
      <div className="bg-[#1A1D21] rounded-lg text-gray-100 shadow-md border border-purple-700 shadow-black/55 w-72 min-h-48 p-4 text-lg">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="pr-2">
              {props.type === "youtube" && (
                <span className="text-red-600">
                  <YoutubeIcon size="md" />
                </span>
              )}
              {props.type === "twitter" && (
                <span>
                  <TwitterIcon size="md" />
                </span>
              )}
            </div>
            {props.title}
          </div>
          <div className="flex items-center">
            <div className="pr-2">
              <a
                href={`https://${
                  props.type === `twitter` ? `x.com/` : `youtube.com/watch?v=`
                }${props.link}`}
                target="_blank"
              >
                <OpenIcon size="lg" />
              </a>
            </div>
            <span
              className="cursor-pointer hover:text-red-700"
              onClick={() => removeThought(props._id)}
            >
              <TrashIcon size="lg" />
            </span>
          </div>
        </div>
        {props.type === "youtube" && (
          <iframe
            className="w-full pt-4"
            src={`https://www.youtube.com/embed/${props.link}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        )}
        {props.type === "twitter" && (
          <blockquote className="twitter-tweet" data-theme="dark">
            <a href={`https://www.twitter.com/${props.link}`}></a>
          </blockquote>
        )}
      </div>
    </div>
  );
};
