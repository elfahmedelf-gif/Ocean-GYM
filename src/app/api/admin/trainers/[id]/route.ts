import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

/** PUT /api/admin/trainers/[id] — update trainer */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const body = await request.json();
    const { name, role, bio, image, specialty, instagram, active, order } =
      body ?? {};

    const existing = await db.trainer.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "المدرب غير موجود" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = String(name).trim();
    if (role !== undefined) data.role = String(role).trim();
    if (bio !== undefined) data.bio = bio?.trim() || null;
    if (image !== undefined) data.image = image || null;
    if (specialty !== undefined) data.specialty = specialty?.trim() || null;
    if (instagram !== undefined) data.instagram = instagram?.trim() || null;
    if (active !== undefined) data.active = Boolean(active);
    if (order !== undefined) data.order = Number(order) || 0;

    const trainer = await db.trainer.update({ where: { id }, data });
    return Response.json(trainer);
  } catch (error) {
    console.error("PUT /api/admin/trainers/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/** DELETE /api/admin/trainers/[id] */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const existing = await db.trainer.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "المدرب غير موجود" }, { status: 404 });
    }

    await db.trainer.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/trainers/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
