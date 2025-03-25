
import React, { useState } from 'react';
import { FileImage, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    "Analyze this medical image in detail. Identify any visible abnormalities, potential diagnoses, severity level, and recommendations."
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
    "Analyze this medical image in detail. Identify any visible abnormalities, potential diagnoses, severity level, and recommendations.",
    "Provide a radiologist-style report for this medical image, including findings, impressions, and recommendations.",
    "Analyze this medical image and explain the findings in simple terms that a patient would understand.",
    "Identify any abnormalities in this medical image and provide differential diagnoses with probability scores."
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-medium mb-2">Medical Image Analysis</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Upload medical images for AI-powered analysis
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger value="results" disabled={!analysisResult}>
            Analysis Results
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileImage className="mr-2" size={18} />
                  Upload Medical Image
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                        className="cursor-pointer"
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
                    className="resize-none"
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
            
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Important Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 list-disc pl-5 text-slate-600 dark:text-slate-400">
                  <li>Ensure images are clear and well-lit for the best analysis results</li>
                  <li>Remove any personal identifying information from the images</li>
                  <li>The analysis is meant to assist, not replace professional medical advice</li>
                  <li>Supported file types: JPEG, PNG, GIF</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="results">
          {analysisResult && (
            <div>
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
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageAnalysis;
