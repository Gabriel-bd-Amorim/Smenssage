import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL?.trim();

async function forwardResponse(response: Response): Promise<Response> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  }

  const text = await response.text();

  return new NextResponse(text, {
    status: response.status,
    headers: contentType ? { "content-type": contentType } : undefined,
  });
}

function getBackendUrl(): string | null {
  return BACKEND_URL ? BACKEND_URL.replace(/\/$/, "") : null;
}

export async function GET() {
  const backendUrl = getBackendUrl();

  if (!backendUrl) {
    return NextResponse.json(
      { message: "BACKEND_URL não configurado." },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${backendUrl}/message`, {
      cache: "no-store",
    });

    return await forwardResponse(response);
  } catch {
    return NextResponse.json(
      { message: "Não foi possível conectar ao backend." },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  const backendUrl = getBackendUrl();

  if (!backendUrl) {
    return NextResponse.json(
      { message: "BACKEND_URL não configurado." },
      { status: 500 },
    );
  }

  try {
    const body = await request.text();
    const response = await fetch(`${backendUrl}/message`, {
      method: "POST",
      headers: {
        "Content-Type":
          request.headers.get("content-type") ?? "application/json",
      },
      body,
    });

    return await forwardResponse(response);
  } catch {
    return NextResponse.json(
      { message: "Não foi possível enviar a mensagem." },
      { status: 502 },
    );
  }
}
