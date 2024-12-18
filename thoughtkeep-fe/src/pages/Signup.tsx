import { useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Logo } from "../components/ui/Logo";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Signup = () => {
  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function signup() {
    setIsLoading(true);
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    try {
      await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username,
        password,
      });
      toast.success("Signed Up!", {
        position: "top-center",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setIsLoading(false);
      navigate("/signin");
    } catch (e) {
      toast.error("Error signing up!", {
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
      <Logo style="sign" />
      <div className="bg-[#1A1D21] rounded-lg text-gray-100 shadow-md border border-purple-700 shadow-black/55 w-screen md:w-[40%] lg:w-[20%] min-h-48 p-6 text-lg">
        <Input type="text" reference={usernameRef} placeholder="Username" />
        <Input type="password" reference={passwordRef} placeholder="Password" />
        <p className="text-xs lg:text-sm text-left text-gray-400 capitalize my-1">
          *Username must be 3-10 characters long.
        </p>
        <p className="text-xs lg:text-sm text-left text-gray-400 mt-2 mb-4">
          *Password Must Be 8-20 Characters Long And Contains One Uppercase, One
          Lowercase And One Special Character.
        </p>
        <div className="my-2">
          <Button
            variant="primary"
            onClick={signup}
            rounded="lg"
            size="lg"
            text="Sign Up"
            fullWidth={true}
            loading={isLoading}
          />
        </div>
      </div>
      <span className="text-gray-300 p-4">
        Already have an account?{" "}
        <span
          className="hover:text-white underline cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Sign In
        </span>
      </span>
    </div>
  );
};
