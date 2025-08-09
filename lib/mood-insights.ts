export type MoodBand = "Very Low" | "Low" | "Neutral" | "Good" | "Great";

export function scoreToBand(score: number): MoodBand {
  if (score <= 12) return "Very Low";
  if (score <= 37) return "Low";
  if (score <= 62) return "Neutral";
  if (score <= 87) return "Good";
  return "Great";
}

export function bandInsight(band: MoodBand): {
  title: string;
  description: string;
  recommendation: string;
  emoji: string;
} {
  switch (band) {
    case "Very Low":
      return {
        title: "Mood Insight: Very Low",
        description:
          "You're running on an emotional low battery. Even small tasks may feel draining.",
        recommendation:
          "Prioritize rest and self-compassion today. Keep to essential activities only. Avoid overwhelming decisions. Try 5–10 minutes of guided meditation or a slow walk.",
        emoji: "😔",
      };
    case "Low":
      return {
        title: "Mood Insight: Low",
        description:
          "Energy and motivation are below average, but you still have some capacity.",
        recommendation:
          "Choose one small, achievable goal and complete it. Celebrate that win. Use uplifting music or light movement. Avoid overloading your schedule.",
        emoji: "😟",
      };
    case "Neutral":
      return {
        title: "Mood Insight: Neutral",
        description:
          "You're emotionally steady—not highly motivated or drained. A balanced point.",
        recommendation:
          "Lean into productive focus: tackle a moderate task you've been putting off. Use short breaks. Add light social interaction to keep balance.",
        emoji: "😐",
      };
    case "Good":
      return {
        title: "Mood Insight: Good",
        description: "You're in a positive frame of mind, open to challenges.",
        recommendation:
          "Use this momentum for harder or creative projects. Connect with friends/colleagues to share the energy. Consider a workout or learn something new today.",
        emoji: "🙂",
      };
    case "Great":
      return {
        title: "Mood Insight: Great",
        description:
          "High motivation and optimism make this a prime day for growth.",
        recommendation:
          "Aim for big-picture progress—deep work, strategic planning, or personal milestones. Channel energy into helping others or something adventurous. End with gratitude.",
        emoji: "😄",
      };
  }
}
