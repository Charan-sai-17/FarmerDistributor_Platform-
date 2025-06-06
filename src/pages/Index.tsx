
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Settings, 
  LogOut, 
  Wallet,
  Globe,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import FarmerDashboard from '@/components/dashboard/FarmerDashboard';
import DistributorDashboard from '@/components/dashboard/DistributorDashboard';
import AgentDashboard from '@/components/dashboard/AgentDashboard';

const Index = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'farmer': return 'bg-green-500';
      case 'distributor': return 'bg-blue-500';
      case 'agent': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const renderDashboard = () => {
    switch (user?.role) {
      case 'farmer':
        return <FarmerDashboard />;
      case 'distributor':
        return <DistributorDashboard />;
      case 'agent':
        return <AgentDashboard />;
      default:
        return <FarmerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-sm border-b sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">HN</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Harvest Nexus</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Connect • Invest • Harvest</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-600" />
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'te')}
                  className="bg-transparent border border-gray-200 rounded-lg px-2 py-1 text-sm"
                >
                  <option value="en">EN</option>
                  <option value="te">TE</option>
                </select>
              </div>

              {/* Wallet Button */}
              <Button variant="outline" size="sm" className="rounded-xl">
                <Wallet className="w-4 h-4 mr-2" />
                Wallet
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <Badge className={`${getRoleBadgeColor(user?.role || 'farmer')} text-white text-xs`}>
                    {user?.role}
                  </Badge>
                </div>
                <Link to="/profile">
                  <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-primary text-white">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>

              {/* Logout */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-gray-100"
            >
              <div className="flex items-center space-x-3 mt-4 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-primary text-white">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <Badge className={`${getRoleBadgeColor(user?.role || 'farmer')} text-white text-xs`}>
                    {user?.role}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Wallet className="w-4 h-4 mr-2" />
                  Wallet
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                <Link to="/profile" className="w-full">
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {renderDashboard()}
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
