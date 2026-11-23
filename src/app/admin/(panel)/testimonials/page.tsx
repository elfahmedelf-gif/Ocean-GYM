import type { Metadata } from "next";
import TestimonialsView from "@/components/admin/views/testimonials-view";

export const metadata: Metadata = {
  title: "آراء العملاء | Ocean GYM",
};

export default function AdminTestimonialsPage() {
  return <TestimonialsView />;
}
