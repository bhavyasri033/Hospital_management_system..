"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Mail,
  Phone,
  Shield,
  Stethoscope,
  Pill,
  Camera,
  Key,
  Globe,
  Palette,
  Save,
  Edit,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
  Monitor,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "@/app/context/theme-context"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "doctor" | "pharma"
}

interface ProfileSettingsProps {
  user: User
  isOpen: boolean
  onClose: () => void
}

export default function ProfileSettings({ user, isOpen, onClose }: ProfileSettingsProps) {
  const { toast } = useToast()
  const { theme, setTheme, isDark } = useTheme()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Role-specific profile data
  const [profileData, setProfileData] = useState({
    // Basic Info
    name: user.name,
    email: user.email,
    phone: "+91 98765 43210",
    avatar: "/placeholder-user.jpg",
    
    // Role-specific fields
    department: user.role === "doctor" ? "Cardiology" : user.role === "pharma" ? "Pharmacy" : "Administration",
    specialization: user.role === "doctor" ? "Interventional Cardiology" : "",
    experience: user.role === "doctor" ? "8" : "",
    license: user.role === "doctor" ? "MED123456" : "",
    shift: user.role === "pharma" ? "Morning (8am-4pm)" : "",
    

    
    // Security
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-5 w-5 text-red-600" />
      case "doctor":
        return <Stethoscope className="h-5 w-5 text-blue-600" />
      case "pharma":
        return <Pill className="h-5 w-5 text-green-600" />
      default:
        return <User className="h-5 w-5 text-gray-600" />
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator"
      case "doctor":
        return "Doctor"
      case "pharma":
        return "Pharmaceutical Admin"
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
      case "doctor":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
      case "pharma":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
    }
  }

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved successfully.",
    })
  }

  const handlePasswordChange = () => {
    if (profileData.newPassword !== profileData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      })
      return
    }
    
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    })
    
    setProfileData({
      ...profileData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    setTheme(newTheme)
    toast({
      title: "Theme Updated",
      description: `Theme changed to ${newTheme === "auto" ? "Auto (System)" : newTheme === "dark" ? "Dark" : "Light"} mode.`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-gray-900 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl dark:text-white">
            <User className="h-6 w-6 text-blue-600" />
            Profile Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileData.avatar} alt={profileData.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 text-xl font-bold dark:from-blue-900 dark:to-cyan-900 dark:text-blue-300">
                      {profileData.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0 dark:border-gray-600 dark:text-gray-300"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profileData.name}</h2>
                    <Badge className={getRoleColor(user.role)}>
                      <div className="flex items-center gap-1">
                        {getRoleIcon(user.role)}
                        {getRoleDisplayName(user.role)}
                      </div>
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2 dark:text-gray-300">{profileData.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Member since January 2024</p>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 dark:from-blue-500 dark:to-cyan-500 dark:hover:from-blue-600 dark:hover:to-cyan-600"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 dark:bg-gray-800 dark:border-gray-700">
              <TabsTrigger value="profile" className="flex items-center gap-2 dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2 dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">
                <Key className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2 dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <User className="h-5 w-5 text-blue-600" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="dark:text-gray-300">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="dark:text-gray-300">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="dark:text-gray-300">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Role-specific Information */}
                <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      {getRoleIcon(user.role)}
                      {getRoleDisplayName(user.role)} Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.role === "doctor" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="department" className="dark:text-gray-300">Department</Label>
                          <Select
                            value={profileData.department}
                            onValueChange={(value) => setProfileData({ ...profileData, department: value })}
                            disabled={!isEditing}
                          >
                            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                              <SelectItem value="Cardiology" className="dark:text-gray-300 dark:hover:bg-gray-700">Cardiology</SelectItem>
                              <SelectItem value="Neurology" className="dark:text-gray-300 dark:hover:bg-gray-700">Neurology</SelectItem>
                              <SelectItem value="Pediatrics" className="dark:text-gray-300 dark:hover:bg-gray-700">Pediatrics</SelectItem>
                              <SelectItem value="Orthopedics" className="dark:text-gray-300 dark:hover:bg-gray-700">Orthopedics</SelectItem>
                              <SelectItem value="Dermatology" className="dark:text-gray-300 dark:hover:bg-gray-700">Dermatology</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="specialization" className="dark:text-gray-300">Specialization</Label>
                          <Input
                            id="specialization"
                            value={profileData.specialization}
                            onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                            disabled={!isEditing}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience" className="dark:text-gray-300">Years of Experience</Label>
                          <Input
                            id="experience"
                            type="number"
                            value={profileData.experience}
                            onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                            disabled={!isEditing}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="license" className="dark:text-gray-300">Medical License</Label>
                          <Input
                            id="license"
                            value={profileData.license}
                            onChange={(e) => setProfileData({ ...profileData, license: e.target.value })}
                            disabled={!isEditing}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                          />
                        </div>
                      </>
                    )}

                    {user.role === "pharma" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="shift" className="dark:text-gray-300">Work Shift</Label>
                          <Select
                            value={profileData.shift}
                            onValueChange={(value) => setProfileData({ ...profileData, shift: value })}
                            disabled={!isEditing}
                          >
                            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                              <SelectItem value="Morning (8am-4pm)" className="dark:text-gray-300 dark:hover:bg-gray-700">Morning (8am-4pm)</SelectItem>
                              <SelectItem value="Evening (4pm-12am)" className="dark:text-gray-300 dark:hover:bg-gray-700">Evening (4pm-12am)</SelectItem>
                              <SelectItem value="Night (12am-8am)" className="dark:text-gray-300 dark:hover:bg-gray-700">Night (12am-8am)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    {user.role === "admin" && (
                      <div className="space-y-2">
                        <Label htmlFor="department" className="dark:text-gray-300">Department</Label>
                        <Input
                          id="department"
                          value={profileData.department}
                          onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                          disabled={!isEditing}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>



            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 dark:text-white">
                    <Key className="h-5 w-5 text-blue-600" />
                    Security Settings
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Update your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="dark:text-gray-300">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={profileData.currentPassword}
                        onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent dark:text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="dark:text-gray-300">New Password</Label>
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="dark:text-gray-300">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={profileData.confirmPassword}
                      onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                    />
                  </div>
                  <Button onClick={handlePasswordChange} className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500">
                    <Key className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 dark:text-white">
                    <Palette className="h-5 w-5 text-blue-600" />
                    Appearance Settings
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Customize your interface appearance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Theme Selection</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div 
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          theme === "light" 
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                        onClick={() => handleThemeChange("light")}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Sun className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">Light Theme</h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Clean and bright interface</p>
                          </div>
                        </div>
                      </div>

                      <div 
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          theme === "dark" 
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                        onClick={() => handleThemeChange("dark")}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                            <Moon className="h-4 w-4 text-gray-300" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">Dark Theme</h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Easy on the eyes</p>
                          </div>
                        </div>
                      </div>

                      <div 
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          theme === "auto" 
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                        onClick={() => handleThemeChange("auto")}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                            <Monitor className="h-4 w-4 text-gray-300" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">Auto (System)</h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Follows system preference</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t dark:border-gray-700">
            <Button variant="outline" onClick={onClose} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Cancel
            </Button>
            {isEditing && (
              <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 