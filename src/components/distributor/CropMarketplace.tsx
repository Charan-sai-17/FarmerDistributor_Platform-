
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Eye, ShoppingCart, MapPin } from 'lucide-react';
import { useApp, Crop } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface CropMarketplaceProps {
  onViewDetails: (crop: Crop) => void;
}

const CropMarketplace: React.FC<CropMarketplaceProps> = ({ onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { crops } = useApp();
  const { toast } = useToast();

  const verifiedCrops = crops.filter(crop => crop.status === 'verified' || crop.status === 'growing');

  const filteredCrops = verifiedCrops.filter(crop => {
    const matchesSearch = crop.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || crop.cropName.toLowerCase().includes(selectedFilter);
    return matchesSearch && matchesFilter;
  });

  const handlePurchaseRequest = (crop: Crop) => {
    toast({
      title: "Purchase Request Sent",
      description: `Your purchase request for ${crop.cropName} has been sent to the farmer.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'growing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-heading font-bold">Crop Marketplace</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Search crops or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-64"
          />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Crops</option>
            <option value="tomato">Tomato</option>
            <option value="rice">Rice</option>
            <option value="chili">Chili</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCrops.map(crop => (
          <Card key={crop.id} className="hover-lift transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                {crop.images[0] && (
                  <img
                    src={crop.images[0]}
                    alt={crop.cropName}
                    className="w-full md:w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                    <div>
                      <h3 className="font-heading font-semibold text-lg">{crop.cropName}</h3>
                      <p className="text-gray-600 text-sm flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {crop.location} • {crop.area} acres
                      </p>
                    </div>
                    <Badge className={getStatusColor(crop.status)}>
                      {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Growth Progress</span>
                      <span>65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xl font-mono font-bold text-primary">₹{crop.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Investment Amount</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => onViewDetails(crop)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" onClick={() => handlePurchaseRequest(crop)}>
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Request Purchase
                      </Button>
                    </div>
                  </div>

                  {crop.agentNotes.length > 0 && (
                    <div className="mt-3 p-2 bg-green-50 rounded text-sm">
                      <p className="text-green-800">
                        <strong>Agent Verified:</strong> {crop.agentNotes[crop.agentNotes.length - 1]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCrops.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No crops found matching your criteria.</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CropMarketplace;
