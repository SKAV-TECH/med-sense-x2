
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Save, CheckCircle, Upload, XCircle, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const UserProfile: React.FC = () => {
  const { userData, updateUserData, addRecentActivity } = useApp();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: userData.name || '',
    age: userData.age || '',
    gender: userData.gender || '',
    height: userData.height || '',
    weight: userData.weight || '',
    medicalHistory: (userData.medicalHistory || []).join(', '),
    allergies: (userData.allergies || []).join(', '),
    medications: (userData.medications || []).join(', ')
  });
  
  const [profileImage, setProfileImage] = useState<string | undefined>(userData.profileImage);
  const [tempImage, setTempImage] = useState<string | undefined>(undefined);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    // Update form when userData changes
    setFormData({
      name: userData.name || '',
      age: userData.age || '',
      gender: userData.gender || '',
      height: userData.height || '',
      weight: userData.weight || '',
      medicalHistory: (userData.medicalHistory || []).join(', '),
      allergies: (userData.allergies || []).join(', '),
      medications: (userData.medications || []).join(', ')
    });
    setProfileImage(userData.profileImage);
  }, [userData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };
  
  const handleGenderChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
    setIsSaved(false);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setTempImage(result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const confirmImageChange = () => {
    setProfileImage(tempImage);
    setIsImageDialogOpen(false);
    setIsSaved(false);
  };
  
  const cancelImageChange = () => {
    setTempImage(undefined);
    setIsImageDialogOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedData = {
      name: formData.name,
      age: formData.age ? parseInt(formData.age.toString()) : undefined,
      gender: formData.gender,
      height: formData.height,
      weight: formData.weight,
      profileImage: profileImage,
      medicalHistory: formData.medicalHistory ? formData.medicalHistory.split(',').map(item => item.trim()) : [],
      allergies: formData.allergies ? formData.allergies.split(',').map(item => item.trim()) : [],
      medications: formData.medications ? formData.medications.split(',').map(item => item.trim()) : []
    };
    
    updateUserData(updatedData);
    
    setIsSaved(true);
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully",
    });
    
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-lg text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">User Profile</h1>
        <p className="text-white/90 max-w-3xl">
          Update your profile information to personalize your experience and help us provide better health recommendations.
          Your information will be stored locally on your device.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6 md:grid-cols-3"
      >
        <Card className="shadow-md border-0 md:col-span-1">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-500" />
              <span>Profile Picture</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="relative w-40 h-40 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-4 border-4 border-indigo-100 dark:border-indigo-900">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <User size={64} className="text-slate-400" />
                </div>
              )}
              
              <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="absolute bottom-2 right-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                    onClick={() => setIsImageDialogOpen(true)}
                  >
                    <Camera size={18} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Update Profile Picture</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-indigo-200 dark:border-indigo-800 bg-slate-100 dark:bg-slate-800">
                        {tempImage ? (
                          <img 
                            src={tempImage} 
                            alt="New profile" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <User size={64} className="text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          ref={fileInputRef}
                          onChange={handleFileChange} 
                          className="hidden" 
                          id="profile-upload"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Select Image
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button variant="outline" onClick={cancelImageChange}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button 
                        disabled={!tempImage} 
                        onClick={confirmImageChange}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Save Image
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <h3 className="text-lg font-semibold">{userData.name || 'Your Name'}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {userData.gender && userData.age ? `${userData.gender}, ${userData.age} years` : 'No details provided'}
            </p>
            
            <div className="w-full space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Height:</span>
                <span className="font-medium">{userData.height || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weight:</span>
                <span className="font-medium">{userData.weight || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Allergies:</span>
                <span className="font-medium">{userData.allergies?.length ? `${userData.allergies.length} listed` : 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Medications:</span>
                <span className="font-medium">{userData.medications?.length ? `${userData.medications.length} listed` : 'None'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      
        <Card className="shadow-md border-0 md:col-span-2">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-500" />
              <span>Your Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Enter your full name" 
                    value={formData.name} 
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    name="age" 
                    type="number" 
                    placeholder="Enter your age" 
                    value={formData.age} 
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup value={formData.gender} onValueChange={handleGenderChange} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="gender-male" />
                      <Label htmlFor="gender-male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="gender-female" />
                      <Label htmlFor="gender-female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="gender-other" />
                      <Label htmlFor="gender-other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input 
                    id="height" 
                    name="height" 
                   placeholder="e.g., 5'10" or 178 cm" 
                    value={formData.height} 
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input 
                    id="weight" 
                    name="weight" 
                    placeholder="e.g., 160 lbs or 73 kg" 
                    value={formData.weight} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History (comma separated)</Label>
                <Textarea 
                  id="medicalHistory" 
                  name="medicalHistory" 
                  placeholder="E.g., diabetes, hypertension, asthma" 
                  value={formData.medicalHistory} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies (comma separated)</Label>
                <Textarea 
                  id="allergies" 
                  name="allergies" 
                  placeholder="E.g., penicillin, peanuts, dust" 
                  value={formData.allergies} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications (comma separated)</Label>
                <Textarea 
                  id="medications" 
                  name="medications" 
                  placeholder="E.g., lisinopril, metformin, albuterol" 
                  value={formData.medications} 
                  onChange={handleChange}
                />
              </div>
              
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                {isSaved ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      
      <div className="mt-8 bg-slate-50 dark:bg-slate-800/20 rounded-lg p-5 border shadow-sm">
        <h3 className="text-lg font-medium mb-2 text-indigo-700 dark:text-indigo-300">Privacy Note</h3>
        <p className="text-sm text-muted-foreground">
          Your information is stored locally on your device and is not sent to any server.
          This information is used to personalize your experience across the application,
          such as pre-filling forms in the Treatment Planner. You can reset your data anytime
          in the Settings page.
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
