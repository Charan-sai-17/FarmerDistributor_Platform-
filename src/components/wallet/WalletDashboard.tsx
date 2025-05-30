
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wallet, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LoadingSpinner from '@/components/ui/loading-spinner';

const WalletDashboard: React.FC = () => {
  const { 
    isConnected, 
    account, 
    balance, 
    isLoading, 
    connectWallet, 
    disconnectWallet, 
    stakeTokens, 
    unstakeTokens, 
    transactions 
  } = useWallet();
  const { t } = useLanguage();
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    await stakeTokens(stakeAmount);
    setStakeAmount('');
  };

  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) return;
    await unstakeTokens(unstakeAmount);
    setUnstakeAmount('');
  };

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'pending') return <Clock className="w-4 h-4 text-yellow-500" />;
    if (status === 'failed') return <XCircle className="w-4 h-4 text-red-500" />;
    if (type === 'stake') return <TrendingUp className="w-4 h-4 text-blue-500" />;
    if (type === 'unstake') return <TrendingDown className="w-4 h-4 text-orange-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Wallet Connection Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>{t('wallet')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="text-center py-8">
              <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-gray-600 mb-6">
                Connect your Web3 wallet to start staking and earning rewards
              </p>
              <Button 
                onClick={connectWallet} 
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                Connect Wallet
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <div>
                  <p className="text-sm text-gray-600">Connected Account</p>
                  <p className="font-mono text-sm">
                    {account?.slice(0, 6)}...{account?.slice(-4)}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={disconnectWallet}
                >
                  Disconnect
                </Button>
              </div>
              
              <div className="text-center py-4">
                <p className="text-3xl font-bold text-primary">{balance}</p>
                <p className="text-sm text-gray-600">AGRO Tokens</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Staking Section */}
      {isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stake Tokens */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span>Stake Tokens</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Amount to Stake</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handleStake}
                disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || isLoading}
                className="w-full"
              >
                {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                Stake Tokens
              </Button>
              <p className="text-xs text-gray-600">
                Earn 12% APY by staking your AGRO tokens
              </p>
            </CardContent>
          </Card>

          {/* Unstake Tokens */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingDown className="w-5 h-5 text-orange-500" />
                <span>Unstake Tokens</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Amount to Unstake</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handleUnstake}
                disabled={!unstakeAmount || parseFloat(unstakeAmount) <= 0 || isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                Unstake Tokens
              </Button>
              <p className="text-xs text-gray-600">
                Unstaking has a 7-day waiting period
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transaction History */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(tx.type, tx.status)}
                      <div>
                        <p className="font-medium capitalize">{tx.type}</p>
                        <p className="text-xs text-gray-600">
                          {tx.timestamp.toLocaleDateString()} {tx.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{tx.amount} AGRO</p>
                      <Badge 
                        variant={tx.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WalletDashboard;
