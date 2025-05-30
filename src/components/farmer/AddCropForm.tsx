
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, X, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface AddCropFormProps {
  onBack: () => void;
}

interface FormData {
  cropName: string;
  area: string;
  location: string;
  seedDate: string;
  expectedHarvest: string;
  price: string;
  description: string;
  images: string[];
}

interface FormErrors {
  cropName?: string;
  area?: string;
  location?: string;
  seedDate?: string;
  expectedHarvest?: string;
  price?: string;
  description?: string;
  images?: string;
}

const AddCropForm: React.FC<AddCropFormProps> = ({ onBack }) => {
  const { user, addCrop } = useApp();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    cropName: '',
    area: '',
    location: '',
    seedDate: '',
    expectedHarvest: '',
    price: '',
    description: '',
    images: []
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.cropName.trim()) {
      newErrors.cropName = 'Crop name is required';
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    } else if (parseFloat(formData.area) <= 0) {
      newErrors.area = 'Area must be greater than 0';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.seedDate) {
      newErrors.seedDate = 'Seed date is required';
    } else if (new Date(formData.seedDate) > new Date()) {
      newErrors.seedDate = 'Seed date cannot be in the future';
    }

    if (!formData.expectedHarvest) {
      newErrors.expectedHarvest = 'Expected harvest date is required';
    } else if (new Date(formData.expectedHarvest) <= new Date(formData.seedDate)) {
      newErrors.expectedHarvest = 'Harvest date must be after seed date';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Expected price is required';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setImageUploading(true);
    try {
      // Simulate image upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newImages = Array.from(files).map((file, index) => 
        `/placeholder.svg?crop=${Date.now()}_${index}`
      );
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 5) // Max 5 images
      }));
      
      toast({
        title: "Images Uploaded",
        description: `Successfully uploaded ${newImages.length} image(s)`
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors below",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newCrop = {
        id: Date.now().toString(),
        farmerId: user!.id,
        cropName: formData.cropName,
        area: parseFloat(formData.area),
        location: formData.location,
        seedDate: formData.seedDate,
        expectedHarvest: formData.expectedHarvest,
        price: parseFloat(formData.price),
        status: 'pending' as const,
        images: formData.images,
        agentNotes: [],
        verificationDate: null,
        agentId: null
      };

      addCrop(newCrop);
      
      toast({
        title: "Crop Added Successfully",
        description: "Your crop has been submitted for verification"
      });
      
      onBack();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to add crop. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('dashboard')}
          </Button>
          <h1 className="text-2xl font-bold">{t('add_new_crop')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crop Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Crop Name */}
              <div>
                <Label htmlFor="cropName">Crop Name *</Label>
                <Select onValueChange={(value) => handleInputChange('cropName', value)}>
                  <SelectTrigger className={errors.cropName ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tomato">Tomato</SelectItem>
                    <SelectItem value="potato">Potato</SelectItem>
                    <SelectItem value="onion">Onion</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="corn">Corn</SelectItem>
                  </SelectContent>
                </Select>
                {errors.cropName && <p className="text-xs text-red-500 mt-1">{errors.cropName}</p>}
              </div>

              {/* Area and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="area">Area (acres) *</Label>
                  <Input
                    id="area"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 2.5"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    className={errors.area ? 'border-red-500' : ''}
                  />
                  {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area}</p>}
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Guntur, AP"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={errors.location ? 'border-red-500' : ''}
                  />
                  {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="seedDate">Seed Date *</Label>
                  <Input
                    id="seedDate"
                    type="date"
                    value={formData.seedDate}
                    onChange={(e) => handleInputChange('seedDate', e.target.value)}
                    className={errors.seedDate ? 'border-red-500' : ''}
                  />
                  {errors.seedDate && <p className="text-xs text-red-500 mt-1">{errors.seedDate}</p>}
                </div>
                <div>
                  <Label htmlFor="expectedHarvest">Expected Harvest *</Label>
                  <Input
                    id="expectedHarvest"
                    type="date"
                    value={formData.expectedHarvest}
                    onChange={(e) => handleInputChange('expectedHarvest', e.target.value)}
                    className={errors.expectedHarvest ? 'border-red-500' : ''}
                  />
                  {errors.expectedHarvest && <p className="text-xs text-red-500 mt-1">{errors.expectedHarvest}</p>}
                </div>
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="price">Expected Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 50000"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your crop, farming methods, expected quality..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={errors.description ? 'border-red-500' : ''}
                  rows={4}
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
              </div>

              {/* Image Upload */}
              <div>
                <Label>Crop Images * (Max 5)</Label>
                <div className="mt-2">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {imageUploading ? (
                        <LoadingSpinner size="md" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500">Click to upload images</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={imageUploading || formData.images.length >= 5}
                    />
                  </label>
                </div>
                {errors.images && <p className="text-xs text-red-500 mt-1">{errors.images}</p>}
                
                {/* Image Preview */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Crop ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
                  {isSubmitting ? 'Adding Crop...' : 'Add Crop'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddCropForm;
