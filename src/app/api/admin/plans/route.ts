import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

/** GET /api/admin/plans — list all plans (including inactive) with member count */
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const plans = await db.plan.findMany({
      include: { _count: { select: { members: true } } },
      orderBy: { price: "asc" },
    });
    return Response.json(plans);
  } catch (error) {
    console.error("GET /api/admin/plans error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/** POST /api/admin/plans — create plan */
export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const body = await request.json();
    const { name, price, duration, features, popular, active } = body ?? {};

    if (!name?.trim() || price === undefined || price === null || price === "") {
      return Response.json(
        { error: "اسم الباقة والسعر مطلوبان" },
        { status: 400 }
      );
    }

    const plan = await db.plan.create({
      data: {
        name: name.trim(),
        price: Number(price) || 0,
        duration: Number(duration) || 1,
        features:
          typeof features === "string" && features.trim()
            ? features.trim()
            : "",
        popular: Boolean(popular),
        active: active ?? true,
      },
    });

    return Response.json(plan, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/plans error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
