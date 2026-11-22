import { db } from "@/lib/db";

export async function GET() {
  try {
    const items = await db.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json(items);
  } catch (error) {
    console.error("GET /api/gallery error:", error);
    return Response.json({ error: "حدث خطأ أثناء تحميل معرض الصور" }, { status: 500 });
  }
}
