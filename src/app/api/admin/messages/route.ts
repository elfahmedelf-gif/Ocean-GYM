import { db } from "@/lib/db";
import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

/** GET /api/admin/messages — list messages (newest first, unread first) */
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();

    const messages = await db.message.findMany({
      orderBy: [{ read: "asc" }, { createdAt: "desc" }],
    });
    return Response.json(messages);
  } catch (error) {
    console.error("GET /api/admin/messages error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
