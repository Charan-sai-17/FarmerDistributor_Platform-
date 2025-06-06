
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sprout, 
  TrendingUp, 
  Bell, 
  Plus, 
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [showAddCrop, setShowAddCrop] = useState(false);

  const crops = [
    {
      id: 1,
      name: 'Rice Paddy',
      variety: 'Basmati',
      area: '2.5 acres',
      plantingDate: '2024-06-15',
      expectedHarvest: '2024-10-15',
      fundingNeeded: 75000,
      fundingReceived: 60000,
      status: 'growing',
      progress: 65,
      location: 'Guntur, AP'
    },
    {
      id: 2,
      name: 'Wheat',
      variety: 'Durum',
      area: '1.8 acres',
      plantingDate: '2024-11-01',
      expectedHarvest: '2025-03-15',
      fundingNeeded: 45000,
      fundingReceived: 45000,
      status: 'funded',
      progress: 15,
      location: 'Guntur, AP'
    }
  ];

  const notifications = [
    { id: 1, message: 'Rice crop verification completed', time: '2 hours ago', type: 'success' },
    { id: 2, message: 'Weather alert: Heavy rain expected', time: '5 hours ago', type: 'warning' },
    { id: 3, message: 'Funding received: ₹15,000', time: '1 day ago', type: 'success' }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      growing: { color: 'bg-green-500', text: 'Growing' },
      funded: { color: 'bg-blue-500', text: 'Funded' },
      pending: { color: 'bg-yellow-500', text: 'Pending' },
      harvested: { color: 'bg-purple-500', text: 'Harvested' }
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}! 🌾</h1>
            <p className="opacity-90">Your crops are growing well. Keep up the great work!</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">₹1,05,000</div>
            <div className="text-sm opacity-90">Total Investment</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Crops', value: '2', icon: Sprout, color: 'text-green-600' },
          { label: 'Expected Returns', value: '₹1.8L', icon: TrendingUp, color: 'text-blue-600' },
          { label: 'Pending Verifications', value: '1', icon: Clock, color: 'text-yellow-600' },
          { label: 'Completed Harvests', value: '5', icon: CheckCircle, color: 'text-purple-600' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Crops */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Sprout className="w-5 h-5 mr-2 text-green-600" />
            My Crops
          </CardTitle>
          <Button 
            onClick={() => setShowAddCrop(true)}
            className="rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Crop
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {crops.map((crop) => {
            const statusInfo = getStatusBadge(crop.status);
            return (
              <motion.div
                key={crop.id}
                whileHover={{ scale: 1.02 }}
                className="border rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{crop.name}</h3>
                    <p className="text-sm text-gray-600">{crop.variety} • {crop.area}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {crop.location}
                    </div>
                  </div>
                  <Badge className={`${statusInfo.color} text-white`}>
                    {statusInfo.text}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Funding Progress</div>
                    <div className="font-semibold">
                      ₹{crop.fundingReceived.toLocaleString()} / ₹{crop.fundingNeeded.toLocaleString()}
                    </div>
                    <Progress 
                      value={(crop.fundingReceived / crop.fundingNeeded) * 100} 
                      className="mt-1 h-2"
                    />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Growth Progress</div>
                    <div className="font-semibold">{crop.progress}% Complete</div>
                    <Progress value={crop.progress} className="mt-1 h-2" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-3 h-3 mr-1" />
                    Expected Harvest: {new Date(crop.expectedHarvest).toLocaleDateString()}
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    View Details
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-600" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full mr-3 ${
                notification.type === 'success' ? 'bg-green-500' : 
                notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerDashboard;
