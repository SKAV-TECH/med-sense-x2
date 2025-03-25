
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { analyzeHealthReport } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import ImageUploader from '@/components/UI/ImageUploader';
import LoadingIndicator from '@/components/UI/LoadingIndicator';
import ResultCard from '@/components/UI/ResultCard';
import TextToSpeechButton from '@/components/UI/TextToSpeechButton';
import DetailedViewToggle from '@/components/UI/DetailedViewToggle';

const HealthReports: React.FC = () => {
  const { addRecentActivity } = useApp();
  const { toast } = useToast();
  
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportAnalysis, setReportAnalysis] = useState('');
  const [isDetailedView, setIsDetailedView] = useState(false);
  
  // Query for health report analysis
  const { isLoading, refetch } = useQuery({
    queryKey: ['healthReport', reportFile, isDetailedView],
    queryFn: async () => {
      if (!reportFile) {
        throw new Error('Report file is required.');
      }
      
      const result = await analyzeHealthReport(reportFile, isDetailedView);
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
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-medium mb-2">Health Reports</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Upload and analyze your medical reports using AI
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span>Upload Medical Report</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-slate-500">
                Upload your medical reports in image format (JPG, PNG) or PDF. 
              </p>
              
              <ImageUploader
                onImageUpload={handleFileUpload}
                acceptedFileTypes={['image/jpeg', 'image/png', 'application/pdf']}
                maxSize={10 * 1024 * 1024}
                label="Upload Medical Report"
                isLoading={isLoading}
              />
              
              <DetailedViewToggle 
                isDetailed={isDetailedView}
                onChange={setIsDetailedView}
                className="mt-4"
              />
              
              <Button 
                onClick={handleAnalyze} 
                disabled={!reportFile || isLoading}
                className="w-full mt-4"
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
            </div>
          </CardContent>
        </Card>
        
        <div>
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
                <TextToSpeechButton text={reportAnalysis} showLabel />
              }
            >
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap">{reportAnalysis}</div>
              </div>
            </ResultCard>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border rounded-lg border-dashed">
              <BarChart className="h-10 w-10 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Report Analysis Yet</h3>
              <p className="text-slate-500 mb-4">
                Upload a medical report and click "Analyze Report" to receive an AI summary.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 bg-slate-50 dark:bg-slate-800/20 rounded-lg p-4 border shadow-sm">
        <h3 className="text-md font-medium mb-2">Disclaimer</h3>
        <p className="text-sm text-slate-500">
          The report analysis provided by our AI is for informational purposes only and is not a substitute for 
          professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default HealthReports;
