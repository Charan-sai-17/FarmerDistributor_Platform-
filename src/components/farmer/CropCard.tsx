
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MessageCircle, Edit } from 'lucide-react';
import { Crop } from '@/contexts/AppContext';

interface CropCardProps {
  crop: Crop;
  onViewDetails: (crop: Crop) => void;
  onEdit?: (crop: Crop) => void;
}

const CropCard: React.FC<CropCardProps> = ({ crop, onViewDetails, onEdit }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'growing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-purple-100 text-purple-800';
      case 'sold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'growing': return 'Growing';
      case 'pending': return 'Pending Verification';
      case 'ready': return 'Ready for Harvest';
      case 'sold': return 'Sold';
      default: return status;
    }
  };

  return (
    <Card className="hover-lift transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          {crop.images[0] && (
            <img
              src={crop.images[0]}
              alt={crop.cropName}
              className="w-20 h-20 object-cover rounded-lg"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-heading font-semibold text-lg">{crop.cropName}</h3>
                <p className="text-gray-600 text-sm">{crop.location} • {crop.area} acres</p>
              </div>
              <Badge className={getStatusColor(crop.status)}>
                {getStatusText(crop.status)}
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

            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-mono font-bold text-primary">₹{crop.price.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Expected Revenue</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => onViewDetails(crop)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4" />
                </Button>
                {crop.status === 'pending' && onEdit && (
                  <Button variant="outline" size="sm" onClick={() => onEdit(crop)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {crop.agentNotes.length > 0 && (
              <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                <p className="text-blue-800">
                  <strong>Latest Update:</strong> {crop.agentNotes[crop.agentNotes.length - 1]}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CropCard;
