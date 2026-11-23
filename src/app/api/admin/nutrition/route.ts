import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

const VALID_GOALS = ["bulk", "cut", "maintain", "healthy"];

/** GET /api/admin/nutrition — all nutrition plans with meals */
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const plans = await db.nutritionPlan.findMany({
      include: { meals: { orderBy: { day: "asc" } } },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(plans);
  } catch (error) {
    console.error("GET /api/admin/nutrition error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/** POST /api/admin/nutrition — create a nutrition plan */
export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const body = await request.json();
    const { name, goal, calories, protein, carbs, fats, description, notes, active } =
      body ?? {};

    if (!name?.trim()) {
      return Response.json({ error: "اسم الخطة مطلوب" }, { status: 400 });
    }

    if (!goal || !VALID_GOALS.includes(goal)) {
      return Response.json(
        { error: "الهدف مطلوب (تضخيم / تنشيف / وزن ثابت / صحة عامة)" },
        { status: 400 }
      );
    }

    if (calories === undefined || calories === null || Number(calories) <= 0) {
      return Response.json(
        { error: "عدد السعرات مطلوب ويجب أن يكون أكبر من صفر" },
        { status: 400 }
      );
    }

    const plan = await db.nutritionPlan.create({
      data: {
        name: name.trim(),
        goal,
        calories: Math.round(Number(calories)),
        protein: protein !== undefined && protein !== null && protein !== "" ? Math.round(Number(protein)) : null,
        carbs: carbs !== undefined && carbs !== null && carbs !== "" ? Math.round(Number(carbs)) : null,
        fats: fats !== undefined && fats !== null && fats !== "" ? Math.round(Number(fats)) : null,
        description: description?.trim() || null,
        notes: notes?.trim() || null,
        active: active ?? true,
      },
    });

    return Response.json(plan, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/nutrition error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
