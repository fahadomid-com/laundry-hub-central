import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Receipt, Truck, Droplets, Zap, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExpenseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultCategories = ["Supplies", "Utilities", "Transport", "Salary", "Other"];

const expenses = [
  { id: 1, category: "Supplies", description: "Detergent bulk order", amount: "KD120.00", date: "Dec 12, 2025", icon: Droplets },
  { id: 2, category: "Utilities", description: "Electricity bill", amount: "KD85.50", date: "Dec 10, 2025", icon: Zap },
  { id: 3, category: "Transport", description: "Delivery fuel costs", amount: "KD45.00", date: "Dec 09, 2025", icon: Truck },
  { id: 4, category: "Salary", description: "Staff wages", amount: "KD500.00", date: "Dec 08, 2025", icon: Users },
  { id: 5, category: "Supplies", description: "Hangers and bags", amount: "KD35.00", date: "Dec 07, 2025", icon: Receipt },
];

export function ExpenseSheet({ open, onOpenChange }: ExpenseSheetProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { toast } = useToast();

  const allCategories = [...defaultCategories, ...customCategories];
  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount.replace("KD", "")), 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || !amount || !category) {
      toast({ title: "Missing fields", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    toast({ title: "Expense added", description: `${description} - KD${amount}` });
    setDescription("");
    setAmount("");
    setCategory("");
    setShowAddForm(false);
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl bg-card overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Expense Management</SheetTitle>
          <SheetDescription>Track and manage business expenses</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="rounded-lg border border-border bg-destructive/10 p-4">
            <p className="text-sm text-muted-foreground">Total Expenses (This Month)</p>
            <p className="text-2xl font-bold text-destructive">KD{totalExpenses.toFixed(2)}</p>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recent Expenses</h3>
            <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="mr-1 h-4 w-4" />
              Add Expense
            </Button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddExpense} className="rounded-lg border border-border bg-background p-4 space-y-3">
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="Enter expense description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={200}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Amount (KD)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.01"
                    min="0"
                  />
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
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select" />
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
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm">Save Expense</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {expenses.map((expense) => {
              const Icon = expense.icon;
              return (
                <div key={expense.id} className="rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.category} • {expense.date}
                      </p>
                    </div>
                    <p className="font-semibold text-destructive">-{expense.amount}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
