import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

/** GET /api/admin/testimonials — list all (approved + pending) */
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const testimonials = await db.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json(testimonials);
  } catch (error) {
    console.error("GET /api/admin/testimonials error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/** POST /api/admin/testimonials — create testimonial */
export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const body = await request.json();
    const { name, role, content, rating, image, approved } = body ?? {};

    if (!name?.trim() || !role?.trim() || !content?.trim()) {
      return Response.json(
        { error: "الاسم والصفة ونص الرأي مطلوبة" },
        { status: 400 }
      );
    }

    const testimonial = await db.testimonial.create({
      data: {
        name: name.trim(),
        role: role.trim(),
        content: content.trim(),
        rating: Math.min(5, Math.max(1, Number(rating) || 5)),
        image: image || null,
        approved: approved ?? true,
      },
    });

    return Response.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/testimonials error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
