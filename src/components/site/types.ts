/**
 * Shared view-model types passed from the server component (page.tsx)
 * to the client section components.
 */

export interface GymClassView {
  id: string;
  name: string;
  description: string;
  schedule: string;
  duration: number;
  capacity: number;
  level: string;
  image: string | null;
  trainerName: string | null;
}

export interface TrainerView {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
  specialty: string | null;
  instagram: string | null;
}

export interface PlanView {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string;
  popular: boolean;
}

export interface TestimonialView {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  /** Optional profile photo — rendered when present, letter avatar otherwise. */
  image: string | null;
}

export interface GalleryView {
  id: string;
  title: string;
  image: string;
}

export interface ScheduleSlotView {
  id: string;
  /** Gym week index: 0=السبت .. 6=الجمعة */
  day: number;
  /** "HH:MM" 24h format */
  time: string;
  gymClass: {
    name: string;
    level: string;
    duration: number;
    image?: string | null;
  };
  trainer: { name: string } | null;
}
