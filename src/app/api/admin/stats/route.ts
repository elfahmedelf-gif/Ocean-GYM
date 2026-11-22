import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const [
      totalMembers,
      activeMembers,
      pendingMembers,
      expiredMembers,
      unreadMessages,
      totalTrainers,
      totalClasses,
      totalSlots,
      nutritionPlans,
      activeMembersWithPlan,
    ] = await Promise.all([
      db.member.count(),
      db.member.count({ where: { status: "active" } }),
      db.member.count({ where: { status: "pending" } }),
      db.member.count({ where: { status: "expired" } }),
      db.message.count({ where: { read: false } }),
      db.trainer.count(),
      db.gymClass.count(),
      db.scheduleSlot.count({ where: { active: true } }),
      db.nutritionPlan.count(),
      db.member.findMany({
        where: { status: "active", planId: { not: null } },
        select: { plan: { select: { name: true, price: true } } },
      }),
    ]);

    const monthlyRevenue = activeMembersWithPlan.reduce(
      (sum, m) => sum + (m.plan?.price ?? 0),
      0
    );

    // Distribution of active members across plan names
    const counts = new Map<string, number>();
    for (const m of activeMembersWithPlan) {
      const name = m.plan?.name ?? "بدون باقة";
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    const planDistribution = Array.from(counts.entries()).map(
      ([name, count]) => ({ name, count })
    );

    const [recentMembers, recentMessagesRaw] = await Promise.all([
      db.member.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          status: true,
          createdAt: true,
          plan: { select: { name: true } },
        },
      }),
      db.message.findMany({
        orderBy: [{ read: "asc" }, { createdAt: "desc" }],
        take: 5,
        select: { id: true, name: true, subject: true, read: true, createdAt: true },
      }),
    ]);

    return Response.json({
      totalMembers,
      activeMembers,
      pendingMembers,
      expiredMembers,
      unreadMessages,
      totalTrainers,
      totalClasses,
      totalSlots,
      nutritionPlans,
      monthlyRevenue,
      planDistribution,
      recentMembers,
      recentMessages: recentMessagesRaw,
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
