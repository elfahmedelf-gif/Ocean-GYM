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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch, jsonDelete, jsonPost } from "@/components/admin/api";
import { EmptyState, PageHeader, StatusBadge } from "@/components/admin/shared";
import ConfirmDialog from "@/components/admin/confirm-dialog";
import MemberFormDialog from "@/components/admin/member-form-dialog";
import MemberProgressDialog from "@/components/admin/member-progress-dialog";
import type {
  Member,
  NutritionPlanItem,
  Plan,
} from "@/components/admin/types";

export default function MembersView() {
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [activatingId, setActivatingId] = useState<string | null>(null);

  // Progress dialog
  const [progressMember, setProgressMember] = useState<Member | null>(null);

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

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(m: Member) {
    setEditing(m);
    setFormOpen(true);
  }

  function openProgress(m: Member) {
    setProgressMember(m);
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
          className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="بحث بالاسم أو الهاتف أو البريد أو الكود"
          aria-label="بحث في الأعضاء"
          className="ps-9"
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
                  <TableHead className="text-end">إجراءات</TableHead>
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
                            className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-mono text-primary tabular-nums"
                          >
                            {m.accessCode}
                          </code>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 text-muted-foreground hover:text-primary"
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
                          className="h-9 text-primary border-primary/40 hover:bg-primary/10"
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
                            className="h-9 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
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
                          className="h-9 text-muted-foreground hover:text-primary"
                          onClick={() => openEdit(m)}
                          aria-label={`تعديل ${m.name}`}
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                          تعديل
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-9 text-muted-foreground hover:text-destructive"
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
      <MemberFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        plans={plans}
        nutritionPlans={nutritionPlans}
        onSaved={loadMembers}
      />

      {/* Progress dialog */}
      <MemberProgressDialog
        member={progressMember}
        onOpenChange={(open) => !open && setProgressMember(null)}
        onLogsChanged={loadMembers}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="تأكيد حذف العضو"
        description={`هل أنت متأكد من حذف العضو "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        busy={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
