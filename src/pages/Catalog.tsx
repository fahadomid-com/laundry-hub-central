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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Package,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  duration: string;
  active: boolean;
  description: string;
}

interface Offer {
  id: string;
  name: string;
  discount: number;
  type: "percentage" | "fixed";
  validUntil: string;
  active: boolean;
}

const initialServices: Service[] = [
  { id: "1", name: "Shirt - Wash & Iron", category: "Wash & Fold", price: 1.5, unit: "piece", duration: "24h", active: true, description: "Professional wash and iron for shirts" },
  { id: "2", name: "Pants - Wash & Iron", category: "Wash & Fold", price: 2.0, unit: "piece", duration: "24h", active: true, description: "Professional wash and iron for pants" },
  { id: "3", name: "Suit - Dry Clean", category: "Dry Cleaning", price: 8.0, unit: "piece", duration: "48h", active: true, description: "Premium dry cleaning for suits" },
  { id: "4", name: "Dress - Dry Clean", category: "Dry Cleaning", price: 7.5, unit: "piece", duration: "48h", active: true, description: "Delicate dry cleaning for dresses" },
  { id: "5", name: "Blanket - Wash", category: "Wash & Fold", price: 5.0, unit: "piece", duration: "48h", active: true, description: "Deep wash for blankets" },
  { id: "6", name: "Alterations - Hem", category: "Alterations", price: 4.0, unit: "piece", duration: "72h", active: true, description: "Professional hemming service" },
  { id: "7", name: "Express - Same Day", category: "Express", price: 3.0, unit: "addon", duration: "6h", active: true, description: "Same day delivery addon" },
  { id: "8", name: "Ironing Only", category: "Ironing", price: 0.75, unit: "piece", duration: "12h", active: false, description: "Ironing service only" },
];

const initialOffers: Offer[] = [
  { id: "1", name: "New Customer 20% Off", discount: 20, type: "percentage", validUntil: "Dec 31, 2025", active: true },
  { id: "2", name: "Bulk Order Discount", discount: 15, type: "percentage", validUntil: "Jan 15, 2026", active: true },
  { id: "3", name: "Holiday Special", discount: 5, type: "fixed", validUntil: "Dec 25, 2025", active: false },
];

export default function Catalog() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [addOfferOpen, setAddOfferOpen] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomType, setShowCustomType] = useState(false);
  const [customType, setCustomType] = useState("");
  const [serviceType, setServiceType] = useState("Normal");
  const { toast } = useToast();

  const [newService, setNewService] = useState({
    name: "",
    category: "Wash & Fold",
    serviceOption: "Wash & Iron",
    price: 0,
    unit: "piece",
    duration: "24h",
    description: "",
  });
  const [showCustomServiceOption, setShowCustomServiceOption] = useState(false);
  const [customServiceOption, setCustomServiceOption] = useState("");

  const [newOffer, setNewOffer] = useState({
    name: "",
    discount: 0,
    type: "percentage" as "percentage" | "fixed",
    validUntil: "",
  });

  const categories = ["Bedding/Bath", "Accessories", "Home", "Undergarment", "Suits", "Dresses", "Children", "Traditional", "Tops", "Bottoms", "Outdoors", "Other"];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddService = () => {
    if (!newService.name) return;
    const service: Service = {
      id: String(services.length + 1),
      ...newService,
      active: true,
    };
    setServices((prev) => [...prev, service]);
    setNewService({ name: "", category: "Wash & Fold", serviceOption: "Wash & Iron", price: 0, unit: "piece", duration: "24h", description: "" });
    setAddServiceOpen(false);
    toast({ title: "Service added", description: `${service.name} has been added to the catalog` });
  };

  const handleUpdateService = () => {
    if (!editService) return;
    setServices((prev) => prev.map((s) => (s.id === editService.id ? editService : s)));
    setEditService(null);
    toast({ title: "Service updated", description: `${editService.name} has been updated` });
  };

  const handleDeleteService = (id: string) => {
    const service = services.find((s) => s.id === id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Service deleted", description: `${service?.name} has been removed` });
  };

  const handleToggleService = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const handleAddOffer = () => {
    if (!newOffer.name) return;
    const offer: Offer = {
      id: String(offers.length + 1),
      ...newOffer,
      active: true,
    };
    setOffers((prev) => [...prev, offer]);
    setNewOffer({ name: "", discount: 0, type: "percentage", validUntil: "" });
    setAddOfferOpen(false);
    toast({ title: "Offer created", description: `${offer.name} is now active` });
  };

  const handleToggleOffer = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o))
    );
  };

  const handleDeleteOffer = (id: string) => {
    const offer = offers.find((o) => o.id === id);
    setOffers((prev) => prev.filter((o) => o.id !== id));
    toast({ title: "Offer deleted", description: `${offer?.name} has been removed` });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Catalog</h1>
            <p className="mt-1 text-muted-foreground">Manage services, pricing, and offers</p>
          </div>
          <Button onClick={() => setAddServiceOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-1">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{services.length}</p>
                <p className="text-sm text-muted-foreground">Total Services</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Services Section */}
        <Card className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-lg font-semibold">Services</h2>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 bg-background">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className={`p-4 ${!service.active && "opacity-60"}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{service.name}</p>
                      {!service.active && <Badge variant="secondary">Inactive</Badge>}
                    </div>
                    <Badge variant="outline" className="mt-1">
                      {service.category}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem onClick={() => setEditService(service)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleService(service.id)}>
                        {service.active ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">KD{service.price.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">/{service.unit} • {service.duration}</span>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      {/* Add Service Dialog */}
      <Dialog open={addServiceOpen} onOpenChange={setAddServiceOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>Create a new service for your catalog</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Service Type</Label>
              {showCustomType ? (
                <div className="flex gap-2">
                  <Input
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="Enter new type"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (customType.trim()) {
                        setServiceType(customType.trim());
                      }
                      setShowCustomType(false);
                      setCustomType("");
                    }}
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <Select
                  value={serviceType}
                  onValueChange={(v) => {
                    if (v === "__add_type__") {
                      setShowCustomType(true);
                    } else {
                      setServiceType(v);
                    }
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Express">Express</SelectItem>
                    <SelectItem value="Extras">Extras</SelectItem>
                    <SelectItem value="__add_type__" className="text-primary font-medium">
                      + Add Extra Type
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service</Label>
                {showCustomCategory ? (
                  <div className="flex gap-2">
                    <Input
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Enter new category"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (customCategory.trim()) {
                          setNewService((p) => ({ ...p, category: customCategory.trim() }));
                        }
                        setShowCustomCategory(false);
                        setCustomCategory("");
                      }}
                    >
                      Done
                    </Button>
                  </div>
                ) : (
                  <Select
                    value={newService.category}
                    onValueChange={(v) => {
                      if (v === "__add_new__") {
                        setShowCustomCategory(true);
                      } else {
                        setNewService((p) => ({ ...p, category: v }));
                      }
                    }}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="Bedding/Bath">Bedding/Bath</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Undergarment">Undergarment</SelectItem>
                      <SelectItem value="Suits">Suits</SelectItem>
                      <SelectItem value="Dresses">Dresses</SelectItem>
                      <SelectItem value="Children">Children</SelectItem>
                      <SelectItem value="Traditional">Traditional</SelectItem>
                      <SelectItem value="Tops">Tops</SelectItem>
                      <SelectItem value="Bottoms">Bottoms</SelectItem>
                      <SelectItem value="Outdoors">Outdoors</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="__add_new__" className="text-primary font-medium">
                        + Add Extra Service
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label>Service Options</Label>
                {showCustomServiceOption ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter custom option"
                      value={customServiceOption}
                      onChange={(e) => setCustomServiceOption(e.target.value)}
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (customServiceOption.trim()) {
                          setNewService((p) => ({ ...p, serviceOption: customServiceOption.trim() }));
                          setShowCustomServiceOption(false);
                          setCustomServiceOption("");
                        }
                      }}
                    >
                      Done
                    </Button>
                  </div>
                ) : (
                  <Select
                    value={newService.serviceOption}
                    onValueChange={(v) => {
                      if (v === "__add_extra__") {
                        setShowCustomServiceOption(true);
                      } else {
                        setNewService((p) => ({ ...p, serviceOption: v }));
                      }
                    }}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="Wash & Iron">Wash & Iron</SelectItem>
                      <SelectItem value="Iron">Iron</SelectItem>
                      <SelectItem value="Dry Clean">Dry Clean</SelectItem>
                      <SelectItem value="Press">Press</SelectItem>
                      <SelectItem value="Fold">Fold</SelectItem>
                      <SelectItem value="__add_extra__" className="text-primary font-medium">
                        + Add Extra Option
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label>Price (KD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newService.price}
                  onChange={(e) => setNewService((p) => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddServiceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddService}>Add Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={!!editService} onOpenChange={() => setEditService(null)}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>Update service details</DialogDescription>
          </DialogHeader>
          {editService && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Service Name</Label>
                <Input
                  value={editService.name}
                  onChange={(e) => setEditService((p) => p ? { ...p, name: e.target.value } : null)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={editService.category}
                    onValueChange={(v) => setEditService((p) => p ? { ...p, category: v } : null)}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="Bedding/Bath">Bedding/Bath</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Undergarment">Undergarment</SelectItem>
                      <SelectItem value="Suits">Suits</SelectItem>
                      <SelectItem value="Dresses">Dresses</SelectItem>
                      <SelectItem value="Children">Children</SelectItem>
                      <SelectItem value="Traditional">Traditional</SelectItem>
                      <SelectItem value="Tops">Tops</SelectItem>
                      <SelectItem value="Bottoms">Bottoms</SelectItem>
                      <SelectItem value="Outdoors">Outdoors</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price (KD)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editService.price}
                    onChange={(e) => setEditService((p) => p ? { ...p, price: parseFloat(e.target.value) || 0 } : null)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={editService.description}
                  onChange={(e) => setEditService((p) => p ? { ...p, description: e.target.value } : null)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditService(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateService}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Offer Dialog */}
      <Dialog open={addOfferOpen} onOpenChange={setAddOfferOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Create New Offer</DialogTitle>
            <DialogDescription>Add a promotional offer</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Offer Name</Label>
              <Input
                value={newOffer.name}
                onChange={(e) => setNewOffer((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g., New Customer 20% Off"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={newOffer.type}
                  onValueChange={(v) => setNewOffer((p) => ({ ...p, type: v as "percentage" | "fixed" }))}
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
                  value={newOffer.discount}
                  onChange={(e) => setNewOffer((p) => ({ ...p, discount: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Valid Until</Label>
              <Input
                value={newOffer.validUntil}
                onChange={(e) => setNewOffer((p) => ({ ...p, validUntil: e.target.value }))}
                placeholder="Dec 31, 2025"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOfferOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddOffer}>Create Offer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
