
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Clipboard, ClipboardCheck, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateTreatmentPlan } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import LoadingIndicator from '@/components/UI/LoadingIndicator';
import ResultCard from '@/components/UI/ResultCard';

const TreatmentPlanner: React.FC = () => {
  const { addRecentActivity } = useApp();
  const { toast } = useToast();
  
  const [patientInfo, setPatientInfo] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  
  const { isLoading, refetch } = useQuery({
    queryKey: ['treatmentPlan', patientInfo, symptoms, medicalHistory],
    queryFn: async () => {
      if (!patientInfo || !symptoms) {
        throw new Error('Patient information and symptoms are required.');
      }
      
      const result = await generateTreatmentPlan(patientInfo, symptoms, medicalHistory);
      setTreatmentPlan(result);
      addRecentActivity(`Generated treatment plan for symptoms: ${symptoms.substring(0, 30)}...`);
      return result;
    },
    enabled: false,
    retry: 1,
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate treatment plan',
        variant: 'destructive',
      });
    },
  });

  const handleGeneratePlan = async () => {
    if (!patientInfo) {
      toast({
        title: 'Missing Information',
        description: 'Please provide patient information.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!symptoms) {
      toast({
        title: 'Missing Information',
        description: 'Please describe the symptoms.',
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

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/80 to-primary p-6 rounded-lg text-primary-foreground"
      >
        <h1 className="text-3xl font-bold mb-2">Treatment Planner</h1>
        <p className="text-primary-foreground/90 max-w-3xl">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clipboard className="h-5 w-5" />
                <span>Patient Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="patientInfo">Basic Information</Label>
                <Input
                  id="patientInfo"
                  placeholder="Age, gender, height, weight, etc."
                  value={patientInfo}
                  onChange={(e) => setPatientInfo(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="symptoms">Symptoms</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe your symptoms in detail..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              
              <div>
                <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
                <Textarea
                  id="medicalHistory"
                  placeholder="Any previous conditions, surgeries, or relevant medical history..."
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              
              <Button 
                onClick={handleGeneratePlan} 
                disabled={isLoading || !patientInfo || !symptoms}
                className="w-full mt-4"
              >
                {isLoading ? (
                  <>
                    <LoadingIndicator size="sm" className="mr-2" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <ClipboardCheck className="mr-2 h-5 w-5" />
                    Generate Treatment Plan
                  </>
                )}
              </Button>
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
              <LoadingIndicator size="lg" />
            </div>
          ) : treatmentPlan ? (
            <ResultCard
              title="Treatment Plan"
              onDownload={handleExport}
              onShare={handleShare}
            >
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap">{treatmentPlan}</div>
              </div>
            </ResultCard>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border rounded-lg border-dashed">
              <Clipboard className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Treatment Plan Yet</h3>
              <p className="text-muted-foreground mb-4">
                Fill out the patient information and symptoms to generate a personalized treatment plan.
              </p>
            </div>
          )}
        </motion.div>
      </div>
      
      <div className="mt-8 bg-card rounded-lg p-4 border shadow-sm">
        <h3 className="text-lg font-medium mb-2">Disclaimer</h3>
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
