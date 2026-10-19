const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("playscope_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, signal } = options;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Auth ───
export const auth = {
  login: (email: string, password: string) =>
    request<{ access_token: string; token_type: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  register: (email: string, password: string, name: string) =>
    request<{ id: string; email: string }>("/auth/register", {
      method: "POST",
      body: { email, password, name },
    }),

  setToken: (token: string) => {
    if (typeof window !== "undefined") localStorage.setItem("playscope_token", token);
  },

  clearToken: () => {
    if (typeof window !== "undefined") localStorage.removeItem("playscope_token");
  },
};

// ─── Videos ───
export const videos = {
  upload: async (
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<{ job_id: string }> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE}/videos/upload`);

      const token = typeof window !== "undefined" ? localStorage.getItem("playscope_token") : null;
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Upload failed"));

      const formData = new FormData();
      formData.append("file", file);
      xhr.send(formData);
    });
  },

  getJobStatus: (jobId: string) =>
    request<{ job_id: string; status: string; progress: number }>(`/videos/jobs/${jobId}/status`),

  getResults: (jobId: string) =>
    request<Record<string, unknown>>(`/videos/jobs/${jobId}/results`),
};

// ─── Matches ───
export const matches = {
  list: () => request<Record<string, unknown>[]>("/matches"),
  get: (matchId: string) => request<Record<string, unknown>>(`/matches/${matchId}`),
};

export const api = { auth, videos, matches };
export default api;
