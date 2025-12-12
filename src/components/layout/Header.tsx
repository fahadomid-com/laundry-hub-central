import { Search, Bell, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden" />
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Global search (⌘/Ctrl+K or /) — Orders, Customers, Drivers..."
            className="h-10 w-80 rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring lg:w-96"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="icon" className="h-9 w-9 rounded-lg">
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            3
          </span>
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
          <User className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
}
