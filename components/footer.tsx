import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t py-6">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-2 text-center md:flex-row md:text-left">
          <Link href="/" className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-semibold">Mind Haven 2.0</span>
          </Link>
          <span className="hidden md:inline-block">|</span>
          <p className="text-sm text-muted-foreground">
            © 2025 All rights reserved.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Created by{" "}
          <a
            href="https://seyyeduvais.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
          >
            Uvais
          </a>
          .
        </p>
      </div>
    </footer>
  );
};
