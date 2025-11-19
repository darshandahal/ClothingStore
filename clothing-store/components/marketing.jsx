"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/background.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-end">
        <div className="container mx-auto px-6 lg:px-12 flex justify-end">
          <div className="max-w-3xl text-right">
            {/* Heading (One Line) */}
            <h1
              className="mb-8 text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight break-words"
              style={{
                textShadow: "4px 4px 8px rgba(0, 0, 0, 0.8)",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              <span className="inline">Welcome to </span>
              <span
                className="inline bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent"
                style={{
                  textShadow: "4px 4px 8px rgba(0, 0, 0, 0.8)",
                }}
              >
                Babita's Clothing 
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="mb-10 text-lg md:text-xl lg:text-2xl text-white leading-relaxed max-w-2xl ml-auto"
              style={{
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)",
              }}
            >
              बबिता क्लोथिङ स्टोर ट्रेंडी, सस्तो, र उच्च-गुणस्तरको फेसनका लागि तपाईँको एक-स्थान गन्तव्य हो। हामी तपाईँका लागि पुरुष, महिला, र बालबालिकाका लागि नवीनतम शैलीहरू ल्याउँछौँ — ती सबै माया र विस्तृत ध्यानका साथ बनाइएका छन्।
            </p>

            {/* Get Started Button */}
            <Link href="/login">
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/50 ml-auto"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}