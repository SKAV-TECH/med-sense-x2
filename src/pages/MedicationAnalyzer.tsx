
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Pill, Search, Upload, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { analyzeMedication, analyzePrescriptionImage } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import ImageUploader from '@/components/UI/ImageUploader';
import LoadingIndicator from '@/components/UI/LoadingIndicator';
import ResultCard from '@/components/UI/ResultCard';
import TextToSpeechButton from '@/components/UI/TextToSpeechButton';

const MedicationAnalyzer: React.FC = () => {
  const { addRecentActivity } = useApp();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('text');
  const [medicationName, setMedicationName] = useState('');
  const [patientInfo, setPatientInfo] = useState('');
  const [prescriptionImage, setPrescriptionImage] = useState<File | null>(null);
  const [medicationAnalysis, setMedicationAnalysis] = useState('');
  
  // Text medication analysis query
  const { isLoading: isAnalyzingText, refetch: analyzeTextMedication } = useQuery({
    queryKey: ['medication', medicationName, patientInfo],
    queryFn: async () => {
      if (!medicationName) {
        throw new Error('Medication name is required.');
      }
      
      const result = await analyzeMedication(medicationName, patientInfo);
      setMedicationAnalysis(result);
      addRecentActivity(`Analyzed medication: ${medicationName}`);
      return result;
    },
    enabled: false,
    retry: 1,
    meta: {
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to analyze medication',
          variant: 'destructive',
        });
      }
    }
  });
  
  // Image medication analysis query
  const { isLoading: isAnalyzingImage, refetch: analyzeImageMedication } = useQuery({
    queryKey: ['prescriptionImage', prescriptionImage],
    queryFn: async () => {
      if (!prescriptionImage) {
        throw new Error('Prescription image is required.');
      }
      
      const result = await analyzePrescriptionImage(prescriptionImage);
      setMedicationAnalysis(result);
      addRecentActivity(`Analyzed prescription image: ${prescriptionImage.name}`);
      return result;
    },
    enabled: false,
    retry: 1,
    meta: {
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to analyze prescription image',
          variant: 'destructive',
        });
      }
    }
  });
  
  const handleTextAnalyze = async () => {
    if (!medicationName) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a medication name.',
        variant: 'destructive',
      });
      return;
    }
    
    await analyzeTextMedication();
  };
  
  const handleImageAnalyze = async () => {
    if (!prescriptionImage) {
      toast({
        title: 'Missing Information',
        description: 'Please upload a prescription image.',
        variant: 'destructive',
      });
      return;
    }
    
    await analyzeImageMedication();
  };
  
  const handleExport = () => {
    const element = document.createElement('a');
    const file = new Blob([medicationAnalysis], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'medication-analysis.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: 'Analysis Exported',
      description: 'Medication analysis has been downloaded.',
    });
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Medication Analysis',
          text: medicationAnalysis,
        });
      } else {
        await navigator.clipboard.writeText(medicationAnalysis);
        toast({
          title: 'Copied to Clipboard',
          description: 'Medication analysis has been copied to clipboard.',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const popularMedications = [
    'Aspirin', 'Acetaminophen', 'Ibuprofen', 'Lisinopril', 'Atorvastatin',
    'Metformin', 'Amlodipine', 'Metoprolol', 'Omeprazole', 'Levothyroxine'
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-lg text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">Medication Analyzer</h1>
        <p className="text-white/90 max-w-3xl">
          Get detailed information about medications, including uses, dosages, side effects, 
          contraindications, and potential drug interactions. Upload prescription images or 
          enter medication names to receive comprehensive analysis.
        </p>
      </motion.div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg">
              <TabsTrigger value="text" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950">Text Input</TabsTrigger>
              <TabsTrigger value="image" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950">Prescription Image</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text">
              <Card className="shadow-md border-0">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-amber-500" />
                    <span>Medication Information</span>
                  </CardTitle>
                  <CardDescription>
                    Enter a medication name to get detailed information
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Medication Name</label>
                    <Input
                      placeholder="Enter medication name"
                      value={medicationName}
                      onChange={(e) => setMedicationName(e.target.value)}
                      className="border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {popularMedications.map((med) => (
                      <Badge 
                        key={med}
                        variant="outline"
                        className="cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                        onClick={() => setMedicationName(med)}
                      >
                        {med}
                      </Badge>
                    ))}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Patient Information (Optional)</label>
                    <Textarea
                      placeholder="Enter relevant patient information (age, weight, allergies, other medications, etc.)"
                      value={patientInfo}
                      onChange={(e) => setPatientInfo(e.target.value)}
                      className="resize-none border-slate-200 dark:border-slate-700"
                      rows={4}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleTextAnalyze} 
                    disabled={isAnalyzingText || !medicationName}
                    className="w-full mt-2 bg-amber-600 hover:bg-amber-700"
                  >
                    {isAnalyzingText ? (
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
            
            <TabsContent value="image">
              <Card className="shadow-md border-0">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-amber-500" />
                    <span>Prescription Image</span>
                  </CardTitle>
                  <CardDescription>
                    Upload a prescription or medication label image for analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <ImageUploader
                    onImageUpload={setPrescriptionImage}
                    acceptedFileTypes={['image/jpeg', 'image/png', 'image/gif']}
                    maxSize={10 * 1024 * 1024}
                    label="Upload Prescription Image"
                    isLoading={isAnalyzingImage}
                  />
                  
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-md border border-amber-100 dark:border-amber-900/30">
                    <h3 className="text-sm font-medium mb-2 text-amber-700 dark:text-amber-300">Image Tips:</h3>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <li>• Ensure the image is clear and well-lit</li>
                      <li>• Make sure all text is legible</li>
                      <li>• Include the entire prescription or medication label</li>
                      <li>• Remove or blur out personal identifying information</li>
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={handleImageAnalyze} 
                    disabled={isAnalyzingImage || !prescriptionImage}
                    className="w-full mt-2 bg-amber-600 hover:bg-amber-700"
                  >
                    {isAnalyzingImage ? (
                      <>
                        <LoadingIndicator size="sm" className="mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5" />
                        Analyze Prescription
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isAnalyzingText || isAnalyzingImage ? (
            <div className="h-full flex items-center justify-center">
              <LoadingIndicator size="lg" />
            </div>
          ) : medicationAnalysis ? (
            <ResultCard
              title="Medication Analysis"
              onDownload={handleExport}
              onShare={handleShare}
              extraButtons={
                <TextToSpeechButton text={medicationAnalysis} />
              }
            >
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap">{medicationAnalysis}</div>
              </div>
            </ResultCard>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border rounded-lg border-dashed bg-slate-50 dark:bg-slate-800/20">
              <Pill className="h-12 w-12 text-amber-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Medication Analysis Yet</h3>
              <p className="text-muted-foreground mb-4">
                Enter a medication name or upload a prescription image to receive a detailed analysis.
              </p>
            </div>
          )}
        </motion.div>
      </div>
      
      <div className="flex items-start p-4 bg-slate-50 dark:bg-slate-800/20 rounded-lg border shadow-sm">
        <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-lg font-medium mb-1 text-amber-700 dark:text-amber-300">Medical Disclaimer</h3>
          <p className="text-sm text-muted-foreground">
            The information provided by this medication analyzer is for informational purposes only and 
            is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the 
            advice of your physician or other qualified health provider regarding any medication or 
            treatment. Never disregard professional medical advice or delay in seeking it because of 
            something you have read on this application.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicationAnalyzer;
