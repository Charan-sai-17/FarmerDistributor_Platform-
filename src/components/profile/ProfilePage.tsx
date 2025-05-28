
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, User, MapPin, Phone, Calendar, Star } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import EditProfileModal from './EditProfileModal';

interface ProfilePageProps {
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const { user, setUser, crops, contracts } = useApp();
  const { toast } = useToast();

  const handleLogout = () => {
    setUser(null);
    onBack(); // This will trigger the main app's logout logic
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  if (!user) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'farmer': return 'bg-green-100 text-green-800 border-green-200';
      case 'distributor': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'agent': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleEmoji = (role: string) => {
    switch (role) {
      case 'farmer': return '🧑‍🌾';
      case 'distributor': return '📦';
      case 'agent': return '🛡️';
      default: return '👤';
    }
  };

  const getStatsForRole = () => {
    if (user.role === 'farmer') {
      const userCrops = crops.filter(c => c.farmerId === user.id);
      return {
        primary: { label: 'Active Crops', value: userCrops.length, icon: '🌱' },
        secondary: { label: 'Total Revenue', value: `₹${userCrops.reduce((sum, c) => sum + c.price, 0).toLocaleString()}`, icon: '💰' },
        tertiary: { label: 'Success Rate', value: '94%', icon: '⭐' }
      };
    } else if (user.role === 'distributor') {
      const userContracts = contracts.filter(c => c.distributorId === user.id);
      return {
        primary: { label: 'Total Purchases', value: userContracts.length, icon: '📦' },
        secondary: { label: 'Investment', value: `₹${userContracts.reduce((sum, c) => sum + c.price, 0).toLocaleString()}`, icon: '💰' },
        tertiary: { label: 'Rating', value: '4.8★', icon: '⭐' }
      };
    } else {
      return {
        primary: { label: 'Verifications', value: '47', icon: '✅' },
        secondary: { label: 'This Month', value: '₹12,500', icon: '💰' },
        tertiary: { label: 'Accuracy', value: '98%', icon: '⭐' }
      };
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <span>←</span>
            <span>Back to Dashboard</span>
          </Button>
          <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
            Logout
          </Button>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-4xl shadow-lg">
                {getRoleEmoji(user.role)}
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                <Badge className={`${getRoleColor(user.role)} text-sm font-medium mb-3`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                </div>
              </div>
              <Button onClick={() => setShowEditModal(true)} className="flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">{stats.primary.icon}</div>
              <p className="text-2xl font-bold text-primary mb-1">{stats.primary.value}</p>
              <p className="text-sm text-gray-600">{stats.primary.label}</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">{stats.secondary.icon}</div>
              <p className="text-2xl font-bold text-green-600 mb-1">{stats.secondary.value}</p>
              <p className="text-sm text-gray-600">{stats.secondary.label}</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">{stats.tertiary.icon}</div>
              <p className="text-2xl font-bold text-orange-600 mb-1">{stats.tertiary.value}</p>
              <p className="text-sm text-gray-600">{stats.tertiary.label}</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">User ID</label>
                <p className="text-lg font-mono">{user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Member Since</label>
                <p className="text-lg">January 2024</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Wallet Balance</label>
                <p className="text-lg font-mono font-bold text-primary">₹{user.walletBalance.toLocaleString()}</p>
              </div>
              {user.bio && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Bio</label>
                  <p className="text-lg">{user.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Activity Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-800 font-medium">Completed Tasks</span>
                <span className="text-green-600 font-bold">
                  {user.role === 'farmer' ? crops.filter(c => c.farmerId === user.id && c.status === 'sold').length :
                   user.role === 'distributor' ? contracts.filter(c => c.distributorId === user.id && c.status === 'completed').length : '23'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-800 font-medium">Active Projects</span>
                <span className="text-blue-600 font-bold">
                  {user.role === 'farmer' ? crops.filter(c => c.farmerId === user.id && c.status !== 'sold').length :
                   user.role === 'distributor' ? contracts.filter(c => c.distributorId === user.id && c.status === 'active').length : '5'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-800 font-medium">Pending Reviews</span>
                <span className="text-yellow-600 font-bold">
                  {user.role === 'farmer' ? crops.filter(c => c.farmerId === user.id && c.status === 'pending').length :
                   user.role === 'distributor' ? '2' : '8'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <EditProfileModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
      />
    </div>
  );
};

export default ProfilePage;
