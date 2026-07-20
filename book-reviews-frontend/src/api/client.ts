const API_URL =
  "https://book-reviews-platform-v2.onrender.com/api";

interface ApiErrorResponse {
  message?: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const response = await fetch(
    `${API_URL}${normalizedEndpoint}`,
    {
      ...options,
      headers,
    }
  );

  const contentType =
    response.headers.get("content-type");

  let data: T | ApiErrorResponse;

  if (
    contentType?.includes("application/json")
  ) {
    data = await response.json();
  } else {
    const responseText = await response.text();

    throw new Error(
      responseText
        ? "The server returned an invalid response."
        : "The server did not return a response."
    );
  }

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;

    throw new Error(
      errorData.message ||
        `Request failed with status ${response.status}.`
    );
  }

  return data as T;
}