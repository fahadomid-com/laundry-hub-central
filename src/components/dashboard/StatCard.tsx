import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
}: StatCardProps) {
  const isPositive = changeType === "positive";

  return (
    <div className="stat-card-shadow hover:stat-card-shadow-hover rounded-lg border border-border bg-card p-6 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className={cn("rounded-lg p-2.5", iconBgColor)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-success" />
        ) : (
          <TrendingDown className="h-4 w-4 text-destructive" />
        )}
        <span
          className={cn(
            "text-sm font-medium",
            isPositive ? "text-success" : "text-destructive"
          )}
        >
          {change}
        </span>
        <span className="text-sm text-muted-foreground">from last month</span>
      </div>
    </div>
  );
}
