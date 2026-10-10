const API_BASE_URL =
  "https://task-management-api-pearl-theta.vercel.app/api";

async function taskRequest(endpoint, token, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export async function getTasks(token) {
  return taskRequest("/tasks?page=1&limit=100", token);
}

export async function createTask(token, taskData) {
  return taskRequest("/tasks", token, {
    method: "POST",
    body: JSON.stringify(taskData),
  });
}

export async function updateTask(token, taskId, updates) {
  return taskRequest(`/tasks/${taskId}`, token, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function deleteTask(token, taskId) {
  return taskRequest(`/tasks/${taskId}`, token, {
    method: "DELETE",
  });
}