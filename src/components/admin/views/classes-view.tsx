"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Clock,
  Dumbbell,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Users2,
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
import { CLASS_IMAGE_OPTIONS, imageOptionLabel } from "@/components/admin/image-options";
import { DANGER_BUTTON_CLASS, EmptyState, PageHeader } from "@/components/admin/shared";
import ConfirmDialog from "@/components/admin/confirm-dialog";
import { CLASS_LEVELS, levelLabel } from "@/lib/gym";
import type { ClassLevel, GymClass, Trainer } from "@/components/admin/types";

const LEVEL_BADGE_CLASS: Record<ClassLevel, string> = {
  beginner: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  advanced: "bg-red-500/15 text-red-400 border-red-500/30",
  all: "bg-primary/15 text-primary border-primary/30",
};

const ALL_LEVELS: ClassLevel[] = CLASS_LEVELS.map((l) => l.value);

interface ClassFormState {
  name: string;
  description: string;
  trainerId: string;
  schedule: string;
  duration: string;
  capacity: string;
  level: ClassLevel;
  image: string;
  active: boolean;
}

const EMPTY_FORM: ClassFormState = {
  name: "",
  description: "",
  trainerId: "none",
  schedule: "",
  duration: "60",
  capacity: "20",
  level: "all",
  image: "none",
  active: true,
};

export default function ClassesView() {
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<GymClass | null>(null);
  const [form, setForm] = useState<ClassFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<GymClass | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadClasses() {
    try {
      const data = await apiFetch<GymClass[]>("/api/admin/classes");
      setClasses(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر تحميل الكلاسات");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClasses();
    apiFetch<Trainer[]>("/api/admin/trainers")
      .then(setTrainers)
      .catch(() => {});
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(c: GymClass) {
    setEditing(c);
    setForm({
      name: c.name,
      description: c.description,
      trainerId: c.trainerId ?? "none",
      schedule: c.schedule,
      duration: String(c.duration),
      capacity: String(c.capacity),
      level: c.level,
      image: c.image ?? "none",
      active: c.active,
    });
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name.trim() || !form.description.trim() || !form.schedule.trim()) {
      toast.error("اسم الكلاس والوصف ومواعيده مطلوبة");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      trainerId: form.trainerId === "none" ? null : form.trainerId,
      schedule: form.schedule.trim(),
      duration: Number(form.duration) || 60,
      capacity: Number(form.capacity) || 20,
      level: form.level,
      image: form.image === "none" ? null : form.image,
      active: form.active,
    };

    try {
      if (editing) {
        await jsonPut(`/api/admin/classes/${editing.id}`, payload);
        toast.success("تم تحديث الكلاس بنجاح");
      } else {
        await jsonPost("/api/admin/classes", payload);
        toast.success("تم إضافة الكلاس بنجاح");
      }
      setFormOpen(false);
      await loadClasses();
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
      await jsonDelete(`/api/admin/classes/${deleteTarget.id}`);
      toast.success("تم حذف الكلاس بنجاح");
      setDeleteTarget(null);
      await loadClasses();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر الحذف");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Dumbbell}
        title="إدارة الكلاسات"
        subtitle="إضافة وتعديل الكلاسات الجماعية ومواعيدها ومستوياتها"
      >
        <Button onClick={openAdd} className="w-full md:w-auto">
          <Plus className="h-4 w-4" aria-hidden="true" />
          إضافة كلاس
        </Button>
      </PageHeader>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : classes.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title="لا توجد كلاسات بعد"
          description="ابدأ بإضافة أول كلاس"
        >
          <Button variant="outline" onClick={openAdd}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            إضافة كلاس
          </Button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {classes.map((c) => (
            <Card key={c.id} className="overflow-hidden p-0 flex flex-col">
              <div className="relative h-36 w-full bg-muted">
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Dumbbell className="h-10 w-10 text-muted-foreground/40" aria-hidden="true" />
                  </div>
                )}
                <div className="absolute top-2 start-2 flex gap-2">
                  <Badge
                    variant="outline"
                    className={LEVEL_BADGE_CLASS[c.level] ?? "bg-background/80"}
                  >
                    {levelLabel(c.level)}
                  </Badge>
                  {!c.active && (
                    <Badge variant="outline" className="bg-slate-900/80 text-slate-300 border-slate-500/40">
                      غير مفعّل
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4 flex-1 flex flex-col gap-3">
                <div>
                  <h3 className="font-bold text-base">{c.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    المدرب: {c.trainer?.name ?? "غير محدد"}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                  {c.description}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {c.duration} دقيقة
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users2 className="h-3.5 w-3.5" aria-hidden="true" />
                    سعة {c.capacity}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{c.schedule}</p>
                <div className="flex gap-1.5 border-t border-border pt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-9"
                    onClick={() => openEdit(c)}
                    aria-label={`تعديل ${c.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`flex-1 h-9 ${DANGER_BUTTON_CLASS}`}
                    onClick={() => setDeleteTarget(c)}
                    aria-label={`حذف ${c.name}`}
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
            <DialogTitle>{editing ? "تعديل الكلاس" : "إضافة كلاس جديد"}</DialogTitle>
            <DialogDescription>الحقول المميزة بـ * مطلوبة</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="class-name">اسم الكلاس *</Label>
              <Input
                id="class-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثال: بوكسينج"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-desc">الوصف *</Label>
              <Textarea
                id="class-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="وصف مختصر للكلاس..."
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-trainer">المدرب</Label>
              <Select
                value={form.trainerId}
                onValueChange={(v) => setForm({ ...form, trainerId: v })}
              >
                <SelectTrigger id="class-trainer" className="w-full">
                  <SelectValue placeholder="اختر المدرب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون مدرب</SelectItem>
                  {trainers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-schedule">المواعيد *</Label>
              <Input
                id="class-schedule"
                value={form.schedule}
                onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                placeholder="مثال: السبت — الإثنين — الأربعاء | 8:00 مساءً"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class-duration">المدة (دقيقة)</Label>
                <Input
                  id="class-duration"
                  type="number"
                  min="10"
                  max="300"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class-capacity">السعة</Label>
                <Input
                  id="class-capacity"
                  type="number"
                  min="1"
                  max="200"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class-level">المستوى</Label>
                <Select
                  value={form.level}
                  onValueChange={(v) => setForm({ ...form, level: v as ClassLevel })}
                >
                  <SelectTrigger id="class-level" className="w-full">
                    <SelectValue placeholder="اختر المستوى" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_LEVELS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {levelLabel(l)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-image">صورة الكلاس</Label>
              <Select
                value={form.image}
                onValueChange={(v) => setForm({ ...form, image: v })}
              >
                <SelectTrigger id="class-image" className="w-full">
                  <SelectValue placeholder="اختر صورة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون صورة</SelectItem>
                  {CLASS_IMAGE_OPTIONS.map((path) => (
                    <SelectItem key={path} value={path}>
                      {imageOptionLabel(path)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.image !== "none" && (
                <div className="mt-2 relative h-24 w-full rounded-lg overflow-hidden border border-border">
                  <Image
                    src={form.image}
                    alt="معاينة الصورة"
                    fill
                    sizes="500px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label htmlFor="class-active" className="cursor-pointer">
                مفعّل ويظهر في الموقع
              </Label>
              <Switch
                id="class-active"
                checked={form.active}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
                aria-label="تفعيل الكلاس"
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
                {editing ? "حفظ التعديلات" : "إضافة الكلاس"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="تأكيد حذف الكلاس"
        description={`هل أنت متأكد من حذف الكلاس "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        busy={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
