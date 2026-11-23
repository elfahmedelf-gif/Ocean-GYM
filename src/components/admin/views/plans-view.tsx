"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CreditCard,
  Crown,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch, jsonDelete, jsonPost, jsonPut } from "@/components/admin/api";
import { durationLabel } from "@/lib/gym";
import { EmptyState, PageHeader } from "@/components/admin/shared";
import ConfirmDialog from "@/components/admin/confirm-dialog";
import type { Plan } from "@/components/admin/types";

interface PlanFormState {
  name: string;
  price: string;
  duration: string;
  popular: boolean;
  active: boolean;
  features: string;
}

const EMPTY_FORM: PlanFormState = {
  name: "",
  price: "",
  duration: "1",
  popular: false,
  active: true,
  features: "",
};

export default function PlansView() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState<PlanFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Plan | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadPlans() {
    try {
      const data = await apiFetch<Plan[]>("/api/admin/plans");
      setPlans(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر تحميل الباقات");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlans();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(p: Plan) {
    setEditing(p);
    setForm({
      name: p.name,
      price: String(p.price),
      duration: String(p.duration),
      popular: p.popular,
      active: p.active,
      features: p.features,
    });
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name.trim() || form.price === "") {
      toast.error("اسم الباقة والسعر مطلوبان");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      price: Number(form.price) || 0,
      duration: Number(form.duration) || 1,
      popular: form.popular,
      active: form.active,
      features: form.features,
    };

    try {
      if (editing) {
        await jsonPut(`/api/admin/plans/${editing.id}`, payload);
        toast.success("تم تحديث الباقة بنجاح");
      } else {
        await jsonPost("/api/admin/plans", payload);
        toast.success("تم إضافة الباقة بنجاح");
      }
      setFormOpen(false);
      await loadPlans();
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
      await jsonDelete(`/api/admin/plans/${deleteTarget.id}`);
      toast.success("تم حذف الباقة بنجاح");
      setDeleteTarget(null);
      await loadPlans();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر الحذف");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CreditCard}
        title="إدارة الباقات"
        subtitle="باقات الاشتراك وأسعارها ومزاياها"
      >
        <Button onClick={openAdd} className="w-full md:w-auto">
          <Plus className="h-4 w-4" aria-hidden="true" />
          إضافة باقة
        </Button>
      </PageHeader>

      <div className="rounded-xl border bg-card overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="لا توجد باقات بعد"
            description="ابدأ بإضافة أول باقة"
            className="border-0"
          >
            <Button variant="outline" onClick={openAdd}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              إضافة باقة
            </Button>
          </EmptyState>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الباقة</TableHead>
                  <TableHead>السعر</TableHead>
                  <TableHead>المدة</TableHead>
                  <TableHead>المزايا</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-end">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{p.name}</span>
                        {p.popular && (
                          <Badge className="bg-primary/15 text-primary border border-primary/30">
                            <Crown className="h-3 w-3 me-1" aria-hidden="true" />
                            الأكثر شيوعًا
                          </Badge>
                        )}
                        {!p.active && (
                          <Badge
                            variant="outline"
                            className="bg-slate-500/15 text-slate-300 border-slate-500/30"
                          >
                            غير مفعّلة
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="tabular-nums font-semibold text-primary whitespace-nowrap">
                      {p.price.toLocaleString("ar-EG")} ج.م
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {durationLabel(p.duration)}
                    </TableCell>
                    <TableCell className="max-w-64">
                      <p className="text-xs text-muted-foreground line-clamp-2 whitespace-pre-line">
                        {p.features || "—"}
                      </p>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {p._count?.members ?? 0} مشترك
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-start md:justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-9 text-muted-foreground hover:text-primary"
                          onClick={() => openEdit(p)}
                          aria-label={`تعديل ${p.name}`}
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                          تعديل
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-9 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteTarget(p)}
                          aria-label={`حذف ${p.name}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          حذف
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Add/Edit dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto custom-scrollbar sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل الباقة" : "إضافة باقة جديدة"}</DialogTitle>
            <DialogDescription>الحقول المميزة بـ * مطلوبة</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2 sm:col-span-3">
                <Label htmlFor="plan-name">اسم الباقة *</Label>
                <Input
                  id="plan-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="مثال: الباقة الشهرية"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-price">السعر (ج.م) *</Label>
                <Input
                  id="plan-price"
                  type="number"
                  min="0"
                  step="1"
                  dir="ltr"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="600"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-duration">المدة (شهور)</Label>
                <Input
                  id="plan-duration"
                  type="number"
                  min="1"
                  max="36"
                  dir="ltr"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-features">المزايا</Label>
              <Textarea
                id="plan-features"
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                placeholder={"كل ميزة في سطر منفصل\nمثال:\nدخول كامل للجيم\nتقييم لياقة شهري"}
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                كل ميزة في سطر منفصل
              </p>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label htmlFor="plan-popular" className="cursor-pointer">
                  الباقة الأكثر شيوعًا
                </Label>
                <p className="text-xs text-muted-foreground">
                  تظهر بعلامة مميزة في صفحة الباقات
                </p>
              </div>
              <Switch
                id="plan-popular"
                checked={form.popular}
                onCheckedChange={(v) => setForm({ ...form, popular: v })}
                aria-label="الباقة الأكثر شيوعًا"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label htmlFor="plan-active" className="cursor-pointer">
                مفعّلة وتظهر في الموقع
              </Label>
              <Switch
                id="plan-active"
                checked={form.active}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
                aria-label="تفعيل الباقة"
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
                {editing ? "حفظ التعديلات" : "إضافة الباقة"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="تأكيد حذف الباقة"
        description={`هل أنت متأكد من حذف الباقة "${deleteTarget?.name}"؟ لا يمكن الحذف إذا كان هناك أعضاء مشتركون فيها.`}
        busy={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
