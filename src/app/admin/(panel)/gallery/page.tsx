import type { Metadata } from "next";
import GalleryView from "@/components/admin/views/gallery-view";

export const metadata: Metadata = {
  title: "معرض الصور | Ocean GYM",
};

export default function AdminGalleryPage() {
  return <GalleryView />;
}
