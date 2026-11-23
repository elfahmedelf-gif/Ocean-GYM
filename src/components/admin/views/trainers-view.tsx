"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Instagram,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  UserCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { TRAINER_IMAGE_OPTIONS, imageOptionLabel } from "@/components/admin/image-options";
import { DANGER_BUTTON_CLASS, EmptyState, PageHeader } from "@/components/admin/shared";
import ConfirmDialog from "@/components/admin/confirm-dialog";
import type { Trainer } from "@/components/admin/types";

interface TrainerFormState {
  name: string;
  role: string;
  bio: string;
  image: string;
  specialty: string;
  instagram: string;
  order: string;
  active: boolean;
}

const EMPTY_FORM: TrainerFormState = {
  name: "",
  role: "",
  bio: "",
  image: "none",
  specialty: "",
  instagram: "",
  order: "0",
  active: true,
};

export default function TrainersView() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Trainer | null>(null);
  const [form, setForm] = useState<TrainerFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Trainer | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadTrainers() {
    try {
      const data = await apiFetch<Trainer[]>("/api/admin/trainers");
      setTrainers(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر تحميل المدربين");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrainers();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(t: Trainer) {
    setEditing(t);
    setForm({
      name: t.name,
      role: t.role,
      bio: t.bio ?? "",
      image: t.image ?? "none",
      specialty: t.specialty ?? "",
      instagram: t.instagram ?? "",
      order: String(t.order),
      active: t.active,
    });
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name.trim() || !form.role.trim()) {
      toast.error("اسم المدرب والتخصص مطلوبان");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      bio: form.bio.trim() || null,
      image: form.image === "none" ? null : form.image,
      specialty: form.specialty.trim() || null,
      instagram: form.instagram.trim() || null,
      order: Number(form.order) || 0,
      active: form.active,
    };

    try {
      if (editing) {
        await jsonPut(`/api/admin/trainers/${editing.id}`, payload);
        toast.success("تم تحديث بيانات المدرب بنجاح");
      } else {
        await jsonPost("/api/admin/trainers", payload);
        toast.success("تم إضافة المدرب بنجاح");
      }
      setFormOpen(false);
      await loadTrainers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر الحفظ");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await jsonDelete(`/api/admin/trainers/${deleteTarget.id}`);
      toast.success("تم حذف المدرب بنجاح");
      setDeleteTarget(null);
      await loadTrainers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر الحذف");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={UserCheck}
        title="إدارة المدربين"
        subtitle="فريق التدريب المعتمد — إضافة وتعديل بيانات المدربين"
      >
        <Button onClick={openAdd} className="w-full md:w-auto">
          <Plus className="h-4 w-4" aria-hidden="true" />
          إضافة مدرب
        </Button>
      </PageHeader>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      ) : trainers.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="لا يوجد مدربون بعد"
          description="ابدأ بإضافة أول مدرب"
        >
          <Button variant="outline" onClick={openAdd}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            إضافة مدرب
          </Button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {trainers.map((t) => (
            <Card key={t.id} className="overflow-hidden p-0 flex flex-col">
              <div className="relative h-44 w-full bg-muted">
                {t.image ? (
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <UserCheck className="h-10 w-10 text-muted-foreground/40" aria-hidden="true" />
                  </div>
                )}
                {!t.active && (
                  <Badge
                    variant="outline"
                    className="absolute top-2 start-2 bg-slate-900/80 text-slate-300 border-slate-500/40"
                  >
                    غير مفعّل
                  </Badge>
                )}
              </div>
              <CardContent className="p-4 flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base">{t.name}</h3>
                    <p className="text-xs text-primary mt-0.5">{t.role}</p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted rounded-md px-2 py-1 whitespace-nowrap">
                    ترتيب: {t.order}
                  </span>
                </div>
                {t.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{t.bio}</p>
                )}
                {t.specialty && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">التخصص: </span>
                    {t.specialty}
                  </p>
                )}
                {t.instagram && (
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1" dir="ltr">
                    <Instagram className="h-3.5 w-3.5" aria-hidden="true" />
                    {t.instagram}
                  </p>
                )}
                <div className="flex gap-1.5 border-t border-border pt-3 mt-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-9"
                    onClick={() => openEdit(t)}
                    aria-label={`تعديل ${t.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`flex-1 h-9 ${DANGER_BUTTON_CLASS}`}
                    onClick={() => setDeleteTarget(t)}
                    aria-label={`حذف ${t.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    حذف
                  </Button>
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
            <DialogTitle>{editing ? "تعديل بيانات المدرب" : "إضافة مدرب جديد"}</DialogTitle>
            <DialogDescription>الحقول المميزة بـ * مطلوبة</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trainer-name">اسم المدرب *</Label>
                <Input
                  id="trainer-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="مثال: كريم الشناوي"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trainer-role">التخصص (الوظيفة) *</Label>
                <Input
                  id="trainer-role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="مثال: مدرب كمال أجسام"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainer-bio">نبذة تعريفية</Label>
              <Textarea
                id="trainer-bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="خبرات وشهادات المدرب..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainer-image">صورة المدرب</Label>
              <Select
                value={form.image}
                onValueChange={(v) => setForm({ ...form, image: v })}
              >
                <SelectTrigger id="trainer-image" className="w-full">
                  <SelectValue placeholder="اختر صورة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون صورة</SelectItem>
                  {TRAINER_IMAGE_OPTIONS.map((path) => (
                    <SelectItem key={path} value={path}>
                      {imageOptionLabel(path)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.image !== "none" && (
                <div className="mt-2 relative h-24 w-24 rounded-lg overflow-hidden border border-border">
                  <Image
                    src={form.image}
                    alt="معاينة الصورة"
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trainer-specialty">مجالات التخصص</Label>
                <Input
                  id="trainer-specialty"
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  placeholder="مثال: بوكسينج — لياقة قتالية"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trainer-instagram">حساب انستجرام</Label>
                <Input
                  id="trainer-instagram"
                  dir="ltr"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  placeholder="username"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainer-order">ترتيب الظهور</Label>
              <Input
                id="trainer-order"
                type="number"
                min="0"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label htmlFor="trainer-active" className="cursor-pointer">
                مفعّل ويظهر في الموقع
              </Label>
              <Switch
                id="trainer-active"
                checked={form.active}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
                aria-label="تفعيل المدرب"
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
                {editing ? "حفظ التعديلات" : "إضافة المدرب"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="تأكيد حذف المدرب"
        description={`هل أنت متأكد من حذف المدرب "${deleteTarget?.name}"؟ الكلاسات المرتبطة به ستفقد المدرب. لا يمكن التراجع عن هذا الإجراء.`}
        busy={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
