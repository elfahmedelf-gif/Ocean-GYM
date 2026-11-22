import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

/** GET /api/admin/trainers — list all trainers */
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const trainers = await db.trainer.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return Response.json(trainers);
  } catch (error) {
    console.error("GET /api/admin/trainers error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/** POST /api/admin/trainers — create trainer */
export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const body = await request.json();
    const { name, role, bio, image, specialty, instagram, active, order } =
      body ?? {};

    if (!name?.trim() || !role?.trim()) {
      return Response.json(
        { error: "اسم المدرب والتخصص مطلوبان" },
        { status: 400 }
      );
    }

    const trainer = await db.trainer.create({
      data: {
        name: name.trim(),
        role: role.trim(),
        bio: bio?.trim() || null,
        image: image || null,
        specialty: specialty?.trim() || null,
        instagram: instagram?.trim() || null,
        active: active ?? true,
        order: typeof order === "number" ? order : 0,
      },
    });

    return Response.json(trainer, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/trainers error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
