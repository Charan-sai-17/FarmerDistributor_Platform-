
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Edit,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Contract {
  id: string;
  farmerId: string;
  farmerName: string;
  distributorId: string;
  distributorName: string;
  cropType: string;
  quantity: number;
  pricePerKg: number;
  totalAmount: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  expectedHarvestDate: string;
  actualHarvestDate?: string;
  terms: string[];
  documents: string[];
}

const Contracts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('active');

  // Mock contract data
  const contracts: Contract[] = [
    {
      id: 'CNT001',
      farmerId: 'F001',
      farmerName: 'Ramesh Kumar',
      distributorId: 'D001',
      distributorName: 'AgriCorp Ltd',
      cropType: 'Tomatoes',
      quantity: 500,
      pricePerKg: 45,
      totalAmount: 22500,
      status: 'active',
      startDate: '2024-01-15',
      expectedHarvestDate: '2024-04-15',
      terms: ['Payment within 7 days of harvest', 'Quality grade A minimum', 'Organic certification required'],
      documents: ['contract.pdf', 'quality_specs.pdf']
    },
    {
      id: 'CNT002', 
      farmerId: 'F001',
      farmerName: 'Lakshmi Devi',
      distributorId: 'D002',
      distributorName: 'Fresh Markets Inc',
      cropType: 'Rice',
      quantity: 1000,
      pricePerKg: 32,
      totalAmount: 32000,
      status: 'completed',
      startDate: '2023-11-01',
      expectedHarvestDate: '2024-02-28',
      actualHarvestDate: '2024-02-25',
      terms: ['Bulk discount applied', 'Transport included', 'Insurance covered'],
      documents: ['contract.pdf', 'completion_certificate.pdf']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'active': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleDownload = (contractId: string, document: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${document} for contract ${contractId}`,
    });
  };

  const handleRenegotiate = (contractId: string) => {
    toast({
      title: "Renegotiation Request",
      description: "Your renegotiation request has been sent to the other party",
    });
  };

  const handleChat = (contractId: string, otherParty: string) => {
    toast({
      title: "Opening Chat",
      description: `Starting conversation with ${otherParty}`,
    });
  };

  const filteredContracts = contracts.filter(contract => {
    if (activeTab === 'active') return contract.status === 'active' || contract.status === 'pending';
    if (activeTab === 'completed') return contract.status === 'completed';
    if (activeTab === 'cancelled') return contract.status === 'cancelled';
    return true;
  });

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
                <h1 className="text-2xl font-bold text-gray-900">My Contracts</h1>
                <p className="text-sm text-gray-600">Manage your farming agreements</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {filteredContracts.length} Active
            </Badge>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-96">
              <TabsTrigger value="active">Active ({contracts.filter(c => c.status === 'active' || c.status === 'pending').length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({contracts.filter(c => c.status === 'completed').length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({contracts.filter(c => c.status === 'cancelled').length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              {filteredContracts.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Contracts Found</h3>
                    <p className="text-gray-600 mb-4">
                      {activeTab === 'active' && "You don't have any active contracts yet."}
                      {activeTab === 'completed' && "No completed contracts to show."}
                      {activeTab === 'cancelled' && "No cancelled contracts found."}
                    </p>
                    <Button onClick={() => navigate('/crop-explorer')}>
                      Explore Opportunities
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {filteredContracts.map((contract, index) => (
                    <motion.div
                      key={contract.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                {getStatusIcon(contract.status)}
                              </div>
                              <div>
                                <CardTitle className="text-lg">Contract #{contract.id}</CardTitle>
                                <p className="text-sm text-gray-600">
                                  {user?.role === 'farmer' ? `With ${contract.distributorName}` : `With ${contract.farmerName}`}
                                </p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(contract.status)}>
                              {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                          {/* Contract Details Grid */}
                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Crop Type</p>
                              <p className="text-lg font-semibold">{contract.cropType}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Quantity</p>
                              <p className="text-lg font-semibold">{contract.quantity} kg</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Price/kg</p>
                              <p className="text-lg font-semibold">₹{contract.pricePerKg}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Total Amount</p>
                              <p className="text-lg font-semibold text-primary">₹{contract.totalAmount.toLocaleString()}</p>
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="border-l-2 border-gray-200 pl-4 space-y-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <p className="text-sm"><strong>Start Date:</strong> {new Date(contract.startDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${contract.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <p className="text-sm">
                                <strong>Expected Harvest:</strong> {new Date(contract.expectedHarvestDate).toLocaleDateString()}
                              </p>
                            </div>
                            {contract.actualHarvestDate && (
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <p className="text-sm"><strong>Actual Harvest:</strong> {new Date(contract.actualHarvestDate).toLocaleDateString()}</p>
                              </div>
                            )}
                          </div>

                          {/* Terms */}
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">Contract Terms</p>
                            <ul className="space-y-1">
                              {contract.terms.map((term, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{term}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 pt-4 border-t">
                            {contract.documents.map((doc, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(contract.id, doc)}
                                className="flex items-center space-x-2"
                              >
                                <Download className="w-4 h-4" />
                                <span>{doc}</span>
                              </Button>
                            ))}
                            
                            {contract.status === 'active' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRenegotiate(contract.id)}
                                  className="flex items-center space-x-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span>Renegotiate</span>
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleChat(contract.id, user?.role === 'farmer' ? contract.distributorName : contract.farmerName)}
                                  className="flex items-center space-x-2"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  <span>Chat</span>
                                </Button>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Contracts;
