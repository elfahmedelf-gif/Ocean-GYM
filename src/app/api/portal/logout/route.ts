import { destroyPortalSession } from "@/lib/portal-auth";

export async function POST() {
  try {
    await destroyPortalSession();
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[POST /api/portal/logout]", error);
    return Response.json(
      { error: "حدث خطأ في الخادم — حاول مرة أخرى" },
      { status: 500 }
    );
  }
}
