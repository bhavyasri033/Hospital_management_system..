"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Shield,
  Bell,
  Palette,
  Globe,
  Database,
  Monitor,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Sun,
  Moon,
  Wifi,
  Lock,
  Users,
  FileText,
  Activity,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "@/app/context/theme-context"

interface SystemSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export default function SystemSettings({ isOpen, onClose }: SystemSettingsProps) {
  const { toast } = useToast()
  const { theme, setTheme, isDark } = useTheme()
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    // General Settings
    systemName: "Hospital Management System",
    systemVersion: "v1.0.0",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24-hour",
    
    // Appearance
    sidebarCollapsed: false,
    animations: true,
    compactMode: false,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    soundNotifications: true,
    notificationFrequency: "immediate",
    
    // Security
    sessionTimeout: "30",
    requirePasswordChange: false,
    twoFactorAuth: false,
    loginAttempts: "5",
    
    // System
    autoBackup: true,
    backupFrequency: "daily",
    logRetention: "30",
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Settings Saved",
        description: "System settings have been updated successfully.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save system settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setSystemSettings({
      ...systemSettings,
      dateFormat: "DD/MM/YYYY",
      timeFormat: "24-hour",
      sidebarCollapsed: false,
      animations: true,
      compactMode: false,
      emailNotifications: true,
      pushNotifications: true,
      soundNotifications: true,
      notificationFrequency: "immediate",
      sessionTimeout: "30",
      requirePasswordChange: false,
      twoFactorAuth: false,
      loginAttempts: "5",
      autoBackup: true,
      backupFrequency: "daily",
      logRetention: "30",
    })
    
    toast({
      title: "Settings Reset",
      description: "System settings have been reset to defaults.",
      variant: "default",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-6 w-6" />
            System Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                System
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    General Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure basic system settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="systemName">System Name</Label>
                      <Input
                        id="systemName"
                        value={systemSettings.systemName}
                        onChange={(e) => setSystemSettings({...systemSettings, systemName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({...systemSettings, dateFormat: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Appearance & Theme
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of the system
                  </CardDescription>
                </CardHeader>
                                 <CardContent className="space-y-4">
                   <div className="space-y-4">
                     <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Animations</Label>
                          <p className="text-sm text-muted-foreground">Enable smooth animations and transitions</p>
                        </div>
                        <Switch
                          checked={systemSettings.animations}
                          onCheckedChange={(checked) => setSystemSettings({...systemSettings, animations: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Compact Mode</Label>
                          <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
                        </div>
                        <Switch
                          checked={systemSettings.compactMode}
                          onCheckedChange={(checked) => setSystemSettings({...systemSettings, compactMode: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Auto-collapse Sidebar</Label>
                          <p className="text-sm text-muted-foreground">Automatically collapse sidebar on small screens</p>
                        </div>
                        <Switch
                          checked={systemSettings.sidebarCollapsed}
                          onCheckedChange={(checked) => setSystemSettings({...systemSettings, sidebarCollapsed: checked})}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Configure how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={systemSettings.emailNotifications}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, emailNotifications: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Show browser push notifications</p>
                      </div>
                      <Switch
                        checked={systemSettings.pushNotifications}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, pushNotifications: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Sound Notifications</Label>
                        <p className="text-sm text-muted-foreground">Play sound for notifications</p>
                      </div>
                      <Switch
                        checked={systemSettings.soundNotifications}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, soundNotifications: checked})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Notification Frequency</Label>
                      <Select value={systemSettings.notificationFrequency} onValueChange={(value) => setSystemSettings({...systemSettings, notificationFrequency: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="hourly">Hourly Digest</SelectItem>
                          <SelectItem value="daily">Daily Digest</SelectItem>
                          <SelectItem value="weekly">Weekly Digest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Configure security and authentication settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Select value={systemSettings.sessionTimeout} onValueChange={(value) => setSystemSettings({...systemSettings, sessionTimeout: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="480">8 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                      <Select value={systemSettings.loginAttempts} onValueChange={(value) => setSystemSettings({...systemSettings, loginAttempts: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="5">5 attempts</SelectItem>
                          <SelectItem value="10">10 attempts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                      </div>
                      <Switch
                        checked={systemSettings.twoFactorAuth}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, twoFactorAuth: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Force Password Change</Label>
                        <p className="text-sm text-muted-foreground">Require password change on next login</p>
                      </div>
                      <Switch
                        checked={systemSettings.requirePasswordChange}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, requirePasswordChange: checked})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Settings */}
            <TabsContent value="system" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    System Configuration
                  </CardTitle>
                  <CardDescription>
                    Advanced system settings and maintenance options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Auto Backup</Label>
                        <p className="text-sm text-muted-foreground">Automatically backup system data</p>
                      </div>
                      <Switch
                        checked={systemSettings.autoBackup}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoBackup: checked})}
                      />
                    </div>
                    
                    {systemSettings.autoBackup && (
                      <div className="space-y-2">
                        <Label>Backup Frequency</Label>
                        <Select value={systemSettings.backupFrequency} onValueChange={(value) => setSystemSettings({...systemSettings, backupFrequency: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label>Log Retention (days)</Label>
                      <Select value={systemSettings.logRetention} onValueChange={(value) => setSystemSettings({...systemSettings, logRetention: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                                       </div>
                 </CardContent>
               </Card>
             </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 