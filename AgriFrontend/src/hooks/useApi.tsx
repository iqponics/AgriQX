import { useState, useCallback } from "react";
import { API_BASE_URL } from "../config/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiOptions<T> {
  body?: T;
  headers?: HeadersInit;
}

export const useApi = (
  baseUrl: string = `${API_BASE_URL}/api`
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async <T = unknown, R = unknown>(
      endpoint: string,
      method: HttpMethod = "GET",
      options?: ApiOptions<T>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const url = `${baseUrl}${endpoint}`;
        const token = localStorage.getItem("authToken");

        const isFormData = options?.body instanceof FormData;
        const headers: HeadersInit = {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options?.headers || {}),
        };

        const config: RequestInit = {
          method,
          headers,
          credentials: "include",
        };

        if (options?.body) {
          config.body = isFormData ? options.body as unknown as BodyInit : JSON.stringify(options.body);
        }


        // Debugging logs
        console.log("API Request:", { url, method, headers, body: config.body });

        const response = await fetch(url, config);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", { status: response.status, statusText: response.statusText, body: errorText });
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const contentType = response.headers.get("content-type");
        const result = contentType?.includes("application/json")
          ? await response.json()
          : await response.text();

        setData(result);
        return result as R;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [baseUrl]
  );

  return { data, loading, error, fetchData };
};
