import { db } from "@/lib/db";

export async function GET() {
  try {
    const plans = await db.plan.findMany({
      where: { active: true },
      orderBy: { price: "asc" },
    });
    return Response.json(plans);
  } catch (error) {
    console.error("GET /api/plans error:", error);
    return Response.json({ error: "حدث خطأ أثناء تحميل الباقات" }, { status: 500 });
  }
}
