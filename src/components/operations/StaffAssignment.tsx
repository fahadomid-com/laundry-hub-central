import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Briefcase, Clock, CheckCircle, Coffee, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Staff {
  id: string;
  name: string;
  role: "washer" | "driver" | "ironer" | "manager";
  status: "available" | "busy" | "break";
  currentTask?: string;
  completedToday: number;
  shift: string;
}

const initialStaff: Staff[] = [
  { id: "S-001", name: "Ahmed Hassan", role: "washer", status: "busy", currentTask: "Processing ORD-001", completedToday: 12, shift: "9AM - 5PM" },
  { id: "S-002", name: "Mohammed Ali", role: "driver", status: "busy", currentTask: "Delivery to Salmiya", completedToday: 8, shift: "8AM - 4PM" },
  { id: "S-003", name: "Fatima Omar", role: "ironer", status: "available", completedToday: 15, shift: "10AM - 6PM" },
  { id: "S-004", name: "Hassan Khalid", role: "driver", status: "break", completedToday: 6, shift: "9AM - 5PM" },
  { id: "S-005", name: "Sara Ahmad", role: "washer", status: "available", completedToday: 10, shift: "8AM - 4PM" },
  { id: "S-006", name: "Ali Mahmoud", role: "manager", status: "busy", currentTask: "Supervising floor", completedToday: 0, shift: "8AM - 6PM" },
];

const tasks = [
  "Process ORD-007",
  "Process ORD-008",
  "Pickup from Hawally",
  "Delivery to Kuwait City",
  "Iron Station 1",
  "Quality Check ORD-003",
  "Inventory Count",
];

const roleConfig = {
  washer: { label: "Washer", color: "bg-info/10 text-info" },
  driver: { label: "Driver", color: "bg-success/10 text-success" },
  ironer: { label: "Ironer", color: "bg-warning/10 text-warning" },
  manager: { label: "Manager", color: "bg-primary/10 text-primary" },
};

const statusConfig = {
  available: { variant: "success" as const, label: "Available", icon: CheckCircle },
  busy: { variant: "info" as const, label: "Busy", icon: Briefcase },
  break: { variant: "warning" as const, label: "On Break", icon: Coffee },
};

export function StaffAssignment() {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedTask, setSelectedTask] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const { toast } = useToast();

  const filteredStaff = staff.filter((s) => roleFilter === "all" || s.role === roleFilter);

  const handleAssignTask = () => {
    if (!selectedStaff || !selectedTask) return;

    setStaff((prev) =>
      prev.map((s) =>
        s.id === selectedStaff.id ? { ...s, status: "busy", currentTask: selectedTask } : s
      )
    );

    toast({ title: "Task assigned", description: `${selectedTask} assigned to ${selectedStaff.name}` });
    setAssignDialogOpen(false);
    setSelectedStaff(null);
    setSelectedTask("");
  };

  const handleSetBreak = (staffMember: Staff) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffMember.id ? { ...s, status: "break", currentTask: undefined } : s
      )
    );
    toast({ title: "Status updated", description: `${staffMember.name} is now on break` });
  };

  const handleEndBreak = (staffMember: Staff) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffMember.id ? { ...s, status: "available", currentTask: undefined } : s
      )
    );
    toast({ title: "Status updated", description: `${staffMember.name} is now available` });
  };

  const handleCompleteTask = (staffMember: Staff) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffMember.id
          ? { ...s, status: "available", currentTask: undefined, completedToday: s.completedToday + 1 }
          : s
      )
    );
    toast({ title: "Task completed", description: `${staffMember.name} completed their task` });
  };

  const openAssignDialog = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setAssignDialogOpen(true);
  };

  const availableCount = staff.filter((s) => s.status === "available").length;
  const busyCount = staff.filter((s) => s.status === "busy").length;

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="p-4 bg-card">
            <p className="text-sm text-muted-foreground">Total Staff</p>
            <p className="text-2xl font-bold">{staff.length}</p>
          </Card>
          <Card className="p-4 bg-success/10 border-success/20">
            <p className="text-sm text-muted-foreground">Available</p>
            <p className="text-2xl font-bold text-success">{availableCount}</p>
          </Card>
          <Card className="p-4 bg-info/10 border-info/20">
            <p className="text-sm text-muted-foreground">Busy</p>
            <p className="text-2xl font-bold text-info">{busyCount}</p>
          </Card>
          <Card className="p-4 bg-warning/10 border-warning/20">
            <p className="text-sm text-muted-foreground">On Break</p>
            <p className="text-2xl font-bold text-warning">
              {staff.filter((s) => s.status === "break").length}
            </p>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Staff Members</h3>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40 bg-background">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="washer">Washers</SelectItem>
              <SelectItem value="driver">Drivers</SelectItem>
              <SelectItem value="ironer">Ironers</SelectItem>
              <SelectItem value="manager">Managers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStaff.map((staffMember) => {
            const statusInfo = statusConfig[staffMember.status];
            const StatusIcon = statusInfo.icon;
            const roleInfo = roleConfig[staffMember.role];

            return (
              <Card key={staffMember.id} className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {staffMember.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{staffMember.name}</h4>
                      <Badge variant={statusInfo.variant}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${roleInfo.color}`}>
                        {roleInfo.label}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{staffMember.shift}</span>
                      </div>
                      {staffMember.currentTask && (
                        <p className="text-sm text-primary">{staffMember.currentTask}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {staffMember.completedToday} tasks completed today
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {staffMember.status === "available" && (
                    <>
                      <Button size="sm" onClick={() => openAssignDialog(staffMember)}>
                        <Plus className="mr-1 h-4 w-4" />
                        Assign Task
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleSetBreak(staffMember)}>
                        <Coffee className="mr-1 h-4 w-4" />
                        Break
                      </Button>
                    </>
                  )}
                  {staffMember.status === "busy" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-success text-success-foreground hover:bg-success/90"
                        onClick={() => handleCompleteTask(staffMember)}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Complete
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openAssignDialog(staffMember)}>
                        Reassign
                      </Button>
                    </>
                  )}
                  {staffMember.status === "break" && (
                    <Button size="sm" onClick={() => handleEndBreak(staffMember)}>
                      End Break
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Assign Task</DialogTitle>
            <DialogDescription>
              Assign a task to {selectedStaff?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedTask} onValueChange={setSelectedTask}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select a task" />
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
              Assign Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
