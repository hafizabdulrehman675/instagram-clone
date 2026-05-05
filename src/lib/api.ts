const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      json?.message || json?.error?.message || "Request failed";
    throw new ApiError(message, response.status);
  }

  return json as T;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      ...(options.headers || {}),
    },
  });

  return parseResponse<T>(response);
}

export { API_BASE_URL };

