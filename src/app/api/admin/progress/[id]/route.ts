import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

/** DELETE /api/admin/progress/[id] — delete a progress log */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const existing = await db.progressLog.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "سجل المتابعة غير موجود" }, { status: 404 });
    }

    await db.progressLog.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/progress/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
