
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet as WalletIcon, 
  Plus, 
  Minus, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowLeft,
  CreditCard,
  Banknote
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';

interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'investment' | 'return' | 'withdrawal';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

const Wallet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { balance, isConnected, connectWallet, stakeTokens, unstakeTokens, transactions } = useWallet();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');

  // Mock additional data
  const totalInvestments = 85000;
  const totalReturns = 12500;
  const pendingWithdrawals = 0;

  const mockTransactions: Transaction[] = [
    {
      id: 'TXN001',
      type: 'credit',
      amount: 50000,
      description: 'Bank transfer deposit',
      date: '2024-01-15T10:30:00Z',
      status: 'completed',
      reference: 'REF001'
    },
    {
      id: 'TXN002',
      type: 'investment',
      amount: -25000,
      description: 'Investment in Tomato farming',
      date: '2024-01-14T14:20:00Z',
      status: 'completed',
      reference: 'CNT001'
    },
    {
      id: 'TXN003',
      type: 'return',
      amount: 2500,
      description: 'ROI from Rice farming',
      date: '2024-01-12T09:15:00Z',
      status: 'completed',
      reference: 'CNT002'
    },
    {
      id: 'TXN004',
      type: 'withdrawal',
      amount: -15000,
      description: 'Bank withdrawal',
      date: '2024-01-10T16:45:00Z',
      status: 'pending',
      reference: 'WD001'
    }
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'credit': return <ArrowDownRight className="w-4 h-4 text-green-600" />;
      case 'debit': 
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'investment': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'return': return <ArrowDownRight className="w-4 h-4 text-green-600" />;
      default: return <WalletIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleAddFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Adding Funds",
      description: `Processing ₹${amount} deposit...`,
    });

    // Simulate payment gateway
    setTimeout(() => {
      toast({
        title: "Funds Added Successfully",
        description: `₹${amount} has been added to your wallet`,
      });
      setShowAddFunds(false);
      setAmount('');
    }, 2000);
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount", 
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(amount) > parseFloat(balance)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Processing Withdrawal",
      description: `Processing ₹${amount} withdrawal...`,
    });

    setTimeout(() => {
      toast({
        title: "Withdrawal Initiated",
        description: `₹${amount} withdrawal will be processed in 1-2 business days`,
      });
      setShowWithdraw(false);
      setAmount('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm border-b sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
                <p className="text-sm text-gray-600">Manage your funds and transactions</p>
              </div>
            </div>
            {!isConnected && (
              <Button onClick={connectWallet}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {/* Balance Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-foreground/80 text-sm">Available Balance</p>
                    <p className="text-2xl font-bold">₹{parseFloat(balance).toLocaleString()}</p>
                  </div>
                  <WalletIcon className="w-8 h-8 text-primary-foreground/80" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Invested</p>
                    <p className="text-2xl font-bold text-blue-600">₹{totalInvestments.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Returns</p>
                    <p className="text-2xl font-bold text-green-600">₹{totalReturns.toLocaleString()}</p>
                  </div>
                  <ArrowDownRight className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">₹{pendingWithdrawals.toLocaleString()}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              onClick={() => setShowAddFunds(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Funds</span>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setShowWithdraw(true)}
              className="flex items-center space-x-2"
            >
              <Minus className="w-5 h-5" />
              <span>Withdraw</span>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/crop-explorer')}
              className="flex items-center space-x-2"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Invest</span>
            </Button>
          </div>

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-96">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="investments">Investments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockTransactions.slice(0, 3).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                          </p>
                          <Badge variant="outline" className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab('transactions')}>
                      View All Transactions
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="font-medium">•••• •••• •••• 1234</p>
                          <p className="text-sm text-gray-600">HDFC Bank</p>
                        </div>
                      </div>
                      <Badge>Primary</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Banknote className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-medium">UPI ID: user@paytm</p>
                          <p className="text-sm text-gray-600">Paytm</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <Button variant="outline" className="w-full">
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(transaction.date).toLocaleDateString()} • {transaction.reference}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                          </p>
                          <Badge variant="outline" className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="investments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-blue-600 font-semibold text-lg">₹85,000</p>
                        <p className="text-sm text-gray-600">Active Investments</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-green-600 font-semibold text-lg">14.7%</p>
                        <p className="text-sm text-gray-600">Average ROI</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-yellow-600 font-semibold text-lg">3</p>
                        <p className="text-sm text-gray-600">Active Contracts</p>
                      </div>
                    </div>
                    <Button onClick={() => navigate('/contracts')} className="w-full">
                      View All Investments
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Add Funds Modal */}
          {showAddFunds && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddFunds(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">Add Funds</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (₹)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => setShowAddFunds(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleAddFunds} className="flex-1">
                      Add Funds
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Withdraw Modal */}
          {showWithdraw && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowWithdraw(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">Withdraw Funds</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (₹)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter amount"
                      max={balance}
                    />
                    <p className="text-sm text-gray-600 mt-1">Available: ₹{parseFloat(balance).toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => setShowWithdraw(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleWithdraw} className="flex-1">
                      Withdraw
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Wallet;
