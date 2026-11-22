"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Flame,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  UtensilsCrossed,
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
import { EmptyState, Field, PageHeader } from "@/components/admin/shared";
import { GYM_DAYS, MEAL_TYPES, NUTRITION_GOALS, goalLabel } from "@/lib/gym";
import type { NutritionMeal, NutritionPlanItem } from "@/components/admin/types";

const GOAL_BADGE_CLASS: Record<string, string> = {
  bulk: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  cut: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  maintain: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  healthy: "bg-violet-500/15 text-violet-400 border-violet-500/30",
};

interface PlanFormState {
  name: string;
  goal: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  description: string;
  notes: string;
  active: boolean;
}

const EMPTY_PLAN_FORM: PlanFormState = {
  name: "",
  goal: "maintain",
  calories: "2000",
  protein: "",
  carbs: "",
  fats: "",
  description: "",
  notes: "",
  active: true,
};

/** Local editable meal row (no id yet for new rows) */
interface EditableMeal {
  rowId: string;
  day: number;
  mealType: string;
  content: string;
  calories: string;
}

function toEditableMeals(meals: NutritionMeal[]): EditableMeal[] {
  return meals.map((m, i) => ({
    rowId: `${m.id}-${i}`,
    day: m.day,
    mealType: m.mealType,
    content: m.content,
    calories: m.calories !== null ? String(m.calories) : "",
  }));
}

export default function NutritionView() {
  const [plans, setPlans] = useState<NutritionPlanItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Plan form dialog
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<NutritionPlanItem | null>(null);
  const [form, setForm] = useState<PlanFormState>(EMPTY_PLAN_FORM);
  const [saving, setSaving] = useState(false);

  // Meals manager dialog
  const [mealsPlan, setMealsPlan] = useState<NutritionPlanItem | null>(null);
  const [meals, setMeals] = useState<EditableMeal[]>([]);
  const [mealsDay, setMealsDay] = useState(0);
  const [savingMeals, setSavingMeals] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<NutritionPlanItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadPlans() {
    try {
      const data = await apiFetch<NutritionPlanItem[]>("/api/admin/nutrition");
      setPlans(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر تحميل الخطط");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlans();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_PLAN_FORM);
    setFormOpen(true);
  }

  function openEdit(plan: NutritionPlanItem) {
    setEditing(plan);
    setForm({
      name: plan.name,
      goal: plan.goal,
      calories: String(plan.calories),
      protein: plan.protein !== null ? String(plan.protein) : "",
      carbs: plan.carbs !== null ? String(plan.carbs) : "",
      fats: plan.fats !== null ? String(plan.fats) : "",
      description: plan.description ?? "",
      notes: plan.notes ?? "",
      active: plan.active,
    });
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("اسم الخطة مطلوب");
      return;
    }
    if (!form.calories || Number(form.calories) <= 0) {
      toast.error("عدد السعرات مطلوب ويجب أن يكون أكبر من صفر");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      goal: form.goal,
      calories: Number(form.calories),
      protein: form.protein ? Number(form.protein) : null,
      carbs: form.carbs ? Number(form.carbs) : null,
      fats: form.fats ? Number(form.fats) : null,
      description: form.description.trim() || null,
      notes: form.notes.trim() || null,
      active: form.active,
    };

    try {
      if (editing) {
        await jsonPut(`/api/admin/nutrition/${editing.id}`, payload);
        toast.success("تم تحديث الخطة بنجاح");
      } else {
        await jsonPost("/api/admin/nutrition", payload);
        toast.success("تم إضافة الخطة بنجاح");
      }
      setFormOpen(false);
      await loadPlans();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر الحفظ");
    } finally {
      setSaving(false);
    }
  }

  function openMeals(plan: NutritionPlanItem) {
    setMealsPlan(plan);
    setMeals(toEditableMeals(plan.meals ?? []));
    setMealsDay(0);
  }

  function addMealRow() {
    setMeals((prev) => [
      ...prev,
      {
        rowId: `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        day: mealsDay,
        mealType: "breakfast",
        content: "",
        calories: "",
      },
    ]);
  }

  function updateMealRow(rowId: string, patch: Partial<EditableMeal>) {
    setMeals((prev) =>
      prev.map((m) => (m.rowId === rowId ? { ...m, ...patch } : m))
    );
  }

  function removeMealRow(rowId: string) {
    setMeals((prev) => prev.filter((m) => m.rowId !== rowId));
  }

  const dayMeals = useMemo(
    () => meals.filter((m) => m.day === mealsDay),
    [meals, mealsDay]
  );

  const dayCalories = useMemo(() => {
    return dayMeals.reduce((sum, m) => {
      const c = Number(m.calories);
      return sum + (Number.isFinite(c) && c > 0 ? c : 0);
    }, 0);
  }, [dayMeals]);

  async function saveMeals() {
    if (!mealsPlan) return;

    const invalid = meals.find((m) => !m.content.trim());
    if (invalid) {
      toast.error("أكمل محتوى كل الوجبات قبل الحفظ أو احذف الصفوف الفارغة");
      return;
    }

    setSavingMeals(true);
    try {
      await jsonPut(`/api/admin/nutrition/${mealsPlan.id}/meals`, {
        meals: meals.map((m) => ({
          day: m.day,
          mealType: m.mealType,
          content: m.content.trim(),
          calories: m.calories ? Number(m.calories) : null,
        })),
      });
      toast.success("تم حفظ الوجبات");
      setMealsPlan(null);
      await loadPlans();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر حفظ الوجبات");
    } finally {
      setSavingMeals(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await jsonDelete(`/api/admin/nutrition/${deleteTarget.id}`);
      toast.success("تم حذف الخطة بنجاح");
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
        icon={UtensilsCrossed}
        title="خطط التغذية"
        subtitle="إدارة برامج التغذية وخطط الوجبات التي تُسند للأعضاء"
      >
        <Button onClick={openAdd} className="w-full md:w-auto">
          <Plus className="h-4 w-4" aria-hidden="true" />
          إضافة خطة
        </Button>
      </PageHeader>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full rounded-xl" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="لا توجد خطط تغذية بعد"
          description="ابدأ بإضافة أول خطة تغذية للأعضاء"
        >
          <Button variant="outline" onClick={openAdd}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            إضافة خطة
          </Button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`p-0 flex flex-col ${plan.active ? "" : "opacity-60"}`}
            >
              <CardContent className="p-4 flex-1 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-base truncate">{plan.name}</h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className={GOAL_BADGE_CLASS[plan.goal] ?? ""}
                      >
                        {goalLabel(plan.goal)}
                      </Badge>
                      <Badge variant="outline" className="bg-muted">
                        {(plan.meals ?? []).length} وجبة
                      </Badge>
                    </div>
                  </div>
                  <Switch
                    checked={plan.active}
                    onCheckedChange={async (v) => {
                      try {
                        await jsonPut(`/api/admin/nutrition/${plan.id}`, {
                          active: v,
                        });
                        toast.success(v ? "تم تفعيل الخطة" : "تم إيقاف الخطة");
                        await loadPlans();
                      } catch (err) {
                        toast.error(
                          err instanceof Error ? err.message : "تعذر التغيير"
                        );
                      }
                    }}
                    aria-label={`تفعيل خطة ${plan.name}`}
                  />
                </div>

                <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-400">
                  <Flame className="h-4 w-4" aria-hidden="true" />
                  <span className="tabular-nums">{plan.calories} سعرة</span>
                </div>

                {(plan.protein || plan.carbs || plan.fats) && (
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {plan.protein !== null && (
                      <Badge
                        variant="outline"
                        className="bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                      >
                        بروتين {plan.protein}جم
                      </Badge>
                    )}
                    {plan.carbs !== null && (
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-400 border-amber-500/25"
                      >
                        كارب {plan.carbs}جم
                      </Badge>
                    )}
                    {plan.fats !== null && (
                      <Badge
                        variant="outline"
                        className="bg-violet-500/10 text-violet-400 border-violet-500/25"
                      >
                        دهون {plan.fats}جم
                      </Badge>
                    )}
                  </div>
                )}

                {plan.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                    {plan.description}
                  </p>
                )}

                <div className="flex gap-1.5 border-t border-border pt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
                    onClick={() => openMeals(plan)}
                    aria-label={`إدارة وجبات ${plan.name}`}
                  >
                    <UtensilsCrossed className="h-3.5 w-3.5" aria-hidden="true" />
                    الوجبات
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8"
                    onClick={() => openEdit(plan)}
                    aria-label={`تعديل ${plan.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-destructive hover:text-destructive border-destructive/40 hover:bg-destructive/10"
                    onClick={() => setDeleteTarget(plan)}
                    aria-label={`حذف ${plan.name}`}
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

      {/* Add/Edit plan dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto custom-scrollbar sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل الخطة" : "إضافة خطة جديدة"}</DialogTitle>
            <DialogDescription>الحقول المميزة بـ * مطلوبة</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="اسم الخطة" required htmlFor="plan-name">
              <Input
                id="plan-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثال: خطة التضخيم"
                required
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="الهدف" required htmlFor="plan-goal">
                <Select
                  value={form.goal}
                  onValueChange={(v) => setForm({ ...form, goal: v })}
                >
                  <SelectTrigger id="plan-goal" className="w-full">
                    <SelectValue placeholder="اختر الهدف" />
                  </SelectTrigger>
                  <SelectContent>
                    {NUTRITION_GOALS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="السعرات الحرارية" required htmlFor="plan-calories">
                <Input
                  id="plan-calories"
                  type="number"
                  min="200"
                  max="8000"
                  dir="ltr"
                  value={form.calories}
                  onChange={(e) => setForm({ ...form, calories: e.target.value })}
                  placeholder="3000"
                  required
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="بروتين (جم)" htmlFor="plan-protein">
                <Input
                  id="plan-protein"
                  type="number"
                  min="0"
                  dir="ltr"
                  value={form.protein}
                  onChange={(e) => setForm({ ...form, protein: e.target.value })}
                  placeholder="180"
                />
              </Field>
              <Field label="كارب (جم)" htmlFor="plan-carbs">
                <Input
                  id="plan-carbs"
                  type="number"
                  min="0"
                  dir="ltr"
                  value={form.carbs}
                  onChange={(e) => setForm({ ...form, carbs: e.target.value })}
                  placeholder="380"
                />
              </Field>
              <Field label="دهون (جم)" htmlFor="plan-fats">
                <Input
                  id="plan-fats"
                  type="number"
                  min="0"
                  dir="ltr"
                  value={form.fats}
                  onChange={(e) => setForm({ ...form, fats: e.target.value })}
                  placeholder="95"
                />
              </Field>
            </div>
            <Field label="الوصف" htmlFor="plan-description">
              <Textarea
                id="plan-description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="وصف مختصر للخطة ومناسب لمن..."
                rows={3}
              />
            </Field>
            <Field label="ملاحظات" htmlFor="plan-notes">
              <Textarea
                id="plan-notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="ملاحظات مهمة تظهر للعضو..."
                rows={2}
              />
            </Field>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="text-sm">نشطة ويمكن إسنادها للأعضاء</span>
              <Switch
                checked={form.active}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
                aria-label="تفعيل الخطة"
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
                {editing ? "حفظ التعديلات" : "إضافة الخطة"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Meals manager dialog */}
      <Dialog
        open={!!mealsPlan}
        onOpenChange={(open) => !open && setMealsPlan(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto custom-scrollbar sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              إدارة الوجبات — {mealsPlan?.name}
            </DialogTitle>
            <DialogDescription>
              نظّم وجبات الأسبوع لكل يوم — احفظ بعد الانتهاء
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Day tabs */}
            <div
              role="tablist"
              aria-label="أيام الأسبوع"
              className="flex gap-2 overflow-x-auto custom-scrollbar pb-1"
            >
              {GYM_DAYS.map((d) => {
                const active = mealsDay === d.index;
                const count = meals.filter((m) => m.day === d.index).length;
                return (
                  <button
                    key={d.index}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setMealsDay(d.index)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {d.name}
                    <span
                      className={`mr-2 text-xs tabular-nums rounded-full px-1.5 ${
                        active ? "bg-background/20" : "bg-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Meal rows */}
            <div className="space-y-3 max-h-[45vh] overflow-y-auto custom-scrollbar pr-1">
              {dayMeals.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  لا توجد وجبات في هذا اليوم — أضف أول وجبة
                </p>
              ) : (
                dayMeals.map((meal) => (
                  <div
                    key={meal.rowId}
                    className="rounded-lg border border-border p-3 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <Select
                        value={meal.mealType}
                        onValueChange={(v) =>
                          updateMealRow(meal.rowId, { mealType: v })
                        }
                      >
                        <SelectTrigger className="w-36 shrink-0 h-9">
                          <SelectValue placeholder="نوع الوجبة" />
                        </SelectTrigger>
                        <SelectContent>
                          {MEAL_TYPES.map((mt) => (
                            <SelectItem key={mt.value} value={mt.value}>
                              {mt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        min="0"
                        dir="ltr"
                        className="w-28 shrink-0 h-9"
                        placeholder="سعرات"
                        aria-label="سعرات الوجبة"
                        value={meal.calories}
                        onChange={(e) =>
                          updateMealRow(meal.rowId, { calories: e.target.value })
                        }
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeMealRow(meal.rowId)}
                        aria-label="حذف الوجبة"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                    <Textarea
                      rows={2}
                      placeholder="محتوى الوجبة — مثال: 4 بياض بيض + شوفان 80جم + موزة"
                      aria-label="محتوى الوجبة"
                      value={meal.content}
                      onChange={(e) =>
                        updateMealRow(meal.rowId, { content: e.target.value })
                      }
                    />
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <Button
                type="button"
                variant="outline"
                onClick={addMealRow}
                className="text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                إضافة وجبة لهذا اليوم
              </Button>
              <p className="text-sm text-muted-foreground tabular-nums">
                إجمالي سعرات اليوم:{" "}
                <span className="font-semibold text-amber-400">{dayCalories}</span> سعرة
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setMealsPlan(null)}
              disabled={savingMeals}
            >
              إلغاء
            </Button>
            <Button type="button" onClick={saveMeals} disabled={savingMeals}>
              {savingMeals && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              حفظ الوجبات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف الخطة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف خطة &quot;{deleteTarget?.name}&quot; وكل وجباتها؟ لا يمكن
              التراجع عن هذا الإجراء.
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
