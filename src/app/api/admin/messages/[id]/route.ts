import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

/** PUT /api/admin/messages/[id] — mark read/unread */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const body = await request.json();
    const { read } = body ?? {};

    const existing = await db.message.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "الرسالة غير موجودة" }, { status: 404 });
    }

    const message = await db.message.update({
      where: { id },
      data: { read: Boolean(read) },
    });
    return Response.json(message);
  } catch (error) {
    console.error("PUT /api/admin/messages/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/** DELETE /api/admin/messages/[id] */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const existing = await db.message.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "الرسالة غير موجودة" }, { status: 404 });
    }

    await db.message.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/messages/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
