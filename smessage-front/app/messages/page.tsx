import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BiConversation } from "react-icons/bi";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "../lib/auth";

type MessageRecord = {
  id: number;
  msg: string;
  name: string | null;
  repost: boolean;
  create_at: string;
};

const BACKEND_URL = process.env.BACKEND_URL?.trim();

export const dynamic = "force-dynamic";

async function getMessages(): Promise<{
  messages: MessageRecord[];
  error: string | null;
}> {
  if (!BACKEND_URL) {
    return { messages: [], error: "BACKEND_URL não configurado no .env." };
  }

  try {
    const response = await fetch(`${BACKEND_URL.replace(/\/$/, "")}/message`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        messages: [],
        error: "Não foi possível carregar as mensagens.",
      };
    }

    const messages = (await response.json()) as MessageRecord[];
    return { messages, error: null };
  } catch {
    return { messages: [], error: "Não foi possível carregar as mensagens." };
  }
}

export default async function MessagesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!verifyAuthToken(token)) {
    redirect("/login");
  }

  const { messages, error } = await getMessages();

  return (
    <main className="min-h-screen bg-[#0E0A1A] text-white px-4 py-8 md:py-10">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#120E24] p-5 md:flex-row md:items-center md:justify-between md:p-6 shadow-[0_0_80px_rgba(124,92,252,0.12)]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#7C5CFC] flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
              <BiConversation size={24} />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/40">
                Mensagens recebidas
              </p>
              <h1 className="text-2xl font-bold">
                Secret<span className="text-[#7C5CFC]">Tell</span>
              </h1>
            </div>
          </div>

          <form action="/api/logout" method="post">
            <button
              type="submit"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-[#7C5CFC] hover:bg-white/10 md:w-auto">
              Sair
            </button>
          </form>
        </header>

        <div className="rounded-3xl border border-white/10 bg-[#120E24] p-5 md:p-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Todas as mensagens</h2>
              <p className="text-sm text-white/50">
                Acompanhamento das mensagens enviadas anonimamente.
              </p>
            </div>
            <Link
              href="/"
              className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:border-[#7C5CFC] hover:bg-white/10 md:inline-flex">
              Ver página pública
            </Link>
          </div>

          {error ? (
            <p className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              {error}
            </p>
          ) : null}

          {!error && messages.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
              Nenhuma mensagem foi enviada ainda.
            </p>
          ) : null}

          {!error ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className="rounded-2xl border border-white/10 bg-[#0E0A1A] p-4 shadow-[0_16px_50px_rgba(0,0,0,0.25)]">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#7C5CFC]">
                      {message.name?.trim() ? message.name : "Anônimo"}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                        message.repost
                          ? "bg-pink-500/15 text-pink-300"
                          : "bg-violet-500/15 text-violet-300"
                      }`}>
                      {message.repost ? "Pode repostar" : "Privado"}
                    </span>
                  </div>

                  <p className="text-sm leading-6 text-white/80">
                    {message.msg}
                  </p>

                  <p className="mt-4 text-xs text-white/35">
                    #{message.id} •{" "}
                    {new Date(message.create_at).toLocaleString("pt-BR")}
                  </p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
