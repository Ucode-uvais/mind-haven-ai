"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Heart, Target, Sparkles } from "lucide-react";

const missions = [
  {
    icon: <Heart className="w-8 h-8 text-primary" />,
    title: "Our Mission",
    description:
      "To democratize access to mental health support through ethical AI and blockchain technology, making high-quality, compassionate care available to everyone, everywhere, at any time.",
  },
  {
    icon: <Target className="w-8 h-8 text-primary" />,
    title: "Our Vision",
    description:
      "A world where mental health support is accessible, deeply personalized, and completely private—powered by trusted AI therapists and secured through transparent blockchain systems.",
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: "Our Values",
    description:
      "Privacy, Innovation, Empathy, and Trust form the cornerstone of our platform, ensuring the highest standards of care and security.",
  },
];

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-24">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-20"
      >
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          About MindHaven2.0
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          &quot;We&apos;re reimagining mental health support—blending the
          compassion of therapy with the power of cutting-edge AI and the
          security of blockchain. At Mind Haven, we commit to creating a
          sanctuary where users feel seen, heard, and supported—anytime,
          anywhere.&quot;
        </p>
      </motion.div>

      {/* Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {missions.map((mission, index) => (
          <motion.div
            key={mission.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6 text-center h-full bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="mb-4 flex justify-center">{mission.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{mission.title}</h3>
              <p className="text-muted-foreground">{mission.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default AboutPage;
