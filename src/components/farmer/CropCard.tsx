
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Calendar, Eye } from 'lucide-react';
import { Crop } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface CropCardProps {
  crop: Crop;
  onViewDetails: (crop: Crop) => void;
}

const CropCard: React.FC<CropCardProps> = ({ crop, onViewDetails }) => {
  const { t } = useLanguage();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'growing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'sold': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (status: string) => {
    return t(status) || status;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="relative">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-100">
              <Skeleton className="w-full h-full" />
            </div>
          )}
          
          <img
            src={imageError ? '/placeholder.svg' : crop.images[0] || '/placeholder.svg'}
            alt={crop.cropName}
            className={`w-full h-full object-cover transition-all duration-300 hover:scale-105 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
          
          {/* Status Badge Overlay */}
          <div className="absolute top-3 right-3">
            <Badge className={`${getStatusColor(crop.status)} shadow-sm`}>
              {getStatusText(crop.status)}
            </Badge>
          </div>

          {/* Image Count Indicator */}
          {crop.images.length > 1 && (
            <div className="absolute bottom-3 right-3">
              <Badge variant="secondary" className="bg-black/50 text-white border-0">
                +{crop.images.length - 1} more
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div>
              <h3 className="text-xl font-heading font-semibold mb-2">{crop.cropName}</h3>
              <div className="flex items-center text-gray-600 text-sm space-x-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{crop.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(crop.seedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-mono font-bold text-primary">
                  {crop.area}
                </p>
                <p className="text-xs text-gray-600">acres</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-mono font-bold text-green-600">
                  ₹{(crop.price / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-gray-600">expected value</p>
              </div>
            </div>

            {/* Harvest Date */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Expected Harvest:</span>
              <span className="font-medium">
                {new Date(crop.expectedHarvest).toLocaleDateString()}
              </span>
            </div>

            {/* Notes Preview */}
            {crop.agentNotes.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 line-clamp-2">
                  Latest: {crop.agentNotes[crop.agentNotes.length - 1]}
                </p>
              </div>
            )}

            {/* Action Button */}
            <Button 
              onClick={() => onViewDetails(crop)}
              className="w-full mt-4 hover:bg-primary/90 transition-colors group"
            >
              <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              {t('view_details')}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default CropCard;
