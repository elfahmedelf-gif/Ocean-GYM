import { db } from "@/lib/db";

export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(testimonials);
  } catch (error) {
    console.error("GET /api/testimonials error:", error);
    return Response.json({ error: "حدث خطأ أثناء تحميل آراء العملاء" }, { status: 500 });
  }
}
