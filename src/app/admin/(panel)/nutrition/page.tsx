import type { Metadata } from "next";
import NutritionView from "@/components/admin/views/nutrition-view";

export const metadata: Metadata = {
  title: "خطط التغذية | Ocean GYM",
};

export default function AdminNutritionPage() {
  return <NutritionView />;
}
