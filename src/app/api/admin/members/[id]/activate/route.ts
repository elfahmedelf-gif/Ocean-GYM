import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

/** POST /api/admin/members/[id]/activate — activate membership for plan duration */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;

    const member = await db.member.findUnique({
      where: { id },
      include: { plan: true },
    });
    if (!member) {
      return Response.json({ error: "العضو غير موجود" }, { status: 404 });
    }
    if (!member.plan) {
      return Response.json(
        { error: "لا يمكن التنشيط — يجب اختيار باقة للعضو أولًا" },
        { status: 400 }
      );
    }

    const now = new Date();
    const end = new Date(now);
    end.setMonth(end.getMonth() + (member.plan.duration || 1));

    const updated = await db.member.update({
      where: { id },
      data: { status: "active", startDate: now, endDate: end },
      include: { plan: { select: { name: true, price: true } } },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("POST /api/admin/members/[id]/activate error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
