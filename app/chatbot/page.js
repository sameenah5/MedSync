"use client";

import HealthChatbot from "@/components/HealthChatbot";
import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default function ChatbotPage() {
  return (
    <div className="flex flex-col items-center pt-20 md:pt-20 h-screen bg-background px-4">

      {/* Back Button */}
      <Link
        href="/"
        className="absolute left-4 top-4 md:top-20 text-sm text-emerald-500 hover:underline z-10"
      >
        ← Back to Home
      </Link>

      {/* Logo + Title */}
      <div className="flex items-center gap-3 mb-2 mt-4 md:mt-0">
        <HeartPulse className="h-8 w-8 text-emerald-500" />
        <h1 className="text-xl font-semibold tracking-tight text-center">
          MedSync AI Assistant
        </h1>
      </div>

      {/* Medical Disclaimer */}
      <p className="text-xs text-yellow-400 mb-3 text-center max-w-xl px-2">
        ⚠️ This AI provides general health information and is not a substitute for professional medical diagnosis or treatment.
      </p>

      {/* Chatbot */}
      <div className="w-full max-w-4xl flex-1 md:h-[75vh] h-[calc(100vh-10rem)]">
        <HealthChatbot />
      </div>

    </div>
  );
}