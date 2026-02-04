export type NormalizedApiError = {
  status?: number;
  message: string;
  code?: string | null;
  raw?: unknown;
};

function extractBackendCode(data: unknown): string | null {
  const d = data as any;
  if (!d) return null;
  return (d.code || d.errorCode || d.reason || d.status || null) as string | null;
}

function extractBackendMessage(data: unknown): string | null {
  if (!data) return null;
  if (typeof data === "string") return data;

  const d = data as any;
  if (typeof d?.message === "string" && d.message.trim()) return d.message;
  if (typeof d?.error === "string" && d.error.trim()) return d.error;
  return null;
}

/**
 * Normalizes Axios (and non-Axios) errors into a single, predictable shape.
 * Assumption: backend error responses follow GlobalExceptionHandler shape { status, error, message, code? }.
 */
export function normalizeApiError(error: unknown): NormalizedApiError {
  const err = error as any;
  const status = err?.response?.status as number | undefined;
  const data = err?.response?.data as unknown;

  const backendMessage = extractBackendMessage(data);
  const fallbackMessage = typeof err?.message === "string" ? err.message : "Request failed";

  return {
    status,
    code: extractBackendCode(data),
    message: backendMessage || fallbackMessage,
    raw: error,
  };
}

/**
 * Maps a normalized error to a user-facing message.
 */
export function getApiErrorMessage(normalized: Partial<NormalizedApiError> | unknown): string {
  const e = normalized as any;
  const status = e?.status as number | undefined;

  if (status === 403) return "Not authorized";
  if (status === 401) return "Please log in to continue";

  if (status === 400) {
    const msg = typeof e?.message === "string" ? e.message : "Bad request";
    return msg || "Bad request";
  }

  return "Something went wrong. Please try again.";
}
