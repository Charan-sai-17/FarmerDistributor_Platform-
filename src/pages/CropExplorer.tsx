
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  User, 
  ArrowLeft,
  Filter,
  Heart,
  Star,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerRating: number;
  cropType: string;
  variety: string;
  quantity: number;
  pricePerKg: number;
  totalInvestment: number;
  location: string;
  plantingDate: string;
  expectedHarvestDate: string;
  stage: 'seedling' | 'growing' | 'flowering' | 'mature';
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
  images: string[];
  verified: boolean;
  organicCertified: boolean;
  minInvestment: number;
  expectedROI: number;
}

const CropExplorer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Mock crop listings data
  const cropListings: CropListing[] = [
    {
      id: 'CROP001',
      farmerId: 'F001',
      farmerName: 'Ramesh Kumar',
      farmerRating: 4.8,
      cropType: 'Tomatoes',
      variety: 'Cherry Tomatoes',
      quantity: 500,
      pricePerKg: 45,
      totalInvestment: 22500,
      location: 'Guntur, AP',
      plantingDate: '2024-01-15',
      expectedHarvestDate: '2024-04-15',
      stage: 'growing',
      riskLevel: 'low',
      description: 'High-quality organic cherry tomatoes with excellent market demand. Expected yield 500kg.',
      images: ['https://images.unsplash.com/photo-1546470427-e21b4dcca5a9?w=400&h=300&fit=crop'],
      verified: true,
      organicCertified: true,
      minInvestment: 5000,
      expectedROI: 18
    },
    {
      id: 'CROP002',
      farmerId: 'F002',
      farmerName: 'Lakshmi Devi',
      farmerRating: 4.6,
      cropType: 'Rice',
      variety: 'Basmati Premium',
      quantity: 1000,
      pricePerKg: 32,
      totalInvestment: 32000,
      location: 'Krishna, AP',
      plantingDate: '2024-02-01',
      expectedHarvestDate: '2024-06-01',
      stage: 'seedling',
      riskLevel: 'medium',
      description: 'Premium basmati rice cultivation with guaranteed buyback agreement.',
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'],
      verified: true,
      organicCertified: false,
      minInvestment: 10000,
      expectedROI: 15
    },
    {
      id: 'CROP003',
      farmerId: 'F003',
      farmerName: 'Suresh Reddy',
      farmerRating: 4.9,
      cropType: 'Cotton',
      variety: 'BT Cotton',
      quantity: 800,
      pricePerKg: 55,
      totalInvestment: 44000,
      location: 'Warangal, TS',
      plantingDate: '2024-01-20',
      expectedHarvestDate: '2024-05-20',
      stage: 'flowering',
      riskLevel: 'high',
      description: 'High-yield BT cotton with excellent fiber quality. Experienced farmer with 15+ years.',
      images: ['https://images.unsplash.com/photo-1612528782771-ae4ad1f33e17?w=400&h=300&fit=crop'],
      verified: true,
      organicCertified: false,
      minInvestment: 8000,
      expectedROI: 22
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'seedling': return 'bg-blue-100 text-blue-800';
      case 'growing': return 'bg-green-100 text-green-800';
      case 'flowering': return 'bg-purple-100 text-purple-800';
      case 'mature': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (cropId: string) => {
    navigate(`/crop/${cropId}`);
  };

  const handleInvest = (crop: CropListing) => {
    toast({
      title: "Investment Interest Registered",
      description: `Interest registered for ${crop.cropType} farming by ${crop.farmerName}`,
    });
  };

  const toggleFavorite = (cropId: string) => {
    setFavorites(prev => 
      prev.includes(cropId) 
        ? prev.filter(id => id !== cropId)
        : [...prev, cropId]
    );
  };

  const filteredCrops = cropListings.filter(crop => {
    const matchesSearch = crop.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === 'all' || crop.cropType.toLowerCase() === selectedCrop;
    const matchesLocation = selectedLocation === 'all' || crop.location.includes(selectedLocation);
    
    return matchesSearch && matchesCrop && matchesLocation;
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
                <h1 className="text-2xl font-bold text-gray-900">Crop Explorer</h1>
                <p className="text-sm text-gray-600">Discover investment opportunities</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {filteredCrops.length} Opportunities
            </Badge>
          </div>
        </div>
      </motion.header>

      {/* Filters */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border-b"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search crops, farmers, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger>
                <SelectValue placeholder="Crop Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                <SelectItem value="tomatoes">Tomatoes</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="cotton">Cotton</SelectItem>
                <SelectItem value="wheat">Wheat</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Guntur">Guntur</SelectItem>
                <SelectItem value="Krishna">Krishna</SelectItem>
                <SelectItem value="Warangal">Warangal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="roi">Highest ROI</SelectItem>
                <SelectItem value="rating">Best Rating</SelectItem>
                <SelectItem value="investment">Min Investment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredCrops.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Crops Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or explore different categories.
                </p>
                <Button onClick={() => {
                  setSearchTerm('');
                  setSelectedCrop('all');
                  setSelectedLocation('all');
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCrops.map((crop, index) => (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden group">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={crop.images[0]}
                        alt={crop.cropType}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex space-x-2">
                        {crop.verified && (
                          <Badge className="bg-green-500 text-white">Verified</Badge>
                        )}
                        {crop.organicCertified && (
                          <Badge className="bg-green-600 text-white">Organic</Badge>
                        )}
                      </div>
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
                          onClick={() => toggleFavorite(crop.id)}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(crop.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                        </Button>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <Badge className={getStageColor(crop.stage)}>
                          {crop.stage.charAt(0).toUpperCase() + crop.stage.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{crop.cropType}</CardTitle>
                          <p className="text-sm text-gray-600">{crop.variety}</p>
                        </div>
                        <Badge className={getRiskColor(crop.riskLevel)}>
                          {crop.riskLevel} risk
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Farmer Info */}
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium">{crop.farmerName}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">{crop.farmerRating}</span>
                        </div>
                      </div>

                      {/* Location & Dates */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{crop.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Harvest: {new Date(crop.expectedHarvestDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Investment Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Min Investment</p>
                          <p className="font-semibold">₹{crop.minInvestment.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Expected ROI</p>
                          <p className="font-semibold text-green-600">{crop.expectedROI}%</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Quantity</p>
                          <p className="font-semibold">{crop.quantity} kg</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Price/kg</p>
                          <p className="font-semibold">₹{crop.pricePerKg}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-2">{crop.description}</p>

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(crop.id)}
                          className="flex-1 flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleInvest(crop)}
                          className="flex-1 flex items-center space-x-2"
                        >
                          <TrendingUp className="w-4 h-4" />
                          <span>Invest</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default CropExplorer;
