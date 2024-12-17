import { SidebarItem } from "./SidebarItem";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { BrainIcon } from "../../icons/BrainIcon";
import { useNavigate } from "react-router-dom";
import { sidebarAtom } from "../../store/sidebarAtom";
import { CrossIcon } from "../../icons/CrossIcon";
import { useRecoilState, useSetRecoilState } from "recoil";
import { modalAtom } from "../../store/modalAtom";
import axios from "axios";
import { shareAtom } from "../../store/shareAtom";
import { toast } from "react-toastify";
import { useState } from "react";
import { Button } from "./Button";
import { PlusIcon } from "../../icons/PlusIcon";
import { ShareIcon } from "../../icons/ShareIcon";
import { useContent } from "../../hooks/useContent";
import { loginAtom } from "../../store/loginAtom";

const APP_URL = import.meta.env.APP_URL;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Sidebar = () => {
  const navigate = useNavigate();
  const setIsLoggedIn = useSetRecoilState(loginAtom);
  const setModalOpen = useSetRecoilState(modalAtom);
  const share = localStorage.getItem("share");
  const [renderTurnOffSharing, setRender] = useRecoilState(shareAtom);
  const [sidebarOpen, setSidebarOpen] = useRecoilState(sidebarAtom);
  const [loading, setIsLoading] = useState(false);
  const [type, setType] = useState("all");

  const fetchContents = useContent();

  const handleFetchContent = (type?: "youtube" | "twitter") => {
    fetchContents(type);
  };

  function logout() {
    localStorage.removeItem("token");
    toast.success("Logged out!", {
      position: "top-center",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    setIsLoggedIn(false);
    navigate("/");
  }

  async function shareLink() {
    setIsLoading(true);
    if (share === "true") {
      const sharableLink = localStorage.getItem("sharableLink");
      if (sharableLink) {
        navigator.clipboard.writeText(`${APP_URL}/share/${sharableLink}`);
        toast.success("Link copied!", {
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
    } else {
      try {
        const res = await axios.post(
          `${BACKEND_URL}/api/v1/brain/share`,
          {
            share: true,
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        localStorage.setItem("sharableLink", res.data.hash);
        navigator.clipboard.writeText(`${APP_URL}/share/${res.data.hash}`);
        toast.success("Link copied!", {
          position: "top-center",
          autoClose: 3500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        localStorage.setItem("share", "true");
        setRender(true);
      } catch (e) {
        console.error(e);
        toast.error("Error creating link!", {
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
    setIsLoading(false);
  }

  async function turnOffSharing() {
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/brain/share`,
        {
          share: false,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      localStorage.removeItem("share");
      setRender(false);
      toast.success("Sharing turned off!", {
        position: "top-center",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (e) {
      console.error(e);
      toast.error("Couldn't turn off sharing!", {
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
    <div
      className={`w-full max-w-full flex lg:flex h-screen lg:w-[20%] flex-col items-center justify-between pb-16 bg-[#1A1D21] lg:border-r border-purple-700 fixed top-0 left-0 transform transition-transform duration-300 ease-in-out box-border ${
        sidebarOpen ? `translate-x-0` : `-translate-x-full`
      }`}
    >
      <span className="text-2xl font-semibold text-white tracking-tighter flex justify-center items-center pt-4">
        <span className="mr-2">
          <BrainIcon />
        </span>
        Thought<span className="text-purple-500">Keep</span>
      </span>
      <div className="flex flex-col w-full items-center pt-20">
        <SidebarItem
          text="All"
          onClick={() => {
            handleFetchContent();
            setType("all");
          }}
          activeColor={type === "all"}
        />
        <SidebarItem
          icon={<TwitterIcon size="md" />}
          text="Twitter"
          onClick={() => {
            handleFetchContent("twitter");
            setType("twitter");
          }}
          activeColor={type === "twitter"}
        />
        <SidebarItem
          icon={<YoutubeIcon size="md" />}
          text="YouTube"
          onClick={() => {
            handleFetchContent("youtube");
            setType("youtube");
          }}
          activeColor={type === "youtube"}
        />
      </div>
      <div className="flex flex-col justify-end items-center pb-3 mb-2">
        <Button
          text="Add Content"
          variant="secondary"
          size="lg"
          rounded="xl"
          startIcon={<PlusIcon size="lg" />}
          onClick={() => {
            setModalOpen(true);
          }}
        />
        <span className="py-4">
          <Button
            text={renderTurnOffSharing ? `Copy Link` : `Share Link`}
            variant="primary"
            size="lg"
            rounded="xl"
            startIcon={<ShareIcon size="lg" />}
            onClick={shareLink}
            loading={loading}
          />
        </span>

        {renderTurnOffSharing && (
          <span className="pl-4 pr-2 transition-all">
            <Button
              text="Turn Off Sharing"
              variant="primary"
              size="lg"
              rounded="xl"
              onClick={turnOffSharing}
              loading={loading}
            />
          </span>
        )}
      </div>
      <div>
        <Button
          variant="primary"
          onClick={logout}
          size="lg"
          text="Logout"
          rounded="xl"
        />
      </div>
      <div
        className="text-white hover:text-purple-500 cursor-pointer transition-all"
        onClick={() => {
          setSidebarOpen(false);
        }}
      >
        <CrossIcon size="xl" />
      </div>
    </div>
  );
};
