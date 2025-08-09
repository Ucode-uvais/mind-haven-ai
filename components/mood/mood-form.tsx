"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/contexts/session-context";
import { trackMood } from "@/lib/api/mood";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MoodFormProps {
  onSuccess?: (score: number) => void;
}

export const MoodForm = ({ onSuccess }: MoodFormProps) => {
  const [moodScore, setMoodScore] = useState(50);
  const [note, setNote] = useState("");
  const [context, setContext] = useState("");
  const [activities, setActivities] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, loading } = useSession();
  const router = useRouter();

  const emotions = [
    { value: 0, label: "😔", description: "Very Low" },
    { value: 25, label: "😕", description: "Low" },
    { value: 50, label: "😊", description: "Neutral" },
    { value: 75, label: "😃", description: "Good" },
    { value: 100, label: "🤗", description: "Great" },
  ];

  const currentEmotion =
    emotions.find((em) => Math.abs(moodScore - em.value) < 15) || emotions[2];

  const handleSubmit = async () => {
    console.log("MoodForm: Starting submission");
    if (!isAuthenticated) {
      toast.error("Authentication required", {
        description: "Please log in to track your mood",
      });
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      await trackMood({
        score: moodScore,
        note,
        context,
        activities: activities ? [activities] : [],
      });

      toast.success("Mood tracked successfully!", {
        description: "Your mood has been recorded.",
      });

      // Pass the mood score to the success callback
      onSuccess?.(moodScore); // This is the key change
    } catch (error) {
      console.error("MoodForm: Error:", error);
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to track mood",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="text-center space-y-2">
        <div className="text-4xl">{currentEmotion.label}</div>
        <div className="text-sm text-muted-foreground">
          {currentEmotion.description}
        </div>
      </div>

      <Slider
        value={[moodScore]}
        onValueChange={(value) => setMoodScore(value[0])}
        min={0}
        max={100}
        step={1}
      />

      {/* New Input Fields */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="note">Note (optional)</Label>
          <Input
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="How are you feeling?"
          />
        </div>
        <div>
          <Label htmlFor="context">Context (optional)</Label>
          <Input
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="What's going on right now?"
          />
        </div>
        <div>
          <Label htmlFor="activities">Activities (optional)</Label>
          <Input
            id="activities"
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
            placeholder="What have you been doing?"
          />
        </div>
      </div>

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={isLoading || loading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : loading ? (
          "Loading..."
        ) : (
          "Save Mood"
        )}
      </Button>
    </div>
  );
};
