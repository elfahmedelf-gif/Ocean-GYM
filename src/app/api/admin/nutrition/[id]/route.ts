import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

const VALID_GOALS = ["bulk", "cut", "maintain", "healthy"];

/** PUT /api/admin/nutrition/[id] — update a nutrition plan */
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
    const { name, goal, calories, protein, carbs, fats, description, notes, active } =
      body ?? {};

    const data: Record<string, unknown> = {};

    if (name !== undefined) {
      if (!name?.trim()) {
        return Response.json({ error: "اسم الخطة مطلوب" }, { status: 400 });
      }
      data.name = name.trim();
    }

    if (goal !== undefined) {
      if (!VALID_GOALS.includes(goal)) {
        return Response.json({ error: "الهدف غير صحيح" }, { status: 400 });
      }
      data.goal = goal;
    }

    if (calories !== undefined) {
      if (Number(calories) <= 0) {
        return Response.json(
          { error: "عدد السعرات يجب أن يكون أكبر من صفر" },
          { status: 400 }
        );
      }
      data.calories = Math.round(Number(calories));
    }

    if (protein !== undefined)
      data.protein = protein !== null && protein !== "" ? Math.round(Number(protein)) : null;
    if (carbs !== undefined)
      data.carbs = carbs !== null && carbs !== "" ? Math.round(Number(carbs)) : null;
    if (fats !== undefined)
      data.fats = fats !== null && fats !== "" ? Math.round(Number(fats)) : null;
    if (description !== undefined) data.description = description?.trim() || null;
    if (notes !== undefined) data.notes = notes?.trim() || null;
    if (active !== undefined) data.active = Boolean(active);

    const plan = await db.nutritionPlan.update({
      where: { id },
      data,
      include: { meals: { orderBy: { day: "asc" } } },
    });

    return Response.json(plan);
  } catch (error) {
    console.error("PUT /api/admin/nutrition/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

/** DELETE /api/admin/nutrition/[id] — blocked when members are assigned */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await params;
    const existing = await db.nutritionPlan.findUnique({
      where: { id },
      include: { _count: { select: { members: true } } },
    });
    if (!existing) {
      return Response.json({ error: "الخطة غير موجودة" }, { status: 404 });
    }

    if (existing._count.members > 0) {
      return Response.json(
        { error: "لا يمكن حذف الخطة — يوجد أعضاء مشتركين فيها" },
        { status: 400 }
      );
    }

    await db.nutritionPlan.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/nutrition/[id] error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
