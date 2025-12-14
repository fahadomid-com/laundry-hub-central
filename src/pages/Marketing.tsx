import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  Gift,
  TrendingUp,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Promotion {
  id: string;
  name: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  usageCount: number;
  usageLimit: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
}

const initialPromotions: Promotion[] = [
  { id: "1", name: "New Customer Discount", code: "WELCOME20", discount: 20, type: "percentage", usageCount: 45, usageLimit: 100, validFrom: "Dec 1, 2025", validUntil: "Dec 31, 2025", active: true },
  { id: "2", name: "Holiday Special", code: "HOLIDAY15", discount: 15, type: "percentage", usageCount: 78, usageLimit: 200, validFrom: "Dec 15, 2025", validUntil: "Jan 5, 2026", active: true },
  { id: "3", name: "Free Delivery", code: "FREEDEL", discount: 3, type: "fixed", usageCount: 120, usageLimit: 500, validFrom: "Dec 1, 2025", validUntil: "Dec 31, 2025", active: true },
  { id: "4", name: "VIP Exclusive", code: "VIP30", discount: 30, type: "percentage", usageCount: 12, usageLimit: 50, validFrom: "Dec 1, 2025", validUntil: "Dec 31, 2025", active: false },
];

export default function Marketing() {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [createPromoOpen, setCreatePromoOpen] = useState(false);
  const [editPromo, setEditPromo] = useState<Promotion | null>(null);
  const { toast } = useToast();

  const [newPromo, setNewPromo] = useState({
    name: "",
    code: "",
    discount: 0,
    type: "percentage" as "percentage" | "fixed",
    usageLimit: 100,
    validFrom: "",
    validUntil: "",
    audience: "All Customers",
  });

  const handleCreatePromo = () => {
    if (!newPromo.name || !newPromo.code) return;
    const promo: Promotion = {
      id: String(promotions.length + 1),
      ...newPromo,
      usageCount: 0,
      active: true,
    };
    setPromotions((prev) => [...prev, promo]);
    setNewPromo({ name: "", code: "", discount: 0, type: "percentage", usageLimit: 100, validFrom: "", validUntil: "", audience: "All Customers" });
    setCreatePromoOpen(false);
    toast({ title: "Promo code created", description: `${promo.code} is now active` });
  };

  const handleTogglePromo = (id: string) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied", description: `${code} copied to clipboard` });
  };

  const handleDeletePromo = (id: string) => {
    const promo = promotions.find((p) => p.id === id);
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Promo deleted", description: `${promo?.code} has been removed` });
  };

  const handleEditPromo = (promo: Promotion) => {
    setEditPromo(promo);
  };

  const handleUpdatePromo = () => {
    if (!editPromo) return;
    setPromotions((prev) => prev.map((p) => (p.id === editPromo.id ? editPromo : p)));
    setEditPromo(null);
    toast({ title: "Promo updated", description: `${editPromo.code} has been updated` });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Marketing</h1>
            <p className="mt-1 text-muted-foreground">Promotions and customer engagement</p>
          </div>
          <Button onClick={() => setCreatePromoOpen(true)}>
            <Gift className="mr-2 h-4 w-4" />
            Create Promo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Gift className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{promotions.length}</p>
                <p className="text-sm text-muted-foreground">Total Promo Codes</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-green-50 dark:bg-green-950/20">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{promotions.filter((p) => p.active).length}</p>
                <p className="text-sm text-muted-foreground">Active Promos</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Promo Codes Section */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Promo Codes</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promo) => (
              <Card key={promo.id} className={`p-4 ${!promo.active && "opacity-60"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{promo.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="font-mono">
                        {promo.code}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopyCode(promo.code)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Switch checked={promo.active} onCheckedChange={() => handleTogglePromo(promo.id)} />
                </div>

                <div className="mt-4">
                  <p className="text-2xl font-bold text-primary">
                    {promo.type === "percentage" ? `${promo.discount}%` : `KD ${promo.discount}`} OFF
                  </p>
                </div>

                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <p>Used: {promo.usageCount} / {promo.usageLimit}</p>
                  <p>Valid: {promo.validFrom} - {promo.validUntil}</p>
                </div>

                <div className="mt-3 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(promo.usageCount / promo.usageLimit) * 100}%` }}
                  />
                </div>

                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditPromo(promo)}>
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDeletePromo(promo.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      {/* Create Promo Dialog */}
      <Dialog open={createPromoOpen} onOpenChange={setCreatePromoOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Create Promo Code</DialogTitle>
            <DialogDescription>Set up a new promotional discount</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Promo Name</Label>
              <Input
                value={newPromo.name}
                onChange={(e) => setNewPromo((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g., New Customer Discount"
              />
            </div>
            <div className="space-y-2">
              <Label>Code</Label>
              <Input
                value={newPromo.code}
                onChange={(e) => setNewPromo((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                placeholder="e.g., SAVE20"
                className="font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={newPromo.type}
                  onValueChange={(v) => setNewPromo((p) => ({ ...p, type: v as "percentage" | "fixed" }))}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (KD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Discount Value</Label>
                <Input
                  type="number"
                  value={newPromo.discount}
                  onChange={(e) => setNewPromo((p) => ({ ...p, discount: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select
                value={newPromo.audience}
                onValueChange={(v) => setNewPromo((p) => ({ ...p, audience: v }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="All Customers">All Customers</SelectItem>
                  <SelectItem value="Platinum">Platinum</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="No Membership">No Membership</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Usage Limit</Label>
                <Input
                  type="number"
                  value={newPromo.usageLimit}
                  onChange={(e) => setNewPromo((p) => ({ ...p, usageLimit: parseInt(e.target.value) || 100 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Valid Until</Label>
                <Input
                  value={newPromo.validUntil}
                  onChange={(e) => setNewPromo((p) => ({ ...p, validUntil: e.target.value }))}
                  placeholder="Dec 31, 2025"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreatePromoOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePromo}>Create Promo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Promo Dialog */}
      <Dialog open={!!editPromo} onOpenChange={() => setEditPromo(null)}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Edit Promo Code</DialogTitle>
            <DialogDescription>Update promotional discount details</DialogDescription>
          </DialogHeader>
          {editPromo && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Promo Name</Label>
                <Input
                  value={editPromo.name}
                  onChange={(e) => setEditPromo((p) => p ? { ...p, name: e.target.value } : null)}
                  placeholder="e.g., New Customer Discount"
                />
              </div>
              <div className="space-y-2">
                <Label>Code</Label>
                <Input
                  value={editPromo.code}
                  onChange={(e) => setEditPromo((p) => p ? { ...p, code: e.target.value.toUpperCase() } : null)}
                  placeholder="e.g., SAVE20"
                  className="font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select
                    value={editPromo.type}
                    onValueChange={(v) => setEditPromo((p) => p ? { ...p, type: v as "percentage" | "fixed" } : null)}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (KD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Discount Value</Label>
                  <Input
                    type="number"
                    value={editPromo.discount}
                    onChange={(e) => setEditPromo((p) => p ? { ...p, discount: parseFloat(e.target.value) || 0 } : null)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Usage Limit</Label>
                  <Input
                    type="number"
                    value={editPromo.usageLimit}
                    onChange={(e) => setEditPromo((p) => p ? { ...p, usageLimit: parseInt(e.target.value) || 100 } : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valid Until</Label>
                  <Input
                    value={editPromo.validUntil}
                    onChange={(e) => setEditPromo((p) => p ? { ...p, validUntil: e.target.value } : null)}
                    placeholder="Dec 31, 2025"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPromo(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePromo}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
