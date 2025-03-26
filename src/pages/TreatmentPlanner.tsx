
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Clipboard, ClipboardCheck, Download, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateTreatmentPlan } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import LoadingIndicator from '@/components/UI/LoadingIndicator';
import ResultCard from '@/components/UI/ResultCard';
import TextToSpeechButton from '@/components/UI/TextToSpeechButton';
import ConciseToggle from '@/components/UI/ConciseToggle';

const TreatmentPlanner: React.FC = () => {
  const { addRecentActivity, recentActivities } = useApp();
  const { toast } = useToast();
  
  // Separate state for patient information fields
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [symptoms, setSymptoms] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [recentActivitiesText, setRecentActivitiesText] = useState('');
  const [useRecentActivities, setUseRecentActivities] = useState(false);
  const [isConcise, setIsConcise] = useState(false);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  useEffect(() => {
    if (recentActivities.length > 0) {
      const activitiesText = recentActivities.join('\n');
      setRecentActivitiesText(activitiesText);
    }
  }, [recentActivities]);
  
  // Combine patient info fields into a single string for the API
  const getPatientInfo = () => {
    const patientInfo = [];
    if (age) patientInfo.push(`Age: ${age}`);
    if (gender) patientInfo.push(`Gender: ${gender}`);
    if (height) patientInfo.push(`Height: ${height}`);
    if (weight) patientInfo.push(`Weight: ${weight}`);
    return patientInfo.join(', ');
  };
  
  const { isLoading, refetch } = useQuery({
    queryKey: ['treatmentPlan', age, gender, height, weight, symptoms, medicalHistory, useRecentActivities, isConcise],
    queryFn: async () => {
      const patientInfo = getPatientInfo();
      
      if (!patientInfo || (!symptoms && !useRecentActivities)) {
        throw new Error('Patient information and symptoms (or recent activities) are required.');
      }
      
      // Include recent activities in the symptoms if requested
      const effectiveSymptoms = useRecentActivities 
        ? `${symptoms}\n\nRecent medical activities:\n${recentActivitiesText}`
        : symptoms;
      
      const result = await generateTreatmentPlan(patientInfo, effectiveSymptoms, medicalHistory, isConcise);
      setTreatmentPlan(result);
      addRecentActivity(`Generated treatment plan for ${useRecentActivities ? 'recent activities' : `symptoms: ${symptoms.substring(0, 30)}...`}`);
      return result;
    },
    enabled: false,
    retry: 1,
    meta: {
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to generate treatment plan',
          variant: 'destructive',
        });
      }
    }
  });

  const handleGeneratePlan = async () => {
    if (!age || !gender) {
      toast({
        title: 'Missing Information',
        description: 'Please provide at least age and gender information.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!symptoms && !useRecentActivities) {
      toast({
        title: 'Missing Information',
        description: 'Please describe the symptoms or enable "Use recent activities".',
        variant: 'destructive',
      });
      return;
    }
    
    refetch();
  };

  const handleExport = () => {
    const element = document.createElement('a');
    const file = new Blob([treatmentPlan], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'treatment-plan.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: 'Treatment Plan Exported',
      description: 'Your treatment plan has been downloaded.',
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Treatment Plan',
          text: treatmentPlan,
        });
      } else {
        await navigator.clipboard.writeText(treatmentPlan);
        toast({
          title: 'Copied to Clipboard',
          description: 'Treatment plan has been copied to clipboard.',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: 'Share Failed',
        description: 'Failed to share treatment plan.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleConcise = (value: boolean) => {
    setIsConcise(value);
    if (treatmentPlan) {
      // Regenerate the treatment plan with the new concise setting
      refetch();
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 rounded-lg text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">Treatment Planner</h1>
        <p className="text-white/90 max-w-3xl">
          Create personalized treatment plans based on patient information, symptoms, and medical history.
          Our AI will analyze the data and provide recommendations for medications, lifestyle changes, and follow-up tests.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <Card className="shadow-md border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
              <CardTitle className="flex items-center gap-2">
                <Clipboard className="h-5 w-5 text-violet-500" />
                <span>Patient Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-4"
              >
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="border-slate-200 dark:border-slate-700 focus:border-violet-500 focus:ring-violet-500"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <Label htmlFor="gender" className="text-slate-700 dark:text-slate-300">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger id="gender" className="border-slate-200 dark:border-slate-700 focus:border-violet-500 focus:ring-violet-500">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <Label htmlFor="height" className="text-slate-700 dark:text-slate-300">Height (cm/ft)</Label>
                  <Input
                    id="height"
                    placeholder="Enter height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="border-slate-200 dark:border-slate-700 focus:border-violet-500 focus:ring-violet-500"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">Weight (kg/lbs)</Label>
                  <Input
                    id="weight"
                    placeholder="Enter weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="border-slate-200 dark:border-slate-700 focus:border-violet-500 focus:ring-violet-500"
                  />
                </motion.div>
              </motion.div>
              
              <div className="flex justify-end">
                <ConciseToggle isConcise={isConcise} onChange={handleToggleConcise} />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="symptoms" className="text-slate-700 dark:text-slate-300">Symptoms</Label>
                <Button
                  variant={useRecentActivities ? "default" : "outline"}
                  size="sm"
                  className={useRecentActivities ? "bg-violet-600 hover:bg-violet-700" : "border-violet-200 text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-900/20"}
                  onClick={() => setUseRecentActivities(!useRecentActivities)}
                >
                  <Sparkles className="mr-1 h-4 w-4" />
                  {useRecentActivities ? "Using Recent Activities" : "Use Recent Activities"}
                </Button>
              </div>
              
              {useRecentActivities && recentActivities.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 bg-violet-50 dark:bg-violet-900/10 rounded border border-violet-100 dark:border-violet-900/50"
                >
                  <h4 className="text-sm font-medium mb-2 text-violet-700 dark:text-violet-300">Recent Activities</h4>
                  <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                    {recentActivities.slice(0, 5).map((activity, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-4 h-4 bg-violet-100 dark:bg-violet-800 rounded-full flex-shrink-0 mr-2 text-center text-violet-700 dark:text-violet-300 text-[10px] leading-4">{index + 1}</span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
              
              <Textarea
                id="symptoms"
                placeholder="Describe your symptoms in detail..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="min-h-[100px] border-slate-200 dark:border-slate-700 focus:border-violet-500 focus:ring-violet-500"
                disabled={useRecentActivities && recentActivities.length > 0}
              />
              
              <motion.div variants={itemVariants}>
                <Label htmlFor="medicalHistory" className="text-slate-700 dark:text-slate-300">Medical History (Optional)</Label>
                <Textarea
                  id="medicalHistory"
                  placeholder="Any previous conditions, surgeries, or relevant medical history..."
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  className="mt-1 min-h-[100px] border-slate-200 dark:border-slate-700 focus:border-violet-500 focus:ring-violet-500"
                />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={handleGeneratePlan} 
                  disabled={isLoading || !age || !gender || (!symptoms && !useRecentActivities)}
                  className="w-full mt-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-violet-500/25"
                >
                  {isLoading ? (
                    <>
                      <LoadingIndicator size="sm" className="mr-2" />
                      <span className="animate-pulse">Generating Plan...</span>
                    </>
                  ) : (
                    <>
                      <ClipboardCheck className="mr-2 h-5 w-5" />
                      Generate Treatment Plan
                    </>
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <LoadingIndicator size="lg" className="text-violet-500" />
            </div>
          ) : treatmentPlan ? (
            <ResultCard
              title={isConcise ? "Concise Treatment Plan" : "Detailed Treatment Plan"}
              onDownload={handleExport}
              onShare={handleShare}
              extraButtons={
                <TextToSpeechButton text={treatmentPlan} />
              }
            >
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap">{treatmentPlan}</div>
              </div>
            </ResultCard>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border rounded-lg border-dashed bg-violet-50/50 dark:bg-violet-900/5">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
              >
                <Clipboard className="h-16 w-16 text-violet-400 mb-4" />
                <h3 className="text-xl font-medium mb-2 text-violet-800 dark:text-violet-300">No Treatment Plan Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Fill out the patient information and symptoms (or use recent activities) to generate a personalized treatment plan.
                </p>
                <motion.div
                  className="text-sm text-violet-600 dark:text-violet-400 mt-4 font-medium"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  Complete the form to start
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
      
      <div className="mt-8 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 rounded-lg p-5 border border-violet-100 dark:border-violet-900/20 shadow-sm">
        <h3 className="text-lg font-medium mb-2 text-violet-700 dark:text-violet-300">Disclaimer</h3>
        <p className="text-sm text-muted-foreground">
          The treatment plans provided by this AI system are for informational purposes only and should not
          be considered medical advice. Always consult with a qualified healthcare professional before 
          starting any treatment, making changes to existing treatments, or for questions related to a medical condition.
        </p>
      </div>
    </div>
  );
};

export default TreatmentPlanner;
