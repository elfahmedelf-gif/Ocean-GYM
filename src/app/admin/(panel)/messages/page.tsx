import type { Metadata } from "next";
import MessagesView from "@/components/admin/views/messages-view";

export const metadata: Metadata = {
  title: "صندوق الرسائل | Ocean GYM",
};

export default function AdminMessagesPage() {
  return <MessagesView />;
}
