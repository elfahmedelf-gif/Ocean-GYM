import type { Metadata } from "next";
import MembersView from "@/components/admin/views/members-view";

export const metadata: Metadata = {
  title: "إدارة الأعضاء | Ocean GYM",
};

export default function AdminMembersPage() {
  return <MembersView />;
}
