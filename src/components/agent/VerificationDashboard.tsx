
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, MapPin, Calendar, User, Camera } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

const VerificationDashboard = () => {
  const { crops, updateCrop, verificationTasks, updateVerificationTask } = useApp();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingVerifications = crops.filter(crop => crop.status === 'pending');

  const handleVerification = async (cropId: string, action: 'approve' | 'reject') => {
    setIsProcessing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const newStatus = action === 'approve' ? 'verified' : 'pending';
      const verificationNotes = notes || `${action === 'approve' ? 'Approved' : 'Rejected'} by agent`;
      
      updateCrop(cropId, {
        status: newStatus,
        verificationDate: new Date().toISOString(),
        agentNotes: [...(crops.find(c => c.id === cropId)?.agentNotes || []), verificationNotes]
      });

      // Update verification task if exists
      const task = verificationTasks.find(t => t.cropId === cropId);
      if (task) {
        updateVerificationTask(task.id, {
          status: 'completed',
          notes: verificationNotes
        });
      }

      toast({
        title: action === 'approve' ? "Crop Approved" : "Crop Rejected",
        description: `Crop has been ${action === 'approve' ? 'approved' : 'rejected'} successfully.`,
      });

      setSelectedTask(null);
      setNotes('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process verification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold">{t('tasks')}</h2>
        <Badge variant="outline" className="text-sm">
          {pendingVerifications.length} Pending Verifications
        </Badge>
      </div>

      {pendingVerifications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending verifications at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingVerifications.map(crop => {
            const task = verificationTasks.find(t => t.cropId === crop.id);
            return (
              <Card key={crop.id} className="hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{crop.cropName}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{crop.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Farmer ID: {crop.farmerId}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(crop.seedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {task && (
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority} priority
                        </Badge>
                      )}
                      <Badge variant="outline">
                        ₹{crop.price.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Area</label>
                      <p className="text-lg">{crop.area} acres</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Expected Harvest</label>
                      <p className="text-lg">{new Date(crop.expectedHarvest).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {crop.images.length > 0 && (
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Crop Images</label>
                      <div className="flex space-x-2 overflow-x-auto">
                        {crop.images.map((image, index) => (
                          <div key={index} className="flex-shrink-0">
                            <img 
                              src={image} 
                              alt={`${crop.cropName} ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border hover:scale-105 transition-transform cursor-pointer"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {crop.agentNotes.length > 0 && (
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Previous Notes</label>
                      <div className="space-y-1">
                        {crop.agentNotes.map((note, index) => (
                          <p key={index} className="text-sm bg-gray-50 p-2 rounded">{note}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedTask(crop.id)}
                          className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          {t('reject')}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reject Crop Verification</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to reject this crop? Please provide a reason for rejection.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Textarea
                          placeholder="Reason for rejection..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="my-4"
                        />
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setNotes('')}>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleVerification(crop.id, 'reject')}
                            disabled={isProcessing}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isProcessing ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                            Reject Crop
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          onClick={() => setSelectedTask(crop.id)}
                          className="hover:bg-green-600 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {t('approve')}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Approve Crop Verification</AlertDialogTitle>
                          <AlertDialogDescription>
                            Confirm that this crop meets all verification standards and approve it for the marketplace.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Textarea
                          placeholder="Add verification notes (optional)..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="my-4"
                        />
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setNotes('')}>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleVerification(crop.id, 'approve')}
                            disabled={isProcessing}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isProcessing ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                            Approve Crop
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VerificationDashboard;
