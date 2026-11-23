import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const PORTAL_COOKIE = "ocean_portal";
const PORTAL_SESSION_DAYS = 14;

/** Generate a new member access code like "OC-4821" (checks uniqueness) */
export async function generateAccessCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = `OC-${crypto.randomInt(1000, 10000)}`;
    const existing = await db.member.findUnique({ where: { accessCode: code } });
    if (!existing) return code;
  }
  // Extremely unlikely fallback
  return `OC-${Date.now() % 10000}`;
}

/** Create a portal session for a member and set the httpOnly cookie */
export async function createPortalSession(memberId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + PORTAL_SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.portalSession.create({ data: { token, memberId, expiresAt } });

  const cookieStore = await cookies();
  cookieStore.set(PORTAL_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  return token;
}

export type PortalMemberPayload = {
  id: string;
  name: string;
  email: string;
};

/** Get the currently authenticated portal member from cookie (or null) */
export async function getCurrentPortalMember(): Promise<PortalMemberPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PORTAL_COOKIE)?.value;
  if (!token) return null;

  const session = await db.portalSession.findUnique({
    where: { token },
    include: { member: true },
  });
  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await db.portalSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return { id: session.member.id, name: session.member.name, email: session.member.email };
}

/** Destroy current portal session (delete DB row + clear cookie) */
export async function destroyPortalSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PORTAL_COOKIE)?.value;
  if (token) {
    await db.portalSession.deleteMany({ where: { token } }).catch(() => {});
  }
  cookieStore.delete(PORTAL_COOKIE);
}

/** Standard 401 response for portal APIs */
export function portalUnauthorizedResponse(): Response {
  return Response.json(
    { error: "انتهت الجلسة — سجل الدخول من جديد" },
    { status: 401 }
  );
}
