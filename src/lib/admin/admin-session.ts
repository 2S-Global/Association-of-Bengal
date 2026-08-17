export const ADMIN_SESSION_COOKIE = "balc_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

type AdminSession = {
  username: string;
  expiresAt: number;
};

const encoder = new TextEncoder();

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured.");
  return secret;
}

function toBase64Url(value: string | Uint8Array) {
  const binary = typeof value === "string"
    ? value
    : Array.from(value, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  return atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
}

async function getSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createAdminSession(username: string) {
  const payload: AdminSession = {
    username,
    expiresAt: Date.now() + ADMIN_SESSION_MAX_AGE * 1000,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = await crypto.subtle.sign("HMAC", await getSigningKey(), encoder.encode(encodedPayload));

  return `${encodedPayload}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifyAdminSession(token?: string): Promise<AdminSession | null> {
  if (!token) return null;
  const [encodedPayload, encodedSignature, ...extraParts] = token.split(".");
  if (!encodedPayload || !encodedSignature || extraParts.length) return null;

  try {
    const signature = Uint8Array.from(fromBase64Url(encodedSignature), (char) => char.charCodeAt(0));
    const valid = await crypto.subtle.verify(
      "HMAC",
      await getSigningKey(),
      signature,
      encoder.encode(encodedPayload)
    );
    if (!valid) return null;

    const payload = JSON.parse(fromBase64Url(encodedPayload)) as AdminSession;
    return typeof payload.username === "string" && typeof payload.expiresAt === "number" && payload.expiresAt > Date.now()
      ? payload
      : null;
  } catch {
    return null;
  }
}
