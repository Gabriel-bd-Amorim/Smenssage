"use client";

import { FormEvent, useEffect, useState } from "react";
import { FaInstagram, FaLock } from "react-icons/fa";
import ToggleButton from "./button";

export default function Maincomp() {
  const [dots, setDots] = useState("");
  const [instagram, setInstagram] = useState(false);
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) {
      setErrorMessage("Escreva uma mensagem antes de enviar.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const response = await fetch(`/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          msg: message.trim(),
          name: nickname.trim() || undefined,
          repost: instagram,
        }),
      });

      if (!response.ok) {
        throw new Error("Não foi possível enviar a mensagem.");
      }

      setMessage("");
      setNickname("");
      setInstagram(false);
      setStatusMessage("Mensagem enviada com sucesso.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao enviar mensagem.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center flex-col px-4">
      <h2 className="text-2xl text-center font-serif font-bold">
        Me envie uma mensagem <span className="text-[#7C5CFC]">anônima</span>
      </h2>

      <p className="text-md opacity-40">
        Você decide se quer ser 100% anônimo ou não
      </p>

      <div className="bg-[#7C5CFC]/10 border rounded-2xl border-white/20 w-full max-w-xl mt-6 p-4 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-[#7C5CFC] text-[12px] font-bold mb-2">
              NOVA FRASE
            </p>

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="w-full h-24 rounded-md bg-zinc-800/80 border border-white/10 resize-none p-3 text-[#7C5CFC]/70"
              placeholder={`Escreva uma mensagem${dots}`}
              required
            />
          </div>

          <div>
            <p className="text-[#7C5CFC] text-[12px] font-bold my-2">
              APELIDO (opcional)
            </p>

            <input
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              className="w-full rounded-md bg-zinc-800/80 border border-white/10 p-2 pl-3 text-[14px] text-[#7C5CFC]"
              placeholder="Seu apelido"
            />
          </div>

          <div className="flex items-center justify-between mt-5 mb-3">
            <p className="font-medium">Posso compartilhar no Instagram?</p>

            <div
              className={`
                flex items-center gap-2
                px-3 py-1
                rounded-full
                text-xs
                font-semibold
                transition-all
                duration-500
                ${
                  instagram
                    ? "bg-pink-500/20 text-pink-400"
                    : "bg-violet-500/20 text-violet-300"
                }
              `}>
              {instagram ? (
                <>
                  <FaInstagram />
                  Permitido
                </>
              ) : (
                <>
                  <FaLock />
                  Privado
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center items-center gap-4">
            <ToggleButton instagram={instagram} setInstagram={setInstagram} />
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 bg-fuchsia-700/80 w-4/5 rounded-md h-10 hover:scale-[1.1] active:scale-95 transition-transform duration-200 disabled:opacity-60 disabled:hover:scale-100">
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>

        {statusMessage ? (
          <p className="text-sm text-emerald-300">{statusMessage}</p>
        ) : null}

        {errorMessage ? (
          <p className="text-sm text-red-300">{errorMessage}</p>
        ) : null}
      </div>
    </div>
  );
}