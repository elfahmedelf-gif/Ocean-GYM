import { randomInt } from "crypto";
import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

/** POST /api/admin/members/[id]/access-code — generate a unique portal access code */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const member = await db.member.findUnique({ where: { id } });
    if (!member) {
      return Response.json({ error: "العضو غير موجود" }, { status: 404 });
    }

    // Try to find a free code (OC-XXXX, 1000..9999)
    let accessCode: string | null = null;
    for (let attempt = 0; attempt < 50; attempt++) {
      const candidate = `OC-${randomInt(1000, 10000)}`;
      const taken = await db.member.findUnique({
        where: { accessCode: candidate },
        select: { id: true },
      });
      if (!taken) {
        accessCode = candidate;
        break;
      }
    }

    if (!accessCode) {
      return Response.json(
        { error: "تعذر توليد كود فريد — حاول مرة أخرى" },
        { status: 500 }
      );
    }

    const updated = await db.member.update({
      where: { id },
      data: { accessCode },
      select: { id: true, accessCode: true },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("POST /api/admin/members/[id]/access-code error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
