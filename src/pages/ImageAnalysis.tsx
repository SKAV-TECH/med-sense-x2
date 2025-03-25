
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileImage, AlertCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import ImageUploader from '@/components/UI/ImageUploader';
import LoadingIndicator from '@/components/UI/LoadingIndicator';
import ResultCard from '@/components/UI/ResultCard';
import { analyzeMedicalImage } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import TextToSpeechButton from '@/components/UI/TextToSpeechButton';
import { Badge } from '@/components/ui/badge';
import DetailedViewToggle from '@/components/UI/DetailedViewToggle';

const ImageAnalysis: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [customPrompt, setCustomPrompt] = useState(
    "Analyze this medical image in detail. Identify any visible abnormalities, potential diagnoses, severity level (low, medium, high), and recommendations for further tests or treatments. Format the response with clear sections."
  );
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [isDetailedView, setIsDetailedView] = useState(false);
  
  const { addActivity } = useApp();
  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    setSelectedImage(file);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast({
        title: 'No image selected',
        description: 'Please upload an image before analyzing.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await analyzeMedicalImage(selectedImage, customPrompt, isDetailedView);
      setAnalysisResult(result);
      addActivity(`Analyzed medical image: ${selectedImage.name}`);
      setActiveTab('results');
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'An error occurred during analysis.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadResults = () => {
    if (!analysisResult) return;
    
    const element = document.createElement('a');
    const file = new Blob([analysisResult], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `analysis_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const predefinedPrompts = [
    "Analyze this medical image in detail. Identify any visible abnormalities, potential diagnoses, severity level (low, medium, high), and recommendations for further tests or treatments. Format the response with clear sections.",
    "Provide a radiologist-style report for this medical image, including findings, impressions, and recommendations.",
    "Analyze this medical image and explain the findings in simple terms that a patient would understand.",
    "Identify any abnormalities in this medical image and provide differential diagnoses with probability scores."
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-lg text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">Medical Image Analysis</h1>
        <p className="text-white/90 mt-2">
          Upload medical images for AI-powered analysis and disease detection
        </p>
      </motion.div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg">
          <TabsTrigger value="upload" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950">Upload Image</TabsTrigger>
          <TabsTrigger value="results" disabled={!analysisResult} className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950">
            Analysis Results
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="overflow-hidden shadow-md border-0">
              <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                <CardTitle className="flex items-center">
                  <FileImage className="mr-2 text-purple-500" size={20} />
                  Upload Medical Image
                </CardTitle>
                <CardDescription>
                  Upload X-rays, MRIs, CT scans, or pathology slides for analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ImageUploader
                  onImageUpload={handleImageUpload}
                  acceptedFileTypes={['image/jpeg', 'image/png', 'image/gif']}
                  isLoading={isLoading}
                />
                
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">
                    Analysis Instructions
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {predefinedPrompts.map((prompt, index) => (
                      <Badge 
                        key={index}
                        variant={prompt === customPrompt ? "default" : "outline"}
                        className="cursor-pointer hover:bg-purple-100 dark:hover:bg-slate-800"
                        onClick={() => setCustomPrompt(prompt)}
                      >
                        Prompt {index + 1}
                      </Badge>
                    ))}
                  </div>
                  <Textarea
                    placeholder="Enter specific instructions for the analysis..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="resize-none border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    rows={4}
                  />
                </div>
                
                <DetailedViewToggle 
                  isDetailed={isDetailedView}
                  onChange={setIsDetailedView}
                  className="mt-4"
                />
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={!selectedImage || isLoading}
                    className="relative overflow-hidden bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? (
                      <>
                        <LoadingIndicator size="sm" className="mr-2" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <span>Analyze Image</span>
                        <ArrowRight className="ml-2" size={16} />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md border-0">
              <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                <CardTitle className="flex items-center">
                  <AlertCircle className="mr-2 text-purple-500" size={20} />
                  Important Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 list-disc pl-5 text-slate-700 dark:text-slate-300">
                  <li>Ensure images are clear and well-lit for the best analysis results</li>
                  <li>Remove any personal identifying information from the images</li>
                  <li>The analysis is meant to assist, not replace professional medical advice</li>
                  <li>Supported file types: JPEG, PNG, GIF</li>
                  <li>Maximum file size: 10MB</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="results">
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ResultCard
                title="Analysis Results"
                onDownload={handleDownloadResults}
                onShare={() => {}}
                extraButtons={
                  <TextToSpeechButton text={analysisResult} showLabel />
                }
              >
                <div className="whitespace-pre-wrap text-sm">
                  {analysisResult}
                </div>
              </ResultCard>
              
              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedImage(null);
                    setAnalysisResult(null);
                    setActiveTab('upload');
                  }}
                  className="mr-2"
                >
                  Start New Analysis
                </Button>
              </div>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageAnalysis;
