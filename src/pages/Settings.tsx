import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Users,
  Shield,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  PenSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: "Admin" | "Employee";
  branch: string;
  status: "Active" | "Inactive";
  lastLogin: string;
  ipAddress: string;
  deviceType: string;
}

interface Permission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  fullAccess: boolean;
}

const initialUsers: User[] = [
  { id: "1", name: "Ahmed Al-Mansouri", email: "ahmed@printo.press", mobile: "+965 9876 5432", role: "Admin", branch: "All Branches", status: "Active", lastLogin: "2024-01-15 14:30", ipAddress: "192.168.1.100", deviceType: "Desktop" },
  { id: "2", name: "Fatima Al-Zahra", email: "fatima@printo.press", mobile: "+965 9765 4321", role: "Employee", branch: "Salmiya", status: "Active", lastLogin: "2024-01-15 12:45", ipAddress: "192.168.1.105", deviceType: "Mobile" },
  { id: "3", name: "Omar Hassan", email: "omar@printo.press", mobile: "+965 9654 3210", role: "Employee", branch: "City", status: "Active", lastLogin: "2024-01-15 09:15", ipAddress: "192.168.1.112", deviceType: "Desktop" },
  { id: "4", name: "Noura Al-Sabah", email: "noura@printo.press", mobile: "+965 9543 2109", role: "Employee", branch: "Hawally", status: "Inactive", lastLogin: "2024-01-10 16:20", ipAddress: "192.168.1.98", deviceType: "Tablet" },
  { id: "5", name: "Hasan Al-Rashid", email: "hasan@printo.press", mobile: "+965 9432 1098", role: "Admin", branch: "Salmiya", status: "Active", lastLogin: "2024-01-15 11:30", ipAddress: "192.168.1.120", deviceType: "Desktop" },
];

const modules = [
  "Dashboard",
  "Orders",
  "Catalog",
  "Customers",
  "Drivers",
  "Staff",
  "Finance",
  "Reports",
  "Marketing",
  "Settings",
];

const initialPermissions: Record<string, Permission[]> = {
  Admin: modules.map((module) => ({
    module,
    view: true,
    create: true,
    edit: true,
    delete: true,
    fullAccess: true,
  })),
  Employee: modules.map((module) => ({
    module,
    view: true,
    create: module !== "Settings" && module !== "Finance",
    edit: module !== "Settings" && module !== "Finance",
    delete: false,
    fullAccess: false,
  })),
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [selectedRole, setSelectedRole] = useState<"Admin" | "Employee">("Admin");
  const [permissions, setPermissions] = useState(initialPermissions);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "Employee" as "Admin" | "Employee",
    branch: "Salmiya",
  });

  const branches = ["All Branches", "Salmiya", "City", "Hawally", "Farwaniya"];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = branchFilter === "all" || user.branch === branchFilter;
    return matchesSearch && matchesBranch;
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    const user: User = {
      id: String(users.length + 1),
      ...newUser,
      status: "Active",
      lastLogin: "Never",
      ipAddress: "-",
      deviceType: "-",
    };
    setUsers((prev) => [...prev, user]);
    setNewUser({ name: "", email: "", mobile: "", role: "Employee", branch: "Salmiya" });
    setAddUserOpen(false);
    toast({ title: "User added", description: `${user.name} has been added successfully` });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    toast({ title: "User deleted", description: "User has been removed" });
  };

  const handlePermissionChange = (
    role: "Admin" | "Employee",
    moduleIndex: number,
    field: keyof Permission,
    value: boolean
  ) => {
    setPermissions((prev) => {
      const updated = { ...prev };
      updated[role] = [...updated[role]];
      updated[role][moduleIndex] = { ...updated[role][moduleIndex], [field]: value };

      if (field === "fullAccess" && value) {
        updated[role][moduleIndex].view = true;
        updated[role][moduleIndex].create = true;
        updated[role][moduleIndex].edit = true;
        updated[role][moduleIndex].delete = true;
      }

      return updated;
    });
    toast({ title: "Permission updated", description: "Changes saved automatically" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Users & Roles
            </TabsTrigger>
            <TabsTrigger value="permissions">
              <Shield className="mr-2 h-4 w-4" />
              Permissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <p className="text-muted-foreground">Invite/manage users and roles.</p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                  <SelectTrigger className="w-40 bg-background">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Branch" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">All Branches</SelectItem>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => setAddUserOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Mobile</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Branch</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Last Login</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">IP Address</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Device Type</th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">{user.name}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{user.mobile}</td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{user.branch}</td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <Badge variant={user.status === "Active" ? "success" : "outline"}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{user.lastLogin}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{user.ipAddress}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{user.deviceType}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Role-Based Permissions</h3>
              <p className="text-muted-foreground">Configure access levels for each role across all modules.</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={selectedRole === "Admin" ? "default" : "outline"}
                onClick={() => setSelectedRole("Admin")}
              >
                Admin
              </Button>
              <Button
                variant={selectedRole === "Employee" ? "default" : "outline"}
                onClick={() => setSelectedRole("Employee")}
              >
                Employee
              </Button>
            </div>

            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Module</th>
                      <th className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Eye className="h-5 w-5 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">View</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Plus className="h-5 w-5 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">Create</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <PenSquare className="h-5 w-5 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">Edit</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Trash2 className="h-5 w-5 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">Delete</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-muted-foreground">Full Access</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {permissions[selectedRole].map((perm, index) => (
                      <tr key={perm.module} className="hover:bg-muted/50 transition-colors">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">{perm.module}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={perm.view}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(selectedRole, index, "view", !!checked)
                              }
                            />
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={perm.create}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(selectedRole, index, "create", !!checked)
                              }
                            />
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={perm.edit}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(selectedRole, index, "edit", !!checked)
                              }
                            />
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={perm.delete}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(selectedRole, index, "delete", !!checked)
                              }
                            />
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex justify-center">
                            <Switch
                              checked={perm.fullAccess}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(selectedRole, index, "fullAccess", checked)
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={newUser.name}
                onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))}
                placeholder="Enter name"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label>Mobile</Label>
              <Input
                value={newUser.mobile}
                onChange={(e) => setNewUser((p) => ({ ...p, mobile: e.target.value }))}
                placeholder="+965 XXXX XXXX"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(v) => setNewUser((p) => ({ ...p, role: v as "Admin" | "Employee" }))}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Branch</Label>
                <Select
                  value={newUser.branch}
                  onValueChange={(v) => setNewUser((p) => ({ ...p, branch: v }))}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
