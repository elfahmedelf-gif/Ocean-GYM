import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/hash";

export { hashPassword, verifyPassword };

export const SESSION_COOKIE = "ocean_session";
const SESSION_DAYS = 7;

/** Create a DB-backed session and set the httpOnly cookie */
export async function createSessionForAdmin(adminId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.session.create({ data: { token, adminId, expiresAt } });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  return token;
}

export type AdminPayload = {
  id: string;
  username: string;
  name: string;
};

/** Get the currently authenticated admin from the session cookie (or null) */
export async function getCurrentAdmin(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { token },
    include: { admin: true },
  });
  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await db.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return {
    id: session.admin.id,
    username: session.admin.username,
    name: session.admin.name,
  };
}

/** Destroy current session (delete DB row + clear cookie) */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { token } }).catch(() => {});
  }
  cookieStore.delete(SESSION_COOKIE);
}

/** Standard 401 response helper for admin APIs */
export function unauthorizedResponse(): Response {
  return Response.json({ error: "غير مصرح — يجب تسجيل الدخول" }, { status: 401 });
}
