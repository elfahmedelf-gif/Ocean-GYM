import type { Metadata } from "next";
import ScheduleView from "@/components/admin/views/schedule-view";

export const metadata: Metadata = {
  title: "الجدول الأسبوعي | Ocean GYM",
};

export default function AdminSchedulePage() {
  return <ScheduleView />;
}
