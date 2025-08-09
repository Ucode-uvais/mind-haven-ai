export interface Activity {
  _id: string;
  userId: string;
  type: string;
  name: string;
  description?: string;
  timestamp: Date;
  duration?: number;
  difficulty?: string;
  completed: boolean;
  moodScore?: number;
  moodNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ActivityEntry {
  type: string;
  name: string;
  description?: string;
  duration?: number;
  difficulty?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export async function logActivity(data: ActivityEntry): Promise<Activity> {
  const response = await fetch("/api/activity", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to log activity");
  }

  return response.json();
}

export async function getAllActivities(): Promise<Activity[]> {
  const response = await fetch("/api/activity", {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch activities");
  }
  return response.json();
}

export async function getTodaysActivities(): Promise<Activity[]> {
  const response = await fetch("/api/activity/today", {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch today's activities");
  }
  return response.json();
}
