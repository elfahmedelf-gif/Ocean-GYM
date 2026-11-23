import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

/** PUT /api/admin/plans/[id] — update plan */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const body = await request.json();
    const { name, price, duration, features, popular, active } = body ?? {};

    const existing = await db.plan.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "الباقة غير موجودة" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = String(name).trim();
    if (price !== undefined && price !== null && price !== "")
      data.price = Number(price) || 0;
    if (duration !== undefined) data.duration = Number(duration) || 1;
    if (features !== undefined)
      data.features =
        typeof features === "string" && features.trim() ? features.trim() : "";
    if (popular !== undefined) data.popular = Boolean(popular);
    if (active !== undefined) data.active = Boolean(active);

    const plan = await db.plan.update({ where: { id }, data });
    return Response.json(plan);
  } catch (error) {
    console.error("PUT /api/admin/plans/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/** DELETE /api/admin/plans/[id] */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const existing = await db.plan.findUnique({
      where: { id },
      include: { _count: { select: { members: true } } },
    });
    if (!existing) {
      return Response.json({ error: "الباقة غير موجودة" }, { status: 404 });
    }
    if (existing._count.members > 0) {
      return Response.json(
        {
          error: "لا يمكن حذف الباقة — يوجد أعضاء مشتركون فيها. قم بنقلهم لباقة أخرى أولًا",
        },
        { status: 400 }
      );
    }

    await db.plan.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/plans/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
