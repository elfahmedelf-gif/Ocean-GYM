"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Copy,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { EmptyState, Field, PageHeader, StatusBadge } from "@/components/admin/shared";
import { MEMBER_STATUSES } from "@/lib/gym";
import type {
  Member,
  MemberStatus,
  NutritionPlanItem,
  Plan,
  ProgressLogItem,
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

interface ProgressFormState {
  date: string;
  weight: string;
  fatPercent: string;
  muscleMass: string;
  waist: string;
  chest: string;
  arm: string;
  notes: string;
}

function todayDateInput(): string {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

const EMPTY_PROGRESS: ProgressFormState = {
  date: "",
  weight: "",
  fatPercent: "",
  muscleMass: "",
  waist: "",
  chest: "",
  arm: "",
  notes: "",
};

function toDateInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatLogDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function fmtNum(v: number | null): string {
  if (v === null || v === undefined) return "—";
  return String(v);
}

export default function MembersView() {
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState<MemberFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [activatingId, setActivatingId] = useState<string | null>(null);

  // Progress dialog
  const [progressMember, setProgressMember] = useState<Member | null>(null);
  const [progressLogs, setProgressLogs] = useState<ProgressLogItem[]>([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressForm, setProgressForm] = useState<ProgressFormState>(EMPTY_PROGRESS);
  const [progressSaving, setProgressSaving] = useState(false);
  const [logDeleteTarget, setLogDeleteTarget] = useState<ProgressLogItem | null>(null);
  const [logDeleting, setLogDeleting] = useState(false);

  const plansLoaded = useRef(false);
  const nutritionLoaded = useRef(false);

  async function loadMembers() {
    try {
      const data = await apiFetch<Member[]>("/api/admin/members");
      setMembers(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر تحميل الأعضاء");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembers();
    if (!plansLoaded.current) {
      plansLoaded.current = true;
      apiFetch<Plan[]>("/api/admin/plans")
        .then(setPlans)
        .catch(() => {});
    }
    if (!nutritionLoaded.current) {
      nutritionLoaded.current = true;
      apiFetch<NutritionPlanItem[]>("/api/admin/nutrition")
        .then(setNutritionPlans)
        .catch(() => {});
    }
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        (m.accessCode ?? "").toLowerCase().includes(q)
    );
  }, [members, search]);

  const lastWeight = useMemo(() => {
    if (progressLogs.length === 0) return null;
    return progressLogs[0].weight;
  }, [progressLogs]);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(m: Member) {
    setEditing(m);
    setForm({
      name: m.name,
      email: m.email,
      phone: m.phone,
      planId: m.planId ?? "none",
      status: m.status,
      startDate: toDateInputValue(m.startDate),
      endDate: toDateInputValue(m.endDate),
      notes: m.notes ?? "",
      nutritionPlanId: m.nutritionPlanId ?? "none",
      accessCode: m.accessCode ?? "",
    });
    setFormOpen(true);
  }

  async function handleGenerateCode() {
    setGeneratingCode(true);
    try {
      const res = await apiFetch<{ accessCode: string | null }>(
        `/api/admin/members/${editing?.id}/access-code`,
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
      setFormOpen(false);
      await loadMembers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر الحفظ");
    } finally {
      setSaving(false);
    }
  }

  async function handleActivate(m: Member) {
    setActivatingId(m.id);
    try {
      await jsonPost(`/api/admin/members/${m.id}/activate`, {});
      toast.success(`تم تنشيط اشتراك ${m.name} بنجاح`);
      await loadMembers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر التنشيط");
    } finally {
      setActivatingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await jsonDelete(`/api/admin/members/${deleteTarget.id}`);
      toast.success("تم حذف العضو بنجاح");
      setDeleteTarget(null);
      await loadMembers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر الحذف");
    } finally {
      setDeleting(false);
    }
  }

  function handleCopyCode(code: string) {
    navigator.clipboard
      .writeText(code)
      .then(() => toast.success(`تم نسخ الكود ${code}`))
      .catch(() => toast.error("تعذر نسخ الكود"));
  }

  // ===== Progress dialog handlers =====

  async function openProgress(m: Member) {
    setProgressMember(m);
    setProgressLogs([]);
    setProgressForm({ ...EMPTY_PROGRESS, date: todayDateInput() });
    setProgressLoading(true);
    try {
      const logs = await apiFetch<ProgressLogItem[]>(`/api/admin/members/${m.id}/progress`);
      setProgressLogs(logs);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر تحميل سجلات المتابعة");
    } finally {
      setProgressLoading(false);
    }
  }

  async function handleSaveProgress(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!progressMember) return;

    if (!progressForm.date) {
      toast.error("تاريخ القياس مطلوب");
      return;
    }
    const weight = Number(progressForm.weight);
    if (!progressForm.weight || Number.isNaN(weight) || weight <= 0) {
      toast.error("الوزن مطلوب ويجب أن يكون أكبر من صفر");
      return;
    }

    setProgressSaving(true);
    const payload = {
      date: new Date(`${progressForm.date}T12:00:00`).toISOString(),
      weight,
      fatPercent: progressForm.fatPercent ? Number(progressForm.fatPercent) : null,
      muscleMass: progressForm.muscleMass ? Number(progressForm.muscleMass) : null,
      waist: progressForm.waist ? Number(progressForm.waist) : null,
      chest: progressForm.chest ? Number(progressForm.chest) : null,
      arm: progressForm.arm ? Number(progressForm.arm) : null,
      notes: progressForm.notes.trim() || null,
    };

    try {
      await jsonPost(`/api/admin/members/${progressMember.id}/progress`, payload);
      toast.success("تم إضافة سجل المتابعة بنجاح");
      setProgressForm({ ...EMPTY_PROGRESS, date: todayDateInput() });
      const logs = await apiFetch<ProgressLogItem[]>(
        `/api/admin/members/${progressMember.id}/progress`
      );
      setProgressLogs(logs);
      await loadMembers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر حفظ السجل");
    } finally {
      setProgressSaving(false);
    }
  }

  async function handleDeleteLog() {
    if (!logDeleteTarget) return;
    setLogDeleting(true);
    try {
      await jsonDelete(`/api/admin/progress/${logDeleteTarget.id}`);
      toast.success("تم حذف السجل بنجاح");
      setLogDeleteTarget(null);
      if (progressMember) {
        const logs = await apiFetch<ProgressLogItem[]>(
          `/api/admin/members/${progressMember.id}/progress`
        );
        setProgressLogs(logs);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر حذف السجل");
    } finally {
      setLogDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="إدارة الأعضاء"
        subtitle="متابعة الأعضاء وتنشيط الاشتراكات والخطط الغذائية وأكواد الدخول"
      >
        <Button onClick={openAdd} className="w-full md:w-auto">
          <Plus className="h-4 w-4" aria-hidden="true" />
          إضافة عضو
        </Button>
      </PageHeader>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="بحث بالاسم أو الهاتف أو البريد أو الكود"
          aria-label="بحث في الأعضاء"
          className="pr-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={search ? "لا توجد نتائج مطابقة للبحث" : "لا يوجد أعضاء بعد"}
            description={search ? undefined : "ابدأ بإضافة أول عضو"}
            className="border-0"
          >
            {!search && (
              <Button variant="outline" onClick={openAdd}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                إضافة عضو
              </Button>
            )}
          </EmptyState>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>الهاتف</TableHead>
                  <TableHead>الباقة</TableHead>
                  <TableHead>الخطة الغذائية</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>كود الدخول</TableHead>
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </div>
                    </TableCell>
                    <TableCell dir="ltr" className="tabular-nums text-sm">
                      {m.phone}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {m.plan?.name ?? "بدون باقة"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {m.nutritionPlan?.name ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={m.status} />
                    </TableCell>
                    <TableCell>
                      {m.accessCode ? (
                        <span className="inline-flex items-center gap-1.5">
                          <code
                            dir="ltr"
                            className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-xs font-mono text-cyan-300 tabular-nums"
                          >
                            {m.accessCode}
                          </code>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-primary"
                            onClick={() => handleCopyCode(m.accessCode as string)}
                            aria-label={`نسخ كود ${m.name}`}
                          >
                            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          </Button>
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-start md:justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
                          onClick={() => openProgress(m)}
                          aria-label={`متابعة ${m.name}`}
                        >
                          <TrendingUp className="h-4 w-4" aria-hidden="true" />
                          المتابعة
                        </Button>
                        {m.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
                            onClick={() => handleActivate(m)}
                            disabled={activatingId === m.id}
                            aria-label={`تنشيط اشتراك ${m.name}`}
                          >
                            {activatingId === m.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            ) : (
                              <UserCheck className="h-4 w-4" aria-hidden="true" />
                            )}
                            تنشيط
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-muted-foreground hover:text-primary"
                          onClick={() => openEdit(m)}
                          aria-label={`تعديل ${m.name}`}
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                          تعديل
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteTarget(m)}
                          aria-label={`حذف ${m.name}`}
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
                    className="shrink-0 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
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
                onClick={() => setFormOpen(false)}
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

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف العضو</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف العضو &quot;{deleteTarget?.name}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
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

      {/* Progress dialog */}
      <Dialog
        open={!!progressMember}
        onOpenChange={(open) => !open && setProgressMember(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto custom-scrollbar sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>متابعة العضو — {progressMember?.name}</DialogTitle>
            <DialogDescription>
              الوزن الحالي:{" "}
              <span className="font-bold text-cyan-400 tabular-nums">
                {lastWeight !== null ? `${fmtNum(lastWeight)} كجم` : "لا يوجد قياس بعد"}
              </span>
            </DialogDescription>
          </DialogHeader>

          {/* Add log form */}
          <form onSubmit={handleSaveProgress} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field label="التاريخ" required htmlFor="progress-date">
                <Input
                  id="progress-date"
                  type="date"
                  dir="ltr"
                  value={progressForm.date}
                  onChange={(e) =>
                    setProgressForm({ ...progressForm, date: e.target.value })
                  }
                  required
                />
              </Field>
              <Field label="الوزن (كجم)" required htmlFor="progress-weight">
                <Input
                  id="progress-weight"
                  type="number"
                  step="0.1"
                  min="20"
                  max="300"
                  dir="ltr"
                  value={progressForm.weight}
                  onChange={(e) =>
                    setProgressForm({ ...progressForm, weight: e.target.value })
                  }
                  placeholder="78.5"
                  required
                />
              </Field>
              <Field label="نسبة الدهون %" htmlFor="progress-fat">
                <Input
                  id="progress-fat"
                  type="number"
                  step="0.1"
                  min="0"
                  max="70"
                  dir="ltr"
                  value={progressForm.fatPercent}
                  onChange={(e) =>
                    setProgressForm({ ...progressForm, fatPercent: e.target.value })
                  }
                  placeholder="18"
                />
              </Field>
              <Field label="الكتلة العضلية" htmlFor="progress-muscle">
                <Input
                  id="progress-muscle"
                  type="number"
                  step="0.1"
                  min="0"
                  dir="ltr"
                  value={progressForm.muscleMass}
                  onChange={(e) =>
                    setProgressForm({ ...progressForm, muscleMass: e.target.value })
                  }
                  placeholder="32"
                />
              </Field>
              <Field label="الخصر (سم)" htmlFor="progress-waist">
                <Input
                  id="progress-waist"
                  type="number"
                  step="0.1"
                  min="0"
                  dir="ltr"
                  value={progressForm.waist}
                  onChange={(e) =>
                    setProgressForm({ ...progressForm, waist: e.target.value })
                  }
                  placeholder="82"
                />
              </Field>
              <Field label="الصدر (سم)" htmlFor="progress-chest">
                <Input
                  id="progress-chest"
                  type="number"
                  step="0.1"
                  min="0"
                  dir="ltr"
                  value={progressForm.chest}
                  onChange={(e) =>
                    setProgressForm({ ...progressForm, chest: e.target.value })
                  }
                  placeholder="98"
                />
              </Field>
              <Field label="الذراع (سم)" htmlFor="progress-arm">
                <Input
                  id="progress-arm"
                  type="number"
                  step="0.1"
                  min="0"
                  dir="ltr"
                  value={progressForm.arm}
                  onChange={(e) =>
                    setProgressForm({ ...progressForm, arm: e.target.value })
                  }
                  placeholder="34"
                />
              </Field>
              <Field label="ملاحظات" htmlFor="progress-notes">
                <Input
                  id="progress-notes"
                  value={progressForm.notes}
                  onChange={(e) =>
                    setProgressForm({ ...progressForm, notes: e.target.value })
                  }
                  placeholder="ملاحظة سريعة..."
                />
              </Field>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={progressSaving}>
                {progressSaving && (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                )}
                إضافة سجل
              </Button>
            </div>
          </form>

          {/* Logs table */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              سجلات المتابعة
            </h3>
            {progressLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : progressLogs.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                لا توجد سجلات متابعة بعد — أضف أول قياس
              </p>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>الوزن</TableHead>
                        <TableHead>الدهون %</TableHead>
                        <TableHead>العضلات</TableHead>
                        <TableHead>الخصر</TableHead>
                        <TableHead>ملاحظات</TableHead>
                        <TableHead className="text-left">حذف</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {progressLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                            {formatLogDate(log.date)}
                          </TableCell>
                          <TableCell className="font-bold text-cyan-400 tabular-nums">
                            {fmtNum(log.weight)}
                          </TableCell>
                          <TableCell className="tabular-nums">
                            {fmtNum(log.fatPercent)}
                          </TableCell>
                          <TableCell className="tabular-nums">
                            {fmtNum(log.muscleMass)}
                          </TableCell>
                          <TableCell className="tabular-nums">
                            {fmtNum(log.waist)}
                          </TableCell>
                          <TableCell className="max-w-40">
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {log.notes ?? "—"}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => setLogDeleteTarget(log)}
                                aria-label="حذف السجل"
                              >
                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Log delete confirm */}
      <AlertDialog
        open={!!logDeleteTarget}
        onOpenChange={(open) => !open && setLogDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف السجل</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف سجل المتابعة بتاريخ{" "}
              {logDeleteTarget ? formatLogDate(logDeleteTarget.date) : ""}؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={logDeleting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteLog();
              }}
              disabled={logDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {logDeleting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              حذف نهائي
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
