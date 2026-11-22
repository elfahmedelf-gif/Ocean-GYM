import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

const TIME_FORMAT = /^\d{2}:\d{2}$/;

/** PUT /api/admin/schedule/[id] — update a schedule slot */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const existing = await db.scheduleSlot.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "الموعد غير موجود" }, { status: 404 });
    }

    const body = await request.json();
    const { day, time, gymClassId, trainerId, active } = body ?? {};

    const data: Record<string, unknown> = {};

    if (day !== undefined) {
      if (!Number.isInteger(day) || day < 0 || day > 6) {
        return Response.json(
          { error: "اليوم يجب أن يكون بين 0 (السبت) و 6 (الجمعة)" },
          { status: 400 }
        );
      }
      data.day = day;
    }

    if (time !== undefined) {
      if (!time || typeof time !== "string" || !TIME_FORMAT.test(time)) {
        return Response.json(
          { error: "الوقت يجب أن يكون بصيغة HH:MM صحيحة" },
          { status: 400 }
        );
      }
      data.time = time;
    }

    if (gymClassId !== undefined) {
      if (!gymClassId) {
        return Response.json({ error: "الكلاس مطلوب" }, { status: 400 });
      }
      const gymClass = await db.gymClass.findUnique({ where: { id: gymClassId } });
      if (!gymClass) {
        return Response.json({ error: "الكلاس غير موجود" }, { status: 400 });
      }
      data.gymClassId = gymClassId;
    }

    if (trainerId !== undefined) {
      if (trainerId) {
        const trainer = await db.trainer.findUnique({ where: { id: trainerId } });
        if (!trainer) {
          return Response.json({ error: "المدرب غير موجود" }, { status: 400 });
        }
        data.trainerId = trainer.id;
      } else {
        data.trainerId = null;
      }
    }

    if (active !== undefined) data.active = Boolean(active);

    const slot = await db.scheduleSlot.update({
      where: { id },
      data,
      include: {
        gymClass: { select: { name: true, level: true, duration: true } },
        trainer: { select: { name: true } },
      },
    });

    return Response.json(slot);
  } catch (error) {
    console.error("PUT /api/admin/schedule/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/** DELETE /api/admin/schedule/[id] */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const existing = await db.scheduleSlot.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "الموعد غير موجود" }, { status: 404 });
    }

    await db.scheduleSlot.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/schedule/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
