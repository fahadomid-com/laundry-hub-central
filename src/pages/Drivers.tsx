import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
  Car,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Navigation,
  Star,
  TrendingUp,
  Package,
  ArrowRight,
  User,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  plateNumber: string;
  status: "Available" | "On Route" | "Off Duty" | "On Break";
  currentLocation: string;
  todayDeliveries: number;
  totalDeliveries: number;
  rating: number;
  joinDate: string;
  activeOrder?: string;
}

interface DeliveryOrder {
  id: string;
  customer: string;
  phone: string;
  address: string;
  area: string;
  items: number;
  total: string;
  status: "Pending" | "Assigned" | "Picked Up" | "In Transit" | "Delivered";
  priority: "Normal" | "Express" | "Urgent";
  assignedDriver?: string;
  estimatedTime?: string;
  createdAt: string;
}

const initialDrivers: Driver[] = [
  { id: "1", name: "Ahmed Hassan", email: "ahmed.hassan@email.com", phone: "+965 1111 2222", vehicle: "Van", plateNumber: "KWT 1234", status: "On Route", currentLocation: "Salmiya", todayDeliveries: 8, totalDeliveries: 450, rating: 4.8, joinDate: "Jan 10, 2024", activeOrder: "ORD-015" },
  { id: "2", name: "Mohammed Ali", email: "mohammed.ali@email.com", phone: "+965 2222 3333", vehicle: "Motorcycle", plateNumber: "KWT 5678", status: "Available", currentLocation: "Warehouse", todayDeliveries: 12, totalDeliveries: 680, rating: 4.9, joinDate: "Mar 5, 2023" },
  { id: "3", name: "Khalid Omar", email: "khalid.omar@email.com", phone: "+965 3333 4444", vehicle: "Van", plateNumber: "KWT 9012", status: "On Break", currentLocation: "Hawally", todayDeliveries: 5, totalDeliveries: 320, rating: 4.6, joinDate: "Jun 15, 2024" },
  { id: "4", name: "Yusuf Ibrahim", email: "yusuf.ibrahim@email.com", phone: "+965 4444 5555", vehicle: "Car", plateNumber: "KWT 3456", status: "On Route", currentLocation: "Farwaniya", todayDeliveries: 10, totalDeliveries: 520, rating: 4.7, joinDate: "Feb 20, 2024", activeOrder: "ORD-018" },
  { id: "5", name: "Omar Saleh", email: "omar.saleh@email.com", phone: "+965 5555 6666", vehicle: "Motorcycle", plateNumber: "KWT 7890", status: "Off Duty", currentLocation: "-", todayDeliveries: 0, totalDeliveries: 280, rating: 4.5, joinDate: "Aug 1, 2024" },
  { id: "6", name: "Hassan Nasser", email: "hassan.nasser@email.com", phone: "+965 6666 7777", vehicle: "Van", plateNumber: "KWT 2345", status: "Available", currentLocation: "Warehouse", todayDeliveries: 9, totalDeliveries: 390, rating: 4.8, joinDate: "Apr 12, 2024" },
];

const initialOrders: DeliveryOrder[] = [
  { id: "ORD-021", customer: "Fatima Al-Sabah", phone: "+965 9988 7766", address: "Block 5, Street 12, House 8", area: "Salmiya", items: 5, total: "KD 28.50", status: "Pending", priority: "Express", createdAt: "10 mins ago" },
  { id: "ORD-022", customer: "Ali Mohammed", phone: "+965 8877 6655", address: "Block 3, Avenue 15, Apt 42", area: "Bayan", items: 3, total: "KD 15.00", status: "Pending", priority: "Normal", createdAt: "25 mins ago" },
  { id: "ORD-023", customer: "Sara Hassan", phone: "+965 7766 5544", address: "Block 1, Street 8, Villa 22", area: "Mishrif", items: 8, total: "KD 52.00", status: "Pending", priority: "Urgent", createdAt: "5 mins ago" },
  { id: "ORD-015", customer: "Nour Ahmad", phone: "+965 6655 4433", address: "Block 7, Street 3, House 15", area: "Salmiya", items: 4, total: "KD 22.00", status: "In Transit", priority: "Normal", assignedDriver: "1", estimatedTime: "15 mins", createdAt: "1 hour ago" },
  { id: "ORD-018", customer: "Khalid Yusuf", phone: "+965 5544 3322", address: "Block 2, Avenue 9, Apt 18", area: "Farwaniya", items: 6, total: "KD 35.50", status: "Picked Up", priority: "Express", assignedDriver: "4", estimatedTime: "25 mins", createdAt: "45 mins ago" },
  { id: "ORD-019", customer: "Maryam Saleh", phone: "+965 4433 2211", address: "Block 4, Street 6, House 12", area: "Hawally", items: 2, total: "KD 12.00", status: "Assigned", priority: "Normal", assignedDriver: "2", createdAt: "30 mins ago" },
];

const statusConfig = {
  Available: { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle },
  "On Route": { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: Navigation },
  "Off Duty": { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400", icon: XCircle },
  "On Break": { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
};

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [orders, setOrders] = useState<DeliveryOrder[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [viewDriver, setViewDriver] = useState<Driver | null>(null);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const [assignOrderDialogOpen, setAssignOrderDialogOpen] = useState(false);
  const [selectedOrderForAssign, setSelectedOrderForAssign] = useState<DeliveryOrder | null>(null);
  const [selectedDriverForAssign, setSelectedDriverForAssign] = useState("");
  const { toast } = useToast();

  const [newDriver, setNewDriver] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "Van",
    plateNumber: "",
  });

  const pendingOrders = orders.filter(o => o.status === "Pending");
  const assignedOrders = orders.filter(o => ["Assigned", "Picked Up", "In Transit"].includes(o.status));
  const availableDrivers = drivers.filter(d => d.status === "Available");

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(search.toLowerCase()) ||
      driver.phone.includes(search) ||
      driver.plateNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddDriver = () => {
    if (!newDriver.name || !newDriver.phone) return;
    const driver: Driver = {
      id: String(drivers.length + 1),
      ...newDriver,
      status: "Off Duty",
      currentLocation: "-",
      todayDeliveries: 0,
      totalDeliveries: 0,
      rating: 5.0,
      joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setDrivers((prev) => [...prev, driver]);
    setNewDriver({ name: "", email: "", phone: "", vehicle: "Van", plateNumber: "" });
    setAddOpen(false);
    toast({ title: "Driver added", description: `${driver.name} has been added` });
  };

  const handleUpdateDriver = () => {
    if (!editDriver) return;
    setDrivers((prev) => prev.map((d) => (d.id === editDriver.id ? editDriver : d)));
    setEditDriver(null);
    toast({ title: "Driver updated", description: `${editDriver.name} has been updated` });
  };

  const handleDeleteDriver = (id: string) => {
    const driver = drivers.find((d) => d.id === id);
    setDrivers((prev) => prev.filter((d) => d.id !== id));
    toast({ title: "Driver removed", description: `${driver?.name} has been removed` });
  };

  const handleStatusChange = (id: string, newStatus: Driver["status"]) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus, currentLocation: newStatus === "Off Duty" ? "-" : d.currentLocation } : d))
    );
    toast({ title: "Status updated", description: `Driver status changed to ${newStatus}` });
  };

  const handleAssignOrder = (driver: Driver) => {
    toast({ title: "Order assigned", description: `New order assigned to ${driver.name}` });
  };

  const handleOpenAssignDialog = (order: DeliveryOrder) => {
    setSelectedOrderForAssign(order);
    setSelectedDriverForAssign("");
    setAssignOrderDialogOpen(true);
  };

  const handleConfirmAssignment = () => {
    if (!selectedOrderForAssign || !selectedDriverForAssign) return;
    
    const driver = drivers.find(d => d.id === selectedDriverForAssign);
    if (!driver) return;

    setOrders(prev => prev.map(o => 
      o.id === selectedOrderForAssign.id 
        ? { ...o, status: "Assigned" as const, assignedDriver: selectedDriverForAssign, estimatedTime: "30 mins" }
        : o
    ));

    setDrivers(prev => prev.map(d =>
      d.id === selectedDriverForAssign
        ? { ...d, status: "On Route" as const, activeOrder: selectedOrderForAssign.id, currentLocation: selectedOrderForAssign.area }
        : d
    ));

    toast({ 
      title: "Order Assigned", 
      description: `${selectedOrderForAssign.id} assigned to ${driver.name}` 
    });

    setAssignOrderDialogOpen(false);
    setSelectedOrderForAssign(null);
    setSelectedDriverForAssign("");
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: DeliveryOrder["status"]) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    if (newStatus === "Delivered") {
      const order = orders.find(o => o.id === orderId);
      if (order?.assignedDriver) {
        setDrivers(prev => prev.map(d => 
          d.id === order.assignedDriver 
            ? { ...d, status: "Available" as const, activeOrder: undefined, currentLocation: "Warehouse", todayDeliveries: d.todayDeliveries + 1 }
            : d
        ));
      }
    }
    
    toast({ title: "Status Updated", description: `Order ${orderId} marked as ${newStatus}` });
  };

  const handleReassignOrder = (order: DeliveryOrder) => {
    setSelectedOrderForAssign(order);
    setSelectedDriverForAssign(order.assignedDriver || "");
    setAssignOrderDialogOpen(true);
  };

  const handleUnassignOrder = (order: DeliveryOrder) => {
    if (order.assignedDriver) {
      setDrivers(prev => prev.map(d =>
        d.id === order.assignedDriver
          ? { ...d, status: "Available" as const, activeOrder: undefined, currentLocation: "Warehouse" }
          : d
      ));
    }
    setOrders(prev => prev.map(o => 
      o.id === order.id 
        ? { ...o, status: "Pending" as const, assignedDriver: undefined, estimatedTime: undefined }
        : o
    ));
    toast({ title: "Order Unassigned", description: `${order.id} is now pending` });
  };

  const getPriorityColor = (priority: DeliveryOrder["priority"]) => {
    switch (priority) {
      case "Urgent": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Express": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getOrderStatusColor = (status: DeliveryOrder["status"]) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Assigned": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Picked Up": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "In Transit": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
      case "Delivered": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const handleTrackDriver = (driver: Driver) => {
    toast({ title: "Tracking", description: `Tracking ${driver.name} - Location: ${driver.currentLocation}` });
  };

  const stats = {
    total: drivers.length,
    available: drivers.filter((d) => d.status === "Available").length,
    onRoute: drivers.filter((d) => d.status === "On Route").length,
    todayTotal: drivers.reduce((sum, d) => sum + d.todayDeliveries, 0),
    pendingOrders: pendingOrders.length,
    assignedOrders: assignedOrders.length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Drivers</h1>
            <p className="mt-1 text-muted-foreground">Manage drivers, assign orders, and track deliveries</p>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Driver
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Car className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Drivers</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-green-50 dark:bg-green-950/20">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-xl font-bold">{stats.available}</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-center gap-3">
              <Navigation className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-xl font-bold">{stats.onRoute}</p>
                <p className="text-xs text-muted-foreground">On Route</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-yellow-50 dark:bg-yellow-950/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
              <div>
                <p className="text-xl font-bold">{stats.pendingOrders}</p>
                <p className="text-xs text-muted-foreground">Pending Orders</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-indigo-50 dark:bg-indigo-950/20">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-indigo-600" />
              <div>
                <p className="text-xl font-bold">{stats.assignedOrders}</p>
                <p className="text-xs text-muted-foreground">In Delivery</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-purple-50 dark:bg-purple-950/20">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-xl font-bold">{stats.todayTotal}</p>
                <p className="text-xs text-muted-foreground">Today's Deliveries</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="drivers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="drivers">
              <Car className="mr-2 h-4 w-4" />
              Drivers
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="mr-2 h-4 w-4" />
              Order Assignment
              {pendingOrders.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">{pendingOrders.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="drivers" className="space-y-4">
            <Card className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or plate..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="On Route">On Route</SelectItem>
                <SelectItem value="On Break">On Break</SelectItem>
                <SelectItem value="Off Duty">Off Duty</SelectItem>
              </SelectContent>
            </Select>
            </div>
          </Card>

          {/* Drivers List */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDrivers.map((driver) => {
            const StatusIcon = statusConfig[driver.status].icon;
            return (
              <Card key={driver.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {driver.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <Badge className={statusConfig[driver.status].color}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {driver.status}
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
                      <DropdownMenuItem onClick={() => setViewDriver(driver)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditDriver(driver)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTrackDriver(driver)}>
                        <MapPin className="mr-2 h-4 w-4" />
                        Track Location
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteDriver(driver.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {driver.phone}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Car className="h-4 w-4" />
                    {driver.vehicle} • {driver.plateNumber}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {driver.currentLocation}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{driver.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">• {driver.totalDeliveries} deliveries</span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="text-lg font-bold">{driver.todayDeliveries}</p>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                  {driver.status === "Available" ? (
                    <Button size="sm" onClick={() => handleAssignOrder(driver)}>
                      Assign Order
                    </Button>
                  ) : driver.status === "On Route" ? (
                    <Button size="sm" variant="outline" onClick={() => handleTrackDriver(driver)}>
                      <Navigation className="mr-1 h-3 w-3" />
                      Track
                    </Button>
                  ) : (
                    <Select
                      value={driver.status}
                      onValueChange={(v) => handleStatusChange(driver.id, v as Driver["status"])}
                    >
                      <SelectTrigger className="h-8 w-28 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="On Break">On Break</SelectItem>
                        <SelectItem value="Off Duty">Off Duty</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </Card>
            );
          })}
          </div>
          </TabsContent>

          {/* Order Assignment Tab */}
          <TabsContent value="orders" className="space-y-6">
            {/* Pending Orders */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold">Pending Orders</h3>
                  <Badge className="bg-yellow-100 text-yellow-800">{pendingOrders.length}</Badge>
                </div>
              </div>
              {pendingOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No pending orders</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{order.id}</span>
                          <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                          <span className="text-xs text-muted-foreground">{order.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {order.customer}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {order.area}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {order.items} items
                          </span>
                          <span className="font-medium">{order.total}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{order.address}</p>
                      </div>
                      <Button size="sm" onClick={() => handleOpenAssignDialog(order)} disabled={availableDrivers.length === 0}>
                        <ArrowRight className="mr-1 h-3 w-3" />
                        Assign Driver
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Assigned & In Progress Orders */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Active Deliveries</h3>
                  <Badge className="bg-blue-100 text-blue-800">{assignedOrders.length}</Badge>
                </div>
              </div>
              {assignedOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Navigation className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No active deliveries</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignedOrders.map((order) => {
                    const assignedDriver = drivers.find(d => d.id === order.assignedDriver);
                    return (
                      <div key={order.id} className="rounded-lg border border-border p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{order.id}</span>
                            <Badge className={getOrderStatusColor(order.status)}>{order.status}</Badge>
                            <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {order.estimatedTime && (
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                ETA: {order.estimatedTime}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{order.customer}</p>
                            <p className="text-xs text-muted-foreground">{order.phone}</p>
                            <p className="text-xs text-muted-foreground">{order.address}, {order.area}</p>
                            <p className="text-sm font-medium mt-2">{order.items} items • {order.total}</p>
                          </div>
                          
                          <div className="space-y-2">
                            {assignedDriver && (
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {assignedDriver.name.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{assignedDriver.name}</p>
                                  <p className="text-xs text-muted-foreground">{assignedDriver.vehicle} • {assignedDriver.phone}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                          <Select 
                            value={order.status} 
                            onValueChange={(v) => handleUpdateOrderStatus(order.id, v as DeliveryOrder["status"])}
                          >
                            <SelectTrigger className="h-8 w-32 bg-background">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                              <SelectItem value="Assigned">Assigned</SelectItem>
                              <SelectItem value="Picked Up">Picked Up</SelectItem>
                              <SelectItem value="In Transit">In Transit</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="outline" onClick={() => handleReassignOrder(order)}>
                            <RefreshCw className="mr-1 h-3 w-3" />
                            Reassign
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleUnassignOrder(order)}>
                            <XCircle className="mr-1 h-3 w-3" />
                            Unassign
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Available Drivers Quick View */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">Available Drivers</h3>
                  <Badge className="bg-green-100 text-green-800">{availableDrivers.length}</Badge>
                </div>
              </div>
              {availableDrivers.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Car className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No drivers available</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {availableDrivers.map((driver) => (
                    <div key={driver.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {driver.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{driver.name}</p>
                        <p className="text-xs text-muted-foreground">{driver.vehicle} • {driver.currentLocation}</p>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-3 w-3 fill-yellow-500" />
                        <span className="text-xs font-medium">{driver.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Assign Order Dialog */}
      <Dialog open={assignOrderDialogOpen} onOpenChange={setAssignOrderDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Assign Order to Driver</DialogTitle>
            <DialogDescription>
              {selectedOrderForAssign && `Select a driver for order ${selectedOrderForAssign.id}`}
            </DialogDescription>
          </DialogHeader>
          {selectedOrderForAssign && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-3 bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getPriorityColor(selectedOrderForAssign.priority)}>
                    {selectedOrderForAssign.priority}
                  </Badge>
                  <span className="font-medium">{selectedOrderForAssign.total}</span>
                </div>
                <p className="text-sm">{selectedOrderForAssign.customer} • {selectedOrderForAssign.area}</p>
                <p className="text-xs text-muted-foreground">{selectedOrderForAssign.address}</p>
              </div>

              <div className="space-y-2">
                <Label>Select Driver</Label>
                <Select value={selectedDriverForAssign} onValueChange={setSelectedDriverForAssign}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Choose a driver" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {availableDrivers.length === 0 ? (
                      <SelectItem value="none" disabled>No drivers available</SelectItem>
                    ) : (
                      availableDrivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          <div className="flex items-center gap-2">
                            <span>{driver.name}</span>
                            <span className="text-muted-foreground">• {driver.vehicle}</span>
                            <span className="text-yellow-600">★ {driver.rating}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOrderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAssignment} disabled={!selectedDriverForAssign}>
              Assign Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Driver Sheet */}
      <Sheet open={!!viewDriver} onOpenChange={() => setViewDriver(null)}>
        <SheetContent className="bg-card overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Driver Details</SheetTitle>
            <SheetDescription>View driver information and performance</SheetDescription>
          </SheetHeader>
          {viewDriver && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {viewDriver.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{viewDriver.name}</h3>
                  <Badge className={statusConfig[viewDriver.status].color}>
                    {viewDriver.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                  <p className="text-2xl font-bold">{viewDriver.todayDeliveries}</p>
                  <p className="text-sm text-muted-foreground">Today</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-2xl font-bold">{viewDriver.totalDeliveries}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </Card>
              </div>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Performance Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold">{viewDriver.rating.toFixed(1)}</span>
                  </div>
                </div>
                <Progress value={viewDriver.rating * 20} className="h-2" />
              </Card>

              <div className="space-y-3">
                <h4 className="font-medium">Vehicle Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span>{viewDriver.vehicle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plate Number</span>
                    <span>{viewDriver.plateNumber}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Contact</h4>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {viewDriver.phone}
                </div>
              </div>

              <div className="flex gap-2">
                {viewDriver.status === "Available" && (
                  <Button className="flex-1" onClick={() => handleAssignOrder(viewDriver)}>
                    Assign Order
                  </Button>
                )}
                <Button variant="outline" className="flex-1" onClick={() => handleTrackDriver(viewDriver)}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Track Location
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Driver Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Add New Driver</DialogTitle>
            <DialogDescription>Add a new driver to your fleet</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={newDriver.name}
                onChange={(e) => setNewDriver((p) => ({ ...p, name: e.target.value }))}
                placeholder="Ahmed Hassan"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input
                value={newDriver.phone}
                onChange={(e) => setNewDriver((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+965 XXXX XXXX"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={newDriver.email}
                onChange={(e) => setNewDriver((p) => ({ ...p, email: e.target.value }))}
                placeholder="driver@email.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vehicle Type</Label>
                <Select
                  value={newDriver.vehicle}
                  onValueChange={(v) => setNewDriver((p) => ({ ...p, vehicle: v }))}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="Van">Van</SelectItem>
                    <SelectItem value="Car">Car</SelectItem>
                    <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Plate Number</Label>
                <Input
                  value={newDriver.plateNumber}
                  onChange={(e) => setNewDriver((p) => ({ ...p, plateNumber: e.target.value }))}
                  placeholder="KWT 1234"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDriver}>Add Driver</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Driver Dialog */}
      <Dialog open={!!editDriver} onOpenChange={() => setEditDriver(null)}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
            <DialogDescription>Update driver information</DialogDescription>
          </DialogHeader>
          {editDriver && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editDriver.name}
                  onChange={(e) => setEditDriver((p) => p ? { ...p, name: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={editDriver.phone}
                  onChange={(e) => setEditDriver((p) => p ? { ...p, phone: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editDriver.email}
                  onChange={(e) => setEditDriver((p) => p ? { ...p, email: e.target.value } : null)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vehicle Type</Label>
                  <Select
                    value={editDriver.vehicle}
                    onValueChange={(v) => setEditDriver((p) => p ? { ...p, vehicle: v } : null)}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="Van">Van</SelectItem>
                      <SelectItem value="Car">Car</SelectItem>
                      <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Plate Number</Label>
                  <Input
                    value={editDriver.plateNumber}
                    onChange={(e) => setEditDriver((p) => p ? { ...p, plateNumber: e.target.value } : null)}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDriver(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDriver}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
