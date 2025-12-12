import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Clock, User, Phone, Plus, CheckCircle, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  type: "pickup" | "delivery";
  customer: string;
  address: string;
  phone: string;
  time: string;
  status: "scheduled" | "in-transit" | "completed";
  driver?: string;
  orderId: string;
}

const initialTasks: Task[] = [
  { id: "T-001", type: "pickup", customer: "John Doe", address: "Block 5, Street 10, Salmiya", phone: "+965 1234 5678", time: "10:00 AM", status: "scheduled", driver: "Ahmed", orderId: "ORD-007" },
  { id: "T-002", type: "delivery", customer: "Sarah Wilson", address: "Block 3, Street 8, Hawally", phone: "+965 2345 6789", time: "11:30 AM", status: "in-transit", driver: "Mohammed", orderId: "ORD-004" },
  { id: "T-003", type: "pickup", customer: "Emily Davis", address: "Block 1, Street 2, Kuwait City", phone: "+965 3456 7890", time: "2:00 PM", status: "scheduled", orderId: "ORD-008" },
  { id: "T-004", type: "delivery", customer: "Mike Johnson", address: "Block 7, Street 15, Farwaniya", phone: "+965 4567 8901", time: "3:30 PM", status: "completed", driver: "Ali", orderId: "ORD-003" },
];

const drivers = ["Ahmed", "Mohammed", "Ali", "Hassan", "Omar"];

const statusConfig = {
  scheduled: { variant: "warning" as const, label: "Scheduled" },
  "in-transit": { variant: "info" as const, label: "In Transit" },
  completed: { variant: "success" as const, label: "Completed" },
};

export function PickupDelivery() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [filter, setFilter] = useState<"all" | "pickup" | "delivery">("all");
  const [newTask, setNewTask] = useState({
    type: "pickup" as "pickup" | "delivery",
    customer: "",
    address: "",
    phone: "",
    time: "",
    orderId: "",
  });
  const { toast } = useToast();

  const filteredTasks = tasks.filter((t) => filter === "all" || t.type === filter);
  const pendingCount = tasks.filter((t) => t.status !== "completed").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.customer || !newTask.address || !newTask.time) {
      toast({ title: "Missing fields", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const task: Task = {
      id: `T-${String(tasks.length + 1).padStart(3, "0")}`,
      ...newTask,
      status: "scheduled",
    };

    setTasks((prev) => [...prev, task]);
    toast({ title: "Task scheduled", description: `${newTask.type === "pickup" ? "Pickup" : "Delivery"} scheduled for ${newTask.customer}` });
    setNewTask({ type: "pickup", customer: "", address: "", phone: "", time: "", orderId: "" });
    setAddDialogOpen(false);
  };

  const handleAssignDriver = () => {
    if (!selectedTask || !selectedDriver) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === selectedTask.id ? { ...t, driver: selectedDriver } : t))
    );

    toast({ title: "Driver assigned", description: `${selectedDriver} assigned to ${selectedTask.id}` });
    setAssignDialogOpen(false);
    setSelectedTask(null);
    setSelectedDriver("");
  };

  const handleStatusChange = (task: Task, newStatus: Task["status"]) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    toast({ title: "Status updated", description: `${task.id} is now ${statusConfig[newStatus].label}` });
  };

  const openAssignDialog = (task: Task) => {
    setSelectedTask(task);
    setSelectedDriver(task.driver || "");
    setAssignDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-4 bg-warning/10 border-warning/20">
            <p className="text-sm text-muted-foreground">Pending Tasks</p>
            <p className="text-2xl font-bold text-warning">{pendingCount}</p>
          </Card>
          <Card className="p-4 bg-success/10 border-success/20">
            <p className="text-sm text-muted-foreground">Completed Today</p>
            <p className="text-2xl font-bold text-success">{completedCount}</p>
          </Card>
          <Card className="p-4 bg-primary/10 border-primary/20">
            <p className="text-sm text-muted-foreground">Active Drivers</p>
            <p className="text-2xl font-bold text-primary">{drivers.length}</p>
          </Card>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "pickup" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pickup")}
            >
              Pickups
            </Button>
            <Button
              variant={filter === "delivery" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("delivery")}
            >
              Deliveries
            </Button>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Task
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant={task.type === "pickup" ? "info" : "success"}>
                    {task.type === "pickup" ? "Pickup" : "Delivery"}
                  </Badge>
                  <span className="text-sm font-medium">{task.id}</span>
                </div>
                <Badge variant={statusConfig[task.status].variant}>
                  {statusConfig[task.status].label}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{task.customer}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{task.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{task.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{task.time}</span>
                </div>
                {task.driver && (
                  <div className="flex items-center gap-2 text-sm">
                    <Navigation className="h-4 w-4 text-primary" />
                    <span className="font-medium text-primary">Driver: {task.driver}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                {task.status === "scheduled" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openAssignDialog(task)}
                    >
                      {task.driver ? "Reassign" : "Assign Driver"}
                    </Button>
                    {task.driver && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(task, "in-transit")}
                      >
                        Start Trip
                      </Button>
                    )}
                  </>
                )}
                {task.status === "in-transit" && (
                  <Button
                    size="sm"
                    className="bg-success text-success-foreground hover:bg-success/90"
                    onClick={() => handleStatusChange(task, "completed")}
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Complete
                  </Button>
                )}
                {task.status === "completed" && (
                  <span className="text-sm text-success flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Completed
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Schedule Task</DialogTitle>
            <DialogDescription>Add a new pickup or delivery task</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="space-y-2">
              <Label>Task Type</Label>
              <Select
                value={newTask.type}
                onValueChange={(v) => setNewTask((p) => ({ ...p, type: v as "pickup" | "delivery" }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input
                value={newTask.customer}
                onChange={(e) => setNewTask((p) => ({ ...p, customer: e.target.value }))}
                placeholder="Enter customer name"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={newTask.address}
                onChange={(e) => setNewTask((p) => ({ ...p, address: e.target.value }))}
                placeholder="Enter full address"
                maxLength={200}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={newTask.phone}
                  onChange={(e) => setNewTask((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+965 XXXX XXXX"
                  maxLength={20}
                />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  value={newTask.time}
                  onChange={(e) => setNewTask((p) => ({ ...p, time: e.target.value }))}
                  placeholder="e.g., 10:00 AM"
                  maxLength={20}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Order ID (optional)</Label>
              <Input
                value={newTask.orderId}
                onChange={(e) => setNewTask((p) => ({ ...p, orderId: e.target.value }))}
                placeholder="e.g., ORD-007"
                maxLength={20}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Schedule Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Assign Driver</DialogTitle>
            <DialogDescription>
              Assign a driver to {selectedTask?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Select Driver</Label>
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger className="mt-2 bg-background">
                <SelectValue placeholder="Choose a driver" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {drivers.map((driver) => (
                  <SelectItem key={driver} value={driver}>
                    {driver}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignDriver} disabled={!selectedDriver}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
