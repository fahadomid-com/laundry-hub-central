import {
  LayoutDashboard,
  Settings2,
  ShoppingCart,
  Package,
  Users,
  Car,
  DollarSign,
  BarChart3,
  Bot,
  Megaphone,
  Settings,
  WashingMachine,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/" },
  { title: "Operations", icon: Settings2, url: "/operations" },
  { title: "Orders", icon: ShoppingCart, url: "/orders" },
  { title: "Catalog", icon: Package, url: "/catalog" },
  { title: "Customers", icon: Users, url: "/customers" },
  { title: "Drivers", icon: Car, url: "/drivers" },
  { title: "Finance", icon: DollarSign, url: "/finance" },
  { title: "Smart Reports", icon: BarChart3, url: "/reports" },
  { title: "AI Support & Bot", icon: Bot, url: "/ai-support" },
  { title: "Marketing", icon: Megaphone, url: "/marketing" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <WashingMachine className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">
              SaaS Laundry
            </span>
            <span className="text-xs text-sidebar-muted-foreground">Admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-muted"
                      activeClassName="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
