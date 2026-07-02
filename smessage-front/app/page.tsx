import HeaderComp from "./components/headerComp";
import Maincomp from "./components/main";
export default function Home() {
  return (
    <div className="bg-[#0E0A1A] flex flex-col w-full min-h-screen p-5">
      <HeaderComp />
      <Maincomp />
    </div>
  );
}
