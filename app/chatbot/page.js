"use client";

import HealthChatbot from "@/components/HealthChatbot";
import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default function ChatbotPage() {

  return (

    <div className="flex flex-col items-center pt-20 h-screen bg-background">

      {/* Back Button */}
      <Link
        href="/"
        className="absolute left-6 top-19 text-sm text-emerald-500 hover:underline"
      >
        ← Back to Home
      </Link>


      {/* Logo + Title */}
      <div className="flex items-center gap-3 mb-2">

        <HeartPulse className="h-8 w-8 text-emerald-500" />

        <h1 className="text-xl font-semibold tracking-tight">
          MedSync AI Assistant
        </h1>

      </div>


      {/* Medical Disclaimer */}
      <p className="text-xs text-yellow-400 mb-3 text-center max-w-xl">
        ⚠️ This AI provides general health information and is not a substitute for professional medical diagnosis or treatment.
      </p>


      {/* Chatbot */}
      <div className="w-full max-w-4xl h-[75vh]">
        <HealthChatbot />
      </div>

    </div>

  );

}