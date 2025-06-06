
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  MapPin, 
  Camera, 
  CheckCircle,
  Clock,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AgentDashboard = () => {
  const { user } = useAuth();

  const verificationTasks = [
    {
      id: 1,
      farmerName: 'Ravi Kumar',
      cropType: 'Rice',
      area: '2.5 acres',
      location: 'Guntur, AP',
      status: 'pending',
      priority: 'high',
      assignedDate: '2024-01-15',
      documents: ['Land Records', 'Soil Certificate'],
      completionReward: 2500
    },
    {
      id: 2,
      farmerName: 'Priya Sharma',
      cropType: 'Wheat',
      area: '1.8 acres',
      location: 'Kurnool, AP',
      status: 'in-progress',
      priority: 'medium',
      assignedDate: '2024-01-14',
      documents: ['Land Records', 'Previous Harvest Data'],
      completionReward: 2000
    }
  ];

  const completedVerifications = [
    {
      id: 1,
      farmerName: 'Suresh Reddy',
      cropType: 'Tomato',
      completedDate: '2024-01-10',
      reward: 3000,
      rating: 5
    },
    {
      id: 2,
      farmerName: 'Lakshmi Devi',
      cropType: 'Cotton',
      completedDate: '2024-01-08',
      reward: 2500,
      rating: 4
    }
  ];

  const agentStats = [
    { label: 'Pending Tasks', value: '12', icon: Clock, color: 'text-yellow-600' },
    { label: 'Completed This Month', value: '25', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Total Earnings', value: '₹45K', icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Farmers Verified', value: '180', icon: Users, color: 'text-purple-600' }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { color: 'bg-yellow-500', text: 'Pending' },
      'in-progress': { color: 'bg-blue-500', text: 'In Progress' },
      completed: { color: 'bg-green-500', text: 'Completed' },
      rejected: { color: 'bg-red-500', text: 'Rejected' }
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: { color: 'bg-red-100 text-red-800', text: 'High Priority' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Medium Priority' },
      low: { color: 'bg-green-100 text-green-800', text: 'Low Priority' }
    };
    return variants[priority as keyof typeof variants] || variants.medium;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}! 🛡️</h1>
            <p className="opacity-90">You have 12 pending verifications in your region.</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">₹45,000</div>
            <div className="text-sm opacity-90">This Month Earnings</div>
          </div>
        </div>
      </motion.div>

      {/* Agent Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {agentStats.map((stat, index) => (
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

      {/* Pending Verification Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-purple-600" />
            Pending Verifications
          </CardTitle>
          <Button variant="outline" size="sm" className="rounded-xl">
            View All Tasks
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationTasks.map((task) => {
            const statusInfo = getStatusBadge(task.status);
            const priorityInfo = getPriorityBadge(task.priority);
            
            return (
              <motion.div
                key={task.id}
                whileHover={{ scale: 1.02 }}
                className="border rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{task.farmerName}</h3>
                    <p className="text-sm text-gray-600">{task.cropType} • {task.area}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {task.location}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={`${statusInfo.color} text-white text-xs`}>
                      {statusInfo.text}
                    </Badge>
                    <Badge className={`${priorityInfo.color} text-xs`}>
                      {priorityInfo.text}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Assigned Date</div>
                    <div className="font-semibold">
                      {new Date(task.assignedDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Completion Reward</div>
                    <div className="font-semibold text-green-600">₹{task.completionReward}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Required Documents:</div>
                  <div className="flex flex-wrap gap-2">
                    {task.documents.map((doc, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 rounded-lg">
                    <Camera className="w-3 h-3 mr-1" />
                    Start Verification
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 rounded-lg">
                    <MapPin className="w-3 h-3 mr-1" />
                    Get Directions
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recently Completed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Recently Completed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {completedVerifications.map((verification) => (
            <div key={verification.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium">{verification.farmerName}</p>
                <p className="text-sm text-gray-600">{verification.cropType} verification</p>
                <p className="text-xs text-gray-500">
                  Completed on {new Date(verification.completedDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">₹{verification.reward}</div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`text-xs ${i < verification.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex-col rounded-xl">
              <Camera className="w-6 h-6 mb-2" />
              Document Scanner
            </Button>
            <Button variant="outline" className="h-20 flex-col rounded-xl">
              <MapPin className="w-6 h-6 mb-2" />
              Nearby Tasks
            </Button>
            <Button variant="outline" className="h-20 flex-col rounded-xl">
              <FileText className="w-6 h-6 mb-2" />
              Upload Report
            </Button>
            <Button variant="outline" className="h-20 flex-col rounded-xl">
              <TrendingUp className="w-6 h-6 mb-2" />
              My Earnings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentDashboard;
