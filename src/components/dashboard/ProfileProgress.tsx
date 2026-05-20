import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Edit, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function ProfileProgress({ percentage = 70 }: { percentage?: number }) {
  const { t } = useLanguage();
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = percentage;
    if (end === 0) return;

    const totalDuration = 1000; // 1 second animation
    const stepTime = Math.max(Math.floor(totalDuration / end), 12);
    
    const timer = setInterval(() => {
      start += 1;
      setAnimatedPercent(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [percentage]);
  
  const steps = [
    { name: t('stepDetails'), completed: true },
    { name: t('stepAcademic'), completed: true },
    { name: t('stepExperience'), completed: true },
    { name: t('stepSkills'), completed: false },
    { name: t('stepCareer'), completed: true },
  ];

  const radius = 64;
  const stroke = 10;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedPercent / 100) * circumference;

  return (
    <Card className="shadow-sm border border-slate-100 rounded-[1.5rem] h-full flex flex-col bg-white">
      <CardHeader className="pb-4 pt-6 px-6">
        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100/60 rounded-xl p-3.5 flex items-center justify-center shadow-sm hover:shadow hover:scale-[1.02] hover:border-blue-200 transition-all duration-300 group cursor-pointer select-none">
          <CardTitle className="text-sm font-bold text-slate-800 tracking-wide text-center flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            {t('progressTitle')}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1 pb-6 px-6">
        <div className="flex justify-center mb-8 relative">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90"
          >
            <circle
              stroke="#F1F5F9"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke="#1062FE"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-300 ease-out"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{t('progressCompleted')}</span>
            <span className="text-3xl font-bold text-slate-800 mt-0.5">{animatedPercent}%</span>
          </div>
        </div>

        <div className="space-y-4 flex-1 mb-8 px-2">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center text-sm font-medium">
              {step.completed ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center mr-4 flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mr-4 flex-shrink-0">
                  <X className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
              )}
              <span className="text-slate-800 text-[15px]">{step.name}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 mt-auto">
          <button className="flex-1 bg-[#1062FE] hover:bg-blue-700 text-white rounded-full py-2 px-4 text-xs font-semibold transition-colors flex items-center justify-center">
            <Eye className="w-3.5 h-3.5 mr-2" />
            {t('viewProfile')}
          </button>
          <button className="flex-1 bg-white border border-[#1062FE] text-[#1062FE] hover:bg-blue-50 rounded-full py-2 px-4 text-xs font-semibold transition-colors flex items-center justify-center">
            <Edit className="w-3.5 h-3.5 mr-2" />
            {t('editProfile')}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
