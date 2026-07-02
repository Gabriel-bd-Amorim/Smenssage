import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  createAuthToken,
  isAuthConfigured,
  validateCredentials,
} from "../../lib/auth";

type LoginBody = {
  username?: string;
  password?: string;
};

export async function POST(request: NextRequest) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      {
        message:
          "Configure LOGIN_USERNAME, LOGIN_PASSWORD e AUTH_COOKIE_SECRET no .env.",
      },
      { status: 500 },
    );
  }

  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json(
      { message: "Corpo da requisição inválido." },
      { status: 400 },
    );
  }

  const username = body.username?.trim() ?? "";
  const password = body.password?.trim() ?? "";

  if (!username || !password) {
    return NextResponse.json(
      { message: "Preencha usuário e senha." },
      { status: 400 },
    );
  }

  if (!validateCredentials(username, password)) {
    return NextResponse.json(
      { message: "Usuário ou senha inválidos." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set(AUTH_COOKIE_NAME, createAuthToken(username), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 8 * 60 * 60,
  });

  return response;
}
