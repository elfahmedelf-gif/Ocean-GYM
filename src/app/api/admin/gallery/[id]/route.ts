import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

/** PUT /api/admin/gallery/[id] — update gallery item */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const body = await request.json();
    const { title, image } = body ?? {};

    const existing = await db.galleryItem.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "الصورة غير موجودة" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = String(title).trim();
    if (image !== undefined) data.image = String(image).trim();

    const item = await db.galleryItem.update({ where: { id }, data });
    return Response.json(item);
  } catch (error) {
    console.error("PUT /api/admin/gallery/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/** DELETE /api/admin/gallery/[id] */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const existing = await db.galleryItem.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "الصورة غير موجودة" }, { status: 404 });
    }

    await db.galleryItem.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/gallery/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
