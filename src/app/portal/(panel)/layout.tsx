import { redirect } from "next/navigation";
import { getCurrentPortalMember } from "@/lib/portal-auth";
import PortalShell from "@/components/portal/portal-shell";

export default async function PortalPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const member = await getCurrentPortalMember();
  if (!member) redirect("/portal/login");

  return <PortalShell member={member}>{children}</PortalShell>;
}
