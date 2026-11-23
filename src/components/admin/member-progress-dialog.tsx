"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Field } from "@/components/admin/shared";
import ConfirmDialog from "@/components/admin/confirm-dialog";
import type { Member, ProgressLogItem } from "@/components/admin/types";

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

function todayDateInput(): string {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
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
  if (v === null) return "—";
  return String(v);
}

/** Member progress-tracking dialog (owns logs state, add form and log deletion). */
export default function MemberProgressDialog({
  member,
  onOpenChange,
  onLogsChanged,
}: {
  member: Member | null;
  onOpenChange: (open: boolean) => void;
  onLogsChanged: () => Promise<void> | void;
}) {
  const [logs, setLogs] = useState<ProgressLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProgressFormState>(EMPTY_PROGRESS);
  const [saving, setSaving] = useState(false);
  const [logDeleteTarget, setLogDeleteTarget] = useState<ProgressLogItem | null>(null);
  const [logDeleting, setLogDeleting] = useState(false);

  // Load logs + reset the form whenever the dialog opens for a member.
  useEffect(() => {
    if (!member) return;
    let cancelled = false;
    setLogs([]);
    setLogDeleteTarget(null);
    setForm({ ...EMPTY_PROGRESS, date: todayDateInput() });
    setLoading(true);
    apiFetch<ProgressLogItem[]>(`/api/admin/members/${member.id}/progress`)
      .then((data) => {
        if (!cancelled) setLogs(data);
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : "تعذر تحميل سجلات المتابعة");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [member]);

  const lastWeight = useMemo(() => {
    if (logs.length === 0) return null;
    return logs[0].weight;
  }, [logs]);

  async function refreshLogs() {
    if (!member) return;
    const data = await apiFetch<ProgressLogItem[]>(
      `/api/admin/members/${member.id}/progress`
    );
    setLogs(data);
  }

  async function handleSaveProgress(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!member) return;

    if (!form.date) {
      toast.error("تاريخ القياس مطلوب");
      return;
    }
    const weight = Number(form.weight);
    if (!form.weight || Number.isNaN(weight) || weight <= 0) {
      toast.error("الوزن مطلوب ويجب أن يكون أكبر من صفر");
      return;
    }

    setSaving(true);
    const payload = {
      date: new Date(`${form.date}T12:00:00`).toISOString(),
      weight,
      fatPercent: form.fatPercent ? Number(form.fatPercent) : null,
      muscleMass: form.muscleMass ? Number(form.muscleMass) : null,
      waist: form.waist ? Number(form.waist) : null,
      chest: form.chest ? Number(form.chest) : null,
      arm: form.arm ? Number(form.arm) : null,
      notes: form.notes.trim() || null,
    };

    try {
      await jsonPost(`/api/admin/members/${member.id}/progress`, payload);
      toast.success("تم إضافة سجل المتابعة بنجاح");
      setForm({ ...EMPTY_PROGRESS, date: todayDateInput() });
      await refreshLogs();
      await onLogsChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر حفظ السجل");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteLog() {
    if (!logDeleteTarget) return;
    setLogDeleting(true);
    try {
      await jsonDelete(`/api/admin/progress/${logDeleteTarget.id}`);
      toast.success("تم حذف السجل بنجاح");
      setLogDeleteTarget(null);
      await refreshLogs();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر حذف السجل");
    } finally {
      setLogDeleting(false);
    }
  }

  return (
    <>
      <Dialog open={!!member} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto custom-scrollbar sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>متابعة العضو — {member?.name}</DialogTitle>
            <DialogDescription>
              الوزن الحالي:{" "}
              <span className="font-bold text-primary tabular-nums">
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
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
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
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
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
                  value={form.fatPercent}
                  onChange={(e) => setForm({ ...form, fatPercent: e.target.value })}
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
                  value={form.muscleMass}
                  onChange={(e) => setForm({ ...form, muscleMass: e.target.value })}
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
                  value={form.waist}
                  onChange={(e) => setForm({ ...form, waist: e.target.value })}
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
                  value={form.chest}
                  onChange={(e) => setForm({ ...form, chest: e.target.value })}
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
                  value={form.arm}
                  onChange={(e) => setForm({ ...form, arm: e.target.value })}
                  placeholder="34"
                />
              </Field>
              <Field label="ملاحظات" htmlFor="progress-notes">
                <Input
                  id="progress-notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="ملاحظة سريعة..."
                />
              </Field>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving && (
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
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : logs.length === 0 ? (
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
                        <TableHead className="text-end">حذف</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                            {formatLogDate(log.date)}
                          </TableCell>
                          <TableCell className="font-bold text-primary tabular-nums">
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
                                className="h-9 w-9 text-muted-foreground hover:text-destructive"
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
      <ConfirmDialog
        open={!!logDeleteTarget}
        onOpenChange={(open) => !open && setLogDeleteTarget(null)}
        title="تأكيد حذف السجل"
        description={
          <>
            هل أنت متأكد من حذف سجل المتابعة بتاريخ{" "}
            {logDeleteTarget ? formatLogDate(logDeleteTarget.date) : ""}؟
          </>
        }
        busy={logDeleting}
        onConfirm={handleDeleteLog}
      />
    </>
  );
}
