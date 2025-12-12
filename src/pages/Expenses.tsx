import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Filter, Download, Droplets, Zap, Truck, Users, MoreHorizontal, Pencil, Trash2, Receipt } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const defaultCategories = ["Supplies", "Utilities", "Transport", "Salary", "Maintenance", "Equipment", "Other"];

const initialExpenses = [
  { id: 1, category: "Supplies", description: "Detergent bulk order", amount: 120.00, date: "2025-12-12", status: "Paid" },
  { id: 2, category: "Utilities", description: "Electricity bill", amount: 85.50, date: "2025-12-10", status: "Paid" },
  { id: 3, category: "Transport", description: "Fuel for delivery van", amount: 45.00, date: "2025-12-09", status: "Paid" },
  { id: 4, category: "Salary", description: "Staff wages - Week 49", amount: 850.00, date: "2025-12-08", status: "Paid" },
  { id: 5, category: "Maintenance", description: "Washing machine repair", amount: 200.00, date: "2025-12-07", status: "Pending" },
  { id: 6, category: "Supplies", description: "Hangers and packaging", amount: 65.00, date: "2025-12-06", status: "Paid" },
  { id: 7, category: "Equipment", description: "New iron purchase", amount: 150.00, date: "2025-12-05", status: "Paid" },
  { id: 8, category: "Utilities", description: "Water bill", amount: 42.00, date: "2025-12-04", status: "Pending" },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Supplies": return Droplets;
    case "Utilities": return Zap;
    case "Transport": return Truck;
    case "Salary": return Users;
    default: return Receipt;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Supplies": return "bg-blue-500/10 text-blue-500";
    case "Utilities": return "bg-yellow-500/10 text-yellow-500";
    case "Transport": return "bg-green-500/10 text-green-500";
    case "Salary": return "bg-purple-500/10 text-purple-500";
    case "Maintenance": return "bg-orange-500/10 text-orange-500";
    case "Equipment": return "bg-cyan-500/10 text-cyan-500";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function Expenses() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<typeof initialExpenses[0] | null>(null);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  
  // Form states
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Pending");
  
  const { toast } = useToast();

  const allCategories = [...defaultCategories, ...customCategories];

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const paidExpenses = expenses.filter(e => e.status === "Paid").reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === "Pending").reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) {
      toast({ title: "Missing fields", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    
    const newExpense = {
      id: expenses.length + 1,
      description,
      amount: parseFloat(amount),
      category,
      date,
      status
    };
    
    setExpenses([newExpense, ...expenses]);
    toast({ title: "Expense added", description: "New expense has been recorded" });
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({ title: "Invalid name", description: "Please enter a category name", variant: "destructive" });
      return;
    }
    if (allCategories.includes(newCategoryName.trim())) {
      toast({ title: "Already exists", description: "This category already exists", variant: "destructive" });
      return;
    }
    setCustomCategories([...customCategories, newCategoryName.trim()]);
    setCategory(newCategoryName.trim());
    setNewCategoryName("");
    setShowAddCategory(false);
    toast({ title: "Category added", description: `"${newCategoryName.trim()}" added to expense types` });
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter(e => e.id !== id));
    toast({ title: "Expense deleted", description: "Expense has been removed" });
  };

  const handleEditExpense = (expense: typeof initialExpenses[0]) => {
    setEditingExpense(expense);
    setDescription(expense.description);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDate(expense.date);
    setStatus(expense.status);
    setIsEditDialogOpen(true);
  };

  const handleUpdateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense || !description || !amount || !category || !date) {
      toast({ title: "Missing fields", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    
    setExpenses(expenses.map(exp => 
      exp.id === editingExpense.id 
        ? { ...exp, description, amount: parseFloat(amount), category, date, status }
        : exp
    ));
    toast({ title: "Expense updated", description: "Expense has been updated" });
    resetForm();
    setIsEditDialogOpen(false);
    setEditingExpense(null);
  };

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setCategory("");
    setDate("");
    setStatus("Pending");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Expenses</h1>
            <p className="text-muted-foreground">Track and manage business expenses</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddExpense} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input 
                      placeholder="Enter expense description" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={100}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Amount (KD)</Label>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input 
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    {showAddCategory ? (
                      <div className="flex gap-2">
                        <Input
                          placeholder="New category name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          maxLength={50}
                          className="flex-1"
                        />
                        <Button type="button" size="sm" onClick={handleAddCategory}>Add</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => { setShowAddCategory(false); setNewCategoryName(""); }}>Cancel</Button>
                      </div>
                    ) : (
                      <Select value={category} onValueChange={(val) => {
                        if (val === "__add_new__") {
                          setShowAddCategory(true);
                        } else {
                          setCategory(val);
                        }
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {allCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                          <SelectItem value="__add_new__" className="text-primary">
                            <span className="flex items-center gap-1">
                              <Plus className="h-3 w-3" /> Add Expense Type
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="flex-1">Add Expense</Button>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KD {totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">KD {paidExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{expenses.filter(e => e.status === "Paid").length} expenses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">KD {pendingExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{expenses.filter(e => e.status === "Pending").length} expenses</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search expenses..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">All Categories</SelectItem>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => {
                  const Icon = getCategoryIcon(expense.category);
                  return (
                    <TableRow key={expense.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${getCategoryColor(expense.category)}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{expense.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell className="text-muted-foreground">{expense.date}</TableCell>
                      <TableCell className="font-medium">KD {expense.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={expense.status === "Paid" ? "default" : "secondary"} className={expense.status === "Paid" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}>
                          {expense.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem onClick={() => handleEditExpense(expense)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteExpense(expense.id)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredExpenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No expenses found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Expense Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            resetForm();
            setEditingExpense(null);
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateExpense} className="space-y-4">
              <div className="space-y-2">
                <Label>Description</Label>
                <Input 
                  placeholder="Enter expense description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={100}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount (KD)</Label>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                {showAddCategory ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="New category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      maxLength={50}
                      className="flex-1"
                    />
                    <Button type="button" size="sm" onClick={handleAddCategory}>Add</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => { setShowAddCategory(false); setNewCategoryName(""); }}>Cancel</Button>
                  </div>
                ) : (
                  <Select value={category} onValueChange={(val) => {
                    if (val === "__add_new__") {
                      setShowAddCategory(true);
                    } else {
                      setCategory(val);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {allCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                      <SelectItem value="__add_new__" className="text-primary">
                        <span className="flex items-center gap-1">
                          <Plus className="h-3 w-3" /> Add Expense Type
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">Update Expense</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
