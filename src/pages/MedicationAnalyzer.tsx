
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Pill, UploadCloud, Search, AlertTriangle, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzeMedication, analyzePrescriptionImage } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import ImageUploader from '@/components/UI/ImageUploader';
import LoadingIndicator from '@/components/UI/LoadingIndicator';
import ResultCard from '@/components/UI/ResultCard';

const MedicationAnalyzer: React.FC = () => {
  const { addRecentActivity } = useApp();
  const { toast } = useToast();
  
  const [medicationName, setMedicationName] = useState('');
  const [patientInfo, setPatientInfo] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  
  // Query for text-based medication analysis
  const { isLoading: isTextAnalysisLoading, refetch: refetchTextAnalysis } = useQuery({
    queryKey: ['medicationAnalysis', medicationName, patientInfo],
    queryFn: async () => {
      if (!medicationName) {
        throw new Error('Medication name is required.');
      }
      
      const result = await analyzeMedication(medicationName, patientInfo);
      setAnalysisResult(result);
      addRecentActivity(`Analyzed medication: ${medicationName}`);
      return result;
    },
    enabled: false,
    retry: 1,
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to analyze medication',
        variant: 'destructive',
      });
    },
  });
  
  // Query for prescription image analysis
  const { isLoading: isImageAnalysisLoading, refetch: refetchImageAnalysis } = useQuery({
    queryKey: ['prescriptionAnalysis', prescriptionFile],
    queryFn: async () => {
      if (!prescriptionFile) {
        throw new Error('Prescription image is required.');
      }
      
      const result = await analyzePrescriptionImage(prescriptionFile);
      setAnalysisResult(result);
      addRecentActivity(`Analyzed prescription image`);
      return result;
    },
    enabled: false,
    retry: 1,
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to analyze prescription image',
        variant: 'destructive',
      });
    },
  });
  
  const handleAnalyzeMedication = () => {
    if (!medicationName) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a medication name.',
        variant: 'destructive',
      });
      return;
    }
    
    refetchTextAnalysis();
  };
  
  const handlePrescriptionUpload = (file: File) => {
    setPrescriptionFile(file);
    refetchImageAnalysis();
  };
  
  const handleExport = () => {
    const element = document.createElement('a');
    const file = new Blob([analysisResult], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'medication-analysis.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: 'Analysis Exported',
      description: 'Your medication analysis has been downloaded.',
    });
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Medication Analysis',
          text: analysisResult,
        });
      } else {
        await navigator.clipboard.writeText(analysisResult);
        toast({
          title: 'Copied to Clipboard',
          description: 'Medication analysis has been copied to clipboard.',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const isLoading = isTextAnalysisLoading || isImageAnalysisLoading;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/80 to-primary p-6 rounded-lg text-primary-foreground"
      >
        <h1 className="text-3xl font-bold mb-2">Medication Analyzer</h1>
        <p className="text-primary-foreground/90 max-w-3xl">
          Get comprehensive information about medications, including uses, dosage, side effects, 
          contraindications, and potential drug interactions. You can enter a medication name 
          or upload a prescription image for analysis.
        </p>
      </motion.div>
      
      <Alert variant="warning" className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle>Important Information</AlertTitle>
        <AlertDescription>
          This tool provides general information about medications and is not a substitute for professional 
          medical advice. Always consult with a healthcare provider before taking any medication.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span>Medication Name</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Prescription Image</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Medication</CardTitle>
              <CardDescription>
                Enter the name of a medication to get detailed information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Input
                  placeholder="Enter medication name (e.g., Aspirin, Lisinopril)"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <Input
                  placeholder="Patient information (optional: age, weight, existing conditions)"
                  value={patientInfo}
                  onChange={(e) => setPatientInfo(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                onClick={handleAnalyzeMedication} 
                disabled={isLoading || !medicationName}
                className="w-full"
              >
                {isTextAnalysisLoading ? (
                  <>
                    <LoadingIndicator size="sm" className="mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Analyze Medication
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="image" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Prescription</CardTitle>
              <CardDescription>
                Upload an image of your prescription for AI-powered analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                onImageUpload={handlePrescriptionUpload}
                acceptedFileTypes={['image/jpeg', 'image/png', 'image/gif']}
                maxSize={5 * 1024 * 1024}
                label="Upload Prescription Image"
                isLoading={isImageAnalysisLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <LoadingIndicator size="lg" />
          </div>
        ) : analysisResult ? (
          <ResultCard
            title={activeTab === 'text' ? `Analysis: ${medicationName}` : 'Prescription Analysis'}
            onDownload={handleExport}
            onShare={handleShare}
          >
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap">{analysisResult}</div>
            </div>
          </ResultCard>
        ) : null}
      </div>
    </div>
  );
};

export default MedicationAnalyzer;
