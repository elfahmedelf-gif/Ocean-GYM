import { db } from "@/lib/db";
import { createSessionForAdmin, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body ?? {};

    if (!username?.trim() || !password) {
      return Response.json(
        { error: "اسم المستخدم وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    const admin = await db.admin.findUnique({
      where: { username: username.trim() },
    });

    if (!admin || !verifyPassword(password, admin.password)) {
      return Response.json(
        { error: "اسم المستخدم أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    await createSessionForAdmin(admin.id);

    return Response.json({
      ok: true,
      admin: { id: admin.id, username: admin.username, name: admin.name },
    });
  } catch (error) {
    console.error("POST /api/admin/login error:", error);
    return Response.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
