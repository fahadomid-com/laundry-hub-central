import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderWorkflow } from "@/components/operations/OrderWorkflow";
import { PickupDelivery } from "@/components/operations/PickupDelivery";
import { ProcessingQueue } from "@/components/operations/ProcessingQueue";
import { StaffAssignment } from "@/components/operations/StaffAssignment";

export default function Operations() {
  const [activeTab, setActiveTab] = useState("workflow");

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Operations</h1>
          <p className="mt-1 text-muted-foreground">
            Manage order workflows, pickups, deliveries, and staff assignments.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="workflow">Order Workflow</TabsTrigger>
            <TabsTrigger value="pickup">Pickup & Delivery</TabsTrigger>
            <TabsTrigger value="processing">Processing Queue</TabsTrigger>
            <TabsTrigger value="staff">Staff Assignment</TabsTrigger>
          </TabsList>

          <TabsContent value="workflow">
            <OrderWorkflow />
          </TabsContent>

          <TabsContent value="pickup">
            <PickupDelivery />
          </TabsContent>

          <TabsContent value="processing">
            <ProcessingQueue />
          </TabsContent>

          <TabsContent value="staff">
            <StaffAssignment />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
