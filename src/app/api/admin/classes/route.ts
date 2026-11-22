import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

/** GET /api/admin/classes — list all classes with trainer name */
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const classes = await db.gymClass.findMany({
      include: { trainer: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(classes);
  } catch (error) {
    console.error("GET /api/admin/classes error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/** POST /api/admin/classes — create class */
export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const body = await request.json();
    const {
      name,
      description,
      trainerId,
      schedule,
      duration,
      capacity,
      level,
      image,
      active,
    } = body ?? {};

    if (!name?.trim() || !description?.trim() || !schedule?.trim()) {
      return Response.json(
        { error: "اسم الكلاس والوصف ومواعيده مطلوبة" },
        { status: 400 }
      );
    }

    let validTrainerId: string | null = null;
    if (trainerId) {
      const trainer = await db.trainer.findUnique({
        where: { id: trainerId },
      });
      validTrainerId = trainer ? trainer.id : null;
    }

    const gymClass = await db.gymClass.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        trainerId: validTrainerId,
        schedule: schedule.trim(),
        duration: Number(duration) || 60,
        capacity: Number(capacity) || 20,
        level: level || "all",
        image: image || null,
        active: active ?? true,
      },
      include: { trainer: { select: { id: true, name: true } } },
    });

    return Response.json(gymClass, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/classes error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
