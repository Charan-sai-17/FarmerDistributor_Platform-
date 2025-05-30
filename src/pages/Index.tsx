
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Home, Calendar, Bell, Plus, LogOut, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppProvider, useApp, Crop } from '@/contexts/AppContext';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddCropForm from '@/components/farmer/AddCropForm';
import CropCard from '@/components/farmer/CropCard';
import CropMarketplace from '@/components/distributor/CropMarketplace';
import VerificationDashboard from '@/components/agent/VerificationDashboard';
import NotificationsPage from '@/components/notifications/NotificationsPage';
import NotificationsDropdown from '@/components/notifications/NotificationsDropdown';
import HelpSupportModal from '@/components/support/HelpSupportModal';
import CropDetailsModal from '@/components/crop/CropDetailsModal';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import WalletDashboard from '@/components/wallet/WalletDashboard';

const AppContent = () => {
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [showCropDetails, setShowCropDetails] = useState(false);
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const { crops, contracts } = useApp();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Navigation will be handled by the auth context
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
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
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
                    onClick={() => navigate('/profile')}
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
                        <div className="text-xs sm:text-sm text-gray-600">{language === 'en' ? 'Pending Verification' : 'పెండింగ్ ధృవీకరణ'}</div>
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
                        <div className="text-xl sm:text-2xl font-mono font-bold text-green-600">₹250,000</div>
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
                        <div className="text-xs sm:text-sm text-gray-600">{language === 'en' ? 'Pending Verifications' : 'పెండింగ్ ధృవీకరణలు'}</div>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3 sm:p-4 text-center">
                        <div className="text-xl sm:text-2xl font-mono font-bold text-green-600">₹15,000</div>
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
            <WalletDashboard />
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
