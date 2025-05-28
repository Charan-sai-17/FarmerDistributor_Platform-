
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Crop } from '@/contexts/AppContext';

interface CropDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  crop: Crop | null;
}

const CropDetailsModal: React.FC<CropDetailsModalProps> = ({ isOpen, onClose, crop }) => {
  if (!crop) return null;

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

  const timeline = [
    { stage: 'Seed Planted', date: crop.seedDate, completed: true },
    { stage: '30% Growth', date: '2024-04-15', completed: true },
    { stage: '60% Growth', date: '2024-05-15', completed: true },
    { stage: 'Ready for Harvest', date: crop.expectedHarvest, completed: false },
    { stage: 'Harvested', date: '', completed: false }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{crop.cropName} Details</span>
            <Badge className={getStatusColor(crop.status)}>
              {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Crop Images */}
          {crop.images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Crop Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {crop.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${crop.cropName} - ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Basic Information */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Crop Name</label>
                  <p className="text-lg">{crop.cropName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="text-lg">{crop.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Area</label>
                  <p className="text-lg">{crop.area} acres</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Expected Price</label>
                  <p className="text-lg font-mono font-bold text-primary">₹{crop.price.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Seed Date</label>
                  <p className="text-lg">{new Date(crop.seedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Expected Harvest</label>
                  <p className="text-lg">{new Date(crop.expectedHarvest).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Growth Timeline */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">Growth Timeline</h3>
              <div className="space-y-3">
                {timeline.map((stage, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${stage.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="flex-1">
                      <p className={`font-medium ${stage.completed ? 'text-green-700' : 'text-gray-500'}`}>
                        {stage.stage}
                      </p>
                      {stage.date && (
                        <p className="text-sm text-gray-500">{new Date(stage.date).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Agent Notes */}
          {crop.agentNotes.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3">Agent Updates</h3>
                <div className="space-y-3">
                  {crop.agentNotes.map((note, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-800">{note}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {new Date().toLocaleDateString()} - Agent Update
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CropDetailsModal;
