"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { apiFetch, jsonDelete, jsonPost, jsonPut } from "@/components/admin/api";
import { EmptyState, Field, PageHeader } from "@/components/admin/shared";
import { GYM_DAYS, dayName, formatTime12, levelLabel } from "@/lib/gym";
import type { GymClass, ScheduleSlot, Trainer } from "@/components/admin/types";

/** Map JS getDay() (0=Sunday..6=Saturday) to gym week (0=السبت..6=الجمعة) */
function todayGymDay(): number {
  const js = new Date().getDay();
  return (js + 1) % 7;
}

interface SlotFormState {
  day: number;
  time: string;
  gymClassId: string;
  trainerId: string;
  active: boolean;
}

const EMPTY_FORM: SlotFormState = {
  day: 0,
  time: "18:00",
  gymClassId: "",
  trainerId: "none",
  active: true,
};

const LEVEL_BADGE_CLASS: Record<string, string> = {
  beginner: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  advanced: "bg-red-500/15 text-red-400 border-red-500/30",
  all: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
};

export default function ScheduleView() {
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ScheduleSlot | null>(null);
  const [form, setForm] = useState<SlotFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ScheduleSlot | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedDay(todayGymDay());
  }, []);

  async function loadSlots() {
    try {
      const data = await apiFetch<ScheduleSlot[]>("/api/admin/schedule");
      setSlots(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر تحميل الجدول");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSlots();
    apiFetch<GymClass[]>("/api/admin/classes")
      .then(setClasses)
      .catch(() => {});
    apiFetch<Trainer[]>("/api/admin/trainers")
      .then(setTrainers)
      .catch(() => {});
  }, []);

  const daySlots = useMemo(() => {
    return slots
      .filter((s) => s.day === selectedDay)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [slots, selectedDay]);

  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, day: selectedDay });
    setFormOpen(true);
  }

  function openEdit(slot: ScheduleSlot) {
    setEditing(slot);
    setForm({
      day: slot.day,
      time: slot.time,
      gymClassId: slot.gymClassId,
      trainerId: slot.trainerId ?? "none",
      active: slot.active,
    });
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.gymClassId) {
      toast.error("اختر الكلاس أولًا");
      return;
    }
    if (!form.time) {
      toast.error("حدد وقت الموعد");
      return;
    }

    setSaving(true);
    const payload = {
      day: form.day,
      time: form.time,
      gymClassId: form.gymClassId,
      trainerId: form.trainerId === "none" ? null : form.trainerId,
      active: form.active,
    };

    try {
      if (editing) {
        await jsonPut(`/api/admin/schedule/${editing.id}`, payload);
        toast.success("تم تحديث الموعد بنجاح");
      } else {
        await jsonPost("/api/admin/schedule", payload);
        toast.success("تم إضافة الموعد بنجاح");
      }
      setFormOpen(false);
      setSelectedDay(form.day);
      await loadSlots();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر الحفظ");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(slot: ScheduleSlot) {
    setTogglingId(slot.id);
    try {
      await jsonPut(`/api/admin/schedule/${slot.id}`, { active: !slot.active });
      toast.success(
        slot.active ? "تم إخفاء الموعد من الجدول" : "تم تفعيل الموعد"
      );
      await loadSlots();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر التغيير");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await jsonDelete(`/api/admin/schedule/${deleteTarget.id}`);
      toast.success("تم حذف الموعد بنجاح");
      setDeleteTarget(null);
      await loadSlots();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر الحذف");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CalendarDays}
        title="الجدول الأسبوعي"
        subtitle="تنظيم مواعيد الكلاسات على مدار الأسبوع — من السبت إلى الجمعة"
      >
        <Button onClick={openAdd} className="w-full md:w-auto">
          <Plus className="h-4 w-4" aria-hidden="true" />
          إضافة موعد
        </Button>
      </PageHeader>

      {/* Day tabs */}
      <div
        role="tablist"
        aria-label="أيام الأسبوع"
        className="flex gap-2 overflow-x-auto custom-scrollbar pb-1"
      >
        {GYM_DAYS.map((d) => {
          const active = selectedDay === d.index;
          const count = slots.filter((s) => s.day === d.index).length;
          return (
            <button
              key={d.index}
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedDay(d.index)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground"
              }`}
            >
              {d.name}
              <span
                className={`mr-2 text-xs tabular-nums rounded-full px-1.5 py-0.5 ${
                  active ? "bg-background/20" : "bg-muted"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Slots of selected day */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : daySlots.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="لا توجد مواعيد في هذا اليوم"
          description="أضف أول موعد لجدول هذا اليوم"
        >
          <Button variant="outline" onClick={openAdd}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            إضافة موعد
          </Button>
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {daySlots.map((slot) => {
            return (
              <Card
                key={slot.id}
                className={`p-0 transition-opacity ${
                  slot.active ? "" : "opacity-60"
                }`}
              >
                <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                  {/* Time */}
                  <div className="flex items-center gap-2 md:w-44 shrink-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 border border-cyan-400/25 text-cyan-400">
                      <Clock className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p
                        dir="ltr"
                        className="text-lg font-bold tabular-nums leading-tight text-right"
                      >
                        {formatTime12(slot.time)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {dayName(slot.day)}
                      </p>
                    </div>
                  </div>

                  {/* Class info */}
                  <div className="flex-1 min-w-0 md:border-r md:border-border md:pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">{slot.gymClass.name}</h3>
                      <Badge
                        variant="outline"
                        className={LEVEL_BADGE_CLASS[slot.gymClass.level] ?? ""}
                      >
                        {levelLabel(slot.gymClass.level)}
                      </Badge>
                      {!slot.active && (
                        <Badge
                          variant="outline"
                          className="bg-slate-500/15 text-slate-300 border-slate-500/30"
                        >
                          مخفي
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <User className="h-3.5 w-3.5" aria-hidden="true" />
                        {slot.trainer?.name ?? "بدون مدرب"}
                      </span>
                      <span>{slot.gymClass.duration} دقائق</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5">
                      {togglingId === slot.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
                      ) : slot.active ? (
                        <Eye className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      )}
                      <Switch
                        checked={slot.active}
                        onCheckedChange={() => handleToggleActive(slot)}
                        disabled={togglingId === slot.id}
                        aria-label={slot.active ? "إخفاء الموعد" : "تفعيل الموعد"}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9"
                      onClick={() => openEdit(slot)}
                      aria-label={`تعديل موعد ${slot.gymClass.name}`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 text-destructive hover:text-destructive border-destructive/40 hover:bg-destructive/10"
                      onClick={() => setDeleteTarget(slot)}
                      aria-label={`حذف موعد ${slot.gymClass.name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto custom-scrollbar sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل الموعد" : "إضافة موعد جديد"}</DialogTitle>
            <DialogDescription>الحقول المميزة بـ * مطلوبة</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="اليوم" required htmlFor="slot-day">
                <Select
                  value={String(form.day)}
                  onValueChange={(v) => setForm({ ...form, day: Number(v) })}
                >
                  <SelectTrigger id="slot-day" className="w-full">
                    <SelectValue placeholder="اختر اليوم" />
                  </SelectTrigger>
                  <SelectContent>
                    {GYM_DAYS.map((d) => (
                      <SelectItem key={d.index} value={String(d.index)}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="الوقت" required htmlFor="slot-time">
                <Input
                  id="slot-time"
                  type="time"
                  dir="ltr"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  required
                />
              </Field>
            </div>
            <Field label="الكلاس" required htmlFor="slot-class">
              <Select
                value={form.gymClassId}
                onValueChange={(v) => setForm({ ...form, gymClassId: v })}
              >
                <SelectTrigger id="slot-class" className="w-full">
                  <SelectValue placeholder="اختر الكلاس" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} — {levelLabel(c.level)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="المدرب" htmlFor="slot-trainer">
              <Select
                value={form.trainerId}
                onValueChange={(v) => setForm({ ...form, trainerId: v })}
              >
                <SelectTrigger id="slot-trainer" className="w-full">
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
            </Field>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="text-sm">نشط ويظهر في الجدول</span>
              <Switch
                checked={form.active}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
                aria-label="تفعيل الموعد"
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
                {editing ? "حفظ التعديلات" : "إضافة الموعد"}
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
            <AlertDialogTitle>تأكيد حذف الموعد</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف موعد &quot;{deleteTarget?.gymClass.name}&quot; يوم{" "}
              {deleteTarget ? dayName(deleteTarget.day) : ""} على الساعة{" "}
              {deleteTarget ? formatTime12(deleteTarget.time) : ""}؟ لا يمكن التراجع عن هذا الإجراء.
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
