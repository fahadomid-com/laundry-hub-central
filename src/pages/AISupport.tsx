import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Bot,
  Send,
  User,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Save,
  Key,
  Upload,
  FileText,
  Image,
  File,
  X,
  Database,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Ticket {
  id: string;
  customer: string;
  subject: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  createdAt: string;
  lastReply: string;
}

const initialMessages: Message[] = [
  { id: "1", role: "assistant", content: "Hello! I'm your AI assistant. I can help you with order tracking, customer inquiries, service information, and more. How can I assist you today?", timestamp: "10:00 AM" },
];

const initialTickets: Ticket[] = [
  { id: "TKT-001", customer: "John Doe", subject: "Order delivery delay", status: "open", priority: "high", createdAt: "Dec 12, 2025", lastReply: "2 hours ago" },
  { id: "TKT-002", customer: "Jane Smith", subject: "Billing inquiry", status: "in-progress", priority: "medium", createdAt: "Dec 11, 2025", lastReply: "1 day ago" },
  { id: "TKT-003", customer: "Mike Johnson", subject: "Service feedback", status: "resolved", priority: "low", createdAt: "Dec 10, 2025", lastReply: "2 days ago" },
  { id: "TKT-004", customer: "Sarah Wilson", subject: "Missing item complaint", status: "open", priority: "high", createdAt: "Dec 12, 2025", lastReply: "30 mins ago" },
];

const aiResponses: Record<string, string> = {
  "check order status": "To check an order status, I'll need the order ID. Please provide the order number (e.g., ORD-001) and I'll look it up for you.",
  "track delivery": "I can help you track a delivery! Please provide the order ID and I'll show you the current location and estimated delivery time.",
  "service pricing": "Here are our current service prices:\n\n• Wash & Iron (Shirt): KD 1.50/piece\n• Wash & Iron (Pants): KD 2.00/piece\n• Dry Cleaning (Suit): KD 8.00/piece\n• Express Service: +KD 3.00 addon\n\nWould you like more detailed pricing information?",
  "operating hours": "Our operating hours are:\n\n📍 Main Branch: 8:00 AM - 10:00 PM (Daily)\n📍 Salmiya Branch: 9:00 AM - 9:00 PM (Daily)\n📍 Hawally Branch: 8:30 AM - 9:30 PM (Daily)\n\nPickup & Delivery available 24/7 with advance booking!",
  "loyalty points balance": "To check loyalty points, I'll need the customer's phone number or name. Points can be redeemed for discounts on future orders. 100 points = KD 1.00 discount.",
  "cancel/modify order": "To cancel or modify an order, please provide the order ID. Note: Orders that have already started processing may have limited modification options.",
};

export default function AISupport() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [ticketFilter, setTicketFilter] = useState("all");
  const [isTransferredToHuman, setIsTransferredToHuman] = useState(false);
  const [chatIssueStatus, setChatIssueStatus] = useState<"not-resolved" | "in-progress" | "resolved">("in-progress");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Bot Configuration State
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful AI customer support assistant for a laundry service business. Be friendly, professional, and provide accurate information about services, pricing, and order status."
  );
  const [botInstructions, setBotInstructions] = useState(
    "1. Always greet customers warmly\n2. Provide accurate pricing information\n3. Help track orders and deliveries\n4. Escalate complex issues to human agents\n5. Maintain a professional and helpful tone\n6. Offer relevant upsells when appropriate"
  );
  const [aiProvider, setAiProvider] = useState("openai");
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const [enableStreaming, setEnableStreaming] = useState(true);
  const [maxTokens, setMaxTokens] = useState("2048");
  const [temperature, setTemperature] = useState("0.7");
  
  // Knowledge Base State
  interface KnowledgeFile {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedAt: string;
  }
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([
    { id: "1", name: "Service Policies.pdf", type: "pdf", size: "2.4 MB", uploadedAt: "Dec 10, 2025" },
    { id: "2", name: "Pricing List.csv", type: "csv", size: "156 KB", uploadedAt: "Dec 8, 2025" },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/csv",
    ];
    
    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type.`,
          variant: "destructive",
        });
        return;
      }
      
      const fileType = file.type.includes("pdf") ? "pdf" 
        : file.type.includes("image") ? "image"
        : file.type.includes("word") || file.type.includes("document") ? "word"
        : "csv";
      
      const newFile: KnowledgeFile = {
        id: String(Date.now() + Math.random()),
        name: file.name,
        type: fileType,
        size: file.size < 1024 * 1024 
          ? `${(file.size / 1024).toFixed(1)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
      
      setKnowledgeFiles((prev) => [...prev, newFile]);
      toast({
        title: "File uploaded",
        description: `${file.name} has been added to knowledge base.`,
      });
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setKnowledgeFiles((prev) => prev.filter((f) => f.id !== fileId));
    toast({
      title: "File removed",
      description: "File has been removed from knowledge base.",
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "image":
        return <Image className="h-4 w-4 text-blue-500" />;
      case "word":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "csv":
        return <File className="h-4 w-4 text-green-500" />;
      default:
        return <File className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleSaveConfig = () => {
    toast({
      title: "Configuration Saved",
      description: "Bot settings have been updated successfully.",
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: String(messages.length + 1),
      role: "user",
      content: messageText,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerText = messageText.toLowerCase();
      let responseText = "I understand you're asking about \"" + messageText + "\". Let me help you with that. Could you provide more details so I can assist you better?";
      
      for (const [key, response] of Object.entries(aiResponses)) {
        if (lowerText.includes(key)) {
          responseText = response;
          break;
        }
      }

      const assistantMessage: Message = {
        id: String(messages.length + 2),
        role: "assistant",
        content: responseText,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleTicketStatusChange = (ticketId: string, newStatus: Ticket["status"]) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    toast({ title: "Ticket updated", description: `${ticketId} status changed to ${newStatus}` });
  };

  const handleAutoReply = (ticket: Ticket) => {
    toast({ title: "AI Reply Sent", description: `Automated response sent to ${ticket.customer}` });
    handleTicketStatusChange(ticket.id, "in-progress");
  };

  const handleFeedback = (positive: boolean) => {
    toast({ title: "Feedback received", description: positive ? "Thank you for your positive feedback!" : "We'll work on improving." });
  };

  const handleTransferToHuman = () => {
    setIsTransferredToHuman(true);
    const systemMessage: Message = {
      id: String(Date.now()),
      role: "assistant",
      content: "This conversation has been transferred to a human agent. A support representative will join shortly. Please hold.",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, systemMessage]);
    toast({
      title: "Transferred to Human",
      description: "A human agent will take over this conversation.",
    });
  };

  const handleIssueStatusChange = (status: "not-resolved" | "in-progress" | "resolved") => {
    setChatIssueStatus(status);
    toast({
      title: "Issue Status Updated",
      description: `Issue marked as ${status.replace("-", " ")}.`,
    });
  };

  const issueStatusColors = {
    "not-resolved": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    "resolved": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  };

  const issueStatusIcons = {
    "not-resolved": <XCircle className="h-3 w-3" />,
    "in-progress": <Clock className="h-3 w-3" />,
    "resolved": <CheckCircle className="h-3 w-3" />,
  };

  const filteredTickets = tickets.filter((t) => {
    return ticketFilter === "all" || t.status === ticketFilter;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    avgResponseTime: "15 mins",
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const statusColors = {
    open: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Support & Bot</h1>
          <p className="mt-1 text-muted-foreground">AI-powered customer support assistant</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Tickets</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.open}</p>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-green-50 dark:bg-green-950/20">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.resolved}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="chat" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chat">
              <Bot className="mr-2 h-4 w-4" />
              AI Chat
            </TabsTrigger>
            <TabsTrigger value="tickets">
              <MessageSquare className="mr-2 h-4 w-4" />
              Support Tickets
            </TabsTrigger>
            <TabsTrigger value="configure">
              <Settings className="mr-2 h-4 w-4" />
              Configure Bot
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <Card className="flex flex-col h-[600px]">
              <div className="border-b border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      {isTransferredToHuman ? (
                        <UserCheck className="h-5 w-5 text-primary" />
                      ) : (
                        <Bot className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {isTransferredToHuman ? "Human Agent" : "AI Support Assistant"}
                      </p>
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        {isTransferredToHuman ? "Agent Connected" : "Online"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={chatIssueStatus} onValueChange={(v) => handleIssueStatusChange(v as "not-resolved" | "in-progress" | "resolved")}>
                      <SelectTrigger className="w-36 h-8 bg-background">
                        <SelectValue>
                          <div className="flex items-center gap-1.5">
                            {issueStatusIcons[chatIssueStatus]}
                            <span className="capitalize">{chatIssueStatus.replace("-", " ")}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="not-resolved">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-3 w-3 text-red-500" />
                            Not Resolved
                          </div>
                        </SelectItem>
                        <SelectItem value="in-progress">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-yellow-500" />
                            In Progress
                          </div>
                        </SelectItem>
                        <SelectItem value="resolved">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Resolved
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {!isTransferredToHuman && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTransferToHuman}
                        className="gap-1.5"
                      >
                        <UserCheck className="h-4 w-4" />
                        Transfer to Human
                      </Button>
                    )}
                    {isTransferredToHuman && (
                      <Badge className={issueStatusColors["in-progress"]}>
                        <UserCheck className="h-3 w-3 mr-1" />
                        Human Agent
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={message.role === "assistant" ? "bg-primary/10" : "bg-muted"}>
                          {message.role === "assistant" ? <Bot className="h-4 w-4 text-primary" /> : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[70%] ${message.role === "user" ? "text-right" : ""}`}>
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10">
                          <Bot className="h-4 w-4 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg bg-muted p-3">
                        <div className="flex gap-1">
                          <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                          <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                          <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={() => handleSendMessage()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleFeedback(true)}>
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleFeedback(false)}>
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Support Tickets</h3>
                <Select value={ticketFilter} onValueChange={setTicketFilter}>
                  <SelectTrigger className="w-32 bg-background">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{ticket.id}</p>
                        <Badge className={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
                        <Badge className={statusColors[ticket.status]}>{ticket.status}</Badge>
                      </div>
                      <p className="text-sm font-medium mt-1">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.customer} • Last reply: {ticket.lastReply}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {ticket.status === "open" && (
                        <Button size="sm" variant="outline" onClick={() => handleAutoReply(ticket)}>
                          <Bot className="mr-1 h-3 w-3" />
                          Auto Reply
                        </Button>
                      )}
                      <Select
                        value={ticket.status}
                        onValueChange={(v) => handleTicketStatusChange(ticket.id, v as Ticket["status"])}
                      >
                        <SelectTrigger className="h-8 w-28 bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="configure" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* System Prompt */}
              <Card className="p-6">
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <Bot className="h-5 w-5 text-primary" />
                  System Prompt
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Define the AI's personality and base behavior. This prompt sets the context for all conversations.
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
                  Specific guidelines and rules for the bot to follow during conversations.
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
                Configure your AI provider credentials and model settings.
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

            {/* Knowledge Base */}
            <Card className="p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Database className="h-5 w-5 text-primary" />
                Knowledge Base
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Upload documents to train the AI with your business-specific knowledge. Supported formats: PDF, Images, Word documents, and CSV files.
              </p>

              {/* Upload Area */}
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.doc,.docx,.csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground mt-1">
                  PDF, Images (PNG, JPG), Word (.doc, .docx), CSV
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Maximum file size: 10MB
                </p>
              </div>

              {/* Uploaded Files List */}
              {knowledgeFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">Uploaded Files ({knowledgeFiles.length})</h4>
                  <div className="space-y-2">
                    {knowledgeFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3 bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {file.size} • Uploaded {file.uploadedAt}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(file.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
