"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BiConversation } from "react-icons/bi";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        setErrorMessage(data?.message ?? "Não foi possível entrar.");
        return;
      }

      router.replace("/messages");
      router.refresh();
    } catch {
      setErrorMessage("Não foi possível entrar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0E0A1A] text-white px-4 py-8 flex items-center justify-center">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#120E24] shadow-[0_0_80px_rgba(124,92,252,0.16)] p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#7C5CFC] flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
            <BiConversation size={24} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">
              Área restrita
            </p>
            <h1 className="text-2xl font-bold">
              Secret<span className="text-[#7C5CFC]">Tell</span>
            </h1>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-semibold leading-tight">
            Acesso para ver todas as mensagens.
          </h2>
          <p className="text-sm text-white/55">
            Esta página só aparece para quem conhece a URL e informa as
            credenciais do arquivo <span className="text-[#7C5CFC]">.env</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm text-white/70">
              Usuário
            </label>
            <input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#7C5CFC] focus:bg-white/8"
              placeholder="Seu usuário"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-white/70">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#7C5CFC] focus:bg-white/8"
              placeholder="Sua senha"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#7C5CFC] py-3 font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {errorMessage ? (
          <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorMessage}
          </p>
        ) : null}
      </section>
    </main>
  );
}
