'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function Header() {
  const { language, toggleLanguage } = useLanguage();
  return (
    <header className="h-20 w-full flex items-center justify-between px-4 md:px-8 bg-transparent">
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger>
            <div className="p-2 -ml-2 rounded-md hover:bg-slate-100 cursor-pointer transition-colors">
              <Menu className="w-6 h-6 text-slate-700" />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[260px] border-none bg-[#E0EFFF]">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Language Switch */}
        <div 
          onClick={toggleLanguage}
          className="flex items-center bg-slate-100 border border-slate-200/50 rounded-full p-1 cursor-pointer w-[92px] h-[34px] relative hover:bg-slate-200/60 transition-all duration-300 select-none shadow-inner"
        >
          {/* Slide Indicator */}
          <div 
            className={cn(
              "absolute top-[2px] bottom-[2px] w-[42px] bg-white rounded-full shadow-sm border border-slate-100 transition-transform duration-300 ease-out",
              language === 'en' ? "translate-x-[44px]" : "translate-x-[2px]"
            )}
          />
          {/* FR / EN Labels */}
          <div className="absolute inset-0 flex justify-between px-3 items-center font-bold text-xs">
            <span className={cn("transition-colors duration-300 z-10", language === 'fr' ? "text-[#1062FE]" : "text-slate-400")}>FR</span>
            <span className={cn("transition-colors duration-300 z-10", language === 'en' ? "text-[#1062FE]" : "text-slate-400")}>EN</span>
          </div>
        </div>
        
        <div className="h-8 w-px bg-slate-200 hidden sm:block" />
        
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-700">Oumar Fall</p>
            <p className="text-xs text-slate-500">Premium</p>
          </div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@oumar" />
            <AvatarFallback>OF</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
