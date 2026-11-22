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

export interface StatsResponse {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  expiredMembers: number;
  unreadMessages: number;
  totalTrainers: number;
  totalClasses: number;
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
