import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

/** PUT /api/admin/members/[id] — update member fields */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const body = await request.json();
    const { name, email, phone, planId, status, startDate, endDate, notes } =
      body ?? {};

    const existing = await db.member.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "العضو غير موجود" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = String(name).trim();
    if (email !== undefined) data.email = String(email).trim();
    if (phone !== undefined) data.phone = String(phone).trim();
    if (planId !== undefined) data.planId = planId || null;
    if (status !== undefined) data.status = status;
    if (startDate !== undefined)
      data.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined)
      data.endDate = endDate ? new Date(endDate) : null;
    if (notes !== undefined) data.notes = notes?.trim() || null;

    const member = await db.member.update({
      where: { id },
      data,
      include: { plan: { select: { name: true, price: true } } },
    });

    return Response.json(member);
  } catch (error) {
    console.error("PUT /api/admin/members/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/** DELETE /api/admin/members/[id] */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const existing = await db.member.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "العضو غير موجود" }, { status: 404 });
    }

    await db.member.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/members/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
