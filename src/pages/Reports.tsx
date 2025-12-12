import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock,
  Star,
  Target,
  Bot,
  Sparkles,
  Key,
  Save,
  Settings,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportCard {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  trend: "up" | "down";
}

const kpiCards: ReportCard[] = [
  { title: "Total Revenue", value: "KD 12,450", change: 12.5, icon: DollarSign, trend: "up" },
  { title: "Orders Completed", value: "342", change: 8.2, icon: ShoppingCart, trend: "up" },
  { title: "New Customers", value: "28", change: -3.1, icon: Users, trend: "down" },
  { title: "Avg Order Value", value: "KD 36.40", change: 5.8, icon: Target, trend: "up" },
];

const topServices = [
  { name: "Dry Cleaning", orders: 145, revenue: 4350, growth: 15.2 },
  { name: "Wash & Fold", orders: 98, revenue: 2450, growth: 8.5 },
  { name: "Express Wash", orders: 56, revenue: 1680, growth: 22.1 },
  { name: "Alterations", orders: 32, revenue: 1280, growth: -5.2 },
  { name: "Ironing", orders: 11, revenue: 165, growth: 3.8 },
];

const customerInsights = [
  { metric: "Repeat Order Rate", value: "65%", status: "good" },
];


export default function Reports() {
  const [dateRange, setDateRange] = useState("month");
  const { toast } = useToast();

  // AI Configuration State
  const [systemPrompt, setSystemPrompt] = useState(
    "You are an intelligent analytics assistant for a laundry business. Analyze data, identify trends, and provide actionable insights to improve business performance."
  );
  const [botInstructions, setBotInstructions] = useState(
    "1. Analyze revenue trends and patterns\n2. Identify top-performing services\n3. Highlight customer behavior insights\n4. Suggest operational improvements\n5. Detect anomalies in data\n6. Provide predictive forecasts"
  );
  const [aiProvider, setAiProvider] = useState("openai");
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const [enableStreaming, setEnableStreaming] = useState(true);
  const [maxTokens, setMaxTokens] = useState("2048");
  const [temperature, setTemperature] = useState("0.7");

  const handleSaveConfig = () => {
    toast({
      title: "Configuration Saved",
      description: "AI settings have been updated successfully.",
    });
  };

  const handleExportReport = (reportType: string) => {
    toast({ title: "Exporting Report", description: `${reportType} report is being exported to PDF` });
  };

  const handleScheduleReport = () => {
    toast({ title: "Report Scheduled", description: "Weekly report will be sent to your email" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "good":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Smart Reports</h1>
            <p className="mt-1 text-muted-foreground">Analytics and insights for your business</p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40 bg-background">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleScheduleReport}>
              <Clock className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button onClick={() => handleExportReport("Full")}>
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((card) => (
            <Card key={card.title} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <card.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className={`mt-2 flex items-center text-sm ${card.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {card.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4" />
                )}
                {card.change > 0 ? "+" : ""}{card.change}% vs last period
              </div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="services" className="space-y-4">
          <TabsList>
            <TabsTrigger value="services">Service Analytics</TabsTrigger>
            <TabsTrigger value="customers">Customer Insights</TabsTrigger>
            <TabsTrigger value="ai-config">
              <Settings className="mr-2 h-4 w-4" />
              AI Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Top Performing Services</h3>
                <Button variant="outline" size="sm" onClick={() => handleExportReport("Services")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <div className="space-y-4">
                {topServices.map((service, index) => (
                  <div key={service.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">KD {service.revenue.toLocaleString()}</p>
                      <div className={`flex items-center justify-end text-sm ${service.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {service.growth >= 0 ? (
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="mr-1 h-3 w-3" />
                        )}
                        {service.growth > 0 ? "+" : ""}{service.growth}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Orders by Status</h3>
                <div className="space-y-3">
                  {[
                    { status: "Completed", count: 245, color: "bg-green-500" },
                    { status: "In Progress", count: 56, color: "bg-blue-500" },
                    { status: "Pending", count: 32, color: "bg-yellow-500" },
                    { status: "Cancelled", count: 9, color: "bg-red-500" },
                  ].map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${item.color}`} />
                        <span>{item.status}</span>
                      </div>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-4">Revenue by Payment Method</h3>
                <div className="space-y-3">
                  {[
                    { method: "Card", amount: 7845, percentage: 63 },
                    { method: "Cash", amount: 3105, percentage: 25 },
                    { method: "Bank Transfer", amount: 1500, percentage: 12 },
                  ].map((item) => (
                    <div key={item.method}>
                      <div className="flex items-center justify-between mb-1">
                        <span>{item.method}</span>
                        <span className="font-medium">KD {item.amount.toLocaleString()}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Customer Metrics</h3>
                <Button variant="outline" size="sm" onClick={() => handleExportReport("Customers")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {customerInsights.map((insight) => (
                  <div
                    key={insight.metric}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div>
                      <p className="text-sm text-muted-foreground">{insight.metric}</p>
                      <p className="text-xl font-bold">{insight.value}</p>
                    </div>
                    <Badge className={getStatusColor(insight.status)}>
                      {insight.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4">Customer Segmentation</h3>
              <div className="grid gap-4 sm:grid-cols-4">
                {[
                  { tier: "Platinum", count: 12, revenue: "KD 4,200", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
                  { tier: "Gold", count: 45, revenue: "KD 5,100", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
                  { tier: "Silver", count: 78, revenue: "KD 2,340", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" },
                  { tier: "No Membership", count: 156, revenue: "KD 810", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" },
                ].map((segment) => (
                  <Card key={segment.tier} className="p-4 text-center">
                    <Badge className={segment.color}>{segment.tier}</Badge>
                    <p className="mt-2 text-2xl font-bold">{segment.count}</p>
                    <p className="text-sm text-muted-foreground">customers</p>
                    <p className="mt-2 font-medium text-primary">{segment.revenue}</p>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>


          <TabsContent value="ai-config" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* System Prompt */}
              <Card className="p-6">
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <Bot className="h-5 w-5 text-primary" />
                  System Prompt
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Define the AI's personality and analytical behavior. This prompt sets the context for generating insights.
                </p>
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Enter system prompt..."
                  className="min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {systemPrompt.length} characters
                </p>
              </Card>

              {/* Bot Instructions */}
              <Card className="p-6">
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Bot Instructions
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Specific guidelines for generating reports and analytics insights.
                </p>
                <Textarea
                  value={botInstructions}
                  onChange={(e) => setBotInstructions(e.target.value)}
                  placeholder="Enter bot instructions..."
                  className="min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {botInstructions.split('\n').length} instructions
                </p>
              </Card>
            </div>

            {/* API Configuration */}
            <Card className="p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Key className="h-5 w-5 text-primary" />
                API Configuration
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Configure your AI provider credentials and model settings for analytics.
              </p>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>AI Provider</Label>
                    <Select value={aiProvider} onValueChange={setAiProvider}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="google">Google AI (Gemini)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {aiProvider === "openai" && (
                    <>
                      <div className="space-y-2">
                        <Label>OpenAI API Key</Label>
                        <Input
                          type="password"
                          value={openaiApiKey}
                          onChange={(e) => setOpenaiApiKey(e.target.value)}
                          placeholder="sk-..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Model</Label>
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                            <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                            <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {aiProvider === "google" && (
                    <>
                      <div className="space-y-2">
                        <Label>Google AI API Key</Label>
                        <Input
                          type="password"
                          value={googleApiKey}
                          onChange={(e) => setGoogleApiKey(e.target.value)}
                          placeholder="AIza..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Model</Label>
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                            <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                            <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Max Tokens</Label>
                    <Input
                      type="number"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(e.target.value)}
                      placeholder="2048"
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum response length (1-4096)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Temperature</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      placeholder="0.7"
                    />
                    <p className="text-xs text-muted-foreground">
                      Creativity level (0 = focused, 2 = creative)
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <Label>Enable Streaming</Label>
                      <p className="text-xs text-muted-foreground">
                        Stream responses in real-time
                      </p>
                    </div>
                    <Switch
                      checked={enableStreaming}
                      onCheckedChange={setEnableStreaming}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveConfig}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Configuration
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
