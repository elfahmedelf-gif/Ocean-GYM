"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch, jsonPost, jsonPut } from "@/components/admin/api";
import { Field } from "@/components/admin/shared";
import { MEMBER_STATUSES } from "@/lib/gym";
import type {
  Member,
  MemberStatus,
  NutritionPlanItem,
  Plan,
} from "@/components/admin/types";

interface MemberFormState {
  name: string;
  email: string;
  phone: string;
  planId: string;
  status: MemberStatus;
  startDate: string;
  endDate: string;
  notes: string;
  nutritionPlanId: string;
  accessCode: string;
}

const EMPTY_FORM: MemberFormState = {
  name: "",
  email: "",
  phone: "",
  planId: "none",
  status: "pending",
  startDate: "",
  endDate: "",
  notes: "",
  nutritionPlanId: "none",
  accessCode: "",
};

function toDateInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

/** Create/edit member dialog (owns the form state; parent only opens/closes it). */
export default function MemberFormDialog({
  open,
  onOpenChange,
  editing,
  plans,
  nutritionPlans,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Member | null;
  plans: Plan[];
  nutritionPlans: NutritionPlanItem[];
  onSaved: () => Promise<void> | void;
}) {
  const [form, setForm] = useState<MemberFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);

  // Re-initialize the form each time the dialog opens (same as previous openAdd/openEdit).
  useEffect(() => {
    if (!open) return;
    if (editing) {
      setForm({
        name: editing.name,
        email: editing.email,
        phone: editing.phone,
        planId: editing.planId ?? "none",
        status: editing.status,
        startDate: toDateInputValue(editing.startDate),
        endDate: toDateInputValue(editing.endDate),
        notes: editing.notes ?? "",
        nutritionPlanId: editing.nutritionPlanId ?? "none",
        accessCode: editing.accessCode ?? "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [open, editing]);

  async function handleGenerateCode() {
    if (!editing) return;
    setGeneratingCode(true);
    try {
      const res = await apiFetch<{ accessCode: string | null }>(
        `/api/admin/members/${editing.id}/access-code`,
        { method: "POST" }
      );
      if (res.accessCode) {
        setForm((f) => ({ ...f, accessCode: res.accessCode as string }));
        toast.success(`تم توليد كود جديد: ${res.accessCode}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر توليد الكود");
    } finally {
      setGeneratingCode(false);
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("الاسم والبريد الإلكتروني ورقم الهاتف مطلوبة");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      planId: form.planId === "none" ? null : form.planId,
      status: form.status,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      notes: form.notes.trim() || null,
      nutritionPlanId: form.nutritionPlanId === "none" ? null : form.nutritionPlanId,
      accessCode: form.accessCode.trim() || null,
    };

    try {
      if (editing) {
        await jsonPut(`/api/admin/members/${editing.id}`, payload);
        toast.success("تم تحديث بيانات العضو بنجاح");
      } else {
        await jsonPost("/api/admin/members", payload);
        toast.success("تم إضافة العضو بنجاح");
      }
      onOpenChange(false);
      await onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر الحفظ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto custom-scrollbar sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "تعديل بيانات العضو" : "إضافة عضو جديد"}</DialogTitle>
          <DialogDescription>
            الحقول المميزة بـ * مطلوبة
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="الاسم" required htmlFor="member-name">
            <Input
              id="member-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="اسم العضو"
              required
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="البريد الإلكتروني" required htmlFor="member-email">
              <Input
                id="member-email"
                type="email"
                dir="ltr"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.com"
                required
              />
            </Field>
            <Field label="الهاتف" required htmlFor="member-phone">
              <Input
                id="member-phone"
                type="tel"
                dir="ltr"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="01012345678"
                required
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="الباقة" htmlFor="member-plan">
              <Select
                value={form.planId}
                onValueChange={(v) => setForm({ ...form, planId: v })}
              >
                <SelectTrigger id="member-plan" className="w-full">
                  <SelectValue placeholder="اختر الباقة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون باقة</SelectItem>
                  {plans.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} — {p.price} ج.م
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="الحالة" htmlFor="member-status">
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as MemberStatus })}
              >
                <SelectTrigger id="member-status" className="w-full">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  {MEMBER_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="تاريخ البدء" htmlFor="member-start">
              <Input
                id="member-start"
                type="date"
                dir="ltr"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </Field>
            <Field label="تاريخ الانتهاء" htmlFor="member-end">
              <Input
                id="member-end"
                type="date"
                dir="ltr"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </Field>
          </div>
          <Field label="الخطة الغذائية" htmlFor="member-nutrition">
            <Select
              value={form.nutritionPlanId}
              onValueChange={(v) => setForm({ ...form, nutritionPlanId: v })}
            >
              <SelectTrigger id="member-nutrition" className="w-full">
                <SelectValue placeholder="اختر الخطة الغذائية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">بدون خطة</SelectItem>
                {nutritionPlans.map((np) => (
                  <SelectItem key={np.id} value={np.id}>
                    {np.name} — {np.calories} سعرة
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="كود الدخول (بوابة الأعضاء)" htmlFor="member-access-code">
            <div className="flex gap-2">
              <Input
                id="member-access-code"
                dir="ltr"
                className="font-mono tabular-nums"
                value={form.accessCode}
                onChange={(e) => setForm({ ...form, accessCode: e.target.value })}
                placeholder="OC-1234"
              />
              {editing && (
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 text-primary border-primary/40 hover:bg-primary/10"
                  onClick={handleGenerateCode}
                  disabled={generatingCode}
                >
                  {generatingCode ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  )}
                  توليد كود جديد
                </Button>
              )}
            </div>
          </Field>
          <Field label="ملاحظات" htmlFor="member-notes">
            <Textarea
              id="member-notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="أي ملاحظات إضافية عن العضو..."
              rows={3}
            />
          </Field>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {editing ? "حفظ التعديلات" : "إضافة العضو"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
