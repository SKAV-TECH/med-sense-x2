
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Save, CheckCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const UserProfile: React.FC = () => {
  const { userData, updateUserData, addActivity } = useApp();
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Local form state
  const [formData, setFormData] = useState({
    name: userData.name || '',
    age: userData.age || '',
    gender: userData.gender || '',
    height: userData.height || '',
    weight: userData.weight || '',
    bloodType: userData.bloodType || '',
    conditions: userData.conditions?.join(', ') || '',
    medicalHistory: userData.medicalHistory?.join(', ') || '',
    allergies: userData.allergies?.join(', ') || '',
    medications: userData.medications?.join(', ') || ''
  });

  // Reset form data when userData changes
  useEffect(() => {
    setFormData({
      name: userData.name || '',
      age: userData.age || '',
      gender: userData.gender || '',
      height: userData.height || '',
      weight: userData.weight || '',
      bloodType: userData.bloodType || '',
      conditions: userData.conditions?.join(', ') || '',
      medicalHistory: userData.medicalHistory?.join(', ') || '',
      allergies: userData.allergies?.join(', ') || '',
      medications: userData.medications?.join(', ') || ''
    });
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = () => {
    // Convert string lists back to arrays
    const updatedData = {
      name: formData.name,
      age: formData.age ? Number(formData.age) : undefined,
      gender: formData.gender,
      height: formData.height,
      weight: formData.weight,
      bloodType: formData.bloodType,
      conditions: formData.conditions ? formData.conditions.split(',').map(item => item.trim()) : [],
      medicalHistory: formData.medicalHistory ? formData.medicalHistory.split(',').map(item => item.trim()) : [],
      allergies: formData.allergies ? formData.allergies.split(',').map(item => item.trim()) : [],
      medications: formData.medications ? formData.medications.split(',').map(item => item.trim()) : []
    };
    
    updateUserData(updatedData);
    addActivity('Updated user profile');
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    
    toast({
      title: "Profile Updated",
      description: "Your health profile has been saved successfully."
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Health Profile</h1>
            <p className="text-muted-foreground">Manage your personal health information</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your basic information to help us personalize your experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  name="name"
                  placeholder="Your full name"
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
                  placeholder="Your age"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => handleSelectChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select 
                  value={formData.bloodType} 
                  onValueChange={(value) => handleSelectChange('bloodType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input 
                  id="height"
                  name="height"
                  placeholder="Your height (e.g., 5'10\" or 178 cm)"
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input 
                  id="weight"
                  name="weight"
                  placeholder="Your weight (e.g., 160 lbs or 73 kg)"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conditions">Medical Conditions</Label>
              <Textarea 
                id="conditions"
                name="conditions"
                placeholder="List your medical conditions separated by commas"
                value={formData.conditions}
                onChange={handleChange}
                rows={2}
              />
              <p className="text-xs text-muted-foreground">E.g., Diabetes Type 2, Hypertension, Asthma</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea 
                  id="allergies"
                  name="allergies"
                  placeholder="List your allergies separated by commas"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">E.g., Penicillin, Peanuts, Latex</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea 
                  id="medications"
                  name="medications"
                  placeholder="List your medications separated by commas"
                  value={formData.medications}
                  onChange={handleChange}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">E.g., Metformin 500mg, Lisinopril 10mg</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea 
                id="medicalHistory"
                name="medicalHistory"
                placeholder="List your past surgeries, hospitalizations, or significant medical events"
                value={formData.medicalHistory}
                onChange={handleChange}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">E.g., Appendectomy 2015, Knee Replacement 2019</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Your information is securely encrypted and stored locally.
            </p>
            <Button 
              onClick={saveProfile} 
              className="px-6 flex items-center"
              disabled={saveSuccess}
            >
              {saveSuccess ? (
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
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserProfile;
