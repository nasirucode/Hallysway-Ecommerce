// Lightweight signed-cookie session used only for the mini user dashboard.
// In production, replace with a proper auth provider.

import "server-only";
import { cookies } from "next/headers";
import crypto from "node:crypto";

const SESSION_COOKIE = "hw_session";
const SECRET = process.env.SESSION_SECRET || "hw-dev-secret-change-me";
const ONE_WEEK = 60 * 60 * 24 * 7;

export interface SessionUser {
  email: string;
  name: string;
  phone?: string;
}

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

function encode(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

function decode(token: string): SessionUser | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  if (sign(payload) !== sig) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export function setSession(user: SessionUser) {
  cookies().set(SESSION_COOKIE, encode(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_WEEK,
    path: "/"
  });
}

export function clearSession() {
  cookies().set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
}

export function getSession(): SessionUser | null {
  const c = cookies().get(SESSION_COOKIE);
  if (!c?.value) return null;
  return decode(c.value);
}
