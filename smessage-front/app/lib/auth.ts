import crypto from "crypto";

const AUTH_COOKIE_NAME = "secretTell.auth";
const AUTH_TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

type AuthSettings = {
  username: string | null;
  password: string | null;
  secret: string | null;
};

type AuthTokenPayload = {
  username: string;
  exp: number;
};

export function getAuthSettings(): AuthSettings {
  return {
    username: process.env.LOGIN_USERNAME?.trim() ?? null,
    password: process.env.LOGIN_PASSWORD?.trim() ?? null,
    secret: process.env.AUTH_COOKIE_SECRET?.trim() ?? null,
  };
}

export function isAuthConfigured(): boolean {
  const settings = getAuthSettings();
  return Boolean(settings.username && settings.password && settings.secret);
}

export function validateCredentials(
  username: string,
  password: string,
): boolean {
  const settings = getAuthSettings();

  if (!settings.username || !settings.password) {
    return false;
  }

  return username === settings.username && password === settings.password;
}

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
}

export function createAuthToken(username: string): string {
  const settings = getAuthSettings();

  if (!settings.secret) {
    throw new Error("Auth secret is not configured.");
  }

  const payload: AuthTokenPayload = {
    username,
    exp: Date.now() + AUTH_TOKEN_TTL_MS,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload, settings.secret);

  return `${encodedPayload}.${signature}`;
}

export function verifyAuthToken(token: string | null | undefined): boolean {
  const settings = getAuthSettings();

  if (!token || !settings.secret) {
    return false;
  }

  const [encodedPayload, providedSignature] = token.split(".");

  if (!encodedPayload || !providedSignature) {
    return false;
  }

  const expectedSignature = signPayload(encodedPayload, settings.secret);

  if (providedSignature.length !== expectedSignature.length) {
    return false;
  }

  const matches = crypto.timingSafeEqual(
    Buffer.from(providedSignature),
    Buffer.from(expectedSignature),
  );

  if (!matches) {
    return false;
  }

  try {
    const payload = JSON.parse(
      fromBase64Url(encodedPayload),
    ) as AuthTokenPayload;

    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export { AUTH_COOKIE_NAME, AUTH_TOKEN_TTL_MS };
