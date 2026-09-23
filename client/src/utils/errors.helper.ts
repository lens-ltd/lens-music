const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";
const NETWORK_ERROR_MESSAGE =
  "We couldn't reach the server. Check your connection and try again.";

// GET API ERROR MESSAGE
// Reads the message out of an RTK Query error (`{ status, data }`), a network
// failure (`{ status: 'FETCH_ERROR', error }`) or a thrown Error.
export const getApiErrorMessage = (
  error: unknown,
  fallback: string = DEFAULT_ERROR_MESSAGE,
): string => {
  if (typeof error === "string") return error || fallback;
  if (!error || typeof error !== "object") return fallback;

  const { status, data } = error as { status?: unknown; data?: unknown };

  if (status === "FETCH_ERROR" || status === "TIMEOUT_ERROR") {
    return NETWORK_ERROR_MESSAGE;
  }

  if (typeof data === "string" && data.trim()) return data;
  if (data && typeof data === "object") {
    const { message } = data as { message?: unknown };
    if (typeof message === "string" && message.trim()) return message;
    if (Array.isArray(message)) {
      const messages = message.filter(
        (item): item is string => typeof item === "string" && Boolean(item),
      );
      if (messages.length > 0) return messages.join(", ");
    }
  }

  if (error instanceof Error && error.message) return error.message;

  return fallback;
};
