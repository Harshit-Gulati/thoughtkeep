import { useRecoilState } from "recoil";
import { BrainIcon } from "../icons/BrainIcon";
import { useEffect, useState } from "react";
import axios from "axios";
import { contentsAtom } from "../store/contentsAtom";
import { useNavigate, useParams } from "react-router-dom";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { OpenIcon } from "../icons/OpenIcon";
import { Button } from "../components/ui/Button";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Share = () => {
  const [contents, setContents] = useRecoilState(contentsAtom);
  const [username, setUsername] = useState("");
  const { shareLink } = useParams();

  axios.defaults.withCredentials = true;

  const fetchContents = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/brain/${shareLink}`);
      setContents(res.data.content || []);
      setUsername(res.data.username);
    } catch (e) {
      console.error(e);
      toast.error("Couldn't retrieve data!", {
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
  };

  useEffect(() => {
    if (shareLink) {
      fetchContents();
    }
  }, [shareLink]);

  const navigate = useNavigate();

  return (
    <div className="max-w-screen h-screen">
      <div className="w-full bg-[#0E1113] min-h-screen h-fit p-3">
        <div className="w-full h-20 md:h-10 flex flex-col md:flex-row justify-between items-center">
          <span className="text-xl font-semibold text-white tracking-tighter flex justify-center items-center w-fit">
            <span className="mr-2">
              <BrainIcon />
            </span>
            Thought<span className="text-purple-500">Keep</span>
          </span>
          <div className="flex">
            <div className="rounded-3xl px-2 py-2 bg-gray-100 text-purple-700 border border-purple-700 font-semibold flex justify-center items-center mr-4 text-sm lg:text-base">{`${username}'s Brain`}</div>
            <Button
              text="Sign Up"
              onClick={() => {
                navigate("/signup");
              }}
              rounded="xl"
              size="lg"
              variant="primary"
            />
          </div>
        </div>
        <div className="mx-auto w-full pt-5 flex justify-center">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {contents.map((card: any) => (
              <div key={card._id} className="break-inside-avoid mb-4">
                <div>
                  <div className="bg-[#1A1D21] rounded-lg text-gray-100 shadow-md border border-purple-700 shadow-black/55 w-72 min-h-48 p-4 text-lg">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="pr-2">
                          {card.type === "youtube" && (
                            <span className="text-red-600">
                              <YoutubeIcon size="md" />
                            </span>
                          )}
                          {card.type === "twitter" && (
                            <span>
                              <TwitterIcon size="md" />
                            </span>
                          )}
                        </div>
                        {card.title}
                      </div>
                      <div className="flex items-center">
                        <div className="pr-2">
                          <a
                            href={`https://${
                              card.type === `twitter`
                                ? `x.com/`
                                : `youtube.com/watch?v=`
                            }${card.link}`}
                            target="_blank"
                          >
                            <OpenIcon size="lg" />
                          </a>
                        </div>
                      </div>
                    </div>
                    {card.type === "youtube" && (
                      <iframe
                        className="w-full pt-4"
                        src={`https://www.youtube.com/embed/${card.link}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    )}
                    {card.type === "twitter" && (
                      <blockquote className="twitter-tweet" data-theme="dark">
                        <a href={`https://www.twitter.com/${card.link}`}></a>
                      </blockquote>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
