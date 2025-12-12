import { Bell, Package, User, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const notifications = [
  {
    id: 1,
    type: "order",
    title: "New order received",
    description: "ORD-005 from Michael Brown",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    type: "customer",
    title: "New customer signup",
    description: "Emily Davis just created an account",
    time: "15 min ago",
    read: false,
  },
  {
    id: 3,
    type: "alert",
    title: "Low inventory alert",
    description: "Detergent supply running low",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 4,
    type: "success",
    title: "Payment received",
    description: "KD150.00 from Jane Smith",
    time: "2 hours ago",
    read: true,
  },
];

const iconMap = {
  order: Package,
  customer: User,
  alert: AlertCircle,
  success: CheckCircle,
};

const colorMap = {
  order: "text-primary bg-primary/10",
  customer: "text-info bg-info/10",
  alert: "text-warning bg-warning/10",
  success: "text-success bg-success/10",
};

export function NotificationsDropdown() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-popover">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <Badge variant="secondary" className="text-xs">
            {unreadCount} new
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => {
            const Icon = iconMap[notification.type as keyof typeof iconMap];
            const colorClass = colorMap[notification.type as keyof typeof colorMap];

            return (
              <div
                key={notification.id}
                className={`flex gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                  !notification.read ? "bg-primary/5" : ""
                }`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.description}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
                {!notification.read && <div className="h-2 w-2 rounded-full bg-primary" />}
              </div>
            );
          })}
        </div>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button variant="ghost" className="w-full text-sm">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
