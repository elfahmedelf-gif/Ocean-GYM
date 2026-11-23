import type { Metadata } from "next";
import PortalDashboard from "@/components/portal/portal-dashboard";

export const metadata: Metadata = {
  title: "بوابة الأعضاء | Ocean GYM",
};

export default function PortalHomePage() {
  return <PortalDashboard />;
}
