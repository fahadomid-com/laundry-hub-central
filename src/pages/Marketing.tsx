import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Megaphone,
  Mail,
  MessageSquare,
  Gift,
  Plus,
  Send,
  Users,
  TrendingUp,
  Eye,
  MousePointer,
  Calendar,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms" | "push";
  status: "draft" | "scheduled" | "active" | "completed";
  audience: string;
  sent: number;
  opened: number;
  clicked: number;
  scheduledDate?: string;
  createdAt: string;
}

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

const initialCampaigns: Campaign[] = [
  { id: "1", name: "Holiday Special Offer", type: "email", status: "active", audience: "All Customers", sent: 1250, opened: 485, clicked: 128, createdAt: "Dec 10, 2025" },
  { id: "2", name: "New Year Promo", type: "sms", status: "scheduled", audience: "Gold & Platinum", sent: 0, opened: 0, clicked: 0, scheduledDate: "Dec 31, 2025", createdAt: "Dec 8, 2025" },
  { id: "3", name: "Welcome Message", type: "email", status: "completed", audience: "New Customers", sent: 450, opened: 312, clicked: 89, createdAt: "Dec 5, 2025" },
  { id: "4", name: "Loyalty Reminder", type: "push", status: "draft", audience: "Inactive Customers", sent: 0, opened: 0, clicked: 0, createdAt: "Dec 12, 2025" },
];

const initialPromotions: Promotion[] = [
  { id: "1", name: "New Customer Discount", code: "WELCOME20", discount: 20, type: "percentage", usageCount: 45, usageLimit: 100, validFrom: "Dec 1, 2025", validUntil: "Dec 31, 2025", active: true },
  { id: "2", name: "Holiday Special", code: "HOLIDAY15", discount: 15, type: "percentage", usageCount: 78, usageLimit: 200, validFrom: "Dec 15, 2025", validUntil: "Jan 5, 2026", active: true },
  { id: "3", name: "Free Delivery", code: "FREEDEL", discount: 3, type: "fixed", usageCount: 120, usageLimit: 500, validFrom: "Dec 1, 2025", validUntil: "Dec 31, 2025", active: true },
  { id: "4", name: "VIP Exclusive", code: "VIP30", discount: 30, type: "percentage", usageCount: 12, usageLimit: 50, validFrom: "Dec 1, 2025", validUntil: "Dec 31, 2025", active: false },
];

export default function Marketing() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [createCampaignOpen, setCreateCampaignOpen] = useState(false);
  const [createPromoOpen, setCreatePromoOpen] = useState(false);
  const [editPromo, setEditPromo] = useState<Promotion | null>(null);
  const { toast } = useToast();

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "email" as "email" | "sms" | "push",
    audience: "All Customers",
    subject: "",
    message: "",
  });

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

  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter((c) => c.status === "active").length,
    totalSent: campaigns.reduce((sum, c) => sum + c.sent, 0),
    avgOpenRate: 38.8,
  };

  const handleCreateCampaign = () => {
    if (!newCampaign.name) return;
    const campaign: Campaign = {
      id: String(campaigns.length + 1),
      name: newCampaign.name,
      type: newCampaign.type,
      status: "draft",
      audience: newCampaign.audience,
      sent: 0,
      opened: 0,
      clicked: 0,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setCampaigns((prev) => [...prev, campaign]);
    setNewCampaign({ name: "", type: "email", audience: "All Customers", subject: "", message: "" });
    setCreateCampaignOpen(false);
    toast({ title: "Campaign created", description: `${campaign.name} saved as draft` });
  };

  const handleSendCampaign = (campaign: Campaign) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaign.id ? { ...c, status: "active" as const, sent: 850 } : c))
    );
    toast({ title: "Campaign sent", description: `${campaign.name} is now being delivered` });
  };

  const handleDeleteCampaign = (id: string) => {
    const campaign = campaigns.find((c) => c.id === id);
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Campaign deleted", description: `${campaign?.name} has been removed` });
  };

  const handleDuplicateCampaign = (campaign: Campaign) => {
    const newCamp: Campaign = {
      ...campaign,
      id: String(campaigns.length + 1),
      name: `${campaign.name} (Copy)`,
      status: "draft",
      sent: 0,
      opened: 0,
      clicked: 0,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setCampaigns((prev) => [...prev, newCamp]);
    toast({ title: "Campaign duplicated", description: `${newCamp.name} created` });
  };

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

  const typeIcons = {
    email: Mail,
    sms: MessageSquare,
    push: Megaphone,
  };

  const statusColors = {
    draft: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    completed: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Marketing</h1>
            <p className="mt-1 text-muted-foreground">Campaigns, promotions, and customer engagement</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCreatePromoOpen(true)}>
              <Gift className="mr-2 h-4 w-4" />
              Create Promo
            </Button>
            <Button onClick={() => setCreateCampaignOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Megaphone className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalCampaigns}</p>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-green-50 dark:bg-green-950/20">
            <div className="flex items-center gap-3">
              <Send className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.activeCampaigns}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-4">
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="promotions">Promo Codes</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">All Campaigns</h3>
              <div className="space-y-3">
                {campaigns.map((campaign) => {
                  const TypeIcon = typeIcons[campaign.type];
                  const openRate = campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(1) : "0";
                  const clickRate = campaign.opened > 0 ? ((campaign.clicked / campaign.opened) * 100).toFixed(1) : "0";
                  return (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <TypeIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{campaign.name}</p>
                            <Badge className={statusColors[campaign.status]}>{campaign.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {campaign.audience} • {campaign.createdAt}
                          </p>
                        </div>
                      </div>

                      {campaign.sent > 0 && (
                        <div className="hidden md:flex items-center gap-6">
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-sm">
                              <Send className="h-3 w-3" />
                              <span className="font-medium">{campaign.sent}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Sent</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-sm">
                              <Eye className="h-3 w-3" />
                              <span className="font-medium">{openRate}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Opened</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-sm">
                              <MousePointer className="h-3 w-3" />
                              <span className="font-medium">{clickRate}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Clicked</p>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {campaign.status === "draft" && (
                          <Button size="sm" onClick={() => handleSendCampaign(campaign)}>
                            <Send className="mr-1 h-3 w-3" />
                            Send
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleDuplicateCampaign(campaign)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDeleteCampaign(campaign.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="promotions" className="space-y-4">
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Campaign Dialog */}
      <Dialog open={createCampaignOpen} onOpenChange={setCreateCampaignOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>Set up a new marketing campaign</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input
                value={newCampaign.name}
                onChange={(e) => setNewCampaign((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g., Holiday Special Offer"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={newCampaign.type}
                  onValueChange={(v) => setNewCampaign((p) => ({ ...p, type: v as "email" | "sms" | "push" }))}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select
                  value={newCampaign.audience}
                  onValueChange={(v) => setNewCampaign((p) => ({ ...p, audience: v }))}
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
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={newCampaign.subject}
                onChange={(e) => setNewCampaign((p) => ({ ...p, subject: e.target.value }))}
                placeholder="Email subject line"
              />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={newCampaign.message}
                onChange={(e) => setNewCampaign((p) => ({ ...p, message: e.target.value }))}
                placeholder="Your campaign message..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateCampaignOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign}>Create Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select
                  value={editPromo.active ? "All Customers" : "All Customers"}
                  onValueChange={() => {}}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Customers" />
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
