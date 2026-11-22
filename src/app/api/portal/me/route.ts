import { db } from "@/lib/db";
import {
  getCurrentPortalMember,
  portalUnauthorizedResponse,
} from "@/lib/portal-auth";

export async function GET() {
  try {
    const session = await getCurrentPortalMember();
    if (!session) return portalUnauthorizedResponse();

    const member = await db.member.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        startDate: true,
        endDate: true,
        notes: true,
        plan: {
          select: { id: true, name: true, price: true, duration: true },
        },
        nutritionPlan: {
          select: {
            id: true,
            name: true,
            goal: true,
            calories: true,
            protein: true,
            carbs: true,
            fats: true,
            description: true,
            notes: true,
            meals: {
              orderBy: [{ day: "asc" }, { mealType: "asc" }],
              select: {
                id: true,
                day: true,
                mealType: true,
                content: true,
                calories: true,
              },
            },
          },
        },
        progressLogs: {
          orderBy: { date: "desc" },
          select: {
            id: true,
            date: true,
            weight: true,
            fatPercent: true,
            muscleMass: true,
            waist: true,
            chest: true,
            arm: true,
            notes: true,
          },
        },
      },
    });

    if (!member) return portalUnauthorizedResponse();

    return Response.json({ member });
  } catch (error) {
    console.error("[GET /api/portal/me]", error);
    return Response.json(
      { error: "حدث خطأ في الخادم — حاول مرة أخرى" },
      { status: 500 }
    );
  }
}
