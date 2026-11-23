import { db } from "@/lib/db";

export async function GET() {
  try {
    const classes = await db.gymClass.findMany({
      where: { active: true },
      include: { trainer: { select: { name: true, role: true } } },
      orderBy: { createdAt: "asc" },
    });
    return Response.json(classes);
  } catch (error) {
    console.error("GET /api/classes error:", error);
    return Response.json({ error: "حدث خطأ أثناء تحميل الكلاسات" }, { status: 500 });
  }
}
