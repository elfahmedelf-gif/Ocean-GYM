import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

/** GET /api/admin/members?search=... — list members (newest first) */
export async function GET(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();

    const members = await db.member.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
              { phone: { contains: search } },
            ],
          }
        : undefined,
      include: {
        plan: { select: { name: true, price: true } },
        nutritionPlan: { select: { id: true, name: true, goal: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(members);
  } catch (error) {
    console.error("GET /api/admin/members error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/** POST /api/admin/members — create a member */
export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const body = await request.json();
    const { name, email, phone, planId, status, startDate, endDate, notes } =
      body ?? {};

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return Response.json(
        { error: "الاسم والبريد الإلكتروني ورقم الهاتف مطلوبة" },
        { status: 400 }
      );
    }

    const member = await db.member.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        planId: planId || null,
        status: status || "pending",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        notes: notes?.trim() || null,
      },
      include: {
        plan: { select: { name: true, price: true } },
        nutritionPlan: { select: { id: true, name: true, goal: true } },
      },
    });

    return Response.json(member, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/members error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
