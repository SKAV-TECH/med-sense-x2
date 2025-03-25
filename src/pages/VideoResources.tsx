
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Search, Youtube, ExternalLink, PlaySquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { searchYouTubeVideos, summarizeYouTubeVideo, getRecommendedVideos } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import LoadingIndicator from '@/components/UI/LoadingIndicator';
import ResultCard from '@/components/UI/ResultCard';
import TextToSpeechButton from '@/components/UI/TextToSpeechButton';
import ConciseToggle from '@/components/UI/ConciseToggle';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
}

const VideoResources: React.FC = () => {
  const { addRecentActivity, recentActivities } = useApp();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videoSummary, setVideoSummary] = useState('');
  const [isConcise, setIsConcise] = useState(false);
  
  // Search videos query
  const { isLoading: isSearching, refetch: searchVideos } = useQuery({
    queryKey: ['searchVideos', searchQuery],
    queryFn: async () => {
      if (!searchQuery) {
        throw new Error('Search query is required');
      }
      
      const results = await searchYouTubeVideos(searchQuery);
      setVideos(results);
      addRecentActivity(`Searched for medical videos: ${searchQuery}`);
      return results;
    },
    enabled: false,
    retry: 1,
    meta: {
      onError: (error: Error) => {
        toast({
          title: 'Search Failed',
          description: error.message || 'Failed to search for videos',
          variant: 'destructive',
        });
      }
    }
  });
  
  // Recommend videos query
  const { isLoading: isRecommending, refetch: fetchRecommendedVideos } = useQuery({
    queryKey: ['recommendVideos', recentActivities],
    queryFn: async () => {
      if (recentActivities.length === 0) {
        throw new Error('No recent activities found');
      }
      
      const results = await getRecommendedVideos(recentActivities);
      setVideos(results);
      return results;
    },
    enabled: false,
    retry: 1,
    meta: {
      onError: (error: Error) => {
        toast({
          title: 'Recommendation Failed',
          description: error.message || 'Failed to recommend videos',
          variant: 'destructive',
        });
      }
    }
  });
  
  // Summarize video query
  const { isLoading: isSummarizing, refetch: summarizeVideo } = useQuery({
    queryKey: ['summarizeVideo', selectedVideo?.id, isConcise],
    queryFn: async () => {
      if (!selectedVideo) {
        throw new Error('No video selected');
      }
      
      const summary = await summarizeYouTubeVideo(selectedVideo.id, selectedVideo.title, isConcise);
      setVideoSummary(summary);
      addRecentActivity(`Watched medical video: ${selectedVideo.title}`);
      return summary;
    },
    enabled: false,
    retry: 1,
    meta: {
      onError: (error: Error) => {
        toast({
          title: 'Summarization Failed',
          description: error.message || 'Failed to summarize the video',
          variant: 'destructive',
        });
      }
    }
  });
  
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: 'Empty Search',
        description: 'Please enter a search term',
        variant: 'destructive',
      });
      return;
    }
    
    searchVideos();
  };
  
  const handleRecommend = () => {
    fetchRecommendedVideos();
  };
  
  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    setVideoSummary('');
    summarizeVideo();
  };
  
  const handleToggleConcise = (value: boolean) => {
    setIsConcise(value);
    if (selectedVideo && videoSummary) {
      // Re-summarize the video with the new concise setting
      summarizeVideo();
    }
  };
  
  useEffect(() => {
    // Load recommended videos on component mount
    if (recentActivities.length > 0) {
      fetchRecommendedVideos();
    }
  }, []);
  
  const popularSearches = [
    'diabetes management',
    'heart disease prevention',
    'mental health therapy',
    'cancer treatments',
    'arthritis pain relief',
    'hypertension management',
    'Covid-19 recovery',
    'sleep apnea'
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-lg text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">Medical Video Resources</h1>
        <p className="text-white/90 max-w-3xl">
          Access expert medical videos on various health topics. Search for specific conditions, 
          treatments, or get AI-recommended content based on your recent activities.
        </p>
      </motion.div>
      
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="shadow-md border-0">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                <span>Find Medical Videos</span>
              </CardTitle>
              <CardDescription>
                Search for videos on specific health topics or get recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search medical videos..."
                    className="border-slate-200 dark:border-slate-700"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSearching ? <LoadingIndicator size="sm" /> : <Search className="h-4 w-4 mr-2" />}
                  Search
                </Button>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Popular Searches:</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <Badge 
                      key={term}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                      onClick={() => {
                        setSearchQuery(term);
                        setTimeout(() => handleSearch(), 100);
                      }}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-5 flex justify-between items-center">
                <h3 className="text-sm font-medium">Recommended For You:</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRecommend}
                  disabled={isRecommending || recentActivities.length === 0}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20"
                >
                  {isRecommending ? <LoadingIndicator size="sm" /> : <Youtube className="h-4 w-4 mr-2" />}
                  Get Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-3">
            {videos.length > 0 ? (
              videos.map((video) => (
                <Card 
                  key={video.id} 
                  className={`cursor-pointer overflow-hidden transition-all hover:shadow-md ${
                    selectedVideo?.id === video.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                  onClick={() => handleSelectVideo(video)}
                >
                  <div className="flex md:flex-row flex-col">
                    <div className="md:w-[180px] w-full h-[120px] bg-slate-100 dark:bg-slate-800">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{video.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs text-muted-foreground">{video.channelTitle}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {new Date(video.publishedAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 border rounded-lg border-dashed bg-slate-50 dark:bg-slate-800/20">
                <Youtube className="h-10 w-10 mx-auto text-slate-400 mb-3" />
                <h3 className="text-lg font-medium mb-1">No Videos Found</h3>
                <p className="text-sm text-muted-foreground">
                  Search for videos or get recommendations based on your recent activities.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          {selectedVideo ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              <Card className="shadow-md border-0">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{selectedVideo.title}</CardTitle>
                    <ConciseToggle isConcise={isConcise} onChange={handleToggleConcise} />
                  </div>
                  <CardDescription>{selectedVideo.channelTitle} • {new Date(selectedVideo.publishedAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <a 
                    href={`https://www.youtube.com/watch?v=${selectedVideo.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center mb-3"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Watch on YouTube
                  </a>
                  
                  <h3 className="text-sm font-medium mb-2">AI Summary</h3>
                  
                  {isSummarizing ? (
                    <div className="py-12 flex flex-col items-center">
                      <LoadingIndicator size="lg" className="mb-3" />
                      <p className="text-sm text-muted-foreground">Generating video summary...</p>
                    </div>
                  ) : videoSummary ? (
                    <div className="relative">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div className="whitespace-pre-wrap">{videoSummary}</div>
                      </div>
                      <div className="absolute top-0 right-0">
                        <TextToSpeechButton text={videoSummary} />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Click "Summarize" to get an AI-generated summary of this video's content.</p>
                  )}
                </CardContent>
                {!videoSummary && !isSummarizing && (
                  <CardFooter className="px-6 pb-6">
                    <Button 
                      onClick={() => summarizeVideo()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <PlaySquare className="h-4 w-4 mr-2" />
                      Summarize
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border rounded-lg border-dashed bg-slate-50 dark:bg-slate-800/20">
              <Youtube className="h-16 w-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Video Selected</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Select a video from the list to view and get an AI-generated summary of its content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoResources;
