'use client';

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface EditorStepperProps {
  currentStep: number;
  totalSteps: number;
  titles: string[];
}

export function EditorStepper({ currentStep, totalSteps, titles }: EditorStepperProps) {
  return (
    <div className="w-full flex items-center justify-between relative px-2 py-4">
      <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-slate-100 -z-10 -translate-y-1/2 rounded-full" />
      <div 
        className="absolute top-1/2 left-4 h-[2px] bg-[#1062FE] -z-10 -translate-y-1/2 rounded-full transition-all duration-500 ease-out" 
        style={{ width: `calc(${(currentStep / (totalSteps - 1)) * 100}% - 2rem)` }}
      />
      
      {titles.map((title, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <div key={index} className="flex flex-col items-center relative">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-sm",
                isActive ? "bg-[#1062FE] text-white scale-110 shadow-blue-200" :
                isCompleted ? "bg-[#1062FE] text-white" : "bg-white text-slate-400 border border-slate-200"
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            {/* Titre de l'étape affiché uniquement pour l'étape active */}
            <span className={cn(
              "absolute -bottom-6 text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-300",
              isActive ? "text-[#1062FE] opacity-100 translate-y-0" : "text-transparent opacity-0 translate-y-2 pointer-events-none"
            )}>
              {title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
