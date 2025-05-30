
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WalletContextType {
  isConnected: boolean;
  account: string | null;
  balance: string;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  stakeTokens: (amount: string) => Promise<void>;
  unstakeTokens: (amount: string) => Promise<void>;
  transactions: Transaction[];
  refreshBalance: () => Promise<void>;
}

interface Transaction {
  id: string;
  type: 'stake' | 'unstake' | 'transfer' | 'reward';
  amount: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  hash?: string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState('0.00');
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  // Check if wallet is already connected on load
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          await refreshBalance();
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another Web3 wallet.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        await refreshBalance();
        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setBalance('0.00');
    setTransactions([]);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected."
    });
  };

  const refreshBalance = async () => {
    if (!account) return;
    
    try {
      // Simulate balance fetch - in real app, use Web3 provider
      const mockBalance = (Math.random() * 100).toFixed(2);
      setBalance(mockBalance);
      
      // Simulate transaction history
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'stake',
          amount: '25.50',
          timestamp: new Date(Date.now() - 86400000),
          status: 'completed',
          hash: '0x...'
        },
        {
          id: '2',
          type: 'reward',
          amount: '2.15',
          timestamp: new Date(Date.now() - 172800000),
          status: 'completed',
          hash: '0x...'
        }
      ];
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const stakeTokens = async (amount: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate staking transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'stake',
        amount,
        timestamp: new Date(),
        status: 'completed'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      await refreshBalance();
      
      toast({
        title: "Staking Successful",
        description: `Successfully staked ${amount} tokens`
      });
    } catch (error: any) {
      toast({
        title: "Staking Failed",
        description: error.message || "Failed to stake tokens",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const unstakeTokens = async (amount: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate unstaking transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'unstake',
        amount,
        timestamp: new Date(),
        status: 'completed'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      await refreshBalance();
      
      toast({
        title: "Unstaking Successful",
        description: `Successfully unstaked ${amount} tokens`
      });
    } catch (error: any) {
      toast({
        title: "Unstaking Failed",
        description: error.message || "Failed to unstake tokens",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WalletContext.Provider value={{
      isConnected,
      account,
      balance,
      isLoading,
      connectWallet,
      disconnectWallet,
      stakeTokens,
      unstakeTokens,
      transactions,
      refreshBalance
    }}>
      {children}
    </WalletContext.Provider>
  );
};
