import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

/** PUT /api/admin/classes/[id] — update class */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      trainerId,
      schedule,
      duration,
      capacity,
      level,
      image,
      active,
    } = body ?? {};

    const existing = await db.gymClass.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "الكلاس غير موجود" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = String(name).trim();
    if (description !== undefined)
      data.description = String(description).trim();
    if (trainerId !== undefined) {
      if (trainerId === null || trainerId === "") {
        data.trainerId = null;
      } else {
        const trainer = await db.trainer.findUnique({
          where: { id: trainerId },
        });
        data.trainerId = trainer ? trainer.id : null;
      }
    }
    if (schedule !== undefined) data.schedule = String(schedule).trim();
    if (duration !== undefined) data.duration = Number(duration) || 60;
    if (capacity !== undefined) data.capacity = Number(capacity) || 20;
    if (level !== undefined) data.level = level;
    if (image !== undefined) data.image = image || null;
    if (active !== undefined) data.active = Boolean(active);

    const gymClass = await db.gymClass.update({
      where: { id },
      data,
      include: { trainer: { select: { id: true, name: true } } },
    });
    return Response.json(gymClass);
  } catch (error) {
    console.error("PUT /api/admin/classes/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/** DELETE /api/admin/classes/[id] */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const existing = await db.gymClass.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "الكلاس غير موجود" }, { status: 404 });
    }

    await db.gymClass.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/classes/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
