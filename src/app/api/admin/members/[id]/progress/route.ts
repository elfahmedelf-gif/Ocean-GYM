import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

function parseOptionalNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** GET /api/admin/members/[id]/progress — progress logs of a member (newest first) */
export async function GET(
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

    const logs = await db.progressLog.findMany({
      where: { memberId: id },
      orderBy: { date: "desc" },
    });

    return Response.json(logs);
  } catch (error) {
    console.error("GET /api/admin/members/[id]/progress error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/** POST /api/admin/members/[id]/progress — add a progress log */
export async function POST(
  request: Request,
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

    const body = await request.json();
    const { date, weight, fatPercent, muscleMass, waist, chest, arm, notes } =
      body ?? {};

    if (!date) {
      return Response.json({ error: "تاريخ القياس مطلوب" }, { status: 400 });
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return Response.json({ error: "تاريخ القياس غير صحيح" }, { status: 400 });
    }

    const parsedWeight = parseOptionalNumber(weight);
    if (parsedWeight === null || parsedWeight <= 0) {
      return Response.json(
        { error: "الوزن مطلوب ويجب أن يكون أكبر من صفر" },
        { status: 400 }
      );
    }

    const log = await db.progressLog.create({
      data: {
        memberId: id,
        date: parsedDate,
        weight: parsedWeight,
        fatPercent: parseOptionalNumber(fatPercent),
        muscleMass: parseOptionalNumber(muscleMass),
        waist: parseOptionalNumber(waist),
        chest: parseOptionalNumber(chest),
        arm: parseOptionalNumber(arm),
        notes: notes?.trim() || null,
      },
    });

    return Response.json(log, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/members/[id]/progress error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
