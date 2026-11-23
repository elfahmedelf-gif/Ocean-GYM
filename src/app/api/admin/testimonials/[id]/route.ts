import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

/** PUT /api/admin/testimonials/[id] — update testimonial */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const body = await request.json();
    const { name, role, content, rating, image, approved } = body ?? {};

    const existing = await db.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "الرأي غير موجود" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = String(name).trim();
    if (role !== undefined) data.role = String(role).trim();
    if (content !== undefined) data.content = String(content).trim();
    if (rating !== undefined)
      data.rating = Math.min(5, Math.max(1, Number(rating) || 5));
    if (image !== undefined) data.image = image || null;
    if (approved !== undefined) data.approved = Boolean(approved);

    const testimonial = await db.testimonial.update({ where: { id }, data });
    return Response.json(testimonial);
  } catch (error) {
    console.error("PUT /api/admin/testimonials/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/** DELETE /api/admin/testimonials/[id] */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const existing = await db.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "الرأي غير موجود" }, { status: 404 });
    }

    await db.testimonial.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/testimonials/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
