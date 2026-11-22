import type { Metadata } from "next";
import ClassesView from "@/components/admin/views/classes-view";

export const metadata: Metadata = {
  title: "إدارة الكلاسات | Ocean GYM",
};

export default function AdminClassesPage() {
  return <ClassesView />;
}
