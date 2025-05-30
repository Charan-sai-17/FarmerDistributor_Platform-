import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Home, Calendar, Bell, Plus, LogOut, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppProvider, useApp, Crop } from '@/contexts/AppContext';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import AddCropForm from '@/components/farmer/AddCropForm';
import CropCard from '@/components/farmer/CropCard';
import CropMarketplace from '@/components/distributor/CropMarketplace';
import VerificationDashboard from '@/components/agent/VerificationDashboard';
import ProfilePage from '@/components/profile/ProfilePage';
import NotificationsPage from '@/components/notifications/NotificationsPage';
import NotificationsDropdown from '@/components/notifications/NotificationsDropdown';
import HelpSupportModal from '@/components/support/HelpSupportModal';
import CropDetailsModal from '@/components/crop/CropDetailsModal';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const AppContent = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedRole, setSelectedRole] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [showCropDetails, setShowCropDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, setUser, crops, contracts } = useApp();
  const { language, setLanguage, t } = useLanguage();

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setCurrentView('auth');
  };

  const handleSendOTP = async () => {
    if (phone.length === 10) {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpSent(true);
      setIsLoading(false);
      toast({
        title: "OTP Sent",
        description: "Please check your mobile for the verification code.",
      });
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length === 6) {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser = {
        id: selectedRole + '1',
        name: `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} User`,
        phone,
        role: selectedRole as 'farmer' | 'distributor' | 'agent',
        location: 'Guntur, AP',
        walletBalance: selectedRole === 'distributor' ? 250000 : 15000
      };
      setUser(newUser);
      setCurrentView('dashboard');
      setIsLoading(false);
      toast({
        title: "Welcome!",
        description: `Successfully logged in as ${selectedRole}.`,
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
    setPhone('');
    setOtp('');
    setOtpSent(false);
    setSelectedRole('');
    setShowProfile(false);
    setShowNotifications(false);
    setShowHelp(false);
    setShowAddCrop(false);
    setShowCropDetails(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleViewCropDetails = (crop: Crop) => {
    setSelectedCrop(crop);
    setShowCropDetails(true);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'te' : 'en');
    toast({
      title: language === 'en' ? 'Language Changed' : 'భాష మార్చబడింది',
      description: language === 'en' ? 'Switched to Telugu' : 'ఇంగ్లీష్‌కు మార్చబడింది',
    });
  };

  // Landing Page
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
        <div className="container mx-auto px-4 py-4 sm:py-8">
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-heading font-bold text-primary">AgroConnect</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="hidden sm:inline-flex">
                {language === 'en' ? 'English' : 'తెలుగు'}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleLanguage}
                className="hover:bg-primary/10 transition-colors"
              >
                {language === 'en' ? 'తెలుగు' : 'English'}
              </Button>
            </div>
          </header>

          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
              <div className="text-2xl sm:text-4xl">🌱</div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4 px-4">
              {language === 'en' 
                ? 'Grow Smart. Trade Fair. Earn Secure.' 
                : 'తెలివిగా పెంచండి. న్యాయంగా వ్యాపారం చేయండి. సురక్షితంగా సంపాదించండి.'
              }
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              {language === 'en'
                ? 'Empowering Farmers, Distributors & Agents through technology-driven agriculture trading'
                : 'సాంకేతికత-ఆధారిత వ్యవసాయ వ్యాపారం ద్వారా రైతులు, పంపిణీదారులు & ఏజెంట్లను శక్తివంతం చేయడం'
              }
            </p>
            <Button 
              onClick={() => setCurrentView('role-select')}
              size="lg"
              className="text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 animate-scale-in hover-lift hover:shadow-lg transition-all"
            >
              {language === 'en' ? 'Get Started →' : 'ప్రారంభించండి →'}
            </Button>
          </div>

          {/* Features - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mb-12 sm:mb-16 px-4">
            {[
              { 
                icon: "🧑‍🌾", 
                title: language === 'en' ? "For Farmers" : "రైతులకు", 
                desc: language === 'en' 
                  ? "List crops, get fair prices, secure contracts" 
                  : "పంటలను జాబితా చేయండి, న్యాయమైన ధరలు పొందండి, సురక్షిత ఒప్పందాలు"
              },
              { 
                icon: "📦", 
                title: language === 'en' ? "For Distributors" : "పంపిణీదారులకు", 
                desc: language === 'en'
                  ? "Discover quality crops, invest early, guaranteed supply" 
                  : "నాణ్యమైన పంటలను కనుగొనండి, ముందుగా పెట్టుబడి పెట్టండి, హామీ సరఫరా"
              },
              { 
                icon: "🛡️", 
                title: language === 'en' ? "For Agents" : "ఏజెంట్లకు", 
                desc: language === 'en'
                  ? "Verify crops, earn commissions, build trust" 
                  : "పంటలను ధృవీకరించండి, కమీషన్లు సంపాదించండి, నమ్మకం పెంచుకోండి"
              }
            ].map((feature, index) => (
              <Card key={index} className="hover-lift animate-slide-up glass-card group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="text-3xl sm:text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-lg sm:text-xl font-heading font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-xs sm:text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <span>🔒</span>
                <span>{language === 'en' ? 'Blockchain Secured' : 'బ్లాక్‌చెయిన్ సురక్షితం'}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>🏛️</span>
                <span>{language === 'en' ? 'FPO Backed' : 'FPO మద్దతు'}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>💰</span>
                <span>{language === 'en' ? 'Escrow Protected' : 'ఎస్క్రో రక్షణ'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Role Selection
  if (currentView === 'role-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2">
              {language === 'en' ? 'I am a...' : 'నేను...'}
            </h2>
            <p className="text-gray-600">
              {language === 'en' ? 'Choose your role to get started' : 'ప్రారంభించడానికి మీ పాత్రను ఎంచుకోండి'}
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {[
              { 
                role: 'farmer', 
                icon: '🧑‍🌾', 
                title: language === 'en' ? 'Farmer' : 'రైతు', 
                subtitle: language === 'en' ? 'Grow and sell crops' : 'పంటలు పెంచి అమ్మండి'
              },
              { 
                role: 'distributor', 
                icon: '📦', 
                title: language === 'en' ? 'Distributor' : 'పంపిణీదారు', 
                subtitle: language === 'en' ? 'Buy and distribute produce' : 'ఉత్పత్తులను కొనుగోలు చేసి పంపిణీ చేయండి'
              },
              { 
                role: 'agent', 
                icon: '🛡️', 
                title: language === 'en' ? 'Field Agent' : 'క్షేత్ర ఏజెంట్', 
                subtitle: language === 'en' ? 'Verify and inspect crops' : 'పంటలను ధృవీకరించి తనిఖీ చేయండి'
              }
            ].map((option) => (
              <Card 
                key={option.role} 
                className="cursor-pointer hover-lift transition-all duration-200 hover:ring-2 hover:ring-primary hover:shadow-lg"
                onClick={() => handleRoleSelect(option.role)}
              >
                <CardContent className="p-4 sm:p-6 flex items-center space-x-4">
                  <div className="text-3xl sm:text-4xl">{option.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-heading font-semibold">{option.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{option.subtitle}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button 
            variant="ghost" 
            className="w-full mt-4 sm:mt-6"
            onClick={() => setCurrentView('landing')}
          >
            ← {language === 'en' ? 'Back' : 'వెనుకకు'}
          </Button>
        </div>
      </div>
    );
  }

  // Authentication
  if (currentView === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold">
                {language === 'en' ? 'Welcome,' : 'స్వాగతం,'} {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {language === 'en' 
                  ? 'Enter your mobile number to continue' 
                  : 'కొనసాగించడానికి మీ మొబైల్ నంబర్ నమోదు చేయండి'
                }
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">
                  {language === 'en' ? 'Mobile Number' : 'మొబైల్ నంబర్'}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={language === 'en' 
                    ? 'Enter 10-digit mobile number' 
                    : '10-అంకెల మొబైల్ నంబర్ నమోదు చేయండి'
                  }
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={otpSent}
                  className="text-base"
                />
              </div>

              {otpSent && (
                <div className="animate-slide-up">
                  <Label htmlFor="otp">
                    {language === 'en' ? 'Enter OTP' : 'OTP నమోదు చేయండి'}
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder={language === 'en' ? '6-digit OTP' : '6-అంకెల OTP'}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="text-base text-center font-mono text-lg"
                  />
                </div>
              )}

              <Button
                className="w-full"
                onClick={otpSent ? handleVerifyOTP : handleSendOTP}
                disabled={(otpSent ? otp.length !== 6 : phone.length !== 10) || isLoading}
              >
                {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                {otpSent 
                  ? (language === 'en' ? 'Verify OTP' : 'OTP ధృవీకరించండి')
                  : (language === 'en' ? 'Send OTP' : 'OTP పంపండి')
                }
              </Button>

              {otpSent && (
                <Button 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => setOtpSent(false)}
                  disabled={isLoading}
                >
                  {language === 'en' ? 'Resend OTP' : 'OTP మళ్లీ పంపండి'}
                </Button>
              )}
            </div>

            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => setCurrentView('role-select')}
              disabled={isLoading}
            >
              ← {language === 'en' ? 'Change Role' : 'పాత్ర మార్చండి'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Profile Page
  if (showProfile) {
    return <ProfilePage onBack={() => setShowProfile(false)} />;
  }

  // Notifications Page
  if (showNotifications) {
    return <NotificationsPage onBack={() => setShowNotifications(false)} />;
  }

  // Add Crop Form
  if (showAddCrop && user?.role === 'farmer') {
    return <AddCropForm onBack={() => setShowAddCrop(false)} />;
  }

  // Dashboard View - Enhanced Mobile Responsive
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile Optimized */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <span className="text-sm sm:text-lg font-heading font-semibold">AgroConnect</span>
                <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                  {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleLanguage} 
                className="hover:bg-gray-100 text-xs sm:text-sm px-2 sm:px-3"
              >
                {language === 'en' ? 'తె' : 'En'}
              </Button>
              <NotificationsDropdown onViewAll={() => setShowNotifications(true)} />
              <Button variant="ghost" size="sm" onClick={() => setShowHelp(true)} className="hover:bg-gray-100 p-1 sm:p-2">
                <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100 p-1 sm:p-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 sm:w-48 bg-white border shadow-lg z-50">
                  <DropdownMenuItem 
                    onClick={() => setShowProfile(true)}
                    className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 text-sm"
                  >
                    <User className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    {t('profile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 text-red-600 text-sm"
                  >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile Optimized */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4 sm:mb-6 h-9 sm:h-10">
            <TabsTrigger value="dashboard" className="text-xs sm:text-sm px-1 sm:px-3">
              {t('dashboard')}
            </TabsTrigger>
            <TabsTrigger value="main" className="text-xs sm:text-sm px-1 sm:px-3">
              {user?.role === 'farmer' ? t('my_crops') : user?.role === 'distributor' ? t('market') : t('tasks')}
            </TabsTrigger>
            <TabsTrigger value="contracts" className="text-xs sm:text-sm px-1 sm:px-3">
              {t('contracts')}
            </TabsTrigger>
            <TabsTrigger value="wallet" className="text-xs sm:text-sm px-1 sm:px-3">
              {t('wallet')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-4 sm:mt-6">
            <div className="grid gap-4 sm:gap-6">
              {/* Welcome Card */}
              <Card className="glass-card">
                <CardContent className="p-4 sm:p-6">
                  <h1 className="text-xl sm:text-2xl font-heading font-bold mb-2">
                    {t('welcome')} back, {user?.name}! 👋
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {user?.role === 'farmer' && (language === 'en' 
                      ? "Manage your crops and track your earnings" 
                      : "మీ పంటలను నిర్వహించండి మరియు మీ ఆదాయాలను ట్రాక్ చేయండి"
                    )}
                    {user?.role === 'distributor' && (language === 'en'
                      ? "Discover new crops and manage your investments"
                      : "కొత్త పంటలను కనుగొనండి మరియు మీ పెట్టుబడులను నిర్వహించండి"
                    )}
                    {user?.role === 'agent' && (language === 'en'
                      ? "Review verification tasks and update crop status"
                      : "ధృవీకరణ పనులను సమీక్షించండి మరియు పంట స్థితిని అప్‌డేట్ చేయండి"
                    )}
                  </p>
                </CardContent>
              </Card>

              {/* Stats Grid - Mobile Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {user?.role === 'farmer' && (
                  <>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3 sm:p-4 text-center">
                        <div className="text-xl sm:text-2xl font-mono font-bold text-primary">{crops.filter(c => c.farmerId === user.id).length}</div>
                        <div className="text-xs sm:text-sm text-gray-600">{language === 'en' ? 'Active Crops' : 'క్రియాశీల పంటలు'}</div>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3 sm:p-4 text-center">
                        <div className="text-xl sm:text-2xl font-mono font-bold text-green-600">₹{crops.filter(c => c.farmerId === user.id).reduce((sum, c) => sum + c.price, 0).toLocaleString()}</div>
                        <div className="text-xs sm:text-sm text-gray-600">{language === 'en' ? 'Expected Returns' : 'అంచనా రాబడులు'}</div>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3 sm:p-4 text-center">
                        <div className="text-xl sm:text-2xl font-mono font-bold text-orange-600">{crops.filter(c => c.farmerId === user.id && c.status === 'pending').length}</div>
                        <div className="text-xs sm:text-sm text-gray-600">{language === 'en' ? 'Pending Verification' : 'పెండింగ్ ధృవీకరण'}</div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {user?.role === 'distributor' && (
                  <>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3 sm:p-4 text-center">
                        <div className="text-xl sm:text-2xl font-mono font-bold text-blue-600">{crops.filter(c => c.status === 'verified').length}</div>
                        <div className="text-xs sm:text-sm text-gray-600">{language === 'en' ? 'Available Crops' : 'అందుబాటులో ఉన్న పంటలు'}</div>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3 sm:p-4 text-center">
                        <div className="text-xl sm:text-2xl font-mono font-bold text-green-600">₹{user.walletBalance.toLocaleString()}</div>
                        <div className="text-xs sm:text-sm text-gray-600">{language === 'en' ? 'Wallet Balance' : 'వాలెట్ బ్యాలెన్స్'}</div>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3 sm:p-4 text-center">
                        <div className="text-xl sm:text-2xl font-mono font-bold text-purple-600">{contracts.filter(c => c.distributorId === user.id).length}</div>
                        <div className="text-xs sm:text-sm text-gray-600">{language === 'en' ? 'Active Contracts' : 'క్రియాశీల ఒప్పందాలు'}</div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {user?.role === 'agent' && (
                  <>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3 sm:p-4 text-center">
                        <div className="text-xl sm:text-2xl font-mono font-bold text-orange-600">8</div>
                        <div className="text-xs sm:text-sm text-gray-600">{language === 'en' ? 'Pending Verifications' : 'పెండింగ్ ధృవీకరणలు'}</div>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3 sm:p-4 text-center">
                        <div className="text-xl sm:text-2xl font-mono font-bold text-green-600">₹{user.walletBalance.toLocaleString()}</div>
                        <div className="text-xs sm:text-sm text-gray-600">{language === 'en' ? 'Monthly Earnings' : 'నెలవారీ ఆదాయాలు'}</div>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3 sm:p-4 text-center">
                        <div className="text-xl sm:text-2xl font-mono font-bold text-blue-600">23</div>
                        <div className="text-xs sm:text-sm text-gray-600">{language === 'en' ? 'Completed Tasks' : 'పూర్తయిన పనులు'}</div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>

              {/* Recent Activity */}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-heading font-semibold mb-4 text-sm sm:text-base">
                    {language === 'en' ? 'Recent Activity' : 'ఇటీవలి కార్యకలాపాలు'}
                  </h3>
                  <div className="space-y-3">
                    {[
                      { 
                        icon: '🌱', 
                        text: language === 'en' ? 'New crop verification request' : 'కొత్త పంట ధృవీకరణ అభ్యర్థన', 
                        time: language === 'en' ? '2 hours ago' : '2 గంటల క్రితం'
                      },
                      { 
                        icon: '💰', 
                        text: language === 'en' ? 'Payment received for tomato harvest' : 'టమోటా పంట కోసం చెల్లింపు వచ్చింది', 
                        time: language === 'en' ? '1 day ago' : '1 రోజు క్రితం'
                      },
                      { 
                        icon: '📝', 
                        text: language === 'en' ? 'Contract signed with distributor' : 'పంపిణీదారుతో ఒప్పందం సంతకం చేయబడింది', 
                        time: language === 'en' ? '2 days ago' : '2 రోజుల క్రితం'
                      }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-lg sm:text-xl">{activity.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm truncate">{activity.text}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="main">
            {user?.role === 'farmer' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                  <h2 className="text-xl sm:text-2xl font-heading font-bold">{t('my_crops')}</h2>
                  <Button 
                    onClick={() => setShowAddCrop(true)}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('add_new_crop')}
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {crops.filter(crop => crop.farmerId === user.id).map(crop => (
                    <CropCard
                      key={crop.id}
                      crop={crop}
                      onViewDetails={handleViewCropDetails}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {user?.role === 'distributor' && <CropMarketplace onViewDetails={handleViewCropDetails} />}
            
            {user?.role === 'agent' && <VerificationDashboard />}
          </TabsContent>

          {/* ... keep existing code (contracts and wallet tabs) */}
          <TabsContent value="contracts">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-heading font-semibold mb-4">{t('contracts')}</h3>
                <div className="space-y-4">
                  {contracts.filter(contract => 
                    contract.farmerId === user?.id || 
                    contract.distributorId === user?.id || 
                    contract.agentId === user?.id
                  ).map(contract => (
                    <div key={contract.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0 mb-2">
                        <div>
                          <h4 className="font-semibold">Contract #{contract.id}</h4>
                          <p className="text-sm text-gray-600">Crop ID: {contract.cropId}</p>
                        </div>
                        <Badge className={
                          contract.status === 'active' ? 'bg-green-100 text-green-800' :
                          contract.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {contract.status}
                        </Badge>
                      </div>
                      <p className="text-lg font-mono font-bold text-primary">₹{contract.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-600 mt-2">{contract.terms}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-heading font-semibold mb-4">{t('wallet')} & Transactions</h3>
                <div className="text-center py-6 sm:py-8">
                  <div className="text-3xl sm:text-4xl font-mono font-bold text-primary mb-2">
                    ₹{user?.walletBalance.toLocaleString()}
                  </div>
                  <p className="text-gray-600 mb-4 sm:mb-6">
                    {language === 'en' ? 'Current Balance' : 'ప్రస్తుత బ్యాలెన్స్'}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <Button className="w-full sm:w-auto">
                      {language === 'en' ? 'Add Funds' : 'నిధులు జోడించండి'}
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto">
                      {language === 'en' ? 'Withdraw' : 'ఉపసంహరించండి'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <HelpSupportModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <CropDetailsModal 
        isOpen={showCropDetails} 
        onClose={() => setShowCropDetails(false)} 
        crop={selectedCrop}
      />
    </div>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </LanguageProvider>
  );
};

export default Index;
