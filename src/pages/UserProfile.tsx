
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Save, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

const UserProfile: React.FC = () => {
  const { userData, updateUserData, addRecentActivity } = useApp();
  const { toast } = useToast();
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedData = {
      name: formData.name,
      age: formData.age ? parseInt(formData.age.toString()) : undefined,
      gender: formData.gender,
      height: formData.height,
      weight: formData.weight,
      medicalHistory: formData.medicalHistory ? formData.medicalHistory.split(',').map(item => item.trim()) : [],
      allergies: formData.allergies ? formData.allergies.split(',').map(item => item.trim()) : [],
      medications: formData.medications ? formData.medications.split(',').map(item => item.trim()) : []
    };
    
    updateUserData(updatedData);
    addRecentActivity(`Updated user profile information`);
    
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
      >
        <Card className="shadow-md border-0">
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
                      <RadioGroupItem value="male" id="gender-male">
                      <Label htmlFor="gender-male">Male</Label></RadioGroupItem>
                    </div>
                   <RadioGroup>
                <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="gender-female" />
    <Label htmlFor="gender-female">Female</Label>
  </div>
</RadioGroup>
 <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="gender-other" />
                      <Label htmlFor="gender-other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                 <input 
              type="text"
              id="height" 
              name="height" 
  placeholder={'e.g., 5\'10" or 178 cm'} 
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
