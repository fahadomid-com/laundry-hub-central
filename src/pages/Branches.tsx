import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
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
  Building2,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Eye,
  UserPlus,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  manager: string;
  status: "active" | "inactive";
  openingHours: string;
  createdAt: string;
}

interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  branchId: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  branchId: string;
  totalOrders: number;
  totalSpent: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  items: number;
  total: number;
  status: "pending" | "processing" | "ready" | "delivered";
  branchId: string;
  date: string;
}

interface BranchFinance {
  branchId: string;
  revenue: number;
  expenses: number;
  payments: number;
  profit: number;
}

const initialBranches: Branch[] = [
  {
    id: "1",
    name: "Salmiya Branch",
    code: "SLM-001",
    address: "Block 5, Salem Al-Mubarak Street",
    city: "Salmiya",
    phone: "+965 2222-1111",
    email: "salmiya@laundry.com",
    manager: "Ahmed Al-Rashid",
    status: "active",
    openingHours: "8:00 AM - 9:00 PM",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Bayan Branch",
    code: "BYN-002",
    address: "Block 8, Street 3",
    city: "Bayan",
    phone: "+965 2222-2222",
    email: "bayan@laundry.com",
    manager: "Fatima Al-Sabah",
    status: "active",
    openingHours: "7:00 AM - 10:00 PM",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Mishref Branch",
    code: "MSH-003",
    address: "Block 1, Avenue 105",
    city: "Mishref",
    phone: "+965 2222-3333",
    email: "mishref@laundry.com",
    manager: "Khalid Al-Mutairi",
    status: "active",
    openingHours: "10:00 AM - 8:00 PM",
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Yarmouk Branch",
    code: "YRM-004",
    address: "Block 3, Street 12",
    city: "Yarmouk",
    phone: "+965 2222-4444",
    email: "yarmouk@laundry.com",
    manager: "Noura Al-Fahad",
    status: "inactive",
    openingHours: "9:00 AM - 9:00 PM",
    createdAt: "2024-04-05",
  },
];

const initialStaff: Staff[] = [
  { id: "1", name: "Ahmed Al-Rashid", role: "Manager", email: "ahmed@laundry.com", phone: "+965 5555-0001", branchId: "1" },
  { id: "2", name: "Sara Al-Kandari", role: "Cashier", email: "sara@laundry.com", phone: "+965 5555-0002", branchId: "1" },
  { id: "3", name: "Fatima Al-Sabah", role: "Manager", email: "fatima@laundry.com", phone: "+965 5555-0003", branchId: "2" },
  { id: "4", name: "Omar Al-Shammari", role: "Operator", email: "omar@laundry.com", phone: "+965 5555-0004", branchId: "2" },
  { id: "5", name: "Khalid Al-Mutairi", role: "Manager", email: "khalid@laundry.com", phone: "+965 5555-0005", branchId: "3" },
  { id: "6", name: "Noura Al-Fahad", role: "Manager", email: "noura@laundry.com", phone: "+965 5555-0006", branchId: "4" },
];

const initialCustomers: Customer[] = [
  { id: "1", name: "Mohammed Al-Ahmad", email: "mohammed@email.com", phone: "+965 6666-0001", branchId: "1", totalOrders: 15, totalSpent: 45 },
  { id: "2", name: "Layla Al-Hamad", email: "layla@email.com", phone: "+965 6666-0002", branchId: "1", totalOrders: 8, totalSpent: 28 },
  { id: "3", name: "Youssef Al-Qattan", email: "youssef@email.com", phone: "+965 6666-0003", branchId: "2", totalOrders: 22, totalSpent: 68 },
  { id: "4", name: "Maryam Al-Dosari", email: "maryam@email.com", phone: "+965 6666-0004", branchId: "3", totalOrders: 5, totalSpent: 15 },
  { id: "5", name: "Hassan Al-Enezi", email: "hassan@email.com", phone: "+965 6666-0005", branchId: "4", totalOrders: 12, totalSpent: 39 },
];

const initialOrders: Order[] = [
  { id: "1", orderNumber: "ORD-001", customerName: "Mohammed Al-Ahmad", items: 5, total: 12, status: "delivered", branchId: "1", date: "2024-12-10" },
  { id: "2", orderNumber: "ORD-002", customerName: "Layla Al-Hamad", items: 3, total: 8, status: "ready", branchId: "1", date: "2024-12-12" },
  { id: "3", orderNumber: "ORD-003", customerName: "Youssef Al-Qattan", items: 8, total: 22, status: "processing", branchId: "2", date: "2024-12-13" },
  { id: "4", orderNumber: "ORD-004", customerName: "Maryam Al-Dosari", items: 2, total: 6, status: "pending", branchId: "3", date: "2024-12-14" },
  { id: "5", orderNumber: "ORD-005", customerName: "Hassan Al-Enezi", items: 6, total: 15, status: "delivered", branchId: "4", date: "2024-12-11" },
];

const initialFinance: BranchFinance[] = [
  { branchId: "1", revenue: 4850, expenses: 1200, payments: 4650, profit: 3650 },
  { branchId: "2", revenue: 3920, expenses: 980, payments: 3750, profit: 2940 },
  { branchId: "3", revenue: 2780, expenses: 720, payments: 2650, profit: 2060 },
  { branchId: "4", revenue: 1950, expenses: 580, payments: 1850, profit: 1370 },
];

const Branches = () => {
  const { toast } = useToast();
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [customers] = useState<Customer[]>(initialCustomers);
  const [orders] = useState<Order[]>(initialOrders);
  const [finance] = useState<BranchFinance[]>(initialFinance);
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const [revenueFilter, setRevenueFilter] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignStaffOpen, setIsAssignStaffOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [newBranch, setNewBranch] = useState<{
    name: string;
    code: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    manager: string;
    openingHours: string;
    status: "active" | "inactive";
  }>({
    name: "",
    code: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    manager: "",
    openingHours: "",
    status: "active",
  });

  const [assignStaffForm, setAssignStaffForm] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
  });

  const [newBranchEmployees, setNewBranchEmployees] = useState<Array<{ name: string; role: string; email: string; phone: string }>>([]);
  const [newEmployeeForm, setNewEmployeeForm] = useState({ name: "", role: "", email: "", phone: "" });
  
  const [editBranchEmployees, setEditBranchEmployees] = useState<Array<{ name: string; role: string; email: string; phone: string }>>([]);
  const [editEmployeeForm, setEditEmployeeForm] = useState({ name: "", role: "", email: "", phone: "" });

  const filteredBranches = branches
    .filter((branch) => {
      const matchesBranchFilter =
        branchFilter === "all" || branch.id === branchFilter;

      const matchesSearch =
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.city.toLowerCase().includes(searchTerm.toLowerCase());

      const stats = getBranchStats(branch.id);

      const matchesCustomerFilter =
        customerFilter === "all" ||
        customerFilter === "most" ||
        customerFilter === "lowest";

      const matchesRevenueFilter =
        revenueFilter === "all" ||
        revenueFilter === "most" ||
        (revenueFilter === "0-2000" && stats.revenue <= 2000) ||
        (revenueFilter === "2001-5000" && stats.revenue >= 2001 && stats.revenue <= 5000) ||
        (revenueFilter === "5000+" && stats.revenue > 5000);

      return matchesBranchFilter && matchesSearch && matchesCustomerFilter && matchesRevenueFilter;
    })
    .sort((a, b) => {
      const statsA = getBranchStats(a.id);
      const statsB = getBranchStats(b.id);

      if (customerFilter === "most") {
        return statsB.customerCount - statsA.customerCount;
      }
      if (customerFilter === "lowest") {
        return statsA.customerCount - statsB.customerCount;
      }
      if (revenueFilter === "most") {
        return statsB.revenue - statsA.revenue;
      }
      if (revenueFilter === "lowest") {
        return statsA.revenue - statsB.revenue;
      }
      return 0;
    });

  function getBranchStats(branchId: string) {
    const branchStaff = staff.filter((s) => s.branchId === branchId);
    const branchCustomers = customers.filter((c) => c.branchId === branchId);
    const branchOrders = orders.filter((o) => o.branchId === branchId);
    const branchFinance = finance.find((f) => f.branchId === branchId);
    return {
      staffCount: branchStaff.length,
      customerCount: branchCustomers.length,
      orderCount: branchOrders.length,
      revenue: branchFinance?.revenue || 0,
      expenses: branchFinance?.expenses || 0,
      profit: branchFinance?.profit || 0,
    };
  }


  const totalStats = {
    totalBranches: branches.length,
    activeBranches: branches.filter((b) => b.status === "active").length,
    totalRevenue: finance.reduce((sum, f) => sum + f.revenue, 0),
    totalProfit: finance.reduce((sum, f) => sum + f.profit, 0),
  };

  const handleAddBranch = () => {
    if (!newBranch.name || !newBranch.code) {
      toast({ title: "Error", description: "Name and Code are required", variant: "destructive" });
      return;
    }
    const branch: Branch = {
      id: Date.now().toString(),
      ...newBranch,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setBranches([...branches, branch]);
    
    // Add employees to the new branch
    if (newBranchEmployees.length > 0) {
      const newStaffMembers: Staff[] = newBranchEmployees.map((emp, index) => ({
        id: `${Date.now()}-${index}`,
        name: emp.name,
        role: emp.role,
        email: emp.email,
        phone: emp.phone,
        branchId: branch.id,
      }));
      setStaff([...staff, ...newStaffMembers]);
    }
    
    setNewBranch({ name: "", code: "", address: "", city: "", phone: "", email: "", manager: "", openingHours: "", status: "active" });
    setNewBranchEmployees([]);
    setNewEmployeeForm({ name: "", role: "", email: "", phone: "" });
    setIsAddDialogOpen(false);
    toast({ title: "Branch added", description: `${branch.name} has been created successfully` });
  };

  const handleEditBranch = () => {
    if (!editingBranch) return;
    setBranches(branches.map((b) => (b.id === editingBranch.id ? editingBranch : b)));
    
    // Add new employees to the branch
    if (editBranchEmployees.length > 0) {
      const newStaffMembers: Staff[] = editBranchEmployees.map((emp, index) => ({
        id: `${Date.now()}-${index}`,
        name: emp.name,
        role: emp.role,
        email: emp.email,
        phone: emp.phone,
        branchId: editingBranch.id,
      }));
      setStaff([...staff, ...newStaffMembers]);
    }
    
    setIsEditDialogOpen(false);
    setEditingBranch(null);
    setEditBranchEmployees([]);
    setEditEmployeeForm({ name: "", role: "", email: "", phone: "" });
    toast({ title: "Branch updated", description: "Branch details have been updated" });
  };

  const handleDeleteBranch = (branch: Branch) => {
    setBranches(branches.filter((b) => b.id !== branch.id));
    toast({ title: "Branch deleted", description: `${branch.name} has been removed` });
  };

  const handleAssignStaff = () => {
    if (!selectedBranch || !assignStaffForm.name || !assignStaffForm.role) {
      toast({ title: "Error", description: "Name and Role are required", variant: "destructive" });
      return;
    }
    const newStaff: Staff = {
      id: Date.now().toString(),
      ...assignStaffForm,
      branchId: selectedBranch.id,
    };
    setStaff([...staff, newStaff]);
    setAssignStaffForm({ name: "", role: "", email: "", phone: "" });
    setIsAssignStaffOpen(false);
    toast({ title: "Staff assigned", description: `${newStaff.name} has been assigned to ${selectedBranch.name}` });
  };

  const handleRemoveStaff = (staffMember: Staff) => {
    setStaff(staff.filter((s) => s.id !== staffMember.id));
    toast({ title: "Staff removed", description: `${staffMember.name} has been removed from the branch` });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active</Badge>;
      case "inactive":
        return <Badge className="bg-muted text-muted-foreground">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge>;
      case "processing":
        return <Badge className="bg-sky-500/10 text-sky-500 border-sky-500/20">Processing</Badge>;
      case "ready":
        return <Badge className="bg-violet-500/10 text-violet-500 border-violet-500/20">Ready</Badge>;
      case "delivered":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Delivered</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Branch Management</h1>
            <p className="text-muted-foreground">Manage all your branch locations and operations</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Branch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Branch</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Branch Name *</Label>
                    <Input
                      value={newBranch.name}
                      onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                      placeholder="Downtown Branch"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Branch Code *</Label>
                    <Input
                      value={newBranch.code}
                      onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value })}
                      placeholder="DT-001"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={newBranch.address}
                    onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Governorate</Label>
                    <Input
                      value={newBranch.city}
                      onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={newBranch.phone}
                      onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                      placeholder="+1 234-567-8900"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={newBranch.email}
                      onChange={(e) => setNewBranch({ ...newBranch, email: e.target.value })}
                      placeholder="branch@laundry.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Manager</Label>
                    <Input
                      value={newBranch.manager}
                      onChange={(e) => setNewBranch({ ...newBranch, manager: e.target.value })}
                      placeholder="John Smith"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Opening Hours</Label>
                    <Input
                      value={newBranch.openingHours}
                      onChange={(e) => setNewBranch({ ...newBranch, openingHours: e.target.value })}
                      placeholder="8:00 AM - 9:00 PM"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={newBranch.status}
                      onValueChange={(value) => setNewBranch({ ...newBranch, status: value as "active" | "inactive" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Add Employees Section */}
                <div className="space-y-3 border-t pt-4">
                  <Label className="text-base font-medium">Employees</Label>
                  
                  {newBranchEmployees.length > 0 && (
                    <div className="space-y-2">
                      {newBranchEmployees.map((emp, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg border bg-muted/50">
                          <div>
                            <p className="font-medium text-sm">{emp.name}</p>
                            <p className="text-xs text-muted-foreground">{emp.role}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setNewBranchEmployees(newBranchEmployees.filter((_, i) => i !== index))}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Employee Name"
                      value={newEmployeeForm.name}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, name: e.target.value })}
                    />
                    <Select
                      value={newEmployeeForm.role}
                      onValueChange={(value) => setNewEmployeeForm({ ...newEmployeeForm, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Cashier">Cashier</SelectItem>
                        <SelectItem value="Operator">Operator</SelectItem>
                        <SelectItem value="Delivery">Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Email"
                      value={newEmployeeForm.email}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, email: e.target.value })}
                    />
                    <Input
                      placeholder="Phone"
                      value={newEmployeeForm.phone}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, phone: e.target.value })}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      if (newEmployeeForm.name && newEmployeeForm.role) {
                        setNewBranchEmployees([...newBranchEmployees, { ...newEmployeeForm }]);
                        setNewEmployeeForm({ name: "", role: "", email: "", phone: "" });
                      }
                    }}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Employee
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddBranch}>Add Branch</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Branches</p>
                  <p className="text-2xl font-bold">{totalStats.totalBranches}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Branches</p>
                  <p className="text-2xl font-bold">{totalStats.activeBranches}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                  <TrendingUp className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">{totalStats.totalRevenue.toLocaleString()} KD</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/10">
                  <DollarSign className="h-6 w-6 text-sky-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Profit</p>
                  <p className="text-2xl font-bold">{totalStats.totalProfit.toLocaleString()} KD</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10">
                  <ArrowUpRight className="h-6 w-6 text-violet-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search branches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={customerFilter} onValueChange={setCustomerFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Customers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              <SelectItem value="most">Most Customers</SelectItem>
              <SelectItem value="lowest">Lowest Customers</SelectItem>
            </SelectContent>
          </Select>
          <Select value={revenueFilter} onValueChange={setRevenueFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Branch Revenue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Revenue</SelectItem>
              <SelectItem value="most">Most Revenue First</SelectItem>
              <SelectItem value="0-2000">0 - 2,000 KD per branch</SelectItem>
              <SelectItem value="2001-5000">2,001 - 5,000 KD per branch</SelectItem>
              <SelectItem value="5000+">5,000+ KD per branch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Branches Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Branches</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Customers</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBranches.map((branch) => {
                  const stats = getBranchStats(branch.id);
                  return (
                    <TableRow key={branch.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{branch.name}</p>
                          <p className="text-sm text-muted-foreground">{branch.code}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{branch.city}</span>
                        </div>
                      </TableCell>
                      <TableCell>{branch.manager}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>{stats.staffCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>{stats.customerCount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{stats.revenue.toLocaleString()} KD</TableCell>
                      <TableCell>{getStatusBadge(branch.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedBranch(branch)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingBranch(branch);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Branch
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteBranch(branch)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Branch Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Branch</DialogTitle>
            </DialogHeader>
            {editingBranch && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Branch Name</Label>
                    <Input
                      value={editingBranch.name}
                      onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Branch Code</Label>
                    <Input
                      value={editingBranch.code}
                      onChange={(e) => setEditingBranch({ ...editingBranch, code: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={editingBranch.address}
                    onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Governorate</Label>
                    <Input
                      value={editingBranch.city}
                      onChange={(e) => setEditingBranch({ ...editingBranch, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={editingBranch.phone}
                      onChange={(e) => setEditingBranch({ ...editingBranch, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={editingBranch.email}
                      onChange={(e) => setEditingBranch({ ...editingBranch, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Manager</Label>
                    <Input
                      value={editingBranch.manager}
                      onChange={(e) => setEditingBranch({ ...editingBranch, manager: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Opening Hours</Label>
                    <Input
                      value={editingBranch.openingHours}
                      onChange={(e) => setEditingBranch({ ...editingBranch, openingHours: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={editingBranch.status}
                      onValueChange={(value) =>
                        setEditingBranch({ ...editingBranch, status: value as "active" | "inactive" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Add Employees Section */}
                <div className="space-y-3 border-t pt-4">
                  <Label className="text-base font-medium">Add New Employees</Label>
                  
                  {editBranchEmployees.length > 0 && (
                    <div className="space-y-2">
                      {editBranchEmployees.map((emp, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg border bg-muted/50">
                          <div>
                            <p className="font-medium text-sm">{emp.name}</p>
                            <p className="text-xs text-muted-foreground">{emp.role}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditBranchEmployees(editBranchEmployees.filter((_, i) => i !== index))}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Employee Name"
                      value={editEmployeeForm.name}
                      onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, name: e.target.value })}
                    />
                    <Select
                      value={editEmployeeForm.role}
                      onValueChange={(value) => setEditEmployeeForm({ ...editEmployeeForm, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Cashier">Cashier</SelectItem>
                        <SelectItem value="Operator">Operator</SelectItem>
                        <SelectItem value="Delivery">Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Email"
                      value={editEmployeeForm.email}
                      onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, email: e.target.value })}
                    />
                    <Input
                      placeholder="Phone"
                      value={editEmployeeForm.phone}
                      onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, phone: e.target.value })}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      if (editEmployeeForm.name && editEmployeeForm.role) {
                        setEditBranchEmployees([...editBranchEmployees, { ...editEmployeeForm }]);
                        setEditEmployeeForm({ name: "", role: "", email: "", phone: "" });
                      }
                    }}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Employee
                  </Button>
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleEditBranch}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Branch Details Sheet */}
        <Sheet open={!!selectedBranch} onOpenChange={() => setSelectedBranch(null)}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {selectedBranch?.name}
              </SheetTitle>
            </SheetHeader>
            {selectedBranch && (
              <div className="mt-6 space-y-6">
                {/* Branch Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Code</p>
                    <p className="font-medium">{selectedBranch.code}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Status</p>
                    {getStatusBadge(selectedBranch.status)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Address
                    </p>
                    <p className="font-medium">{selectedBranch.address}, {selectedBranch.city}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </p>
                    <p className="font-medium">{selectedBranch.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email
                    </p>
                    <p className="font-medium">{selectedBranch.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Manager</p>
                    <p className="font-medium">{selectedBranch.manager}</p>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="staff">Staff</TabsTrigger>
                    <TabsTrigger value="customers">Customers</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    {(() => {
                      const stats = getBranchStats(selectedBranch.id);
                      const branchFinance = finance.find((f) => f.branchId === selectedBranch.id);
                      return (
                        <>
                          <div className="grid grid-cols-3 gap-4">
                            <Card>
                              <CardContent className="p-4 text-center">
                                <Users className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                                <p className="text-2xl font-bold">{stats.staffCount}</p>
                                <p className="text-xs text-muted-foreground">Staff</p>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4 text-center">
                                <Users className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                                <p className="text-2xl font-bold">{stats.customerCount}</p>
                                <p className="text-xs text-muted-foreground">Customers</p>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4 text-center">
                                <ShoppingCart className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                                <p className="text-2xl font-bold">{stats.orderCount}</p>
                                <p className="text-xs text-muted-foreground">Orders</p>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Financial Summary */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Financial Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                                  <span className="text-sm">Revenue</span>
                                </div>
                                <span className="font-medium text-emerald-500">
                                  {branchFinance?.revenue.toLocaleString()} KD
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                                  <span className="text-sm">Expenses</span>
                                </div>
                                <span className="font-medium text-destructive">
                                  {branchFinance?.expenses.toLocaleString()} KD
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Receipt className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Payments Received</span>
                                </div>
                                <span className="font-medium">
                                  {branchFinance?.payments.toLocaleString()} KD
                                </span>
                              </div>
                              <div className="border-t pt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-primary" />
                                  <span className="text-sm font-medium">Net Profit</span>
                                </div>
                                <span className="font-bold text-primary">
                                  {branchFinance?.profit.toLocaleString()} KD
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      );
                    })()}
                  </TabsContent>

                  <TabsContent value="staff" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        {staff.filter((s) => s.branchId === selectedBranch.id).length} staff members
                      </p>
                      <Dialog open={isAssignStaffOpen} onOpenChange={setIsAssignStaffOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Staff
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Staff to {selectedBranch.name}</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label>Name *</Label>
                              <Input
                                value={assignStaffForm.name}
                                onChange={(e) => setAssignStaffForm({ ...assignStaffForm, name: e.target.value })}
                                placeholder="Staff name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Role *</Label>
                              <Select
                                value={assignStaffForm.role}
                                onValueChange={(value) => setAssignStaffForm({ ...assignStaffForm, role: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Manager">Manager</SelectItem>
                                  <SelectItem value="Cashier">Cashier</SelectItem>
                                  <SelectItem value="Operator">Operator</SelectItem>
                                  <SelectItem value="Delivery">Delivery</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input
                                value={assignStaffForm.email}
                                onChange={(e) => setAssignStaffForm({ ...assignStaffForm, email: e.target.value })}
                                placeholder="email@example.com"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Phone</Label>
                              <Input
                                value={assignStaffForm.phone}
                                onChange={(e) => setAssignStaffForm({ ...assignStaffForm, phone: e.target.value })}
                                placeholder="+1 234-567-8900"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleAssignStaff}>Assign Staff</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="space-y-2">
                      {staff
                        .filter((s) => s.branchId === selectedBranch.id)
                        .map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-3 rounded-lg border"
                          >
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveStaff(member)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="customers" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {customers.filter((c) => c.branchId === selectedBranch.id).length} customers
                    </p>
                    <div className="space-y-2">
                      {customers
                        .filter((c) => c.branchId === selectedBranch.id)
                        .map((customer) => (
                          <div
                            key={customer.id}
                            className="flex items-center justify-between p-3 rounded-lg border"
                          >
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-sm text-muted-foreground">{customer.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{customer.totalSpent} KD</p>
                              <p className="text-xs text-muted-foreground">{customer.totalOrders} orders</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="orders" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {orders.filter((o) => o.branchId === selectedBranch.id).length} orders
                    </p>
                    <div className="space-y-2">
                      {orders
                        .filter((o) => o.branchId === selectedBranch.id)
                        .map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-3 rounded-lg border"
                          >
                            <div>
                              <p className="font-medium">{order.orderNumber}</p>
                              <p className="text-sm text-muted-foreground">{order.customerName}</p>
                            </div>
                            <div className="text-right flex items-center gap-3">
                              {getStatusBadge(order.status)}
                              <span className="font-medium">{order.total} KD</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </DashboardLayout>
  );
};

export default Branches;
