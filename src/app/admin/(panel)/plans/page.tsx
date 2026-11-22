import type { Metadata } from "next";
import PlansView from "@/components/admin/views/plans-view";

export const metadata: Metadata = {
  title: "إدارة الباقات | Ocean GYM",
};

export default function AdminPlansPage() {
  return <PlansView />;
}
