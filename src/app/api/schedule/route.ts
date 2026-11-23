import { db } from "@/lib/db";

export async function GET() {
  try {
    const slots = await db.scheduleSlot.findMany({
      where: { active: true },
      include: {
        gymClass: { select: { name: true, level: true, duration: true } },
        trainer: { select: { name: true } },
      },
      orderBy: [{ day: "asc" }, { time: "asc" }],
    });
    return Response.json(slots);
  } catch (error) {
    console.error("GET /api/schedule error:", error);
    return Response.json({ error: "حدث خطأ أثناء تحميل الجدول الأسبوعي" }, { status: 500 });
  }
}
