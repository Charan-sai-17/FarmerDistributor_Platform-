
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, 
  Check, Shield, Upload, FileText, Home, Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Validation schemas for each step
const roleSchema = z.object({
  role: z.enum(['farmer', 'distributor', 'agent'])
});

const personalSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
  verificationType: z.enum(['phone', 'email'])
});

const documentsSchema = z.object({
  aadhaarFile: z.any().optional(),
  agreedToTerms: z.boolean().refine(val => val === true, 'You must agree to terms and conditions')
});

type RoleFormData = z.infer<typeof roleSchema>;
type PersonalFormData = z.infer<typeof personalSchema>;
type OTPFormData = z.infer<typeof otpSchema>;
type DocumentsFormData = z.infer<typeof documentsSchema>;

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const { signup, sendOTP, verifyOTP } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Role Selection Form
  const roleForm = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: { role: formData.role }
  });

  // Personal Details Form
  const personalForm = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
    defaultValues: formData
  });

  // OTP Form
  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { verificationType: 'phone' }
  });

  // Documents Form
  const documentsForm = useForm<DocumentsFormData>({
    resolver: zodResolver(documentsSchema)
  });

  const roles = [
    {
      id: 'farmer' as UserRole,
      title: 'Farmer',
      subtitle: 'Grow and sell crops',
      icon: '🧑‍🌾',
      description: 'List your crops, get fair prices, and secure contracts with distributors'
    },
    {
      id: 'distributor' as UserRole,
      title: 'Distributor',
      subtitle: 'Buy and distribute produce',
      icon: '📦',
      description: 'Discover quality crops, invest early, and ensure guaranteed supply'
    },
    {
      id: 'agent' as UserRole,
      title: 'Field Agent',
      subtitle: 'Verify and inspect crops',
      icon: '🛡️',
      description: 'Verify crop quality, earn commissions, and build trust in the ecosystem'
    }
  ];

  const nextStep = async (data: any) => {
    setFormData({ ...formData, ...data });
    
    if (currentStep === 2 && !otpSent) {
      // Send OTP after personal details
      await sendOTP('phone');
      setOtpSent(true);
    }
    
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleOTPVerification = async (data: OTPFormData) => {
    setIsSubmitting(true);
    try {
      const verified = await verifyOTP(data.otp, data.verificationType);
      if (verified) {
        nextStep(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} uploaded successfully`
      });
    }
  };

  const handleFinalSubmit = async (data: DocumentsFormData) => {
    setIsSubmitting(true);
    try {
      const signupData = {
        ...formData,
        ...data,
        agreedToTerms: true
      };
      
      const success = await signup(signupData);
      if (success) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to AgroConnect. Please complete your profile."
        });
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    return strength;
  };

  const watchedPassword = personalForm.watch('password') || '';
  const passwordStrength = getPasswordStrength(watchedPassword);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-3">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">AgroConnect</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Create your account</h2>
          <p className="text-gray-600">Join the future of agriculture trading</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Role Selection */}
            {currentStep === 1 && (
              <motion.div
                key="role-selection"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3 className="text-lg font-semibold text-center mb-6">Choose your role</h3>
                <form onSubmit={roleForm.handleSubmit(nextStep)} className="space-y-4">
                  <div className="grid gap-4">
                    {roles.map((role) => (
                      <motion.label
                        key={role.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          roleForm.watch('role') === role.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          {...roleForm.register('role')}
                          type="radio"
                          value={role.id}
                          className="sr-only"
                        />
                        <div className="text-4xl mr-4">{role.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{role.title}</h4>
                          <p className="text-sm text-gray-600 mb-1">{role.subtitle}</p>
                          <p className="text-xs text-gray-500">{role.description}</p>
                        </div>
                        {roleForm.watch('role') === role.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.label>
                    ))}
                  </div>
                  <Button
                    type="submit"
                    disabled={!roleForm.watch('role')}
                    className="w-full h-12 mt-6"
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Step 2: Personal Details */}
            {currentStep === 2 && (
              <motion.div
                key="personal-details"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3 className="text-lg font-semibold text-center mb-6">Personal Information</h3>
                <form onSubmit={personalForm.handleSubmit(nextStep)} className="space-y-6">
                  {/* Name Field */}
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      {...personalForm.register('name')}
                      placeholder="Full Name"
                      className="pl-12 h-12"
                    />
                    {personalForm.formState.errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {personalForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      {...personalForm.register('email')}
                      type="email"
                      placeholder="Email Address"
                      className="pl-12 h-12"
                    />
                    {personalForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {personalForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      {...personalForm.register('phone')}
                      type="tel"
                      placeholder="Phone Number (+91XXXXXXXXXX)"
                      className="pl-12 h-12"
                    />
                    {personalForm.formState.errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {personalForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      {...personalForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      className="pl-12 pr-12 h-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {watchedPassword && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Password strength</span>
                          <span>{passwordStrength}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                            className={`h-1 rounded-full transition-colors ${
                              passwordStrength < 50 ? 'bg-red-500' :
                              passwordStrength < 75 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                    {personalForm.formState.errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {personalForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      {...personalForm.register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      className="pl-12 pr-12 h-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {personalForm.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {personalForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12">
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Back
                    </Button>
                    <Button type="submit" className="flex-1 h-12">
                      Continue
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: OTP Verification */}
            {currentStep === 3 && (
              <motion.div
                key="otp-verification"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Verify your phone number</h3>
                  <p className="text-gray-600">
                    We've sent a 6-digit code to {formData.phone}
                  </p>
                </div>

                <form onSubmit={otpForm.handleSubmit(handleOTPVerification)} className="space-y-6">
                  <div className="flex justify-center">
                    <Input
                      {...otpForm.register('otp')}
                      placeholder="Enter 6-digit OTP"
                      className="text-center text-lg font-mono tracking-widest h-12 w-48"
                      maxLength={6}
                    />
                  </div>
                  {otpForm.formState.errors.otp && (
                    <p className="text-red-500 text-sm text-center">
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => sendOTP('phone')}
                      className="text-primary"
                    >
                      Resend OTP
                    </Button>
                  </div>

                  <div className="flex space-x-4">
                    <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12">
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 h-12"
                    >
                      {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                      Verify
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 4: Documents & Terms */}
            {currentStep === 4 && (
              <motion.div
                key="documents"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3 className="text-lg font-semibold text-center mb-6">Complete your profile</h3>
                
                <form onSubmit={documentsForm.handleSubmit(handleFinalSubmit)} className="space-y-6">
                  {/* Document Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors">
                    <div className="mb-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900 mb-1">Upload Aadhaar/ID Proof</h4>
                      <p className="text-sm text-gray-600">PDF, JPG, PNG up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="document-upload"
                    />
                    <label htmlFor="document-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <span>
                          <FileText className="w-4 h-4 mr-2" />
                          Choose File
                        </span>
                      </Button>
                    </label>
                    {uploadedFile && (
                      <div className="mt-3 flex items-center justify-center text-sm text-green-600">
                        <Check className="w-4 h-4 mr-1" />
                        {uploadedFile.name}
                      </div>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox {...documentsForm.register('agreedToTerms')} className="mt-1" />
                      <div className="text-sm">
                        <p className="text-gray-700">
                          I agree to the{' '}
                          <Link to="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </p>
                      </div>
                    </div>
                    {documentsForm.formState.errors.agreedToTerms && (
                      <p className="text-red-500 text-sm">
                        {documentsForm.formState.errors.agreedToTerms.message}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12">
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !documentsForm.watch('agreedToTerms')}
                      className="flex-1 h-12"
                    >
                      {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                      Create Account
                      <Check className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
