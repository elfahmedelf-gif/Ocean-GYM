import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, content } = body ?? {};

    if (!name?.trim() || !email?.trim() || !content?.trim()) {
      return Response.json(
        { error: "الاسم والبريد الإلكتروني والرسالة مطلوبة" },
        { status: 400 }
      );
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return Response.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 });
    }

    const message = await db.message.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        subject: subject?.trim() || null,
        content: content.trim(),
      },
    });

    return Response.json({ ok: true, id: message.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return Response.json({ error: "حدث خطأ أثناء إرسال الرسالة" }, { status: 500 });
  }
}
