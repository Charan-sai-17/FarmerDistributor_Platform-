
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Home, Calendar, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedRole, setSelectedRole] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [userRole, setUserRole] = useState('');
  const { toast } = useToast();

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setCurrentView('auth');
  };

  const handleSendOTP = () => {
    if (phone.length === 10) {
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "Please check your mobile for the verification code.",
      });
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      setUserRole(selectedRole);
      setCurrentView('dashboard');
      toast({
        title: "Welcome!",
        description: `Successfully logged in as ${selectedRole}.`,
      });
    }
  };

  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold text-primary">AgroConnect</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">English</Badge>
              <Button variant="ghost" size="sm">తెలుగు</Button>
            </div>
          </header>

          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
              <div className="text-4xl">🌱</div>
            </div>
            <h1 className="text-5xl font-heading font-bold text-gray-900 mb-4">
              Grow Smart. Trade Fair. Earn Secure.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Empowering Farmers, Distributors & Agents through technology-driven agriculture trading
            </p>
            <Button 
              onClick={() => setCurrentView('role-select')}
              size="lg"
              className="text-lg px-8 py-3 animate-scale-in hover-lift"
            >
              Get Started →
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: "🧑‍🌾", title: "For Farmers", desc: "List crops, get fair prices, secure contracts" },
              { icon: "📦", title: "For Distributors", desc: "Discover quality crops, invest early, guaranteed supply" },
              { icon: "🛡️", title: "For Agents", desc: "Verify crops, earn commissions, build trust" }
            ].map((feature, index) => (
              <Card key={index} className="hover-lift animate-slide-up glass-card">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-heading font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <span>🔒 Blockchain Secured</span>
              <span>🏛️ FPO Backed</span>
              <span>💰 Escrow Protected</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'role-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">I am a...</h2>
            <p className="text-gray-600">Choose your role to get started</p>
          </div>

          <div className="space-y-4">
            {[
              { role: 'farmer', icon: '🧑‍🌾', title: 'Farmer', subtitle: 'Grow and sell crops' },
              { role: 'distributor', icon: '📦', title: 'Distributor', subtitle: 'Buy and distribute produce' },
              { role: 'agent', icon: '🛡️', title: 'Field Agent', subtitle: 'Verify and inspect crops' }
            ].map((option) => (
              <Card 
                key={option.role} 
                className="cursor-pointer hover-lift transition-all duration-200 hover:ring-2 hover:ring-primary"
                onClick={() => handleRoleSelect(option.role)}
              >
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="text-4xl">{option.icon}</div>
                  <div>
                    <h3 className="text-xl font-heading font-semibold">{option.title}</h3>
                    <p className="text-gray-600">{option.subtitle}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button 
            variant="ghost" 
            className="w-full mt-6"
            onClick={() => setCurrentView('landing')}
          >
            ← Back
          </Button>
        </div>
      </div>
    );
  }

  if (currentView === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-heading font-bold">
                Welcome, {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
              </h2>
              <p className="text-gray-600">Enter your mobile number to continue</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Mobile Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={otpSent}
                />
              </div>

              {otpSent && (
                <div className="animate-slide-up">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>
              )}

              <Button
                className="w-full"
                onClick={otpSent ? handleVerifyOTP : handleSendOTP}
                disabled={otpSent ? otp.length !== 6 : phone.length !== 10}
              >
                {otpSent ? 'Verify OTP' : 'Send OTP'}
              </Button>

              {otpSent && (
                <Button variant="ghost" className="w-full" onClick={() => setOtpSent(false)}>
                  Resend OTP
                </Button>
              )}
            </div>

            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => setCurrentView('role-select')}
            >
              ← Change Role
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-heading font-semibold">AgroConnect</span>
                <Badge variant="secondary" className="ml-2">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="crops">
              {userRole === 'farmer' ? 'My Crops' : userRole === 'distributor' ? 'Market' : 'Tasks'}
            </TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid gap-6">
              {/* Welcome Card */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h1 className="text-2xl font-heading font-bold mb-2">
                    Welcome back! 👋
                  </h1>
                  <p className="text-gray-600">
                    {userRole === 'farmer' && "Manage your crops and track your earnings"}
                    {userRole === 'distributor' && "Discover new crops and manage your investments"}
                    {userRole === 'agent' && "Review verification tasks and update crop status"}
                  </p>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                {userRole === 'farmer' && (
                  <>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-mono font-bold text-primary">3</div>
                        <div className="text-sm text-gray-600">Active Crops</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-mono font-bold text-green-600">₹45,000</div>
                        <div className="text-sm text-gray-600">Expected Returns</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-mono font-bold text-orange-600">2</div>
                        <div className="text-sm text-gray-600">Pending Verification</div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {userRole === 'distributor' && (
                  <>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-mono font-bold text-blue-600">12</div>
                        <div className="text-sm text-gray-600">Available Crops</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-mono font-bold text-green-600">₹2,50,000</div>
                        <div className="text-sm text-gray-600">Wallet Balance</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-mono font-bold text-purple-600">5</div>
                        <div className="text-sm text-gray-600">Active Contracts</div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {userRole === 'agent' && (
                  <>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-mono font-bold text-orange-600">8</div>
                        <div className="text-sm text-gray-600">Pending Verifications</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-mono font-bold text-green-600">₹15,800</div>
                        <div className="text-sm text-gray-600">Monthly Earnings</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-mono font-bold text-blue-600">23</div>
                        <div className="text-sm text-gray-600">Completed Tasks</div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>

              {/* Recent Activity */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { icon: '🌱', text: 'New crop verification request', time: '2 hours ago' },
                      { icon: '💰', text: 'Payment received for tomato harvest', time: '1 day ago' },
                      { icon: '📝', text: 'Contract signed with distributor', time: '2 days ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-xl">{activity.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm">{activity.text}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="crops">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4">
                  {userRole === 'farmer' ? 'My Crops' : userRole === 'distributor' ? 'Crop Market' : 'Verification Tasks'}
                </h3>
                <p className="text-gray-600">This section is under development.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4">Contracts</h3>
                <p className="text-gray-600">Contract management coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4">Wallet & Transactions</h3>
                <p className="text-gray-600">Wallet functionality in development.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
