"use client";

import { FaInstagram } from "react-icons/fa";

interface ToggleButtonProps {
  instagram: boolean;
  setInstagram: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ToggleButton({
  instagram,
  setInstagram,
}: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={() => setInstagram(!instagram)}
      className="relative w-2/3 h-11 rounded-md font-semibold text-white flex items-center justify-center overflow-hidden hover:scale-[1.02] active:scale-95 transition-transform duration-200">
      {/* Estado Anônimo */}
      <span
        className={`
          absolute inset-0 flex items-center justify-center gap-2
          bg-[#7C5CFC]
          transition-opacity duration-500
          ${instagram ? "opacity-0" : "opacity-100"}
        `}>
        🤫 Anônimo
      </span>

      {/* Estado Instagram */}
      <span
        className={`
          absolute inset-0 flex items-center justify-center gap-2
          bg-linear-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF]
          transition-opacity duration-500
          ${instagram ? "opacity-100" : "opacity-0"}
        `}>
        <FaInstagram className="text-lg" />
        Instagram
      </span>
    </button>
  );
}
