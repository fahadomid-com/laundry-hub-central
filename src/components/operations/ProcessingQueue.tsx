import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shirt, Droplets, Wind, CheckCircle, AlertTriangle, Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProcessingItem {
  id: string;
  orderId: string;
  items: string;
  machine: string;
  process: "wash" | "dry" | "iron" | "fold";
  status: "queued" | "running" | "paused" | "completed";
  progress: number;
  estimatedTime: string;
}

const initialQueue: ProcessingItem[] = [
  { id: "P-001", orderId: "ORD-001", items: "5 shirts, 2 pants", machine: "Washer 1", process: "wash", status: "running", progress: 65, estimatedTime: "12 min" },
  { id: "P-002", orderId: "ORD-002", items: "8 mixed items", machine: "Dryer 2", process: "dry", status: "running", progress: 80, estimatedTime: "8 min" },
  { id: "P-003", orderId: "ORD-005", items: "6 formal shirts", machine: "Iron Station 1", process: "iron", status: "queued", progress: 0, estimatedTime: "25 min" },
  { id: "P-004", orderId: "ORD-006", items: "4 items", machine: "Washer 2", process: "wash", status: "paused", progress: 30, estimatedTime: "20 min" },
  { id: "P-005", orderId: "ORD-001", items: "5 shirts, 2 pants", machine: "Fold Station", process: "fold", status: "queued", progress: 0, estimatedTime: "15 min" },
];

const machines = {
  washers: [
    { id: "w1", name: "Washer 1", status: "running", load: "ORD-001" },
    { id: "w2", name: "Washer 2", status: "paused", load: "ORD-006" },
    { id: "w3", name: "Washer 3", status: "idle", load: null },
  ],
  dryers: [
    { id: "d1", name: "Dryer 1", status: "idle", load: null },
    { id: "d2", name: "Dryer 2", status: "running", load: "ORD-002" },
  ],
  irons: [
    { id: "i1", name: "Iron Station 1", status: "idle", load: null },
    { id: "i2", name: "Iron Station 2", status: "idle", load: null },
  ],
};

const processConfig = {
  wash: { icon: Droplets, label: "Washing", color: "text-info" },
  dry: { icon: Wind, label: "Drying", color: "text-warning" },
  iron: { icon: Shirt, label: "Ironing", color: "text-primary" },
  fold: { icon: CheckCircle, label: "Folding", color: "text-success" },
};

const statusConfig = {
  queued: { variant: "secondary" as const, label: "Queued" },
  running: { variant: "info" as const, label: "Running" },
  paused: { variant: "warning" as const, label: "Paused" },
  completed: { variant: "success" as const, label: "Completed" },
};

export function ProcessingQueue() {
  const [queue, setQueue] = useState<ProcessingItem[]>(initialQueue);
  const [processFilter, setProcessFilter] = useState<string>("all");
  const { toast } = useToast();

  const filteredQueue = queue.filter((item) => processFilter === "all" || item.process === processFilter);

  const handleStart = (item: ProcessingItem) => {
    setQueue((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, status: "running" } : q))
    );
    toast({ title: "Process started", description: `${item.id} is now running` });
  };

  const handlePause = (item: ProcessingItem) => {
    setQueue((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, status: "paused" } : q))
    );
    toast({ title: "Process paused", description: `${item.id} has been paused` });
  };

  const handleResume = (item: ProcessingItem) => {
    setQueue((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, status: "running" } : q))
    );
    toast({ title: "Process resumed", description: `${item.id} is now running` });
  };

  const handleComplete = (item: ProcessingItem) => {
    setQueue((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, status: "completed", progress: 100 } : q))
    );
    toast({ title: "Process completed", description: `${item.id} is finished` });
  };

  const handleRestart = (item: ProcessingItem) => {
    setQueue((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, status: "queued", progress: 0 } : q))
    );
    toast({ title: "Process restarted", description: `${item.id} added back to queue` });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <Droplets className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Washers</p>
              <p className="font-semibold">
                {machines.washers.filter((m) => m.status !== "idle").length}/{machines.washers.length} Active
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Wind className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dryers</p>
              <p className="font-semibold">
                {machines.dryers.filter((m) => m.status !== "idle").length}/{machines.dryers.length} Active
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shirt className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Iron Stations</p>
              <p className="font-semibold">
                {machines.irons.filter((m) => m.status !== "idle").length}/{machines.irons.length} Active
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Alerts</p>
              <p className="font-semibold">{queue.filter((q) => q.status === "paused").length} Paused</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Processing Queue</h3>
        <Select value={processFilter} onValueChange={setProcessFilter}>
          <SelectTrigger className="w-40 bg-background">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Processes</SelectItem>
            <SelectItem value="wash">Washing</SelectItem>
            <SelectItem value="dry">Drying</SelectItem>
            <SelectItem value="iron">Ironing</SelectItem>
            <SelectItem value="fold">Folding</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filteredQueue.map((item) => {
          const config = processConfig[item.process];
          const ProcessIcon = config.icon;

          return (
            <Card key={item.id} className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-muted`}>
                    <ProcessIcon className={`h-6 w-6 ${config.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.id}</span>
                      <Badge variant={statusConfig[item.status].variant}>
                        {statusConfig[item.status].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.orderId} • {item.items}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.machine} • Est. {item.estimatedTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <Progress value={item.progress} className="h-2" />
                    <p className="mt-1 text-xs text-center text-muted-foreground">{item.progress}%</p>
                  </div>
                  <div className="flex gap-1">
                    {item.status === "queued" && (
                      <Button size="sm" onClick={() => handleStart(item)}>
                        <Play className="mr-1 h-4 w-4" />
                        Start
                      </Button>
                    )}
                    {item.status === "running" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handlePause(item)}>
                          <Pause className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={() => handleComplete(item)}>
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Done
                        </Button>
                      </>
                    )}
                    {item.status === "paused" && (
                      <Button size="sm" onClick={() => handleResume(item)}>
                        <Play className="mr-1 h-4 w-4" />
                        Resume
                      </Button>
                    )}
                    {item.status === "completed" && (
                      <Button size="sm" variant="ghost" onClick={() => handleRestart(item)}>
                        <RotateCcw className="mr-1 h-4 w-4" />
                        Restart
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
