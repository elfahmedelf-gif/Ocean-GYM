/**
 * Small typed fetch helper for portal views.
 * Throws Error(server Arabic message) on !ok responses.
 */
export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new Error("تعذر الاتصال بالخادم");
  }

  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    const message =
      (json as { error?: string } | null)?.error || "حدث خطأ غير متوقع";
    throw new Error(message);
  }

  return json as T;
}

/** Quick JSON request builder */
export function jsonPost<T>(url: string, data: unknown): Promise<T> {
  return apiFetch<T>(url, { method: "POST", body: JSON.stringify(data) });
}
