"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CheckCheck,
  Eye,
  Loader2,
  Mail,
  MailOpen,
  Phone,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiFetch, jsonDelete, jsonPut } from "@/components/admin/api";
import type { Message } from "@/components/admin/types";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function MessagesView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "unread">("all");

  const [viewing, setViewing] = useState<Message | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadMessages() {
    try {
      const data = await apiFetch<Message[]>("/api/admin/messages");
      setMessages(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر تحميل الرسائل");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  const unreadCount = messages.filter((m) => !m.read).length;

  const filtered = useMemo(
    () => (tab === "unread" ? messages.filter((m) => !m.read) : messages),
    [messages, tab]
  );

  function openMessage(m: Message) {
    setViewing(m);
    if (!m.read) {
      markRead(m, true);
    }
  }

  async function markRead(m: Message, read: boolean) {
    try {
      await jsonPut(`/api/admin/messages/${m.id}`, { read });
      setMessages((prev) =>
        prev.map((msg) => (msg.id === m.id ? { ...msg, read } : msg))
      );
      setViewing((prev) =>
        prev && prev.id === m.id ? { ...prev, read } : prev
      );
      if (!read) toast.success("تم إرجاع الرسالة لغير مقروءة");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر التحديث");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await jsonDelete(`/api/admin/messages/${deleteTarget.id}`);
      toast.success("تم حذف الرسالة بنجاح");
      if (viewing?.id === deleteTarget.id) setViewing(null);
      setDeleteTarget(null);
      await loadMessages();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر الحذف");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Mail className="h-7 w-7 text-primary" aria-hidden="true" />
          صندوق الرسائل
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          رسائل واستفسارات العملاء من الموقع
          {unreadCount > 0 && (
            <span className="text-primary font-medium">
              {" "}
              — لديك {unreadCount} {unreadCount === 1 ? "رسالة" : "رسائل"} غير مقروءة
            </span>
          )}
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "all" | "unread")}>
        <TabsList aria-label="تصفية الرسائل">
          <TabsTrigger value="all">
            الكل
            <Badge variant="outline" className="mr-2 tabular-nums">
              {messages.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            غير مقروءة
            <Badge className="mr-2 bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 tabular-nums">
              {unreadCount}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <MailOpen className="h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
            <p className="text-muted-foreground">
              {tab === "unread"
                ? "لا توجد رسائل غير مقروءة — أحسنت"
                : "لا توجد رسائل بعد"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <Card
              key={m.id}
              className={`p-0 transition-colors ${
                !m.read
                  ? "border-cyan-400/40 bg-cyan-400/[0.04] hover:bg-cyan-400/[0.07]"
                  : "hover:border-primary/25"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${
                      m.read ? "bg-muted-foreground/40" : "bg-cyan-400 animate-pulse"
                    }`}
                    aria-label={m.read ? "مقروءة" : "غير مقروءة"}
                  />
                  <button
                    type="button"
                    onClick={() => openMessage(m)}
                    className="flex-1 min-w-0 text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                    aria-label={`فتح رسالة من ${m.name}`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={`font-semibold ${
                          m.read ? "text-foreground/80" : "text-foreground"
                        }`}
                      >
                        {m.subject || "بدون عنوان"}
                      </p>
                      {!m.read && (
                        <Badge className="bg-cyan-400/15 text-cyan-300 border border-cyan-400/30">
                          جديدة
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      من: {m.name} ·{" "}
                      <span dir="ltr" className="text-xs">
                        {m.email}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground/80 mt-1 line-clamp-1">
                      {m.content}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-2">
                      {formatDate(m.createdAt)}
                    </p>
                  </button>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {!m.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-muted-foreground hover:text-primary"
                        onClick={() => markRead(m, true)}
                        aria-label={`تحديد رسالة ${m.name} كمقروءة`}
                      >
                        <CheckCheck className="h-4 w-4" aria-hidden="true" />
                        مقروءة
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteTarget(m)}
                      aria-label={`حذف رسالة ${m.name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      حذف
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View message dialog */}
      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewing?.subject || "بدون عنوان"}
              {viewing && !viewing.read && (
                <Badge className="bg-cyan-400/15 text-cyan-300 border border-cyan-400/30">
                  جديدة
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              من: {viewing?.name} ·{" "}
              <span dir="ltr">{viewing?.email}</span>
              {viewing?.phone && (
                <>
                  {" "}
                  ·{" "}
                  <span dir="ltr" className="inline-flex items-center gap-1">
                    <Phone className="h-3 w-3 inline" aria-hidden="true" />
                    {viewing.phone}
                  </span>
                </>
              )}
              {viewing && (
                <span className="block mt-1">{formatDate(viewing.createdAt)}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border bg-background/50 p-4 text-sm leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto custom-scrollbar">
            {viewing?.content}
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(viewing)}
              className="text-destructive hover:text-destructive border-destructive/40 hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              حذف الرسالة
            </Button>
            {viewing && viewing.read ? (
              <Button type="button" variant="outline" onClick={() => markRead(viewing, false)}>
                <Eye className="h-4 w-4" aria-hidden="true" />
                إرجاع كغير مقروءة
              </Button>
            ) : (
              viewing && (
                <Button
                  type="button"
                  onClick={() => markRead(viewing, true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <CheckCheck className="h-4 w-4" aria-hidden="true" />
                  تحديد كمقروء
                </Button>
              )
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف الرسالة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف الرسالة من &quot;{deleteTarget?.name}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
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
