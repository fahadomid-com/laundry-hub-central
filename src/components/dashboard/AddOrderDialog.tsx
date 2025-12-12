import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";

interface AddOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddOrderDialog({ open, onOpenChange }: AddOrderDialogProps) {
  const [customerName, setCustomerName] = useState("");
  const [service, setService] = useState("");
  const [phone, setPhone] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim() || !service || !phone.trim()) {
      toast({ title: "Missing fields", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    toast({ title: "Order created!", description: `New order for ${customerName} has been created.` });
    setCustomerName("");
    setService("");
    setPhone("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>Add a new laundry order to the system.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer Name</Label>
            <Input
              id="customer"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="+965 XXXX XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={20}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="service">Service Type</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="dry-cleaning">Dry Cleaning</SelectItem>
                <SelectItem value="wash-fold">Wash & Fold</SelectItem>
                <SelectItem value="alterations">Alterations</SelectItem>
                <SelectItem value="express-wash">Express Wash</SelectItem>
                <SelectItem value="ironing">Ironing Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
