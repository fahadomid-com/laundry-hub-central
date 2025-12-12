import { Button } from "@/components/ui/button";

const actions = [
  { label: "Manage Orders", color: "primary" },
  { label: "Add Customer", color: "info" },
  { label: "Invoicing & Collection", color: "success" },
  { label: "Expense Management", color: "warning" },
] as const;

export function QuickActions() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.color === "primary" ? "default" : "outline"}
            className={
              action.color === "primary"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : action.color === "info"
                ? "bg-info text-info-foreground hover:bg-info/90"
                : action.color === "success"
                ? "bg-success text-success-foreground hover:bg-success/90"
                : "bg-warning text-warning-foreground hover:bg-warning/90"
            }
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
