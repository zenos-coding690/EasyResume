import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  title: string;
  count?: number;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  iconClassName?: string;
}

export function ActionCard({ title, count, icon, onClick, className, iconClassName }: ActionCardProps) {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 rounded-2xl flex items-center px-2 py-4 h-20 cursor-pointer overflow-hidden select-none",
        className
      )}
    >
      <CardContent className="p-0 flex items-center space-x-2 w-full min-w-0">
        <div className={cn("w-8 h-8 rounded-xl flex flex-shrink-0 items-center justify-center bg-[#E0EFFF] text-[#1062FE] transition-colors", iconClassName)}>
          {icon}
        </div>
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <h3 className="text-[11px] sm:text-xs xl:text-[13px] font-semibold text-slate-800 leading-tight whitespace-nowrap overflow-visible" title={title}>
            {title}
          </h3>
          {count !== undefined && (
            <p className="text-base sm:text-lg font-bold text-slate-950 mt-0.5 leading-none">{count}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
