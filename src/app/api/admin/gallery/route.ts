import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

/** GET /api/admin/gallery — list all gallery items */
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const items = await db.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json(items);
  } catch (error) {
    console.error("GET /api/admin/gallery error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/** POST /api/admin/gallery — create gallery item */
export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const body = await request.json();
    const { title, image } = body ?? {};

    if (!title?.trim() || !image?.trim()) {
      return Response.json(
        { error: "عنوان الصورة ومسار الصورة مطلوبان" },
        { status: 400 }
      );
    }

    const item = await db.galleryItem.create({
      data: { title: title.trim(), image: image.trim() },
    });

    return Response.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/gallery error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
