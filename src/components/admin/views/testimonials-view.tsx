"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Loader2,
  MessageSquareQuote,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch, jsonDelete, jsonPost, jsonPut } from "@/components/admin/api";
import { IMAGE_OPTIONS } from "@/components/admin/image-options";
import { EmptyState, PageHeader } from "@/components/admin/shared";
import type { Testimonial } from "@/components/admin/types";

interface TestimonialFormState {
  name: string;
  role: string;
  content: string;
  rating: string;
  image: string;
  approved: boolean;
}

const EMPTY_FORM: TestimonialFormState = {
  name: "",
  role: "",
  content: "",
  rating: "5",
  image: "none",
  approved: true,
};

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`التقييم: ${rating} من 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function TestimonialsView() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<TestimonialFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadTestimonials() {
    try {
      const data = await apiFetch<Testimonial[]>("/api/admin/testimonials");
      setTestimonials(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر تحميل الآراء");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setForm({
      name: t.name,
      role: t.role,
      content: t.content,
      rating: String(t.rating),
      image: t.image ?? "none",
      approved: t.approved,
    });
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name.trim() || !form.role.trim() || !form.content.trim()) {
      toast.error("الاسم والصفة ونص الرأي مطلوبة");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      content: form.content.trim(),
      rating: Number(form.rating) || 5,
      image: form.image === "none" ? null : form.image,
      approved: form.approved,
    };

    try {
      if (editing) {
        await jsonPut(`/api/admin/testimonials/${editing.id}`, payload);
        toast.success("تم تحديث الرأي بنجاح");
      } else {
        await jsonPost("/api/admin/testimonials", payload);
        toast.success("تم إضافة الرأي بنجاح");
      }
      setFormOpen(false);
      await loadTestimonials();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر الحفظ");
    } finally {
      setSaving(false);
    }
  }

  async function toggleApproved(t: Testimonial) {
    try {
      await jsonPut(`/api/admin/testimonials/${t.id}`, { approved: !t.approved });
      setTestimonials((prev) =>
        prev.map((item) =>
          item.id === t.id ? { ...item, approved: !t.approved } : item
        )
      );
      toast.success(
        !t.approved ? "تم نشر الرأي في الموقع" : "تم إخفاء الرأي من الموقع"
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر التحديث");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await jsonDelete(`/api/admin/testimonials/${deleteTarget.id}`);
      toast.success("تم حذف الرأي بنجاح");
      setDeleteTarget(null);
      await loadTestimonials();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر الحذف");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={MessageSquareQuote}
        title="آراء العملاء"
        subtitle="إدارة شهادات العملاء ومراجعاتهم — الأراء المعتمدة تظهر في الموقع"
      >
        <Button onClick={openAdd} className="w-full md:w-auto">
          <Plus className="h-4 w-4" aria-hidden="true" />
          إضافة رأي
        </Button>
      </PageHeader>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <EmptyState
          icon={MessageSquareQuote}
          title="لا توجد آراء بعد"
          description="ابدأ بإضافة أول رأي"
        >
          <Button variant="outline" onClick={openAdd}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            إضافة رأي
          </Button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <Card key={t.id} className="p-0 flex flex-col">
              <CardContent className="p-5 flex-1 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {t.image ? (
                      <Image
                        src={t.image}
                        alt={t.name}
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-full object-cover border border-primary/30 shrink-0"
                      />
                    ) : (
                      <div
                        className="h-11 w-11 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold border border-primary/30 shrink-0"
                        aria-hidden="true"
                      >
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{t.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{t.role}</p>
                    </div>
                  </div>
                  <Stars rating={t.rating} />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {t.content}
                </p>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <Badge
                    variant="outline"
                    className={
                      t.approved
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : "bg-slate-500/15 text-slate-300 border-slate-500/30"
                    }
                  >
                    {t.approved ? "منشور في الموقع" : "مخفي"}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8"
                      onClick={() => toggleApproved(t)}
                      aria-label={
                        t.approved ? `إخفاء رأي ${t.name}` : `نشر رأي ${t.name}`
                      }
                    >
                      {t.approved ? "إخفاء" : "نشر"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-muted-foreground hover:text-primary"
                      onClick={() => openEdit(t)}
                      aria-label={`تعديل رأي ${t.name}`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteTarget(t)}
                      aria-label={`حذف رأي ${t.name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      حذف
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto custom-scrollbar sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل الرأي" : "إضافة رأي جديد"}</DialogTitle>
            <DialogDescription>الحقول المميزة بـ * مطلوبة</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testimonial-name">الاسم *</Label>
                <Input
                  id="testimonial-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="اسم العميل"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testimonial-role">الصفة *</Label>
                <Input
                  id="testimonial-role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="مثال: عضو من سنتين"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="testimonial-content">نص الرأي *</Label>
              <Textarea
                id="testimonial-content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="تجربة العميل مع النادي..."
                rows={4}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testimonial-rating">التقييم</Label>
                <Select
                  value={form.rating}
                  onValueChange={(v) => setForm({ ...form, rating: v })}
                >
                  <SelectTrigger id="testimonial-rating" className="w-full">
                    <SelectValue placeholder="اختر التقييم" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <SelectItem key={r} value={String(r)}>
                        {r} {r === 5 ? "نجوم — ممتاز" : r === 4 ? "نجوم — جيد جدًا" : r === 3 ? "نجوم — جيد" : r === 2 ? "نجوم — مقبول" : "نجمة — ضعيف"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="testimonial-image">صورة العميل (اختياري)</Label>
                <Select
                  value={form.image}
                  onValueChange={(v) => setForm({ ...form, image: v })}
                >
                  <SelectTrigger id="testimonial-image" className="w-full">
                    <SelectValue placeholder="اختر صورة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون صورة</SelectItem>
                    {IMAGE_OPTIONS.map((path) => (
                      <SelectItem key={path} value={path} dir="ltr">
                        {path}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label htmlFor="testimonial-approved" className="cursor-pointer">
                  نشر في الموقع
                </Label>
                <p className="text-xs text-muted-foreground">
                  الأراء غير المعتمدة لا تظهر للزوار
                </p>
              </div>
              <Switch
                id="testimonial-approved"
                checked={form.approved}
                onCheckedChange={(v) => setForm({ ...form, approved: v })}
                aria-label="اعتماد الرأي"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                disabled={saving}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {editing ? "حفظ التعديلات" : "إضافة الرأي"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف الرأي</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف رأي &quot;{deleteTarget?.name}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={deleting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              حذف نهائي
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
