"use client";

import { useState } from "react";
import {
  Apple,
  Flame,
  Moon,
  Sunrise,
  UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { goalLabel, GYM_DAYS, mealTypeLabel } from "@/lib/gym";
import type { NutritionMealItem, NutritionPlanDetail } from "@/components/portal/types";

const MEAL_ORDER: Record<string, number> = {
  breakfast: 0,
  lunch: 1,
  dinner: 2,
  snack: 3,
};

const MEAL_ICONS: Record<string, LucideIcon> = {
  breakfast: Sunrise,
  lunch: UtensilsCrossed,
  dinner: Moon,
  snack: Apple,
};

/** JS getDay() (0=الأحد..6=السبت) → GYM day index (0=السبت..6=الجمعة) */
function todayGymDay(): number {
  return (new Date().getDay() + 1) % 7;
}

export default function NutritionTab({ plan }: { plan: NutritionPlanDetail }) {
  const [selectedDay, setSelectedDay] = useState<number>(todayGymDay);

  const dayMeals = plan.meals
    .filter((m) => m.day === selectedDay)
    .sort(
      (a, b) =>
        (MEAL_ORDER[a.mealType] ?? 99) - (MEAL_ORDER[b.mealType] ?? 99)
    );

  const macros = [
    { label: "بروتين", value: plan.protein },
    { label: "كارب", value: plan.carbs },
    { label: "دهون", value: plan.fats },
  ].filter((m) => typeof m.value === "number");

  return (
    <div className="space-y-6">
      {/* Plan header */}
      <Card className="glass border-primary/20">
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold md:text-2xl">
              <span className="text-gradient-ocean">{plan.name}</span>
            </h2>
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 font-semibold text-primary"
            >
              {goalLabel(plan.goal)}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="inline-flex items-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-lg font-bold text-orange-300">
              <Flame className="h-5 w-5" aria-hidden="true" />
              <span dir="ltr">{plan.calories}</span>
              <span className="text-sm font-medium">سعرة/يوم</span>
            </p>

            {macros.map((m) => (
              <span
                key={m.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/50 px-3 py-1.5 text-sm"
              >
                <span className="font-semibold">{m.label}</span>
                <span dir="ltr" className="font-bold text-primary">
                  {m.value}
                </span>
                <span className="text-muted-foreground">جم</span>
              </span>
            ))}
          </div>

          {plan.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {plan.description}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Day pills */}
      <div
        className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap"
        role="tablist"
        aria-label="أيام الأسبوع"
      >
        {GYM_DAYS.map((d) => (
          <button
            key={d.index}
            type="button"
            role="tab"
            aria-selected={selectedDay === d.index}
            onClick={() => setSelectedDay(d.index)}
            className={`h-9 rounded-full border px-3 text-sm font-medium transition-colors ${
              selectedDay === d.index
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/70 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Meals timeline */}
      {dayMeals.length === 0 ? (
        <p className="rounded-xl border border-border/60 bg-card/40 px-4 py-8 text-center text-sm text-muted-foreground">
          لا توجد وجبات مسجلة في هذا اليوم
        </p>
      ) : (
        <div className="relative space-y-4">
          <div
            aria-hidden="true"
            className="absolute inset-y-6 right-[22px] w-px bg-gradient-to-b from-primary/40 via-border to-transparent"
          />
          {dayMeals.map((meal: NutritionMealItem) => {
            const Icon = MEAL_ICONS[meal.mealType] ?? UtensilsCrossed;
            return (
              <div key={meal.id} className="relative flex gap-4">
                <div className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-secondary text-primary shadow-md">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <Card className="flex-1 bg-card/60">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold">{mealTypeLabel(meal.mealType)}</p>
                      {meal.calories !== null && (
                        <Badge
                          variant="outline"
                          className="border-orange-500/30 bg-orange-500/10 text-orange-300"
                        >
                          <span dir="ltr">{meal.calories}</span> سعرة
                        </Badge>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {meal.content}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Coach notes */}
      {plan.notes && (
        <Card className="border-primary/20 bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Apple className="h-4 w-4 text-primary" aria-hidden="true" />
              ملاحظات الكابتن
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {plan.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
