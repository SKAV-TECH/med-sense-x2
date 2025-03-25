
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Save, User, UserCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  age: z.string().min(1, { message: 'Age is required.' }),
  gender: z.string().min(1, { message: 'Gender is required.' }),
  height: z.string().min(1, { message: 'Height is required.' }),
  weight: z.string().min(1, { message: 'Weight is required.' }),
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  conditions: z.string().optional(),
  medications: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const UserProfile = () => {
  const { userData, setUserData } = useApp();
  const { toast } = useToast();
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  // Initialize form with existing user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData.name || '',
      age: userData.age || '',
      gender: userData.gender || '',
      height: userData.height || '',
      weight: userData.weight || '',
      bloodType: userData.bloodType || '',
      allergies: userData.allergies || '',
      conditions: userData.conditions || '',
      medications: userData.medications || '',
    },
  });

  useEffect(() => {
    // Check if this is the first visit
    const isFirstTime = !localStorage.getItem('userProfileComplete');
    setIsFirstVisit(isFirstTime);
  }, []);

  useEffect(() => {
    // Update form values when userData changes
    form.reset({
      name: userData.name || '',
      age: userData.age || '',
      gender: userData.gender || '',
      height: userData.height || '',
      weight: userData.weight || '',
      bloodType: userData.bloodType || '',
      allergies: userData.allergies || '',
      conditions: userData.conditions || '',
      medications: userData.medications || '',
    });
  }, [userData, form]);

  const onSubmit = (data: ProfileFormValues) => {
    // Update context and localStorage
    setUserData({
      ...userData,
      ...data,
    });
    
    // Save to localStorage
    localStorage.setItem('userData', JSON.stringify({
      ...userData,
      ...data,
    }));
    
    // Mark profile as complete
    localStorage.setItem('userProfileComplete', 'true');
    
    // Show success toast
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
    
    setIsFirstVisit(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="container max-w-4xl mx-auto"
    >
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {isFirstVisit ? "Welcome to MedClauseX" : "Your Profile"}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {isFirstVisit 
            ? "Please complete your profile to help us personalize your experience."
            : "Update your personal information to receive more accurate medical insights."
          }
        </p>
      </div>

      <Card className="border-border/40 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                This information helps us provide personalized medical insights
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input placeholder="35" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input placeholder="170" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input placeholder="70" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Medical Information</h3>
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergies</FormLabel>
                      <FormControl>
                        <Input placeholder="Penicillin, peanuts, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="conditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pre-existing Conditions</FormLabel>
                      <FormControl>
                        <Input placeholder="Diabetes, hypertension, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="medications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Medications</FormLabel>
                      <FormControl>
                        <Input placeholder="List your current medications" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <CardFooter className="flex justify-end px-0 pt-4">
                <Button type="submit" className="w-full sm:w-auto" size="lg">
                  <Save className="mr-2 h-4 w-4" />
                  {isFirstVisit ? "Complete Profile" : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserProfile;
