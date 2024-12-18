import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Logo } from "../components/ui/Logo";

export const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-screen h-screen">
      <div className="bg-[#0E1113] min-h-screen h-fit px-16">
        <div className="max-w-full w-full px-16 fixed top-0 left-0 h-14 flex items-center justify-between">
          <Logo style="land" />
          <span className="hidden md:flex">
            <span className="mr-4">
              <Button
                text="Sign In"
                onClick={() => {
                  navigate("/signin");
                }}
                rounded="xl"
                size="lg"
                variant="secondary"
              />
            </span>
            <Button
              text="Sign Up"
              onClick={() => {
                navigate("/signup");
              }}
              rounded="xl"
              size="lg"
              variant="primary"
            />
          </span>
        </div>
        <div className="h-screen flex flex-col w-full items-center justify-center uppercase text-white text-4xl font-medium">
          <span className="mb-5">Store, Organize &</span>
          <span>
            Access Your <span className="text-purple-500">Key Links.</span>
          </span>
          <span className="flex text-lg mt-5 md:hidden">
            <span className="mr-4">
              <Button
                text="Sign In"
                onClick={() => {
                  navigate("/signin");
                }}
                rounded="xl"
                size="sm"
                variant="secondary"
              />
            </span>
            <Button
              text="Sign Up"
              onClick={() => {
                navigate("/signup");
              }}
              rounded="xl"
              size="sm"
              variant="primary"
            />
          </span>
        </div>
      </div>
    </div>
  );
};
