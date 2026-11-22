"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch, jsonDelete, jsonPost, jsonPut } from "@/components/admin/api";
import { IMAGE_OPTIONS } from "@/components/admin/image-options";
import { EmptyState, PageHeader } from "@/components/admin/shared";
import type { GalleryItem } from "@/components/admin/types";

interface GalleryFormState {
  title: string;
  image: string;
}

const EMPTY_FORM: GalleryFormState = { title: "", image: IMAGE_OPTIONS[0] };

export default function GalleryView() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState<GalleryFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadGallery() {
    try {
      const data = await apiFetch<GalleryItem[]>("/api/admin/gallery");
      setItems(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر تحميل معرض الصور");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGallery();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(item: GalleryItem) {
    setEditing(item);
    setForm({ title: item.title, image: item.image });
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.title.trim() || !form.image.trim()) {
      toast.error("عنوان الصورة ومسار الصورة مطلوبان");
      return;
    }

    setSaving(true);
    const payload = { title: form.title.trim(), image: form.image.trim() };

    try {
      if (editing) {
        await jsonPut(`/api/admin/gallery/${editing.id}`, payload);
        toast.success("تم تحديث الصورة بنجاح");
      } else {
        await jsonPost("/api/admin/gallery", payload);
        toast.success("تم إضافة الصورة بنجاح");
      }
      setFormOpen(false);
      await loadGallery();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر الحفظ");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await jsonDelete(`/api/admin/gallery/${deleteTarget.id}`);
      toast.success("تم حذف الصورة بنجاح");
      setDeleteTarget(null);
      await loadGallery();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر الحذف");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ImageIcon}
        title="معرض الصور"
        subtitle="صور الجيم التي تظهر في قسم المعرض بالصفحة الرئيسية"
      >
        <Button onClick={openAdd} className="w-full md:w-auto">
          <Plus className="h-4 w-4" aria-hidden="true" />
          إضافة صورة
        </Button>
      </PageHeader>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="لا توجد صور بعد"
          description="ابدأ بإضافة أول صورة"
        >
          <Button variant="outline" onClick={openAdd}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            إضافة صورة
          </Button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden p-0 group">
              <div className="relative h-36 w-full bg-muted">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate" dir="ltr">
                  {item.image}
                </p>
                <div className="flex gap-1.5 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8"
                    onClick={() => openEdit(item)}
                    aria-label={`تعديل ${item.title}`}
                  >
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-destructive hover:text-destructive border-destructive/40 hover:bg-destructive/10"
                    onClick={() => setDeleteTarget(item)}
                    aria-label={`حذف ${item.title}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto custom-scrollbar sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل الصورة" : "إضافة صورة جديدة"}</DialogTitle>
            <DialogDescription>الحقول المميزة بـ * مطلوبة</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gallery-title">عنوان الصورة *</Label>
              <Input
                id="gallery-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="مثال: منطقة الأوزان الحرة"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-image">مسار الصورة *</Label>
              <Input
                id="gallery-image"
                dir="ltr"
                list="gallery-image-options"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="/images/example.jpg"
                required
              />
              <datalist id="gallery-image-options">
                {IMAGE_OPTIONS.map((path) => (
                  <option key={path} value={path} />
                ))}
              </datalist>
              <p className="text-xs text-muted-foreground leading-relaxed">
                اختر من المسارات المتاحة أو اكتب مسارًا — أمثلة:{" "}
                <span dir="ltr" className="font-mono">
                  /images/class-boxing.jpg
                </span>
                ،{" "}
                <span dir="ltr" className="font-mono">
                  /images/about-gym.jpg
                </span>
              </p>
            </div>
            {form.image.trim() && (
              <div className="relative h-32 w-full rounded-lg overflow-hidden border border-border bg-muted">
                <Image
                  src={form.image.trim()}
                  alt="معاينة الصورة"
                  fill
                  sizes="448px"
                  className="object-cover"
                />
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                disabled={saving}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {editing ? "حفظ التعديلات" : "إضافة الصورة"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف الصورة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف الصورة &quot;{deleteTarget?.title}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={deleting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              حذف نهائي
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
