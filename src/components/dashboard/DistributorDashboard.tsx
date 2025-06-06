
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Eye,
  Calendar,
  MapPin,
  Sprout,
  Users,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DistributorDashboard = () => {
  const { user } = useAuth();

  const investments = [
    {
      id: 1,
      farmerName: 'Ravi Kumar',
      cropType: 'Rice',
      variety: 'Basmati',
      location: 'Guntur, AP',
      investedAmount: 50000,
      expectedReturn: 65000,
      duration: '4 months',
      progress: 75,
      status: 'active',
      riskLevel: 'Low'
    },
    {
      id: 2,
      farmerName: 'Priya Sharma',
      cropType: 'Wheat',
      variety: 'Durum',
      location: 'Kurnool, AP',
      investedAmount: 35000,
      expectedReturn: 42000,
      duration: '5 months',
      progress: 30,
      status: 'active',
      riskLevel: 'Medium'
    }
  ];

  const opportunities = [
    {
      id: 1,
      farmerName: 'Suresh Reddy',
      cropType: 'Tomato',
      fundingNeeded: 75000,
      expectedROI: 25,
      duration: '6 months',
      location: 'Anantapur, AP',
      riskLevel: 'Low'
    },
    {
      id: 2,
      farmerName: 'Lakshmi Devi',
      cropType: 'Cotton',
      fundingNeeded: 120000,
      expectedROI: 30,
      duration: '8 months',
      location: 'Warangal, TS',
      riskLevel: 'Medium'
    }
  ];

  const portfolioStats = [
    { label: 'Total Invested', value: '₹2.8L', change: '+12%', positive: true },
    { label: 'Active Investments', value: '8', change: '+2', positive: true },
    { label: 'Expected Returns', value: '₹3.6L', change: '+18%', positive: true },
    { label: 'Avg. ROI', value: '22%', change: '+3%', positive: true }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}! 📈</h1>
            <p className="opacity-90">Your portfolio is performing well with strong returns.</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">₹2,80,000</div>
            <div className="text-sm opacity-90">Portfolio Value</div>
          </div>
        </div>
      </motion.div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {portfolioStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-600">{stat.label}</div>
                  {stat.positive ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className={`text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} vs last month
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Investments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-600" />
            Active Investments
          </CardTitle>
          <Button variant="outline" size="sm" className="rounded-xl">
            View All
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {investments.map((investment) => (
            <motion.div
              key={investment.id}
              whileHover={{ scale: 1.02 }}
              className="border rounded-xl p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{investment.farmerName}</h3>
                  <p className="text-sm text-gray-600">{investment.cropType} • {investment.variety}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {investment.location}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={investment.riskLevel === 'Low' ? 'default' : 'secondary'}>
                    {investment.riskLevel} Risk
                  </Badge>
                  <div className="text-sm text-gray-600 mt-1">{investment.duration}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">Invested Amount</div>
                  <div className="font-semibold text-lg">₹{investment.investedAmount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Expected Return</div>
                  <div className="font-semibold text-lg text-green-600">
                    ₹{investment.expectedReturn.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{investment.progress}%</span>
                </div>
                <Progress value={investment.progress} className="h-2" />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 rounded-lg">
                  <Eye className="w-3 h-3 mr-1" />
                  Track
                </Button>
                <Button variant="outline" size="sm" className="flex-1 rounded-lg">
                  Contact Farmer
                </Button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Investment Opportunities */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Investment Opportunities
          </CardTitle>
          <Button variant="outline" size="sm" className="rounded-xl">
            Explore More
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {opportunities.map((opportunity) => (
            <motion.div
              key={opportunity.id}
              whileHover={{ scale: 1.02 }}
              className="border rounded-xl p-4 hover:shadow-md transition-all bg-gradient-to-r from-green-50 to-emerald-50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{opportunity.farmerName}</h3>
                  <p className="text-sm text-gray-600">{opportunity.cropType}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {opportunity.location}
                  </div>
                </div>
                <Badge variant={opportunity.riskLevel === 'Low' ? 'default' : 'secondary'}>
                  {opportunity.riskLevel} Risk
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">Funding Needed</div>
                  <div className="font-semibold">₹{opportunity.fundingNeeded.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Expected ROI</div>
                  <div className="font-semibold text-green-600">{opportunity.expectedROI}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="font-semibold">{opportunity.duration}</div>
                </div>
              </div>
              
              <Button className="w-full rounded-lg">
                Invest Now
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DistributorDashboard;
