import { getCurrentAdmin, unauthorizedResponse } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorizedResponse();
    return Response.json({ admin });
  } catch (error) {
    console.error("GET /api/admin/me error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
