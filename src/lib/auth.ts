// src/lib/auth.ts

const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 Tage

function getEncoder() {
  return new TextEncoder();
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function signValue(value: string, secret: string): Promise<string> {
  const encoder = getEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value)
  );

  return toHex(signature);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

export async function createSessionToken(
  email: string,
  secret: string
): Promise<string> {
  const normalizedEmail = normalizeEmail(email);
  const issuedAt = Date.now();
  const encodedEmail = encodeURIComponent(normalizedEmail);
  const payload = `${encodedEmail}|${issuedAt}`;
  const signature = await signValue(payload, secret);
  return `${payload}|${signature}`;
}

export async function verifySessionToken(
  token: string,
  secret: string
): Promise<{ valid: boolean; email?: string; issuedAt?: number }> {
  const parts = token.split("|");
  if (parts.length !== 3) return { valid: false };

  const [encodedEmail, issuedAtRaw, signature] = parts;
  const issuedAt = Number(issuedAtRaw);

  if (!Number.isFinite(issuedAt)) return { valid: false };

  const payload = `${encodedEmail}|${issuedAt}`;
  const expectedSignature = await signValue(payload, secret);

  if (!safeEqual(signature, expectedSignature)) {
    return { valid: false };
  }

  if (Date.now() - issuedAt > SESSION_MAX_AGE_MS) {
    return { valid: false };
  }

  const email = decodeURIComponent(encodedEmail);

  return {
    valid: true,
    email,
    issuedAt,
  };
}