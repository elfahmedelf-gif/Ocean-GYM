import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

const VALID_GOALS = ["bulk", "cut", "maintain", "healthy"];
const VALID_MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];
const MAX_MEALS = 200;

/** PUT /api/admin/nutrition/[id]/meals — bulk replace all meals of a plan */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const existing = await db.nutritionPlan.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "الخطة غير موجودة" }, { status: 404 });
    }

    const body = await request.json();
    const { meals } = body ?? {};

    if (!Array.isArray(meals)) {
      return Response.json(
        { error: "قائمة الوجبات مطلوبة ويجب أن تكون مصفوفة" },
        { status: 400 }
      );
    }

    if (meals.length > MAX_MEALS) {
      return Response.json(
        { error: `الحد الأقصى لعدد الوجبات هو ${MAX_MEALS} وجبة` },
        { status: 400 }
      );
    }

    for (let i = 0; i < meals.length; i++) {
      const m = meals[i] ?? {};
      if (!Number.isInteger(m.day) || m.day < 0 || m.day > 6) {
        return Response.json(
          { error: `الوجبة رقم ${i + 1}: اليوم يجب أن يكون بين 0 (السبت) و 6 (الجمعة)` },
          { status: 400 }
        );
      }
      if (!m.mealType || !VALID_MEAL_TYPES.includes(m.mealType)) {
        return Response.json(
          { error: `الوجبة رقم ${i + 1}: نوع الوجبة غير صحيح` },
          { status: 400 }
        );
      }
      if (!m.content?.trim()) {
        return Response.json(
          { error: `الوجبة رقم ${i + 1}: محتوى الوجبة مطلوب` },
          { status: 400 }
        );
      }
    }

    await db.$transaction(async (tx) => {
      await tx.nutritionMeal.deleteMany({ where: { planId: id } });
      if (meals.length > 0) {
        await tx.nutritionMeal.createMany({
          data: meals.map((m) => ({
            planId: id,
            day: m.day,
            mealType: m.mealType,
            content: m.content.trim(),
            calories:
              m.calories !== undefined && m.calories !== null && m.calories !== ""
                ? Math.round(Number(m.calories))
                : null,
          })),
        });
      }
    });

    const mealsSaved = await db.nutritionMeal.findMany({
      where: { planId: id },
      orderBy: [{ day: "asc" }, { createdAt: "asc" }],
    });

    return Response.json({ ok: true, meals: mealsSaved });
  } catch (error) {
    console.error("PUT /api/admin/nutrition/[id]/meals error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
