"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import type { Member, MemberStatus, Plan } from "@/components/admin/types";

const STATUS_LABELS: Record<MemberStatus, string> = {
  pending: "قيد المراجعة",
  active: "نشط",
  expired: "منتهي",
  frozen: "مجمّد",
};

const STATUS_BADGE_CLASS: Record<MemberStatus, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  expired: "bg-red-500/15 text-red-400 border-red-500/30",
  frozen: "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

const ALL_STATUSES: MemberStatus[] = ["pending", "active", "expired", "frozen"];

interface MemberFormState {
  name: string;
  email: string;
  phone: string;
  planId: string;
  status: MemberStatus;
  startDate: string;
  endDate: string;
  notes: string;
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

export default function MembersView() {
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState<MemberFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [activatingId, setActivatingId] = useState<string | null>(null);

  const plansLoaded = useRef(false);

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
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q)
    );
  }, [members, search]);

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
    });
    setFormOpen(true);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" aria-hidden="true" />
            إدارة الأعضاء
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            متابعة الأعضاء وتنشيط الاشتراكات وإدارة بياناتهم
          </p>
        </div>
        <Button onClick={openAdd} className="w-full md:w-auto">
          <Plus className="h-4 w-4" aria-hidden="true" />
          إضافة عضو
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="بحث بالاسم أو الهاتف أو البريد"
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
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Users className="h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
            <p className="text-muted-foreground">
              {search
                ? "لا توجد نتائج مطابقة للبحث"
                : "لا يوجد أعضاء بعد — ابدأ بإضافة أول عضو"}
            </p>
            {!search && (
              <Button variant="outline" onClick={openAdd}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                إضافة عضو
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>الهاتف</TableHead>
                  <TableHead>الباقة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الانتهاء</TableHead>
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
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={STATUS_BADGE_CLASS[m.status] ?? ""}
                      >
                        {STATUS_LABELS[m.status] ?? m.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                      {formatDate(m.endDate)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-start md:justify-end">
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
            <div className="space-y-2">
              <Label htmlFor="member-name">الاسم *</Label>
              <Input
                id="member-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="اسم العضو"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="member-email">البريد الإلكتروني *</Label>
                <Input
                  id="member-email"
                  type="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-phone">الهاتف *</Label>
                <Input
                  id="member-phone"
                  type="tel"
                  dir="ltr"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="01012345678"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="member-plan">الباقة</Label>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-status">الحالة</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v as MemberStatus })}
                >
                  <SelectTrigger id="member-status" className="w-full">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="member-start">تاريخ البدء</Label>
                <Input
                  id="member-start"
                  type="date"
                  dir="ltr"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-end">تاريخ الانتهاء</Label>
                <Input
                  id="member-end"
                  type="date"
                  dir="ltr"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-notes">ملاحظات</Label>
              <Textarea
                id="member-notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="أي ملاحظات إضافية عن العضو..."
                rows={3}
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
    </div>
  );
}
