import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Send, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvoicingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const invoices = [
  { id: "INV-001", customer: "John Doe", amount: "KD45.50", status: "Paid", date: "Dec 12, 2025" },
  { id: "INV-002", customer: "Jane Smith", amount: "KD28.75", status: "Paid", date: "Dec 12, 2025" },
  { id: "INV-003", customer: "Mike Johnson", amount: "KD65.00", status: "Pending", date: "Dec 11, 2025" },
  { id: "INV-004", customer: "Sarah Wilson", amount: "KD35.25", status: "Pending", date: "Dec 11, 2025" },
  { id: "INV-005", customer: "Michael Brown", amount: "KD22.00", status: "Overdue", date: "Dec 05, 2025" },
];

const statusConfig = {
  Paid: { variant: "success" as const, icon: CheckCircle },
  Pending: { variant: "warning" as const, icon: Clock },
  Overdue: { variant: "destructive" as const, icon: AlertCircle },
};

export function InvoicingSheet({ open, onOpenChange }: InvoicingSheetProps) {
  const { toast } = useToast();

  const handleSendReminder = (invoiceId: string) => {
    toast({ title: "Reminder sent", description: `Payment reminder sent for ${invoiceId}` });
  };

  const handleDownload = (invoiceId: string) => {
    toast({ title: "Downloading", description: `Downloading ${invoiceId}.pdf` });
  };

  const totalPending = invoices
    .filter((inv) => inv.status !== "Paid")
    .reduce((sum, inv) => sum + parseFloat(inv.amount.replace("KD", "")), 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl bg-card overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Invoicing & Collection</SheetTitle>
          <SheetDescription>Manage invoices and collect payments</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-success/10 p-4">
              <p className="text-sm text-muted-foreground">Total Collected</p>
              <p className="text-2xl font-bold text-success">KD74.25</p>
            </div>
            <div className="rounded-lg border border-border bg-warning/10 p-4">
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <p className="text-2xl font-bold text-warning">KD{totalPending.toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Recent Invoices</h3>
            {invoices.map((invoice) => {
              const config = statusConfig[invoice.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;

              return (
                <div key={invoice.id} className="rounded-lg border border-border bg-background p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{invoice.id}</span>
                          <Badge variant={config.variant}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {invoice.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{invoice.customer}</p>
                        <p className="text-xs text-muted-foreground">{invoice.date}</p>
                      </div>
                    </div>
                    <p className="font-semibold">{invoice.amount}</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => handleDownload(invoice.id)}>
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                    {invoice.status !== "Paid" && (
                      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => handleSendReminder(invoice.id)}>
                        <Send className="mr-1 h-3 w-3" />
                        Send Reminder
                      </Button>
                    )}
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
