import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Crown,
  Star,
  Users,
  Percent,
  Gift,
  TrendingUp,
  Check,
  Copy,
  Layers,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MembershipTier {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: "crown" | "star" | "gift";
  discountPercent: number;
  pointsMultiplier: number;
  minSpendRequired: number;
  minOrdersRequired: number;
  benefits: string[];
  isActive: boolean;
  memberCount: number;
  sortOrder: number;
}

const colorOptions = [
  { value: "purple", label: "Purple", bg: "bg-purple-100", text: "text-purple-800", darkBg: "dark:bg-purple-950/30" },
  { value: "yellow", label: "Gold", bg: "bg-yellow-100", text: "text-yellow-800", darkBg: "dark:bg-yellow-950/30" },
  { value: "gray", label: "Silver", bg: "bg-gray-100", text: "text-gray-800", darkBg: "dark:bg-gray-950/30" },
  { value: "blue", label: "Blue", bg: "bg-blue-100", text: "text-blue-800", darkBg: "dark:bg-blue-950/30" },
  { value: "green", label: "Green", bg: "bg-green-100", text: "text-green-800", darkBg: "dark:bg-green-950/30" },
  { value: "rose", label: "Rose", bg: "bg-rose-100", text: "text-rose-800", darkBg: "dark:bg-rose-950/30" },
];

const iconOptions = [
  { value: "crown", label: "Crown", icon: Crown },
  { value: "star", label: "Star", icon: Star },
  { value: "gift", label: "Gift", icon: Gift },
];

const initialTiers: MembershipTier[] = [
  {
    id: "1",
    name: "Platinum",
    description: "Our most exclusive tier with maximum benefits",
    color: "purple",
    icon: "crown",
    discountPercent: 20,
    pointsMultiplier: 3,
    minSpendRequired: 500,
    minOrdersRequired: 50,
    benefits: ["20% discount on all orders", "3x loyalty points", "Priority pickup & delivery", "Free express service", "Exclusive member events"],
    isActive: true,
    memberCount: 24,
    sortOrder: 1,
  },
  {
    id: "2",
    name: "Gold",
    description: "Premium benefits for loyal customers",
    color: "yellow",
    icon: "crown",
    discountPercent: 15,
    pointsMultiplier: 2,
    minSpendRequired: 250,
    minOrdersRequired: 25,
    benefits: ["15% discount on all orders", "2x loyalty points", "Priority pickup", "Free stain treatment"],
    isActive: true,
    memberCount: 67,
    sortOrder: 2,
  },
  {
    id: "3",
    name: "Silver",
    description: "Great value for regular customers",
    color: "gray",
    icon: "star",
    discountPercent: 10,
    pointsMultiplier: 1.5,
    minSpendRequired: 100,
    minOrdersRequired: 10,
    benefits: ["10% discount on all orders", "1.5x loyalty points", "Member-only promotions"],
    isActive: true,
    memberCount: 156,
    sortOrder: 3,
  },
];

const getColorClasses = (color: string) => {
  const option = colorOptions.find((c) => c.value === color);
  return option || colorOptions[0];
};

const getIcon = (iconName: string) => {
  const option = iconOptions.find((i) => i.value === iconName);
  return option?.icon || Star;
};

export default function MembershipTiers() {
  const [tiers, setTiers] = useState<MembershipTier[]>(initialTiers);
  const [addOpen, setAddOpen] = useState(false);
  const [editTier, setEditTier] = useState<MembershipTier | null>(null);
  const [deleteTier, setDeleteTier] = useState<MembershipTier | null>(null);
  const { toast } = useToast();

  const emptyTier: Omit<MembershipTier, "id" | "memberCount" | "sortOrder"> = {
    name: "",
    description: "",
    color: "gray",
    icon: "star",
    discountPercent: 0,
    pointsMultiplier: 1,
    minSpendRequired: 0,
    minOrdersRequired: 0,
    benefits: [],
    isActive: true,
  };

  const [newTier, setNewTier] = useState(emptyTier);
  const [newBenefit, setNewBenefit] = useState("");
  const [editBenefit, setEditBenefit] = useState("");

  const handleAddTier = () => {
    if (!newTier.name) {
      toast({ title: "Error", description: "Tier name is required", variant: "destructive" });
      return;
    }
    const tier: MembershipTier = {
      id: String(Date.now()),
      ...newTier,
      memberCount: 0,
      sortOrder: tiers.length + 1,
    };
    setTiers((prev) => [...prev, tier]);
    setNewTier(emptyTier);
    setNewBenefit("");
    setAddOpen(false);
    toast({ title: "Tier created", description: `${tier.name} tier has been added` });
  };

  const handleUpdateTier = () => {
    if (!editTier) return;
    setTiers((prev) => prev.map((t) => (t.id === editTier.id ? editTier : t)));
    setEditTier(null);
    setEditBenefit("");
    toast({ title: "Tier updated", description: `${editTier.name} tier has been updated` });
  };

  const handleDeleteTier = () => {
    if (!deleteTier) return;
    setTiers((prev) => prev.filter((t) => t.id !== deleteTier.id));
    toast({ title: "Tier deleted", description: `${deleteTier.name} tier has been removed` });
    setDeleteTier(null);
  };

  const handleToggleActive = (tier: MembershipTier) => {
    setTiers((prev) =>
      prev.map((t) => (t.id === tier.id ? { ...t, isActive: !t.isActive } : t))
    );
    toast({
      title: tier.isActive ? "Tier deactivated" : "Tier activated",
      description: `${tier.name} is now ${tier.isActive ? "inactive" : "active"}`,
    });
  };

  const handleDuplicateTier = (tier: MembershipTier) => {
    const duplicate: MembershipTier = {
      ...tier,
      id: String(Date.now()),
      name: `${tier.name} (Copy)`,
      memberCount: 0,
      sortOrder: tiers.length + 1,
    };
    setTiers((prev) => [...prev, duplicate]);
    toast({ title: "Tier duplicated", description: `${duplicate.name} has been created` });
  };

  const addBenefitToNew = () => {
    if (!newBenefit.trim()) return;
    setNewTier((prev) => ({ ...prev, benefits: [...prev.benefits, newBenefit.trim()] }));
    setNewBenefit("");
  };

  const removeBenefitFromNew = (index: number) => {
    setNewTier((prev) => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== index) }));
  };

  const addBenefitToEdit = () => {
    if (!editBenefit.trim() || !editTier) return;
    setEditTier({ ...editTier, benefits: [...editTier.benefits, editBenefit.trim()] });
    setEditBenefit("");
  };

  const removeBenefitFromEdit = (index: number) => {
    if (!editTier) return;
    setEditTier({ ...editTier, benefits: editTier.benefits.filter((_, i) => i !== index) });
  };

  const stats = {
    totalTiers: tiers.length,
    activeTiers: tiers.filter((t) => t.isActive).length,
    totalMembers: tiers.reduce((sum, t) => sum + t.memberCount, 0),
    avgDiscount: tiers.length > 0 ? (tiers.reduce((sum, t) => sum + t.discountPercent, 0) / tiers.length).toFixed(1) : 0,
  };

  const sortedTiers = [...tiers].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Membership Tiers</h1>
            <p className="mt-1 text-muted-foreground">Manage loyalty program tiers and benefits</p>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Tier
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Layers className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalTiers}</p>
                <p className="text-sm text-muted-foreground">Total Tiers</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-green-50 dark:bg-green-950/20">
            <div className="flex items-center gap-3">
              <Check className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.activeTiers}</p>
                <p className="text-sm text-muted-foreground">Active Tiers</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalMembers}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-purple-50 dark:bg-purple-950/20">
            <div className="flex items-center gap-3">
              <Percent className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.avgDiscount}%</p>
                <p className="text-sm text-muted-foreground">Avg Discount</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tiers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedTiers.map((tier) => {
            const colorClass = getColorClasses(tier.color);
            const TierIcon = getIcon(tier.icon);
            return (
              <Card key={tier.id} className={`relative overflow-hidden ${!tier.isActive ? "opacity-60" : ""}`}>
                <div className={`absolute top-0 left-0 right-0 h-2 ${colorClass.bg.replace("100", "500")}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClass.bg} ${colorClass.darkBg}`}>
                        <TierIcon className={`h-6 w-6 ${colorClass.text}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{tier.name}</h3>
                        <Badge variant={tier.isActive ? "default" : "secondary"}>
                          {tier.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem onClick={() => setEditTier(tier)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateTier(tier)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(tier)}>
                          {tier.isActive ? (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteTier(tier)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">{tier.description}</p>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <p className="text-2xl font-bold text-primary">{tier.discountPercent}%</p>
                      <p className="text-xs text-muted-foreground">Discount</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <p className="text-2xl font-bold">{tier.pointsMultiplier}x</p>
                      <p className="text-xs text-muted-foreground">Points</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Min. Spend</span>
                      <span className="font-medium">KD {tier.minSpendRequired}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Min. Orders</span>
                      <span className="font-medium">{tier.minOrdersRequired}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Members</span>
                      <span className="font-medium">{tier.memberCount}</span>
                    </div>
                  </div>

                  {tier.benefits.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <p className="text-sm font-medium mb-2">Benefits</p>
                      <ul className="space-y-1">
                        {tier.benefits.slice(0, 3).map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                        {tier.benefits.length > 3 && (
                          <li className="text-sm text-primary">+{tier.benefits.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {tiers.length === 0 && (
          <Card className="p-12 text-center">
            <Layers className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No tiers yet</h3>
            <p className="mt-2 text-muted-foreground">Create your first membership tier to start rewarding customers</p>
            <Button className="mt-4" onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Tier
            </Button>
          </Card>
        )}
      </div>

      {/* Add Tier Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Membership Tier</DialogTitle>
            <DialogDescription>Add a new tier to your loyalty program</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tier Name *</Label>
                <Input
                  placeholder="e.g., Diamond"
                  value={newTier.name}
                  onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Select value={newTier.color} onValueChange={(v) => setNewTier({ ...newTier, color: v })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {colorOptions.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${c.bg.replace("100", "500")}`} />
                          {c.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe this tier..."
                value={newTier.description}
                onChange={(e) => setNewTier({ ...newTier, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon</Label>
                <Select value={newTier.icon} onValueChange={(v) => setNewTier({ ...newTier, icon: v as "crown" | "star" | "gift" })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {iconOptions.map((i) => (
                      <SelectItem key={i.value} value={i.value}>
                        <div className="flex items-center gap-2">
                          <i.icon className="h-4 w-4" />
                          {i.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Discount %</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={newTier.discountPercent}
                  onChange={(e) => setNewTier({ ...newTier, discountPercent: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Points Multiplier</Label>
                <Input
                  type="number"
                  min={1}
                  step={0.5}
                  value={newTier.pointsMultiplier}
                  onChange={(e) => setNewTier({ ...newTier, pointsMultiplier: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Min. Spend (KD)</Label>
                <Input
                  type="number"
                  min={0}
                  value={newTier.minSpendRequired}
                  onChange={(e) => setNewTier({ ...newTier, minSpendRequired: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Min. Orders Required</Label>
              <Input
                type="number"
                min={0}
                value={newTier.minOrdersRequired}
                onChange={(e) => setNewTier({ ...newTier, minOrdersRequired: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label>Benefits</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a benefit..."
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBenefitToNew())}
                />
                <Button type="button" variant="secondary" onClick={addBenefitToNew}>
                  Add
                </Button>
              </div>
              {newTier.benefits.length > 0 && (
                <div className="mt-2 space-y-1">
                  {newTier.benefits.map((b, i) => (
                    <div key={i} className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm">
                      <span>{b}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeBenefitFromNew(i)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={newTier.isActive}
                onCheckedChange={(v) => setNewTier({ ...newTier, isActive: v })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTier}>Create Tier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tier Dialog */}
      <Dialog open={!!editTier} onOpenChange={() => setEditTier(null)}>
        <DialogContent className="sm:max-w-lg bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Membership Tier</DialogTitle>
            <DialogDescription>Update tier details and benefits</DialogDescription>
          </DialogHeader>
          {editTier && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tier Name *</Label>
                  <Input
                    value={editTier.name}
                    onChange={(e) => setEditTier({ ...editTier, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Select value={editTier.color} onValueChange={(v) => setEditTier({ ...editTier, color: v })}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {colorOptions.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${c.bg.replace("100", "500")}`} />
                            {c.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editTier.description}
                  onChange={(e) => setEditTier({ ...editTier, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Select value={editTier.icon} onValueChange={(v) => setEditTier({ ...editTier, icon: v as "crown" | "star" | "gift" })}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {iconOptions.map((i) => (
                        <SelectItem key={i.value} value={i.value}>
                          <div className="flex items-center gap-2">
                            <i.icon className="h-4 w-4" />
                            {i.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Discount %</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={editTier.discountPercent}
                    onChange={(e) => setEditTier({ ...editTier, discountPercent: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Points Multiplier</Label>
                  <Input
                    type="number"
                    min={1}
                    step={0.5}
                    value={editTier.pointsMultiplier}
                    onChange={(e) => setEditTier({ ...editTier, pointsMultiplier: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Min. Spend (KD)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={editTier.minSpendRequired}
                    onChange={(e) => setEditTier({ ...editTier, minSpendRequired: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Min. Orders Required</Label>
                <Input
                  type="number"
                  min={0}
                  value={editTier.minOrdersRequired}
                  onChange={(e) => setEditTier({ ...editTier, minOrdersRequired: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label>Benefits</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a benefit..."
                    value={editBenefit}
                    onChange={(e) => setEditBenefit(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBenefitToEdit())}
                  />
                  <Button type="button" variant="secondary" onClick={addBenefitToEdit}>
                    Add
                  </Button>
                </div>
                {editTier.benefits.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {editTier.benefits.map((b, i) => (
                      <div key={i} className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm">
                        <span>{b}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeBenefitFromEdit(i)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                  checked={editTier.isActive}
                  onCheckedChange={(v) => setEditTier({ ...editTier, isActive: v })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTier(null)}>Cancel</Button>
            <Button onClick={handleUpdateTier}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTier} onOpenChange={() => setDeleteTier(null)}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTier?.name} Tier?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tier.
              {deleteTier && deleteTier.memberCount > 0 && (
                <span className="block mt-2 text-destructive">
                  Warning: {deleteTier.memberCount} members are currently in this tier.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTier} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
