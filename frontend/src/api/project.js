const API_BASE_URL =
  "https://task-management-api-pearl-theta.vercel.app/api";

async function projectRequest(endpoint, token, options = {}) {
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

export async function getProjects(token) {
  return projectRequest("/projects", token);
}

export async function createProject(token, projectData) {
  return projectRequest("/projects", token, {
    method: "POST",
    body: JSON.stringify(projectData),
  });
}

export async function getProjectById(token, projectId) {
  return projectRequest(`/projects/${projectId}`, token);
};

export async function updateProject(token, projectId, projectData) {
  return projectRequest(`/projects/${projectId}`, token, {
    method: "PATCH",
    body: JSON.stringify(projectData),
  });
}

export async function deleteProject(token, projectId) {
  return projectRequest(`/projects/${projectId}`, token, {
    method: "DELETE",
  });
}
