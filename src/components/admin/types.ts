/** Shared TypeScript interfaces for admin panel entities (dates as strings) */

export type MemberStatus = "pending" | "active" | "expired" | "frozen";
export type ClassLevel = "beginner" | "intermediate" | "advanced" | "all";

export interface AdminPayload {
  id: string;
  username: string;
  name: string;
}

export interface PlanRef {
  name: string;
  price: number;
}

export interface TrainerRef {
  id: string;
  name: string;
}

export interface NutritionPlanRef {
  id: string;
  name: string;
  goal: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  planId: string | null;
  plan: PlanRef | null;
  status: MemberStatus;
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  accessCode: string | null;
  nutritionPlanId: string | null;
  nutritionPlan: NutritionPlanRef | null;
  createdAt: string;
  updatedAt: string;
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
  specialty: string | null;
  instagram: string | null;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface GymClass {
  id: string;
  name: string;
  description: string;
  trainerId: string | null;
  trainer: TrainerRef | null;
  schedule: string;
  duration: number;
  capacity: number;
  level: ClassLevel;
  image: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string;
  popular: boolean;
  active: boolean;
  _count?: { members: number };
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string | null;
  approved: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  createdAt: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface ScheduleSlot {
  id: string;
  day: number;
  time: string;
  gymClassId: string;
  gymClass: { name: string; level: ClassLevel; duration: number };
  trainerId: string | null;
  trainer: TrainerRef | null;
  active: boolean;
  createdAt: string;
}

export interface NutritionMeal {
  id: string;
  planId: string;
  day: number;
  mealType: string;
  content: string;
  calories: number | null;
  createdAt: string;
}

export interface NutritionPlanItem {
  id: string;
  name: string;
  goal: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fats: number | null;
  description: string | null;
  notes: string | null;
  active: boolean;
  meals?: NutritionMeal[];
  _count?: { meals: number; members: number };
  createdAt: string;
  updatedAt: string;
}

export interface ProgressLogItem {
  id: string;
  memberId: string;
  date: string;
  weight: number;
  fatPercent: number | null;
  muscleMass: number | null;
  waist: number | null;
  chest: number | null;
  arm: number | null;
  notes: string | null;
  createdAt: string;
}

export interface StatsResponse {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  expiredMembers: number;
  unreadMessages: number;
  totalTrainers: number;
  totalClasses: number;
  totalSlots: number;
  nutritionPlans: number;
  monthlyRevenue: number;
  planDistribution: { name: string; count: number }[];
  recentMembers: {
    id: string;
    name: string;
    status: MemberStatus;
    createdAt: string;
    plan: { name: string } | null;
  }[];
  recentMessages: {
    id: string;
    name: string;
    subject: string | null;
    read: boolean;
    createdAt: string;
  }[];
}
