"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useCallback, RefAttributes } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  SmilePlus,
  ActivityIcon,
  Sun,
  Moon,
  Heart,
  Trophy,
  Bell,
  ClockFading,
  MessageSquare,
  CircleCheckBig,
  ArrowRight,
  Loader2,
  HeartCrack,
  Lightbulb,
  Frown,
  Meh,
  Smile,
  Sparkles,
  LucideProps,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import {
  format,
  addDays,
  subDays,
  startOfDay,
  isWithinInterval,
} from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnxietyGames } from "@/components/games/anxiety-game";
import { MeditationPlaylists } from "@/components/playlists/meditation-playlists";
import { FloatingMusicPlayer } from "@/components/playlists/floating-music-player";
import { MoodForm } from "@/components/mood/mood-form";
import { ActivityLogger } from "@/components/activities/activity-logger";
import { useSession } from "@/lib/contexts/session-context";
import { Activity, getAllActivities, logActivity } from "@/lib/api/activity";
import { ScrollArea } from "@/components/ui/scroll-area";
import { bandInsight, MoodBand, scoreToBand } from "@/lib/mood-insights";
import { ForwardRefExoticComponent } from "react";

// Define a consistent type for all insight objects
type Insight = {
  title: string;
  description: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  priority: "low" | "medium" | "high";
  moodBand?: MoodBand; // Add moodBand
  moodScore?: number; // Add moodScore
};

const moodGradientMap: Record<MoodBand, string> = {
  "Very Low":
    "bg-gradient-to-br from-purple-900/20 via-rose-900/20 to-transparent border-rose-900/30",
  Low: "bg-gradient-to-br from-indigo-900/20 via-violet-900/20 to-transparent border-violet-900/30",
  Neutral:
    "bg-gradient-to-br from-amber-900/20 via-yellow-900/20 to-transparent border-yellow-900/30",
  Good: "bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-transparent border-teal-900/30",
  Great:
    "bg-gradient-to-br from-sky-900/20 via-cyan-900/20 to-transparent border-cyan-900/30",
};

const moodGradientMapLight: Record<MoodBand, string> = {
  "Very Low":
    "bg-gradient-to-br from-rose-50/70 via-rose-100/50 to-transparent border-rose-200/60",
  Low: "bg-gradient-to-br from-violet-50/70 via-violet-100/50 to-transparent border-violet-200/60",
  Neutral:
    "bg-gradient-to-br from-amber-50/70 via-amber-100/50 to-transparent border-amber-200/60",
  Good: "bg-gradient-to-br from-teal-50/70 via-teal-100/50 to-transparent border-teal-200/60",
  Great:
    "bg-gradient-to-br from-cyan-50/70 via-cyan-100/50 to-transparent border-cyan-200/60",
};

const moodTextColorMap: Record<MoodBand, string> = {
  "Very Low": "text-rose-400",
  Low: "text-violet-400",
  Neutral: "text-amber-400",
  Good: "text-teal-400",
  Great: "text-cyan-400",
};

const moodTextColorMapLight: Record<MoodBand, string> = {
  "Very Low": "text-rose-700",
  Low: "text-violet-700",
  Neutral: "text-amber-700",
  Good: "text-teal-700",
  Great: "text-cyan-700",
};
interface DailyStats {
  moodScore: number | null;
  completionRate: number;
  mindfulnessCount: number;
  totalActivities: number;
  lastUpdated: Date;
}

const calculateDailyStats = (activities: Activity[]): DailyStats => {
  const today = startOfDay(new Date());
  const todaysActivities = activities.filter((activity) =>
    isWithinInterval(new Date(activity.timestamp), {
      start: today,
      end: addDays(today, 1),
    })
  );

  const moodEntries = todaysActivities.filter(
    (a) => a.type === "mood" && typeof a.moodScore === "number"
  );
  const averageMood =
    moodEntries.length > 0
      ? Math.round(
          moodEntries.reduce((acc, curr) => acc + (curr.moodScore || 0), 0) /
            moodEntries.length
        )
      : null;

  const therapySessions = activities.filter((a) => a.type === "therapy").length;

  return {
    moodScore: averageMood,
    completionRate: 100,
    mindfulnessCount: therapySessions,
    totalActivities: todaysActivities.length,
    lastUpdated: new Date(),
  };
};

const generateActivityInsights = (activities: Activity[]): Insight[] => {
  const insights: Insight[] = [];
  const lastWeek = subDays(new Date(), 7);
  const recentActivities = activities.filter(
    (a) => new Date(a.timestamp) >= lastWeek
  );

  const mindfulnessActivities = recentActivities.filter((a) =>
    ["game", "meditation", "breathing"].includes(a.type)
  );
  if (mindfulnessActivities.length > 1) {
    insights.push({
      title: "Consistent Practice",
      description: `You've been regularly engaging in mindfulness activities. This can help reduce stress and improve focus.`,
      icon: Trophy,
      priority: "medium",
    });
  }

  const morningActivities = recentActivities.filter(
    (a) => new Date(a.timestamp).getHours() < 12
  );
  const eveningActivities = recentActivities.filter(
    (a) => new Date(a.timestamp).getHours() >= 18
  );

  if (
    morningActivities.length > 0 &&
    morningActivities.length > eveningActivities.length
  ) {
    insights.push({
      title: "Morning Person",
      description:
        "You're most active in the mornings. Consider scheduling important tasks during your peak hours.",
      icon: Sun,
      priority: "medium",
    });
  } else if (
    eveningActivities.length > 0 &&
    eveningActivities.length > morningActivities.length
  ) {
    insights.push({
      title: "Evening Routine",
      description:
        "You tend to be more active in the evenings. Make sure to wind down before bedtime.",
      icon: Moon,
      priority: "medium",
    });
  }

  return insights;
};

const DashboardPage = () => {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();
  const { user } = useSession();

  const [insights, setInsights] = useState<Insight[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showActivityLogger, setShowActivityLogger] = useState(false);
  const [isUpdatingStats, setIsUpdatingStats] = useState(false);
  const [latestMood, setLatestMood] = useState<number | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    moodScore: null,
    completionRate: 100,
    mindfulnessCount: 0,
    totalActivities: 0,
    lastUpdated: new Date(),
  });

  const loadActivities = useCallback(async () => {
    try {
      const userActivities = await getAllActivities();
      setActivities(userActivities);
    } catch (error) {
      console.error("Error loading activities:", error);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      // Use the latestMood state if available, otherwise find in activities
      let moodValue = latestMood;
      if (moodValue === null) {
        const moodEntry = [...activities]
          .reverse()
          .find(
            (act) => act.type === "mood" && typeof act.moodScore === "number"
          );
        moodValue = moodEntry?.moodScore ?? null;
      }

      const moodInsightInfo =
        moodValue !== null ? bandInsight(scoreToBand(moodValue)) : null;

      const activityInsights = generateActivityInsights(activities);

      const combinedInsights: Insight[] = [];
      if (moodInsightInfo && moodValue !== null) {
        const iconMap = {
          "😔": HeartCrack,
          "😟": Frown,
          "😐": Meh,
          "🙂": Smile,
          "😄": Sparkles,
        };
        const priorityMap = {
          "Very Low": "high",
          Low: "high",
          Neutral: "medium",
          Good: "low",
          Great: "low",
        } as const;

        combinedInsights.push({
          title: moodInsightInfo.title,
          description: `${moodInsightInfo.description} ${moodInsightInfo.recommendation}`,
          moodBand: scoreToBand(moodValue),
          moodScore: moodValue,
          icon:
            iconMap[moodInsightInfo.emoji as keyof typeof iconMap] || Lightbulb,
          priority: priorityMap[scoreToBand(moodValue)],
        });
      } else {
        combinedInsights.push({
          title: "Log Your Mood",
          description:
            "Check in with how you're feeling to receive personalized insights for your day.",
          icon: Lightbulb,
          priority: "high",
        });
      }

      setInsights(
        [...combinedInsights, ...activityInsights].sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        })
      );

      setDailyStats(calculateDailyStats(activities));
      setIsUpdatingStats(true);
      const timer = setTimeout(() => setIsUpdatingStats(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [activities, mounted, latestMood]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const wellnessStats = [
    {
      title: "Mood Score",
      value: dailyStats.moodScore ? `${dailyStats.moodScore}%` : "No data",
      icon: SmilePlus,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      description: "Today's average mood",
    },
    {
      title: "Completion Rate",
      value: `${dailyStats.completionRate}%`,
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      description: "Perfect completion rate",
    },
    {
      title: "Therapy Sessions",
      value: `${dailyStats.mindfulnessCount} sessions`,
      icon: Heart,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      description: "Total sessions completed",
    },
    {
      title: "Total Activities",
      value: dailyStats.totalActivities.toString(),
      icon: ActivityIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      description: "Planned for today",
    },
  ];

  const handleStartTherapy = () => {
    router.push("/therapy/new");
  };

  const handleAICheckIn = () => {
    setShowActivityLogger(true);
  };

  const handleGamePlayed = useCallback(
    async (gameName: string, description: string) => {
      try {
        await logActivity({
          type: "game",
          name: gameName,
          description: description,
          duration: 0,
          difficulty: "easy",
        });
        await loadActivities();
      } catch (error) {
        console.error("Error logging game activity:", error);
      }
    },
    [loadActivities]
  );

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Container className="pt-20 pb-8 space-y-6">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.name || "there"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-primary/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent" />
              <CardContent className="p-5 relative">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ClockFading className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Quick Actions</h3>
                      <p className="text-sm text-muted-foreground">
                        Start your wellness journey
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <Button
                      variant="default"
                      className={cn(
                        "w-full justify-between items-center p-6 h-auto group/button",
                        "bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90",
                        "transition-all duration-200 group-hover:translate-y-[-2px]"
                      )}
                      onClick={() => handleStartTherapy()}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-white">
                            Start Therapy
                          </div>
                          <div className="text-xs text-white/80">
                            Begin a new session
                          </div>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover/button:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className={cn(
                          "flex flex-col h-[120px] px-4 py-3 group/mood hover:border-primary/50",
                          "justify-center items-center text-center",
                          "transition-all duration-200 group-hover:translate-y-[-2px]"
                        )}
                        onClick={() => setShowMoodModal(true)}
                      >
                        <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center mb-2">
                          <Heart className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            Monitor Mood
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            How are you feeling?
                          </div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className={cn(
                          "flex flex-col h-[120px] px-4 py-3 group/ai hover:border-primary/50",
                          "justify-center items-center text-center",
                          "transition-all duration-200 group-hover:translate-y-[-2px]"
                        )}
                        onClick={() => handleAICheckIn()}
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                          <CircleCheckBig className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Check-in</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Quick wellness check
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Today's Overview</CardTitle>
                    <CardDescription>
                      Your wellness metrics for{" "}
                      {format(new Date(), "MMMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <div className="h-8 w-8 flex items-center justify-center">
                    {isUpdatingStats && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3">
                  {wellnessStats.map((stat) => (
                    <div
                      key={stat.title}
                      className={cn(
                        "p-3 rounded-lg transition-all duration-200 hover:scale-[1.02]",
                        stat.bgColor
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <stat.icon className={cn("w-5 h-5", stat.color)} />
                        <p className="text-sm font-medium">{stat.title}</p>
                      </div>
                      <p className="text-xl font-bold mt-1">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-muted-foreground text-right">
                  Last updated: {format(dailyStats.lastUpdated, "h:mm a")}
                </div>
              </CardContent>
            </Card>

            <Card
              className="border-primary/10 flex flex-col 
                         
                         dark:bg-gradient-to-br dark:from-slate-900/50 dark:to-slate-800/30 dark:backdrop-blur-sm
                         shadow-sm dark:shadow-none"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-slate-200">
                  <Lightbulb className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                  Personalized Insights
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-slate-400">
                  Recommendations based on your mood and activity patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="h-[300px] w-full">
                  <div className="space-y-4 p-4">
                    {insights.length > 0 ? (
                      insights.map((insight, index) => (
                        <div
                          key={index}
                          className={cn(
                            "p-5 rounded-xl space-y-3 transition-all hover:scale-[1.01] border",
                            insight.moodBand
                              ? `${
                                  moodGradientMapLight[insight.moodBand]
                                } dark:${
                                  moodGradientMap[insight.moodBand]
                                } hover:shadow-lg border-amber-200/50 dark:border-transparent`
                              : "bg-gradient-to-br from-white to-amber-50/70 dark:from-slate-800/30 dark:to-slate-900/40 border-amber-200/50 dark:border-slate-700/50"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-amber-100/50 dark:bg-slate-700/50 backdrop-blur-sm">
                              <insight.icon
                                className={cn(
                                  "w-6 h-6",
                                  insight.moodBand
                                    ? moodTextColorMapLight[insight.moodBand] +
                                        " dark:" +
                                        moodTextColorMap[insight.moodBand]
                                    : " dark:text-slate-300"
                                )}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="font-bold text-gray-900 dark:text-slate-200">
                                  {insight.title}
                                </h3>

                                {insight.moodBand && insight.moodScore && (
                                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-100/50 dark:bg-slate-700/50 text-gray-700 dark:text-slate-300">
                                    {insight.moodScore}%
                                  </span>
                                )}
                              </div>

                              {/* Mood band display */}
                              {insight.moodBand && (
                                <div className="flex items-center gap-2 mt-1">
                                  <span
                                    className={cn(
                                      "font-bold text-lg tracking-wide",
                                      moodTextColorMapLight[insight.moodBand],
                                      "dark:" +
                                        moodTextColorMap[insight.moodBand]
                                    )}
                                  >
                                    {insight.moodBand}
                                  </span>
                                </div>
                              )}

                              <p className="mt-2 text-gray-700 dark:text-slate-300 text-sm">
                                {insight.description}
                              </p>

                              {/* Recommendation section */}
                              {insight.moodBand && (
                                <div className="mt-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                                      Recommendation
                                    </p>
                                  </div>
                                  <div className="p-3 rounded-lg bg-amber-100/30 dark:bg-slate-800/50 border border-amber-200/50 dark:border-slate-700/50">
                                    <p className="text-sm text-gray-800 dark:text-slate-200">
                                      {
                                        bandInsight(insight.moodBand)
                                          .recommendation
                                      }
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 dark:text-slate-400 py-8 h-full flex flex-col items-center justify-center">
                        <ActivityIcon className="w-10 h-10 mx-auto mb-3 text-amber-300 dark:text-slate-500" />
                        <p className="text-gray-600 dark:text-slate-300">
                          Log your mood or activities to receive personalized
                          insights
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-4 border-t border-amber-200/50 dark:border-slate-700/30">
                <p className="text-xs text-gray-500 dark:text-slate-500">
                  Insights update in real-time based on your activities
                </p>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <AnxietyGames onGamePlayed={handleGamePlayed} />
            </div>
            <div className="lg:col-span-3 space-y-6">
              <MeditationPlaylists />
            </div>
          </div>
        </div>
      </Container>

      <Dialog open={showMoodModal} onOpenChange={setShowMoodModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>How are you feeling?</DialogTitle>
            <DialogDescription>
              Move the slider to track your current mood
            </DialogDescription>
          </DialogHeader>
          <MoodForm
            onSuccess={(moodScore) => {
              setShowMoodModal(false);
              setLatestMood(moodScore); // Store the latest mood score
              loadActivities();
            }}
          />
        </DialogContent>
      </Dialog>

      <ActivityLogger
        open={showActivityLogger}
        onOpenChange={setShowActivityLogger}
        onActivityLogged={loadActivities}
      />
      <FloatingMusicPlayer />
    </div>
  );
};

export default DashboardPage;
