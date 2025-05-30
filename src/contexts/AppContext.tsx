import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Crop {
  id: string;
  farmerId: string;
  cropName: string;
  location: string;
  area: number;
  seedDate: string;
  expectedHarvest: string;
  status: 'pending' | 'verified' | 'growing' | 'ready' | 'sold';
  price: number;
  images: string[];
  agentNotes: string[];
  verificationDate?: string;
  contractId?: string;
}

export interface Contract {
  id: string;
  cropId: string;
  farmerId: string;
  distributorId: string;
  agentId?: string;
  price: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  terms: string;
  milestones: {
    id: string;
    title: string;
    amount: number;
    status: 'pending' | 'completed';
    date?: string;
  }[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'farmer' | 'distributor' | 'agent';
  location: string;
  walletBalance: number;
  bio?: string;
}

export interface VerificationTask {
  id: string;
  cropId: string;
  agentId: string;
  farmerId: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  notes: string;
  photos: string[];
  location: string;
  scheduledDate: string;
}

interface AppContextType {
  user: User | null;
  crops: Crop[];
  contracts: Contract[];
  verificationTasks: VerificationTask[];
  addCrop: (crop: Omit<Crop, 'id'>) => void;
  updateCrop: (id: string, updates: Partial<Crop>) => void;
  createContract: (contract: Omit<Contract, 'id'>) => void;
  updateContract: (id: string, updates: Partial<Contract>) => void;
  addVerificationTask: (task: Omit<VerificationTask, 'id'>) => void;
  updateVerificationTask: (id: string, updates: Partial<VerificationTask>) => void;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Sample data
const sampleCrops: Crop[] = [
  {
    id: '1',
    farmerId: 'farmer1',
    cropName: 'Tomato',
    location: 'Guntur, AP',
    area: 2.5,
    seedDate: '2024-03-15',
    expectedHarvest: '2024-06-15',
    status: 'growing',
    price: 45000,
    images: ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400'],
    agentNotes: ['Crop looking healthy', 'Good soil moisture']
  },
  {
    id: '2',
    farmerId: 'farmer2',
    cropName: 'Rice',
    location: 'Krishna, AP',
    area: 5.0,
    seedDate: '2024-02-20',
    expectedHarvest: '2024-07-20',
    status: 'verified',
    price: 125000,
    images: ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400'],
    agentNotes: ['Excellent variety', 'Ready for investment']
  }
];

const sampleContracts: Contract[] = [
  {
    id: '1',
    cropId: '1',
    farmerId: 'farmer1',
    distributorId: 'distributor1',
    price: 45000,
    status: 'active',
    terms: 'Standard purchase agreement with quality guarantee',
    milestones: [
      { id: '1', title: 'Advance Payment', amount: 15000, status: 'completed', date: '2024-03-20' },
      { id: '2', title: 'Mid-stage Payment', amount: 15000, status: 'pending' },
      { id: '3', title: 'Final Payment', amount: 15000, status: 'pending' }
    ],
    createdAt: '2024-03-20'
  }
];

const sampleTasks: VerificationTask[] = [
  {
    id: '1',
    cropId: '2',
    agentId: 'agent1',
    farmerId: 'farmer2',
    status: 'pending',
    priority: 'high',
    notes: 'Initial verification required',
    photos: [],
    location: 'Krishna, AP',
    scheduledDate: '2024-05-29'
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [crops, setCrops] = useState<Crop[]>(sampleCrops);
  const [contracts, setContracts] = useState<Contract[]>(sampleContracts);
  const [verificationTasks, setVerificationTasks] = useState<VerificationTask[]>(sampleTasks);

  const addCrop = (crop: Omit<Crop, 'id'>) => {
    const newCrop = { ...crop, id: Date.now().toString() };
    setCrops(prev => [...prev, newCrop]);
  };

  const updateCrop = (id: string, updates: Partial<Crop>) => {
    setCrops(prev => prev.map(crop => 
      crop.id === id ? { ...crop, ...updates } : crop
    ));
  };

  const createContract = (contract: Omit<Contract, 'id'>) => {
    const newContract = { ...contract, id: Date.now().toString() };
    setContracts(prev => [...prev, newContract]);
  };

  const updateContract = (id: string, updates: Partial<Contract>) => {
    setContracts(prev => prev.map(contract => 
      contract.id === id ? { ...contract, ...updates } : contract
    ));
  };

  const addVerificationTask = (task: Omit<VerificationTask, 'id'>) => {
    const newTask = { ...task, id: Date.now().toString() };
    setVerificationTasks(prev => [...prev, newTask]);
  };

  const updateVerificationTask = (id: string, updates: Partial<VerificationTask>) => {
    setVerificationTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  return (
    <AppContext.Provider value={{
      user,
      crops,
      contracts,
      verificationTasks,
      addCrop,
      updateCrop,
      createContract,
      updateContract,
      addVerificationTask,
      updateVerificationTask,
      setUser
    }}>
      {children}
    </AppContext.Provider>
  );
};
