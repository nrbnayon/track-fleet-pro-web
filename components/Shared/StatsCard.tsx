// components/Dashboard/Shared/StatsCard.tsx
import { cn } from "@/lib/utils";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconSvgElement;
  iconBgColor: string;
  className?: string;
  subtitle?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  iconBgColor,
  className,
  subtitle,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-white px-5 py-6 rounded-2xl flex items-center justify-between h-full border-none hover:bg-gray-50 transition-colors cursor-pointer hover:shadow-lg",
        className
      )}
    >
      <div className="flex flex-col justify-center gap-1">
        <h3 className="text-secondary text-sm font-medium">{title}</h3>
        <div className="text-2xl font-semibold text-foreground">{value}
          {subtitle && (
          <span className="text-xs text-secondary ml-1">{subtitle}</span>
        )}
        </div>
      </div>
      
      <div
        className="flex items-center justify-center rounded-lg p-3"
        style={{ backgroundColor: iconBgColor }}
      >
        <HugeiconsIcon
          icon={icon}
          size={24}
          className="text-white"
          strokeWidth={2}
        />
      </div>
    </div>
  );
}