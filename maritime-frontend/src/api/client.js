const API = process.env.REACT_APP_API_URL || "http://localhost:3000";

export async function apiCall(endpoint, method = "GET", body = null) {
  const response = await fetch(`${API}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
    body: body ? JSON.stringify(body) : null,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const apiUrl = (endpoint) => `${API}${endpoint}`;
