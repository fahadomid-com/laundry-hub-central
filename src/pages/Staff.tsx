import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Users,
  CheckCircle,
  Clock,
  Coffee,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Staff {
  id: string;
  name: string;
  role: string;
  status: "Available" | "Busy" | "On Break";
  shift: string;
  currentTask?: string;
  tasksCompleted: number;
}

const defaultRoles = ["Washer", "Driver", "Ironer", "Manager"];

const initialStaff: Staff[] = [
  { id: "1", name: "Ahmed Hassan", role: "Washer", status: "Busy", shift: "9AM - 5PM", currentTask: "Processing ORD-001", tasksCompleted: 12 },
  { id: "2", name: "Mohammed Ali", role: "Driver", status: "Busy", shift: "8AM - 4PM", currentTask: "Delivery to Salmiya", tasksCompleted: 8 },
  { id: "3", name: "Fatima Omar", role: "Ironer", status: "Available", shift: "10AM - 6PM", tasksCompleted: 15 },
  { id: "4", name: "Hassan Khalid", role: "Driver", status: "On Break", shift: "9AM - 5PM", tasksCompleted: 6 },
  { id: "5", name: "Sara Ahmad", role: "Washer", status: "Available", shift: "8AM - 4PM", tasksCompleted: 10 },
  { id: "6", name: "Ali Mahmoud", role: "Manager", status: "Busy", shift: "8AM - 6PM", currentTask: "Supervising floor", tasksCompleted: 0 },
];

const defaultRoleConfig: Record<string, { color: string }> = {
  Washer: { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  Driver: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  Ironer: { color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
  Manager: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
};

const getRoleColor = (role: string) => {
  return defaultRoleConfig[role]?.color || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
};

const statusConfig = {
  Available: { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle },
  Busy: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
  "On Break": { color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", icon: Coffee },
};

const tasks = [
  "Processing ORD-001",
  "Processing ORD-002",
  "Delivery to Salmiya",
  "Delivery to Hawally",
  "Ironing batch #5",
  "Supervising floor",
  "Quality check",
];

export default function Staff() {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [roleFilter, setRoleFilter] = useState("all");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedTask, setSelectedTask] = useState("");
  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "",
    shift: "",
    phone: "",
  });
  const [customRoles, setCustomRoles] = useState<string[]>([]);
  const [showCustomRole, setShowCustomRole] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState("");
  const allRoles = [...defaultRoles, ...customRoles];
  const { toast } = useToast();

  const shiftOptions = [
    "6AM - 2PM",
    "8AM - 4PM",
    "9AM - 5PM",
    "10AM - 6PM",
    "12PM - 8PM",
    "2PM - 10PM",
  ];

  const handleAddCustomRole = () => {
    if (!customRoleInput.trim()) return;
    if (allRoles.includes(customRoleInput.trim())) {
      toast({ title: "Role exists", description: "This role already exists", variant: "destructive" });
      return;
    }
    setCustomRoles((prev) => [...prev, customRoleInput.trim()]);
    setNewStaff({ ...newStaff, role: customRoleInput.trim() });
    setCustomRoleInput("");
    setShowCustomRole(false);
    toast({ title: "Role added", description: `"${customRoleInput.trim()}" has been added as a role` });
  };

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.role || !newStaff.shift) {
      toast({ title: "Missing fields", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    const staffMember: Staff = {
      id: String(Date.now()),
      name: newStaff.name,
      role: newStaff.role,
      status: "Available",
      shift: newStaff.shift,
      tasksCompleted: 0,
    };
    setStaff((prev) => [...prev, staffMember]);
    setNewStaff({ name: "", role: "", shift: "", phone: "" });
    setAddDialogOpen(false);
    toast({ title: "Staff added", description: `${staffMember.name} has been added as ${staffMember.role}` });
  };

  const filteredStaff = staff.filter((s) => {
    return roleFilter === "all" || s.role === roleFilter;
  });

  const stats = {
    total: staff.length,
    available: staff.filter((s) => s.status === "Available").length,
    busy: staff.filter((s) => s.status === "Busy").length,
    onBreak: staff.filter((s) => s.status === "On Break").length,
  };

  const handleCompleteTask = (staffMember: Staff) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffMember.id
          ? { ...s, status: "Available" as const, currentTask: undefined, tasksCompleted: s.tasksCompleted + 1 }
          : s
      )
    );
    toast({ title: "Task Completed", description: `${staffMember.name} has completed the task` });
  };

  const handleAssignTask = () => {
    if (!selectedStaff || !selectedTask) return;
    setStaff((prev) =>
      prev.map((s) =>
        s.id === selectedStaff.id
          ? { ...s, status: "Busy" as const, currentTask: selectedTask }
          : s
      )
    );
    toast({ title: "Task Assigned", description: `${selectedTask} assigned to ${selectedStaff.name}` });
    setAssignDialogOpen(false);
    setSelectedStaff(null);
    setSelectedTask("");
  };

  const handleSetBreak = (staffMember: Staff) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffMember.id ? { ...s, status: "On Break" as const } : s
      )
    );
    toast({ title: "Break Started", description: `${staffMember.name} is now on break` });
  };

  const handleEndBreak = (staffMember: Staff) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffMember.id ? { ...s, status: "Available" as const } : s
      )
    );
    toast({ title: "Break Ended", description: `${staffMember.name} is now available` });
  };

  const openAssignDialog = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setAssignDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Staff</h1>
            <p className="mt-1 text-muted-foreground">Manage staff members and assignments</p>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Staff</p>
            <p className="text-3xl font-bold mt-1">{stats.total}</p>
          </Card>
          <Card className="p-4 bg-green-50 dark:bg-green-950/20">
            <p className="text-sm text-muted-foreground">Available</p>
            <p className="text-3xl font-bold mt-1 text-green-600">{stats.available}</p>
          </Card>
          <Card className="p-4 bg-yellow-50 dark:bg-yellow-950/20">
            <p className="text-sm text-muted-foreground">Busy</p>
            <p className="text-3xl font-bold mt-1 text-yellow-600">{stats.busy}</p>
          </Card>
          <Card className="p-4 bg-orange-50 dark:bg-orange-950/20">
            <p className="text-sm text-muted-foreground">On Break</p>
            <p className="text-3xl font-bold mt-1 text-orange-600">{stats.onBreak}</p>
          </Card>
        </div>

        {/* Staff Members */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Staff Members</h2>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40 bg-background">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Washer">Washers</SelectItem>
                <SelectItem value="Driver">Drivers</SelectItem>
                <SelectItem value="Ironer">Ironers</SelectItem>
                <SelectItem value="Manager">Managers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStaff.map((member) => {
              const StatusIcon = statusConfig[member.status].icon;
              return (
                <Card key={member.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <Badge className={getRoleColor(member.role)}>
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={statusConfig[member.status].color}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {member.status}
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {member.shift}
                    </div>
                    {member.currentTask && (
                      <p className="text-primary font-medium">{member.currentTask}</p>
                    )}
                    <p className="text-muted-foreground">{member.tasksCompleted} tasks completed today</p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {member.status === "Busy" && (
                      <>
                        <Button size="sm" onClick={() => handleCompleteTask(member)}>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Complete
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openAssignDialog(member)}>
                          <RefreshCw className="mr-1 h-3 w-3" />
                          Reassign
                        </Button>
                      </>
                    )}
                    {member.status === "Available" && (
                      <>
                        <Button size="sm" onClick={() => openAssignDialog(member)}>
                          <Plus className="mr-1 h-3 w-3" />
                          Assign Task
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSetBreak(member)}>
                          <Coffee className="mr-1 h-3 w-3" />
                          Break
                        </Button>
                      </>
                    )}
                    {member.status === "On Break" && (
                      <Button size="sm" onClick={() => handleEndBreak(member)}>
                        End Break
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Assign Task Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Assign Task</DialogTitle>
            <DialogDescription>
              {selectedStaff ? `Assign a task to ${selectedStaff.name}` : "Select a task to assign"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedTask} onValueChange={setSelectedTask}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select task" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {tasks.map((task) => (
                  <SelectItem key={task} value={task}>
                    {task}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignTask} disabled={!selectedTask}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Staff Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Add New Staff</DialogTitle>
            <DialogDescription>
              Add a new staff member to the team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+965 XXXX XXXX"
                value={newStaff.phone}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Role *</Label>
              {showCustomRole ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter custom role"
                    value={customRoleInput}
                    onChange={(e) => setCustomRoleInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddCustomRole()}
                  />
                  <Button type="button" onClick={handleAddCustomRole}>Add</Button>
                  <Button type="button" variant="outline" onClick={() => { setShowCustomRole(false); setCustomRoleInput(""); }}>Cancel</Button>
                </div>
              ) : (
                <Select value={newStaff.role} onValueChange={(value) => {
                  if (value === "__add_custom__") {
                    setShowCustomRole(true);
                  } else {
                    setNewStaff({ ...newStaff, role: value });
                  }
                }}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {allRoles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                    <SelectItem value="__add_custom__" className="text-primary">
                      <span className="flex items-center gap-1">
                        <Plus className="h-3 w-3" /> Add Custom Role
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label>Shift *</Label>
              <Select value={newStaff.shift} onValueChange={(value) => setNewStaff({ ...newStaff, shift: value })}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {shiftOptions.map((shift) => (
                    <SelectItem key={shift} value={shift}>
                      {shift}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStaff}>
              Add Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
