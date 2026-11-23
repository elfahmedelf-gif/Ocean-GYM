import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

const TIME_FORMAT = /^\d{2}:\d{2}$/;

/** GET /api/admin/schedule — all weekly slots ordered by day then time */
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const slots = await db.scheduleSlot.findMany({
      orderBy: [{ day: "asc" }, { time: "asc" }],
      include: {
        gymClass: { select: { name: true, level: true, duration: true } },
        trainer: { select: { name: true } },
      },
    });

    return Response.json(slots);
  } catch (error) {
    console.error("GET /api/admin/schedule error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/** POST /api/admin/schedule — create a schedule slot */
export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const body = await request.json();
    const { day, time, gymClassId, trainerId, active } = body ?? {};

    if (
      day === undefined ||
      day === null ||
      !Number.isInteger(day) ||
      day < 0 ||
      day > 6
    ) {
      return Response.json(
        { error: "اليوم مطلوب ويجب أن يكون بين 0 (السبت) و 6 (الجمعة)" },
        { status: 400 }
      );
    }

    if (!time || typeof time !== "string" || !TIME_FORMAT.test(time)) {
      return Response.json(
        { error: "الوقت مطلوب بصيغة HH:MM صحيحة" },
        { status: 400 }
      );
    }

    if (!gymClassId) {
      return Response.json({ error: "الكلاس مطلوب" }, { status: 400 });
    }

    const gymClass = await db.gymClass.findUnique({ where: { id: gymClassId } });
    if (!gymClass) {
      return Response.json({ error: "الكلاس غير موجود" }, { status: 400 });
    }

    let validTrainerId: string | null = null;
    if (trainerId) {
      const trainer = await db.trainer.findUnique({ where: { id: trainerId } });
      if (!trainer) {
        return Response.json({ error: "المدرب غير موجود" }, { status: 400 });
      }
      validTrainerId = trainer.id;
    }

    const slot = await db.scheduleSlot.create({
      data: {
        day,
        time,
        gymClassId,
        trainerId: validTrainerId,
        active: active ?? true,
      },
      include: {
        gymClass: { select: { name: true, level: true, duration: true } },
        trainer: { select: { name: true } },
      },
    });

    return Response.json(slot, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/schedule error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
