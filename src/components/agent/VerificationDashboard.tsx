
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Camera, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const VerificationDashboard: React.FC = () => {
  const { verificationTasks, updateVerificationTask, crops, updateCrop } = useApp();
  const { toast } = useToast();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  const handleCompleteVerification = (taskId: string, cropId: string, approved: boolean) => {
    updateVerificationTask(taskId, { 
      status: 'completed',
      notes: verificationNotes 
    });
    
    updateCrop(cropId, { 
      status: approved ? 'verified' : 'pending',
      agentNotes: [verificationNotes],
      verificationDate: new Date().toISOString()
    });

    toast({
      title: approved ? "Crop Verified" : "Verification Rejected",
      description: approved 
        ? "The crop has been successfully verified and is now available for purchase."
        : "The crop verification has been rejected. Farmer will be notified."
    });

    setSelectedTask(null);
    setVerificationNotes('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingTasks = verificationTasks.filter(task => task.status === 'pending');
  const completedTasks = verificationTasks.filter(task => task.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-orange-600">{pendingTasks.length}</div>
            <div className="text-sm text-gray-600">Pending Verifications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-green-600">₹15,800</div>
            <div className="text-sm text-gray-600">Monthly Earnings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-blue-600">{completedTasks.length}</div>
            <div className="text-sm text-gray-600">Completed Tasks</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Pending Verification Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingTasks.map((task) => {
              const crop = crops.find(c => c.id === task.cropId);
              const isSelected = selectedTask === task.id;
              
              return (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{crop?.cropName || 'Unknown Crop'}</h3>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{task.location}</span>
                        <span className="mx-2">•</span>
                        <span>Farmer ID: {task.farmerId}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority} priority
                      </Badge>
                      <Badge variant="outline">
                        Due: {new Date(task.scheduledDate).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>

                  {crop?.images[0] && (
                    <img
                      src={crop.images[0]}
                      alt={crop.cropName}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}

                  <p className="text-sm text-gray-700 mb-3">{task.notes}</p>

                  {!isSelected ? (
                    <Button onClick={() => setSelectedTask(task.id)}>
                      Start Verification
                    </Button>
                  ) : (
                    <div className="space-y-4 border-t pt-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Verification Notes</label>
                        <Textarea
                          value={verificationNotes}
                          onChange={(e) => setVerificationNotes(e.target.value)}
                          placeholder="Enter your verification notes, crop quality assessment, and recommendations..."
                          className="min-h-24"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline">
                          <Camera className="w-4 h-4 mr-2" />
                          Add Photos
                        </Button>
                        <Button variant="outline">
                          <MapPin className="w-4 h-4 mr-2" />
                          Mark Location
                        </Button>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => handleCompleteVerification(task.id, task.cropId, true)}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={!verificationNotes.trim()}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve & Verify
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleCompleteVerification(task.id, task.cropId, false)}
                          disabled={!verificationNotes.trim()}
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedTask(null);
                            setVerificationNotes('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {pendingTasks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No pending verification tasks</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Completed Tasks */}
      {completedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Recently Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedTasks.slice(0, 3).map((task) => {
                const crop = crops.find(c => c.id === task.cropId);
                return (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{crop?.cropName || 'Unknown Crop'}</p>
                      <p className="text-sm text-gray-600">{task.location}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VerificationDashboard;
