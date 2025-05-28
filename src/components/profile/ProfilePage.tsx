
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, User, Bell, LogOut, HelpCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import EditProfileModal from './EditProfileModal';

interface ProfilePageProps {
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const { user, setUser } = useApp();
  const { toast } = useToast();

  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  if (!user) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'farmer': return 'bg-green-100 text-green-800';
      case 'distributor': return 'bg-blue-100 text-blue-800';
      case 'agent': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Dashboard
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center text-4xl">
              {getRoleEmoji(user.role)}
            </div>
            <CardTitle className="text-2xl font-heading">{user.name}</CardTitle>
            <Badge className={getRoleColor(user.role)}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-lg">{user.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Location</label>
                <p className="text-lg">{user.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">User ID</label>
                <p className="text-lg">{user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Wallet Balance</label>
                <p className="text-lg font-mono font-bold text-primary">₹{user.walletBalance.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button onClick={() => setShowEditModal(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Account Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {user.role === 'farmer' ? '3' : user.role === 'distributor' ? '12' : '8'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {user.role === 'farmer' ? 'Active Crops' : user.role === 'distributor' ? 'Purchases' : 'Verifications'}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">98%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
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
