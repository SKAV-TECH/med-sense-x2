
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FileText, Upload, BarChart, Download, Share2, Volume } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { analyzeHealthReport } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import ImageUploader from '@/components/UI/ImageUploader';
import LoadingIndicator from '@/components/UI/LoadingIndicator';
import ResultCard from '@/components/UI/ResultCard';
import TextToSpeechButton from '@/components/UI/TextToSpeechButton';

const HealthReports: React.FC = () => {
  const { addRecentActivity } = useApp();
  const { toast } = useToast();
  
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportAnalysis, setReportAnalysis] = useState('');
  
  // Query for health report analysis
  const { isLoading, refetch } = useQuery({
    queryKey: ['healthReport', reportFile],
    queryFn: async () => {
      if (!reportFile) {
        throw new Error('Report file is required.');
      }
      
      const result = await analyzeHealthReport(reportFile);
      setReportAnalysis(result);
      addRecentActivity(`Analyzed health report: ${reportFile.name}`);
      return result;
    },
    enabled: false,
    retry: 1,
    meta: {
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to analyze health report',
          variant: 'destructive',
        });
      }
    }
  });
  
  const handleFileUpload = (file: File) => {
    setReportFile(file);
  };
  
  const handleAnalyze = () => {
    if (!reportFile) {
      toast({
        title: 'No file selected',
        description: 'Please upload a medical report before analyzing.',
        variant: 'destructive',
      });
      return;
    }
    refetch();
  };
  
  const handleExport = () => {
    const element = document.createElement('a');
    const file = new Blob([reportAnalysis], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'health-report-analysis.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: 'Analysis Exported',
      description: 'Your health report analysis has been downloaded.',
    });
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Health Report Analysis',
          text: reportAnalysis,
        });
      } else {
        await navigator.clipboard.writeText(reportAnalysis);
        toast({
          title: 'Copied to Clipboard',
          description: 'Health report analysis has been copied to clipboard.',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-lg text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">Health Reports</h1>
        <p className="text-white/90 max-w-3xl">
          Upload and analyze your medical reports such as X-rays, MRIs, CT scans, lab results, and other
          health documents. Our AI will generate a comprehensive summary with key findings, diagnoses, 
          causes, treatment plans, and follow-up recommendations.
        </p>
      </motion.div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-md border-0 overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" />
                <span>Upload Medical Report</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Upload your medical reports in image format (JPG, PNG) or PDF. 
                  Our AI will analyze the content and provide you with a comprehensive summary.
                </p>
                
                <ImageUploader
                  onImageUpload={handleFileUpload}
                  acceptedFileTypes={['image/jpeg', 'image/png', 'application/pdf']}
                  maxSize={10 * 1024 * 1024}
                  label="Upload Medical Report"
                  isLoading={isLoading}
                />
                
                <Button 
                  onClick={handleAnalyze} 
                  disabled={!reportFile || isLoading}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
                >
                  {isLoading ? (
                    <>
                      <LoadingIndicator size="sm" className="mr-2" />
                      Analyzing Report...
                    </>
                  ) : (
                    <>
                      <BarChart className="mr-2 h-5 w-5" />
                      Analyze Report
                    </>
                  )}
                </Button>
                
                <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-md mt-4">
                  <h3 className="text-sm font-medium mb-2 text-indigo-700 dark:text-indigo-300">Supported Report Types:</h3>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>X-ray reports</li>
                    <li>MRI reports</li>
                    <li>CT scan reports</li>
                    <li>Laboratory test results</li>
                    <li>Pathology reports</li>
                    <li>Doctor's prescription</li>
                    <li>Discharge summaries</li>
                  </ul>
                </div>
              </div>
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
          ) : reportAnalysis ? (
            <ResultCard
              title="Report Analysis"
              onDownload={handleExport}
              onShare={handleShare}
              extraButtons={
                <TextToSpeechButton text={reportAnalysis} />
              }
            >
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap">{reportAnalysis}</div>
              </div>
            </ResultCard>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border rounded-lg border-dashed bg-slate-50 dark:bg-slate-800/20">
              <BarChart className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Report Analysis Yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload a medical report and click "Analyze Report" to receive an AI-generated analysis with key findings,
                diagnoses, and recommendations.
              </p>
            </div>
          )}
        </motion.div>
      </div>
      
      <div className="mt-8 bg-slate-50 dark:bg-slate-800/20 rounded-lg p-5 border shadow-sm">
        <h3 className="text-lg font-medium mb-2 text-indigo-700 dark:text-indigo-300">Disclaimer</h3>
        <p className="text-sm text-muted-foreground">
          The report analysis provided by our AI is for informational purposes only and is not a substitute for 
          professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other 
          qualified health provider with any questions you may have regarding your medical reports or health condition.
        </p>
      </div>
    </div>
  );
};

export default HealthReports;
