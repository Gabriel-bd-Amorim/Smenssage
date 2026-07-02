import { BiConversation } from "react-icons/bi";

export default function HeaderComp() {
  return (
    <header className="flex ">
      <div className="w-max h-max bg-[#7C5CFC] p-1 rounded-md">
        <BiConversation size={25} />
      </div>
      <div className="ml-2 p-1 text-[18px] font-bold">
        Secret<span className="text-[#7C5CFC]">Tell</span>
      </div>
    </header>
  );
}
