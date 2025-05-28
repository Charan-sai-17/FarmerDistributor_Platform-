
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, Camera } from 'lucide-react';

interface AddCropFormProps {
  onBack: () => void;
}

const AddCropForm: React.FC<AddCropFormProps> = ({ onBack }) => {
  const { addCrop, user } = useApp();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cropName: '',
    location: '',
    area: '',
    seedDate: '',
    expectedHarvest: '',
    price: '',
    soilType: '',
    waterSource: '',
    images: [] as string[]
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = () => {
    // Simulate image upload
    const sampleImage = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400';
    setFormData(prev => ({ 
      ...prev, 
      images: [...prev.images, sampleImage] 
    }));
    toast({
      title: "Image uploaded",
      description: "Crop image has been added successfully."
    });
  };

  const handleSubmit = () => {
    if (!user) return;

    const newCrop = {
      farmerId: user.id,
      cropName: formData.cropName,
      location: formData.location,
      area: parseFloat(formData.area),
      seedDate: formData.seedDate,
      expectedHarvest: formData.expectedHarvest,
      status: 'pending' as const,
      price: parseFloat(formData.price),
      images: formData.images,
      agentNotes: []
    };

    addCrop(newCrop);
    toast({
      title: "Crop Added Successfully",
      description: "Your crop has been submitted for verification."
    });
    onBack();
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-heading font-bold">Add New Crop</h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  i <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {i}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Basic Crop Information"}
              {step === 2 && "Land Details"}
              {step === 3 && "Investment & Pricing"}
              {step === 4 && "Images & Final Review"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <Label htmlFor="cropName">Crop Type</Label>
                  <Input
                    id="cropName"
                    value={formData.cropName}
                    onChange={(e) => handleInputChange('cropName', e.target.value)}
                    placeholder="e.g., Tomato, Rice, Cotton"
                  />
                </div>
                <div>
                  <Label htmlFor="seedDate">Seed Sown Date</Label>
                  <Input
                    id="seedDate"
                    type="date"
                    value={formData.seedDate}
                    onChange={(e) => handleInputChange('seedDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="expectedHarvest">Expected Harvest Date</Label>
                  <Input
                    id="expectedHarvest"
                    type="date"
                    value={formData.expectedHarvest}
                    onChange={(e) => handleInputChange('expectedHarvest', e.target.value)}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Village, District, State"
                  />
                </div>
                <div>
                  <Label htmlFor="area">Land Area (Acres)</Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    placeholder="e.g., 2.5"
                  />
                </div>
                <div>
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Input
                    id="soilType"
                    value={formData.soilType}
                    onChange={(e) => handleInputChange('soilType', e.target.value)}
                    placeholder="e.g., Clay, Sandy, Loam"
                  />
                </div>
                <div>
                  <Label htmlFor="waterSource">Water Source</Label>
                  <Input
                    id="waterSource"
                    value={formData.waterSource}
                    onChange={(e) => handleInputChange('waterSource', e.target.value)}
                    placeholder="e.g., Bore well, Canal, Rain fed"
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <Label htmlFor="price">Expected Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Total expected revenue"
                  />
                </div>
                <div>
                  <Label>Investment Terms</Label>
                  <Textarea
                    placeholder="Describe any specific terms or conditions for potential buyers..."
                    className="h-24"
                  />
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div>
                  <Label>Crop Images</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="space-y-4">
                      <div className="flex justify-center space-x-4">
                        <Button onClick={handleImageUpload} variant="outline">
                          <Camera className="w-4 h-4 mr-2" />
                          Take Photo
                        </Button>
                        <Button onClick={handleImageUpload} variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </Button>
                      </div>
                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          {formData.images.map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt={`Crop ${index + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Review Your Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Crop:</strong> {formData.cropName}</p>
                    <p><strong>Location:</strong> {formData.location}</p>
                    <p><strong>Area:</strong> {formData.area} acres</p>
                    <p><strong>Expected Price:</strong> ₹{formData.price}</p>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              {step < 4 ? (
                <Button onClick={nextStep} className="ml-auto">
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="ml-auto">
                  Submit Crop
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddCropForm;
