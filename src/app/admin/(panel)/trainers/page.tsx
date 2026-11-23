import type { Metadata } from "next";
import TrainersView from "@/components/admin/views/trainers-view";

export const metadata: Metadata = {
  title: "إدارة المدربين | Ocean GYM",
};

export default function AdminTrainersPage() {
  return <TrainersView />;
}
