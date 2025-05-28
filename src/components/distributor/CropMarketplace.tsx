
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Calendar, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const CropMarketplace: React.FC = () => {
  const { crops, createContract, user } = useApp();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || crop.status === selectedFilter;
    return matchesSearch && matchesFilter && crop.status === 'verified';
  });

  const handleBuyRequest = (crop: any) => {
    if (!user) return;

    const newContract = {
      cropId: crop.id,
      farmerId: crop.farmerId,
      distributorId: user.id,
      price: crop.price,
      status: 'draft' as const,
      terms: 'Standard purchase agreement with quality guarantee',
      milestones: [
        { id: '1', title: 'Advance Payment', amount: Math.round(crop.price * 0.3), status: 'pending' as const },
        { id: '2', title: 'Mid-stage Payment', amount: Math.round(crop.price * 0.4), status: 'pending' as const },
        { id: '3', title: 'Final Payment', amount: Math.round(crop.price * 0.3), status: 'pending' as const }
      ],
      createdAt: new Date().toISOString()
    };

    createContract(newContract);
    toast({
      title: "Purchase Request Sent",
      description: "Your contract request has been sent to the farmer."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search crops by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
          >
            All
          </Button>
          <Button
            variant={selectedFilter === 'verified' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('verified')}
          >
            Verified
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredCrops.map((crop) => (
          <Card key={crop.id} className="hover-lift">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-48">
                  {crop.images[0] && (
                    <img
                      src={crop.images[0]}
                      alt={crop.cropName}
                      className="w-full h-32 md:h-40 object-cover rounded-lg"
                    />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-gray-900">{crop.cropName}</h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{crop.location}</span>
                        <span className="mx-2">•</span>
                        <span>{crop.area} acres</span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Seed Date</p>
                      <p className="font-semibold">{new Date(crop.seedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expected Harvest</p>
                      <p className="font-semibold">{new Date(crop.expectedHarvest).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Growth Stage</p>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }} />
                        </div>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Investment</p>
                      <p className="text-xl font-mono font-bold text-primary">₹{crop.price.toLocaleString()}</p>
                    </div>
                  </div>

                  {crop.agentNotes.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Agent Verification:</strong> {crop.agentNotes[crop.agentNotes.length - 1]}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-1" />
                      <span>Farmer ID: {crop.farmerId}</span>
                      <span className="mx-2">•</span>
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Listed {Math.floor(Math.random() * 5) + 1} days ago</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        View Details
                      </Button>
                      <Button onClick={() => handleBuyRequest(crop)}>
                        Send Purchase Request
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No crops found</h3>
              <p>Try adjusting your search criteria or check back later for new listings.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CropMarketplace;
