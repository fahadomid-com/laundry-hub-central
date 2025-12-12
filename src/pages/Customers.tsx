import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Users,
  Crown,
  Star,
  Gift,
  MessageSquare,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  tier: "No Membership" | "Silver" | "Gold" | "Platinum";
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  joinDate: string;
  lastOrder: string;
  notes: string;
}

const initialCustomers: Customer[] = [
  { id: "1", name: "John Doe", phone: "+965 1234 5678", email: "john@email.com", address: "Block 5, Salmiya", tier: "Gold", totalOrders: 45, totalSpent: 890.50, loyaltyPoints: 445, joinDate: "Jan 15, 2024", lastOrder: "Dec 10, 2025", notes: "VIP customer" },
  { id: "2", name: "Jane Smith", phone: "+965 2345 6789", email: "jane@email.com", address: "Block 3, Hawally", tier: "Platinum", totalOrders: 120, totalSpent: 2450.00, loyaltyPoints: 1225, joinDate: "Mar 22, 2023", lastOrder: "Dec 11, 2025", notes: "" },
  { id: "3", name: "Mike Johnson", phone: "+965 3456 7890", email: "mike@email.com", address: "Block 1, Kuwait City", tier: "Silver", totalOrders: 18, totalSpent: 320.75, loyaltyPoints: 160, joinDate: "Aug 10, 2024", lastOrder: "Dec 8, 2025", notes: "Prefers express service" },
  { id: "4", name: "Sarah Wilson", phone: "+965 4567 8901", email: "sarah@email.com", address: "Block 7, Farwaniya", tier: "No Membership", totalOrders: 5, totalSpent: 85.00, loyaltyPoints: 42, joinDate: "Nov 20, 2025", lastOrder: "Dec 5, 2025", notes: "" },
  { id: "5", name: "Emily Davis", phone: "+965 5678 9012", email: "emily@email.com", address: "Block 2, Salmiya", tier: "Gold", totalOrders: 52, totalSpent: 1120.00, loyaltyPoints: 560, joinDate: "Feb 14, 2024", lastOrder: "Dec 9, 2025", notes: "Corporate account" },
  { id: "6", name: "Michael Brown", phone: "+965 6789 0123", email: "michael@email.com", address: "Block 4, Jabriya", tier: "Silver", totalOrders: 22, totalSpent: 445.50, loyaltyPoints: 222, joinDate: "Jun 5, 2024", lastOrder: "Dec 7, 2025", notes: "" },
];

const tierConfig = {
  "No Membership": { color: "bg-gray-100 text-gray-800", icon: Star },
  Silver: { color: "bg-gray-100 text-gray-800", icon: Star },
  Gold: { color: "bg-yellow-100 text-yellow-800", icon: Crown },
  Platinum: { color: "bg-purple-100 text-purple-800", icon: Crown },
};

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.includes(search) ||
      customer.email.toLowerCase().includes(search.toLowerCase());
    const matchesTier = tierFilter === "all" || customer.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) return;
    const customer: Customer = {
      id: String(customers.length + 1),
      ...newCustomer,
      tier: "No Membership",
      totalOrders: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
      joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lastOrder: "-",
    };
    setCustomers((prev) => [...prev, customer]);
    setNewCustomer({ name: "", phone: "", email: "", address: "", notes: "" });
    setAddOpen(false);
    toast({ title: "Customer added", description: `${customer.name} has been added` });
  };

  const handleUpdateCustomer = () => {
    if (!editCustomer) return;
    setCustomers((prev) => prev.map((c) => (c.id === editCustomer.id ? editCustomer : c)));
    setEditCustomer(null);
    toast({ title: "Customer updated", description: `${editCustomer.name} has been updated` });
  };

  const handleDeleteCustomer = (id: string) => {
    const customer = customers.find((c) => c.id === id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Customer deleted", description: `${customer?.name} has been removed` });
  };

  const handleSendMessage = (customer: Customer) => {
    toast({ title: "Message sent", description: `SMS sent to ${customer.phone}` });
  };

  const handleRedeemPoints = (customer: Customer) => {
    toast({ title: "Points redeemed", description: `${customer.loyaltyPoints} points redeemed for ${customer.name}` });
  };

  const handleExportCustomers = () => {
    const headers = ["Name", "Phone", "Email", "Address", "Tier", "Total Orders", "Total Spent", "Loyalty Points", "Join Date", "Last Order", "Notes"];
    const csvContent = [
      headers.join(","),
      ...customers.map((c) =>
        [
          `"${c.name}"`,
          `"${c.phone}"`,
          `"${c.email}"`,
          `"${c.address}"`,
          c.tier,
          c.totalOrders,
          c.totalSpent.toFixed(2),
          c.loyaltyPoints,
          c.joinDate,
          c.lastOrder,
          `"${c.notes}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `customers_export_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast({ title: "Export complete", description: `${customers.length} customers exported to CSV` });
  };

  const stats = {
    total: customers.length,
    platinum: customers.filter((c) => c.tier === "Platinum").length,
    gold: customers.filter((c) => c.tier === "Gold").length,
    silver: customers.filter((c) => c.tier === "Silver").length,
    noMembership: customers.filter((c) => c.tier === "No Membership").length,
    totalPoints: customers.reduce((sum, c) => sum + c.loyaltyPoints, 0),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Customers</h1>
            <p className="mt-1 text-muted-foreground">Manage customer profiles and loyalty</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCustomers}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Customers</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-purple-50 dark:bg-purple-950/20">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.platinum}</p>
                <p className="text-sm text-muted-foreground">Platinum Members</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-yellow-50 dark:bg-yellow-950/20">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.gold}</p>
                <p className="text-sm text-muted-foreground">Gold Members</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gray-50 dark:bg-gray-950/20">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-gray-600" />
              <div>
                <p className="text-2xl font-bold">{stats.silver}</p>
                <p className="text-sm text-muted-foreground">Silver Members</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-slate-50 dark:bg-slate-950/20">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-slate-500" />
              <div>
                <p className="text-2xl font-bold">{stats.noMembership}</p>
                <p className="text-sm text-muted-foreground">No Membership</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-green-50 dark:bg-green-950/20">
            <div className="flex items-center gap-3">
              <Gift className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalPoints.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-background">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="No Membership">No Membership</SelectItem>
                <SelectItem value="Silver">Silver</SelectItem>
                <SelectItem value="Gold">Gold</SelectItem>
                <SelectItem value="Platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Customers List */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => {
            const TierIcon = tierConfig[customer.tier].icon;
            return (
              <Card key={customer.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {customer.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <Badge className={tierConfig[customer.tier].color}>
                        <TierIcon className="mr-1 h-3 w-3" />
                        {customer.tier}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem onClick={() => setViewCustomer(customer)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditCustomer(customer)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendMessage(customer)}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteCustomer(customer.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {customer.phone}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {customer.email}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {customer.address}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <div className="text-center">
                    <p className="text-lg font-bold">{customer.totalOrders}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">KD{customer.totalSpent.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-primary">{customer.loyaltyPoints}</p>
                    <p className="text-xs text-muted-foreground">Points</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* View Customer Sheet */}
      <Sheet open={!!viewCustomer} onOpenChange={() => setViewCustomer(null)}>
        <SheetContent className="bg-card overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Customer Details</SheetTitle>
            <SheetDescription>View customer information and history</SheetDescription>
          </SheetHeader>
          {viewCustomer && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {viewCustomer.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{viewCustomer.name}</h3>
                  <Badge className={tierConfig[viewCustomer.tier].color}>
                    {viewCustomer.tier} Member
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                  <p className="text-2xl font-bold">{viewCustomer.totalOrders}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-2xl font-bold">KD{viewCustomer.totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </Card>
              </div>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Loyalty Points</p>
                    <p className="text-2xl font-bold text-primary">{viewCustomer.loyaltyPoints}</p>
                  </div>
                  <Button size="sm" onClick={() => handleRedeemPoints(viewCustomer)}>
                    <Gift className="mr-2 h-4 w-4" />
                    Redeem
                  </Button>
                </div>
              </Card>

              <div className="space-y-3">
                <h4 className="font-medium">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {viewCustomer.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {viewCustomer.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {viewCustomer.address}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Activity</h4>
                <div className="text-sm text-muted-foreground">
                  <p>Member since: {viewCustomer.joinDate}</p>
                  <p>Last order: {viewCustomer.lastOrder}</p>
                </div>
              </div>

              {viewCustomer.notes && (
                <div className="space-y-2">
                  <h4 className="font-medium">Notes</h4>
                  <p className="text-sm text-muted-foreground">{viewCustomer.notes}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => handleSendMessage(viewCustomer)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
                <Button variant="outline" onClick={() => { setViewCustomer(null); setEditCustomer(viewCustomer); }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Customer Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>Add a new customer to your database</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={newCustomer.name}
                onChange={(e) => setNewCustomer((p) => ({ ...p, name: e.target.value }))}
                placeholder="John Doe"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+965 XXXX XXXX"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer((p) => ({ ...p, email: e.target.value }))}
                  placeholder="john@email.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={newCustomer.address}
                onChange={(e) => setNewCustomer((p) => ({ ...p, address: e.target.value }))}
                placeholder="Block, Street, Area"
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input
                value={newCustomer.notes}
                onChange={(e) => setNewCustomer((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Any special notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={!!editCustomer} onOpenChange={() => setEditCustomer(null)}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update customer information</DialogDescription>
          </DialogHeader>
          {editCustomer && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editCustomer.name}
                  onChange={(e) => setEditCustomer((p) => p ? { ...p, name: e.target.value } : null)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editCustomer.phone}
                    onChange={(e) => setEditCustomer((p) => p ? { ...p, phone: e.target.value } : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editCustomer.email}
                    onChange={(e) => setEditCustomer((p) => p ? { ...p, email: e.target.value } : null)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={editCustomer.address}
                  onChange={(e) => setEditCustomer((p) => p ? { ...p, address: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  value={editCustomer.notes}
                  onChange={(e) => setEditCustomer((p) => p ? { ...p, notes: e.target.value } : null)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCustomer(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCustomer}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
