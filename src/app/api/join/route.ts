import { db } from "@/lib/db";

/**
 * Public endpoint: visitors request to join the gym.
 * Creates a Member with status "pending" for the admin to approve.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, planId, notes } = body ?? {};

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return Response.json(
        { error: "الاسم والبريد الإلكتروني ورقم الهاتف مطلوبة" },
        { status: 400 }
      );
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return Response.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 });
    }

    let validPlanId: string | null = null;
    if (planId) {
      const plan = await db.plan.findUnique({ where: { id: planId } });
      validPlanId = plan ? plan.id : null;
    }

    const member = await db.member.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        planId: validPlanId,
        status: "pending",
        notes: notes?.trim() || "طلب انضمام من الموقع",
      },
    });

    return Response.json({ ok: true, id: member.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/join error:", error);
    return Response.json({ error: "حدث خطأ أثناء إرسال الطلب" }, { status: 500 });
  }
}
