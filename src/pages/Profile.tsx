
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User, Mail, Phone, MapPin, Camera, Edit, Save, X, Shield,
  FileText, Settings, Trash2, Eye, EyeOff, Globe, Bell,
  ChevronRight, Upload, Check, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Please enter a valid phone number'),
  address: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const Profile = () => {
  const { user, updateProfile, uploadAvatar, deleteAccount } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
  const [language, setLanguage] = useState(user?.language || 'en');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    }
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema)
  });

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      await uploadAvatar(file);
      setIsLoading(false);
    }
  };

  const handleProfileSave = async (data: ProfileFormData) => {
    setIsLoading(true);
    const success = await updateProfile(data);
    if (success) {
      setIsEditing(false);
    }
    setIsLoading(false);
  };

  const handlePasswordChange = async (data: PasswordFormData) => {
    setIsLoading(true);
    // Simulate password change
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully"
    });
    passwordForm.reset();
    setIsLoading(false);
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    await deleteAccount();
    setIsLoading(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'farmer': return 'bg-green-100 text-green-800';
      case 'distributor': return 'bg-blue-100 text-blue-800';
      case 'agent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completionItems = [
    { label: 'Basic Info', completed: !!user?.name && !!user?.email },
    { label: 'Phone Verified', completed: user?.isPhoneVerified },
    { label: 'Email Verified', completed: user?.isEmailVerified },
    { label: 'Document Uploaded', completed: user?.aadhaarVerified },
    { label: 'Profile Picture', completed: !!user?.avatar }
  ];

  const completedItems = completionItems.filter(item => item.completed).length;
  const completionPercentage = (completedItems / completionItems.length) * 100;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </motion.button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <Badge className={getRoleColor(user.role)}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">{user.email}</p>
              
              {/* Profile Completion */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                  <span className="text-sm text-gray-500">{Math.round(completionPercentage)}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
                <div className="flex flex-wrap gap-2 mt-2">
                  {completionItems.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${
                        item.completed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {item.completed ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <div className="w-3 h-3 border border-current rounded-full" />
                      )}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border"
        >
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5 rounded-t-2xl">
              <TabsTrigger value="basic" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Basic Info</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Documents</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="danger" className="flex items-center space-x-2">
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Danger Zone</span>
              </TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2"
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </>
                  )}
                </Button>
              </div>

              <form onSubmit={profileForm.handleSubmit(handleProfileSave)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        {...profileForm.register('name')}
                        disabled={!isEditing}
                        className="pl-12"
                      />
                    </div>
                    {profileForm.formState.errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {profileForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        {...profileForm.register('email')}
                        disabled={!isEditing}
                        className="pl-12"
                      />
                      {user.isEmailVerified && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            <Check className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                      )}
                    </div>
                    {profileForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        {...profileForm.register('phone')}
                        disabled={!isEditing}
                        className="pl-12"
                      />
                      {user.isPhoneVerified && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            <Check className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                      )}
                    </div>
                    {profileForm.formState.errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {profileForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        {...profileForm.register('address')}
                        disabled={!isEditing}
                        className="pl-12"
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading} className="flex items-center space-x-2">
                      {isLoading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
                      <span>Save Changes</span>
                    </Button>
                  </div>
                )}
              </form>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="p-8">
              <h3 className="text-lg font-semibold mb-6">Documents & Verification</h3>
              
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <div className="mb-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1">Aadhaar Card</h4>
                    <p className="text-sm text-gray-600">
                      {user.aadhaarVerified ? 'Verified and uploaded' : 'Upload your Aadhaar card for verification'}
                    </p>
                  </div>
                  
                  {user.aadhaarVerified ? (
                    <div className="flex items-center justify-center text-green-600">
                      <Check className="w-5 h-5 mr-2" />
                      <span className="font-medium">Verified</span>
                    </div>
                  ) : (
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Email Verification</h5>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge className={user.isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {user.isEmailVerified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Phone Verification</h5>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge className={user.isPhoneVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {user.isPhoneVerified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="p-8">
              <h3 className="text-lg font-semibold mb-6">Security Settings</h3>
              
              <div className="space-y-8">
                {/* Change Password */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
                  <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                    <div className="relative">
                      <Input
                        {...passwordForm.register('currentPassword')}
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="Current Password"
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    <div className="relative">
                      <Input
                        {...passwordForm.register('newPassword')}
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="New Password"
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    <Input
                      {...passwordForm.register('confirmPassword')}
                      type="password"
                      placeholder="Confirm New Password"
                    />
                    
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                      Update Password
                    </Button>
                  </form>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={setTwoFactorEnabled}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="p-8">
              <h3 className="text-lg font-semibold mb-6">Preferences</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">Language</h4>
                      <p className="text-sm text-gray-600">Choose your preferred language</p>
                    </div>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'te')}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="en">English</option>
                    <option value="te">Telugu</option>
                  </select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </TabsContent>

            {/* Danger Zone Tab */}
            <TabsContent value="danger" className="p-8">
              <h3 className="text-lg font-semibold mb-6 text-red-600">Danger Zone</h3>
              
              <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
                    <p className="text-sm text-red-700 mb-4">
                      This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </p>
                    
                    <AnimatePresence>
                      {!showDeleteConfirm ? (
                        <Button
                          variant="destructive"
                          onClick={() => setShowDeleteConfirm(true)}
                        >
                          Delete Account
                        </Button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          <p className="text-sm text-red-700 font-medium">
                            Are you absolutely sure? This action cannot be undone.
                          </p>
                          <div className="flex space-x-3">
                            <Button
                              variant="destructive"
                              onClick={handleDeleteAccount}
                              disabled={isLoading}
                            >
                              {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                              Yes, Delete My Account
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setShowDeleteConfirm(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
