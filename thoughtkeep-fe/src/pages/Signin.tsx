import { useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BrainIcon } from "../icons/BrainIcon";
import { useSetRecoilState } from "recoil";
import { loginAtom } from "../store/loginAtom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Signin = () => {
  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const setIsLoggedIn = useSetRecoilState(loginAtom);

  async function signin() {
    setIsLoading(true);
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/signin`,
        {
          username,
          password,
        },
        { withCredentials: false }
      );
      const jwt = res.data.token;
      localStorage.setItem("token", jwt);
      localStorage.setItem("share", "false");
      toast.success("Logged in!", {
        position: "top-center",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    } catch (e) {
      toast.error("Error logging in!", {
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
    <div className="bg-[#0E1113] h-screen w-screen flex flex-col justify-center items-center">
      <span className="text-4xl font-semibold text-white tracking-tighter flex justify-center items-center pt-4 mb-6">
        <span className="mr-2">
          <BrainIcon />
        </span>
        Thought<span className="text-purple-500">Keep</span>
      </span>
      <div className="bg-[#1A1D21] rounded-lg text-gray-100 shadow-md border border-purple-700 shadow-black/55 w-screen md:w-[40%] lg:w-[20%] min-h-48 p-6 text-lg">
        <Input reference={usernameRef} placeholder="Username" />
        <Input reference={passwordRef} placeholder="Password" />
        <div className="my-2">
          <Button
            variant="primary"
            onClick={signin}
            rounded="lg"
            size="lg"
            text="Sign In"
            fullWidth={true}
            loading={isLoading}
          />
        </div>
      </div>
      <span className="text-gray-300 p-4">
        Don't have an account?{" "}
        <span
          className="hover:text-white underline cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </span>
      </span>
    </div>
  );
};
