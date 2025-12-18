import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  Receipt,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  Building2,
  MapPin,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: "completed" | "pending" | "failed";
  branch: string;
}

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  issuedDate: string;
  branch: string;
}

const branches = ["Salmiya", "Bayan", "Mishrif", "Yarmouk", "Hawally"];

const initialTransactions: Transaction[] = [
  { id: "1", type: "income", category: "Sales", description: "Order ORD-001", amount: 45.50, date: "Dec 12, 2025", paymentMethod: "Card", status: "completed", branch: "Salmiya" },
  { id: "2", type: "income", category: "Sales", description: "Order ORD-002", amount: 28.75, date: "Dec 12, 2025", paymentMethod: "Cash", status: "completed", branch: "Bayan" },
  { id: "3", type: "expense", category: "Supplies", description: "Detergent purchase", amount: 120.00, date: "Dec 11, 2025", paymentMethod: "Card", status: "completed", branch: "Mishrif" },
  { id: "4", type: "expense", category: "Utilities", description: "Electricity bill", amount: 85.00, date: "Dec 10, 2025", paymentMethod: "Bank Transfer", status: "completed", branch: "Salmiya" },
  { id: "5", type: "income", category: "Sales", description: "Order ORD-003", amount: 65.00, date: "Dec 10, 2025", paymentMethod: "Card", status: "pending", branch: "Yarmouk" },
  { id: "6", type: "expense", category: "Salary", description: "Staff salaries", amount: 1500.00, date: "Dec 1, 2025", paymentMethod: "Bank Transfer", status: "completed", branch: "Hawally" },
  { id: "7", type: "income", category: "Sales", description: "Order ORD-004", amount: 35.25, date: "Dec 9, 2025", paymentMethod: "Cash", status: "completed", branch: "Bayan" },
  { id: "8", type: "expense", category: "Maintenance", description: "Machine repair", amount: 200.00, date: "Dec 8, 2025", paymentMethod: "Cash", status: "completed", branch: "Salmiya" },
];

const initialInvoices: Invoice[] = [
  { id: "INV-001", customer: "ABC Corp", amount: 450.00, status: "paid", dueDate: "Dec 15, 2025", issuedDate: "Dec 1, 2025", branch: "Salmiya" },
  { id: "INV-002", customer: "XYZ Ltd", amount: 320.00, status: "pending", dueDate: "Dec 20, 2025", issuedDate: "Dec 5, 2025", branch: "Bayan" },
  { id: "INV-003", customer: "Tech Inc", amount: 180.00, status: "overdue", dueDate: "Dec 5, 2025", issuedDate: "Nov 20, 2025", branch: "Mishrif" },
  { id: "INV-004", customer: "Global Co", amount: 275.00, status: "pending", dueDate: "Dec 25, 2025", issuedDate: "Dec 10, 2025", branch: "Yarmouk" },
];

export default function Finance() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const { toast } = useToast();

  const [newTransaction, setNewTransaction] = useState({
    type: "income" as "income" | "expense",
    category: "",
    description: "",
    amount: 0,
    paymentMethod: "Cash",
    branch: "",
  });

  // Filter data by branch
  const branchFilteredTransactions = branchFilter === "all" 
    ? transactions 
    : transactions.filter((t) => t.branch === branchFilter);
  
  const branchFilteredInvoices = branchFilter === "all"
    ? invoices
    : invoices.filter((inv) => inv.branch === branchFilter);

  const totalIncome = branchFilteredTransactions.filter((t) => t.type === "income" && t.status === "completed").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = branchFilteredTransactions.filter((t) => t.type === "expense" && t.status === "completed").reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const pendingPayments = branchFilteredTransactions.filter((t) => t.status === "pending").reduce((sum, t) => sum + t.amount, 0);

  const filteredTransactions = branchFilteredTransactions.filter((t) => {
    return typeFilter === "all" || t.type === typeFilter;
  });

  const handleAddTransaction = () => {
    if (!newTransaction.category || !newTransaction.amount) return;
    const transaction: Transaction = {
      id: String(transactions.length + 1),
      ...newTransaction,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "completed",
    };
    setTransactions((prev) => [transaction, ...prev]);
    setNewTransaction({ type: "income", category: "", description: "", amount: 0, paymentMethod: "Cash", branch: "" });
    setAddTransactionOpen(false);
    toast({ title: "Transaction added", description: `${transaction.type === "income" ? "Income" : "Expense"} of KD${transaction.amount.toFixed(2)} recorded` });
  };

  const handleMarkInvoicePaid = (id: string) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: "paid" as const } : inv)));
    toast({ title: "Invoice paid", description: `${id} marked as paid` });
  };

  const handleSendReminder = (invoice: Invoice) => {
    toast({ title: "Reminder sent", description: `Payment reminder sent to ${invoice.customer}` });
  };

  const handleExportReport = () => {
    toast({ title: "Exporting", description: "Financial report is being exported" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Finance</h1>
            <p className="mt-1 text-muted-foreground">Track revenue, expenses, and payments</p>
          </div>
          <div className="flex gap-2">
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-[160px] bg-background">
                <Building2 className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">KD{totalIncome.toFixed(2)}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              +12.5% from last month
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">KD{totalExpenses.toFixed(2)}</p>
              </div>
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-red-600">
              <ArrowDownRight className="mr-1 h-4 w-4" />
              -8.3% from last month
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  KD{netProfit.toFixed(2)}
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <PiggyBank className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {((netProfit / totalIncome) * 100).toFixed(1)}% profit margin
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold text-yellow-600">KD{pendingPayments.toFixed(2)}</p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
                <Wallet className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {transactions.filter((t) => t.status === "pending").length} pending transactions
            </div>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Transactions</h3>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-32 bg-background">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-full p-2 ${
                          transaction.type === "income"
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-red-100 dark:bg-red-900/30"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span>{transaction.category}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {transaction.branch}
                          </span>
                          <span>•</span>
                          <span>{transaction.date}</span>
                          <span>•</span>
                          <span>{transaction.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          transaction.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}KD{transaction.amount.toFixed(2)}
                      </p>
                      <Badge
                        variant={transaction.status === "completed" ? "success" : transaction.status === "pending" ? "warning" : "destructive"}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Invoices</h3>
              <div className="space-y-3">
                {branchFilteredInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Receipt className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{invoice.customer}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {invoice.branch}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">KD{invoice.amount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Due: {invoice.dueDate}</p>
                      </div>
                      <Badge
                        variant={invoice.status === "paid" ? "success" : invoice.status === "pending" ? "warning" : "destructive"}
                      >
                        {invoice.status}
                      </Badge>
                      {invoice.status !== "paid" && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleSendReminder(invoice)}>
                            Remind
                          </Button>
                          <Button size="sm" onClick={() => handleMarkInvoicePaid(invoice.id)}>
                            Mark Paid
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={addTransactionOpen} onOpenChange={setAddTransactionOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>Record a new income or expense</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={newTransaction.type}
                onValueChange={(v) => setNewTransaction((p) => ({ ...p, type: v as "income" | "expense" }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={newTransaction.category}
                  onValueChange={(v) => setNewTransaction((p) => ({ ...p, category: v }))}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {newTransaction.type === "income" ? (
                      <>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Services">Services</SelectItem>
                        <SelectItem value="Other Income">Other Income</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="Supplies">Supplies</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Salary">Salary</SelectItem>
                        <SelectItem value="Rent">Rent</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount (KD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction((p) => ({ ...p, amount: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={newTransaction.description}
                onChange={(e) => setNewTransaction((p) => ({ ...p, description: e.target.value }))}
                placeholder="Transaction description"
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={newTransaction.paymentMethod}
                onValueChange={(v) => setNewTransaction((p) => ({ ...p, paymentMethod: v }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTransactionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTransaction}>Add Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
