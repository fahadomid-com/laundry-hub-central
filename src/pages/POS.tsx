import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Monitor,
  ShoppingCart,
  User,
  Phone,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Receipt,
  ArrowLeft,
  Search,
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Service {
  id: string;
  name: string;
  price: number;
  category: string;
}

const services: Service[] = [
  { id: "1", name: "Shirt - Wash & Iron", price: 1.5, category: "Wash & Fold" },
  { id: "2", name: "Pants - Wash & Iron", price: 2.0, category: "Wash & Fold" },
  { id: "3", name: "Suit - Dry Clean", price: 8.0, category: "Dry Cleaning" },
  { id: "4", name: "Dress - Dry Clean", price: 7.5, category: "Dry Cleaning" },
  { id: "5", name: "Coat - Dry Clean", price: 10.0, category: "Dry Cleaning" },
  { id: "6", name: "Blanket - Wash", price: 5.0, category: "Wash & Fold" },
  { id: "7", name: "Curtains - Per KG", price: 3.0, category: "Wash & Fold" },
  { id: "8", name: "Alterations - Hem", price: 4.0, category: "Alterations" },
  { id: "9", name: "Alterations - Zipper", price: 5.0, category: "Alterations" },
  { id: "10", name: "Express - Same Day", price: 3.0, category: "Express" },
  { id: "11", name: "Ironing Only - Shirt", price: 0.75, category: "Ironing" },
  { id: "12", name: "Ironing Only - Pants", price: 1.0, category: "Ironing" },
];

export default function POS() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");

  const categories = [...new Set(services.map((s) => s.category))];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (service: Service) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === service.id);
      if (existing) {
        return prev.map((item) =>
          item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: service.id, name: service.name, price: service.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0;
  const total = subtotal + tax;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast({
        title: "Customer info required",
        description: "Please enter customer name and phone number",
        variant: "destructive",
      });
      return;
    }
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to the cart",
        variant: "destructive",
      });
      return;
    }

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    toast({
      title: "Order Created",
      description: `Order ${orderId} created for ${customerName}`,
    });

    // Reset form
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/orders")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Monitor className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">POS System</h1>
            </div>
          </div>
          <Badge variant="outline" className="text-sm">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Badge>
        </div>
      </header>

      <div className="flex h-[calc(100vh-61px)]">
        {/* Left Panel - Services */}
        <div className="flex-1 overflow-auto p-4">
          {/* Search & Filter */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-background">
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

          {/* Services Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="cursor-pointer p-4 transition-all hover:border-primary hover:shadow-md active:scale-95"
                onClick={() => addToCart(service)}
              >
                <p className="text-sm font-medium leading-tight">{service.name}</p>
                <div className="mt-2 flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {service.category}
                  </Badge>
                  <span className="font-bold text-primary">KD{service.price.toFixed(2)}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Panel - Cart */}
        <div className="w-full max-w-md border-l border-border bg-card flex flex-col">
          {/* Customer Info */}
          <div className="border-b border-border p-4 space-y-3">
            <h2 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Information
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Name *</Label>
                <Input
                  placeholder="Customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  maxLength={100}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="+965 XXXX XXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="pl-8"
                    maxLength={20}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Cart
              </h2>
              <Badge>{totalItems} items</Badge>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mb-2 opacity-50" />
                <p className="text-sm">Cart is empty</p>
                <p className="text-xs">Click on services to add</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        KD{item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Section */}
          <div className="border-t border-border p-4 space-y-4">
            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>KD{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (0%)</span>
                <span>KD{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                <span>Total</span>
                <span className="text-primary">KD{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={paymentMethod === "cash" ? "default" : "outline"}
                className="w-full"
                onClick={() => setPaymentMethod("cash")}
              >
                <Banknote className="mr-2 h-4 w-4" />
                Cash
              </Button>
              <Button
                variant={paymentMethod === "card" ? "default" : "outline"}
                className="w-full"
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Card
              </Button>
            </div>

            {/* Checkout Button */}
            <Button
              className="w-full h-12 text-lg"
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              <Receipt className="mr-2 h-5 w-5" />
              Complete Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
