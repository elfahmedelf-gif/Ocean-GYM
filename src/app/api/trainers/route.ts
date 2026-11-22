import { db } from "@/lib/db";

export async function GET() {
  try {
    const trainers = await db.trainer.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return Response.json(trainers);
  } catch (error) {
    console.error("GET /api/trainers error:", error);
    return Response.json({ error: "حدث خطأ أثناء تحميل المدربين" }, { status: 500 });
  }
}
