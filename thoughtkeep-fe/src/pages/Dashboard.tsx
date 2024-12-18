import { CreateContentModal } from "../components/ui/CreateContentModal";
import { Sidebar } from "../components/ui/Sidebar";
import { CardList } from "../components/ui/CardList";
import { sidebarAtom } from "../store/sidebarAtom";
import { useRecoilState } from "recoil";
import { HamburgerIcon } from "../icons/HamburgerIcon";
import { useEffect } from "react";
import { useContent } from "../hooks/useContent";
import { Logo } from "../components/ui/Logo";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useRecoilState(sidebarAtom);

  const fetchContents = useContent();

  useEffect(() => {
    fetchContents();
  }, []);

  return (
    <div className="max-w-screen h-screen">
      <Sidebar />
      <div
        className={`${
          sidebarOpen ? `w-[80%] ml-[20%]` : `w-full`
        } bg-[#0E1113] min-h-screen h-fit p-3`}
      >
        <CreateContentModal />
        {!sidebarOpen && (
          <div className="w-full h-10 flex justify-between items-center">
            <Logo style="dash" />
            <span
              className="flex justify-center items-center h-full text-white cursor-pointer hover:text-purple-500 transition-all"
              onClick={() => {
                setSidebarOpen(true);
              }}
            >
              <HamburgerIcon />
            </span>
          </div>
        )}
        <div className="mx-auto w-full pt-5 flex justify-center">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
            <CardList />
          </div>
        </div>
      </div>
    </div>
  );
}
