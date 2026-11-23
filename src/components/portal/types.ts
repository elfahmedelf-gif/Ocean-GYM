/** Shared types for the member portal API payloads & components. */

export interface PortalMemberSession {
  id: string;
  name: string;
  email: string;
}

export interface PortalLoginResponse {
  ok: boolean;
  member: PortalMemberSession;
}

export interface PlanSummary {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface NutritionMealItem {
  id: string;
  day: number;
  mealType: string;
  content: string;
  calories: number | null;
}

export interface NutritionPlanDetail {
  id: string;
  name: string;
  goal: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fats: number | null;
  description: string | null;
  notes: string | null;
  meals: NutritionMealItem[];
}

export interface ProgressLogItem {
  id: string;
  date: string;
  weight: number;
  fatPercent: number | null;
  muscleMass: number | null;
  waist: number | null;
  chest: number | null;
  arm: number | null;
  notes: string | null;
}

export interface PortalMemberDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  plan: PlanSummary | null;
  nutritionPlan: NutritionPlanDetail | null;
  progressLogs: ProgressLogItem[];
}

export interface PortalMeResponse {
  member: PortalMemberDetail;
}
