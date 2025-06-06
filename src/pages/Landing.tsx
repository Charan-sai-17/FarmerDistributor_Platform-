
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sprout, 
  TrendingUp, 
  Shield, 
  Users, 
  MapPin, 
  CheckCircle,
  ArrowRight,
  Globe,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Landing = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { t, setLanguage } = useLanguage();

  const roles = [
    {
      id: 'farmer',
      title: 'Farmer',
      description: 'Get funding for your crops and maximize your harvest returns',
      icon: Sprout,
      color: 'bg-green-500',
      features: ['Crop Funding', 'Expert Guidance', 'Market Access', 'Risk Protection']
    },
    {
      id: 'distributor',
      title: 'Distributor',
      description: 'Invest in agricultural projects and diversify your portfolio',
      icon: TrendingUp,
      color: 'bg-blue-500',
      features: ['High Returns', 'Diversified Portfolio', 'Direct Investment', 'Transparent Tracking']
    },
    {
      id: 'agent',
      title: 'Agent',
      description: 'Verify and support farmers in your region',
      icon: Shield,
      color: 'bg-purple-500',
      features: ['Field Verification', 'Earn Commission', 'Support Farmers', 'Regional Network']
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Farmers', icon: Users },
    { number: '₹50Cr+', label: 'Funding Raised', icon: TrendingUp },
    { number: '500+', label: 'Districts Covered', icon: MapPin },
    { number: '98%', label: 'Success Rate', icon: CheckCircle }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Harvest Nexus Connect</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-600" />
              <select 
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  setLanguage(e.target.value as 'en' | 'te');
                }}
                className="bg-transparent border border-gray-200 rounded-lg px-2 py-1 text-sm"
              >
                <option value="en">English</option>
                <option value="te">తెలుగు</option>
              </select>
            </div>
            <Link to="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 px-4"
      >
        <div className="container mx-auto text-center">
          <motion.div variants={itemVariants} className="mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              🌾 Revolutionizing Agriculture Finance
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect. Invest.{' '}
              <span className="text-primary">Harvest</span> Success
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Bridge the gap between farmers and investors with our AI-powered 
              agricultural financing platform. Transparent, secure, and profitable.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6 rounded-2xl group">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-2xl">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Role Selection */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-4 bg-white"
      >
        <div className="container mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Choose Your Role
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our ecosystem as a farmer seeking funding, an investor looking for opportunities, 
              or an agent supporting the community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full border-2 border-gray-100 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 ${role.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                      <role.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{role.title}</h3>
                    <p className="text-gray-600 mb-6">{role.description}</p>
                    
                    <div className="space-y-2 mb-8">
                      {role.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <Link to="/signup" state={{ role: role.id }}>
                      <Button className="w-full rounded-xl group-hover:bg-primary/90">
                        Join as {role.title}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-4 bg-gradient-to-r from-green-50 to-emerald-50"
      >
        <div className="container mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our simple 3-step process connects farmers with investors seamlessly
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Register & Verify',
                description: 'Create your profile and complete KYC verification with our secure process'
              },
              {
                step: '02',
                title: 'Connect & Invest',
                description: 'Browse opportunities, connect with farmers, and make informed investments'
              },
              {
                step: '03',
                title: 'Track & Harvest',
                description: 'Monitor your investments in real-time and receive returns upon harvest'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-gray-900 text-white py-16 px-4"
      >
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">Harvest Nexus</span>
              </div>
              <p className="text-gray-400 text-sm">
                Revolutionizing agriculture through technology and community.
              </p>
            </motion.div>

            {[
              {
                title: 'Platform',
                links: ['How it Works', 'For Farmers', 'For Investors', 'For Agents']
              },
              {
                title: 'Support',
                links: ['Help Center', 'Contact Us', 'Live Chat', 'FAQ']
              },
              {
                title: 'Legal',
                links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Compliance']
              }
            ].map((section, index) => (
              <motion.div key={index} variants={itemVariants}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            variants={itemVariants}
            className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm"
          >
            © 2024 Harvest Nexus Connect. All rights reserved.
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Landing;
