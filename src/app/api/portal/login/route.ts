import { db } from "@/lib/db";
import { createPortalSession } from "@/lib/portal-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      email?: unknown;
      accessCode?: unknown;
    } | null;

    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const accessCode =
      typeof body?.accessCode === "string" ? body.accessCode.trim() : "";

    if (!email || !accessCode) {
      return Response.json(
        { error: "البريد الإلكتروني وكود الدخول مطلوبان" },
        { status: 400 }
      );
    }

    const member = await db.member.findFirst({ where: { email } });

    if (!member || !member.accessCode || member.accessCode !== accessCode) {
      return Response.json(
        { error: "البريد الإلكتروني أو كود الدخول غير صحيح" },
        { status: 401 }
      );
    }

    await createPortalSession(member.id);

    return Response.json({
      ok: true,
      member: { id: member.id, name: member.name, email: member.email },
    });
  } catch (error) {
    console.error("[POST /api/portal/login]", error);
    return Response.json(
      { error: "حدث خطأ في الخادم — حاول مرة أخرى" },
      { status: 500 }
    );
  }
}
