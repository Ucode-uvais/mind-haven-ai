interface MoodEntry {
  score: number;
  note?: string;
  context?: string;
  activities?: string[];
}

interface MoodStats {
  average: number;
  count: number;
  highest: number;
  lowest: number;
  history: Array<{
    _id: string;
    score: number;
    note?: string;
    timestamp: string;
  }>;
}

export async function trackMood(
  data: MoodEntry
): Promise<{ success: boolean; data: any }> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch("/api/mood", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to track mood");
  }

  const result = await response.json();

  // Cache today's mood snapshot for fast, local rendering
  try {
    const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const snapshot = {
      date: todayKey,
      score: data.score,
      note: data.note || "",
      context: data.context || "",
      activities: data.activities || [],
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("lastMood", JSON.stringify(snapshot));
    // Notify listeners (e.g., Dashboard) that mood changed
    window.dispatchEvent(new CustomEvent("mood:updated", { detail: snapshot }));
  } catch {
    /* ignore localStorage issues */
  }

  return result;

  return response.json();
}

export async function getMoodHistory(params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<{ success: boolean; data: any[] }> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  if (params?.endDate) queryParams.append("endDate", params.endDate);
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const response = await fetch(`/api/mood/history?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch mood history");
  }

  return response.json();
}

export async function getMoodStats(
  period: "week" | "month" | "year" = "week"
): Promise<{
  success: boolean;
  data: MoodStats;
}> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`/api/mood/stats?period=${period}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch mood statistics");
  }

  return response.json();
}
