import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Building,
  CreditCard,
  Mail,
  Smartphone,
  Save,
  Upload,
  Key,
  Trash2,
  Download,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: user?.name || "Admin User",
    email: user?.email || "admin@laundry.com",
    phone: "+965 1234 5678",
    role: "Administrator",
  });

  const [business, setBusiness] = useState({
    name: "SaaS Laundry",
    address: "Block 5, Street 10, Kuwait City",
    phone: "+965 2222 3333",
    email: "info@saaslaundry.com",
    website: "www.saaslaundry.com",
    taxId: "KWT-123456789",
  });

  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailMarketing: false,
    smsOrders: true,
    smsMarketing: false,
    pushOrders: true,
    pushReminders: true,
    dailyReport: true,
    weeklyReport: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
  });

  const [appearance, setAppearance] = useState({
    theme: "system",
    language: "en",
    dateFormat: "MMM DD, YYYY",
    currency: "KWD",
    timezone: "Asia/Kuwait",
  });

  const handleSaveProfile = () => {
    toast({ title: "Profile updated", description: "Your profile has been saved successfully" });
  };

  const handleSaveBusiness = () => {
    toast({ title: "Business settings updated", description: "Your business information has been saved" });
  };

  const handleSaveNotifications = () => {
    toast({ title: "Notification preferences saved", description: "Your notification settings have been updated" });
  };

  const handleSaveSecurity = () => {
    toast({ title: "Security settings saved", description: "Your security preferences have been updated" });
  };

  const handleSaveAppearance = () => {
    toast({ title: "Appearance settings saved", description: "Your display preferences have been updated" });
  };

  const handleChangePassword = () => {
    toast({ title: "Password change initiated", description: "Check your email for password reset instructions" });
  };

  const handleExportData = () => {
    toast({ title: "Export started", description: "Your data export is being prepared" });
  };

  const handleDeleteAccount = () => {
    toast({ title: "Action required", description: "Please contact support to delete your account", variant: "destructive" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="mt-1 text-muted-foreground">Manage your account and application preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-2">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="business">
              <Building className="mr-2 h-4 w-4" />
              Business
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="mr-2 h-4 w-4" />
              Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Profile Information</h3>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {profile.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input value={profile.role} disabled />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Business Information</h3>
              
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input
                      value={business.name}
                      onChange={(e) => setBusiness((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax ID</Label>
                    <Input
                      value={business.taxId}
                      onChange={(e) => setBusiness((p) => ({ ...p, taxId: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Business Address</Label>
                  <Textarea
                    value={business.address}
                    onChange={(e) => setBusiness((p) => ({ ...p, address: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Business Phone</Label>
                    <Input
                      value={business.phone}
                      onChange={(e) => setBusiness((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Email</Label>
                    <Input
                      type="email"
                      value={business.email}
                      onChange={(e) => setBusiness((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    value={business.website}
                    onChange={(e) => setBusiness((p) => ({ ...p, website: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveBusiness}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Notification Preferences</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium flex items-center gap-2 mb-4">
                    <Mail className="h-4 w-4" />
                    Email Notifications
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Order Updates</p>
                        <p className="text-sm text-muted-foreground">Get notified about new orders and status changes</p>
                      </div>
                      <Switch
                        checked={notifications.emailOrders}
                        onCheckedChange={(v) => setNotifications((p) => ({ ...p, emailOrders: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Updates</p>
                        <p className="text-sm text-muted-foreground">Receive tips and product updates</p>
                      </div>
                      <Switch
                        checked={notifications.emailMarketing}
                        onCheckedChange={(v) => setNotifications((p) => ({ ...p, emailMarketing: v }))}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium flex items-center gap-2 mb-4">
                    <Smartphone className="h-4 w-4" />
                    SMS Notifications
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Order Alerts</p>
                        <p className="text-sm text-muted-foreground">SMS for urgent order notifications</p>
                      </div>
                      <Switch
                        checked={notifications.smsOrders}
                        onCheckedChange={(v) => setNotifications((p) => ({ ...p, smsOrders: v }))}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium flex items-center gap-2 mb-4">
                    <Bell className="h-4 w-4" />
                    Reports
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Daily Summary</p>
                        <p className="text-sm text-muted-foreground">Receive daily business summary</p>
                      </div>
                      <Switch
                        checked={notifications.dailyReport}
                        onCheckedChange={(v) => setNotifications((p) => ({ ...p, dailyReport: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Report</p>
                        <p className="text-sm text-muted-foreground">Detailed weekly analytics report</p>
                      </div>
                      <Switch
                        checked={notifications.weeklyReport}
                        onCheckedChange={(v) => setNotifications((p) => ({ ...p, weeklyReport: v }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveNotifications}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Security Settings</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={security.twoFactor}
                    onCheckedChange={(v) => setSecurity((p) => ({ ...p, twoFactor: v }))}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Select
                      value={security.sessionTimeout}
                      onValueChange={(v) => setSecurity((p) => ({ ...p, sessionTimeout: v }))}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Password Expiry (days)</Label>
                    <Select
                      value={security.passwordExpiry}
                      onValueChange={(v) => setSecurity((p) => ({ ...p, passwordExpiry: v }))}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleChangePassword}>
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                  <Button onClick={handleSaveSecurity}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-destructive/50">
              <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Export Data</p>
                    <p className="text-sm text-muted-foreground">Download all your data in CSV format</p>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Display Settings</h3>
              
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select
                      value={appearance.theme}
                      onValueChange={(v) => setAppearance((p) => ({ ...p, theme: v }))}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={appearance.language}
                      onValueChange={(v) => setAppearance((p) => ({ ...p, language: v }))}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={appearance.currency}
                      onValueChange={(v) => setAppearance((p) => ({ ...p, currency: v }))}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="KWD">Kuwaiti Dinar (KD)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select
                      value={appearance.timezone}
                      onValueChange={(v) => setAppearance((p) => ({ ...p, timezone: v }))}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="Asia/Kuwait">Kuwait (GMT+3)</SelectItem>
                        <SelectItem value="Asia/Dubai">Dubai (GMT+4)</SelectItem>
                        <SelectItem value="Asia/Riyadh">Riyadh (GMT+3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select
                    value={appearance.dateFormat}
                    onValueChange={(v) => setAppearance((p) => ({ ...p, dateFormat: v }))}
                  >
                    <SelectTrigger className="w-full sm:w-64 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="MMM DD, YYYY">Dec 12, 2025</SelectItem>
                      <SelectItem value="DD/MM/YYYY">12/12/2025</SelectItem>
                      <SelectItem value="YYYY-MM-DD">2025-12-12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveAppearance}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
