import { CreditCard, Package, Users, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { QuickActions } from "@/components/dashboard/QuickActions";

const stats = [
  {
    title: "Total Revenue",
    value: "KD12,345",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: CreditCard,
    iconBgColor: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    title: "Active Orders",
    value: "156",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: Package,
    iconBgColor: "bg-success/10",
    iconColor: "text-success",
  },
  {
    title: "Total Customers",
    value: "2,847",
    change: "+15.3%",
    changeType: "positive" as const,
    icon: Users,
    iconBgColor: "bg-info/10",
    iconColor: "text-info",
  },
  {
    title: "Completion Rate",
    value: "94.2%",
    change: "-2.1%",
    changeType: "negative" as const,
    icon: CheckCircle,
    iconBgColor: "bg-warning/10",
    iconColor: "text-warning",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Here's what's happening with your laundry business today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <RecentOrdersTable />

      <QuickActions />
    </div>
  );
}
