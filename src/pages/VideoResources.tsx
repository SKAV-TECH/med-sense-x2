
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Video, Search, Youtube, FileText, Play, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { searchYouTubeVideos, summarizeYouTubeVideo, getRecommendedVideos } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import LoadingIndicator from '@/components/UI/LoadingIndicator';
import ResultCard from '@/components/UI/ResultCard';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
}

const VideoResources: React.FC = () => {
  const { recentActivities, addRecentActivity } = useApp();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [videoSummary, setVideoSummary] = useState('');
  const [activeTab, setActiveTab] = useState('recommended');
  
  // Query for video search
  const { isLoading: isSearchLoading, refetch: refetchSearch } = useQuery({
    queryKey: ['videoSearch', searchQuery],
    queryFn: async () => {
      if (!searchQuery) {
        throw new Error('Search query is required.');
      }
      
      const results = await searchYouTubeVideos(searchQuery);
      setVideos(results);
      addRecentActivity(`Searched for medical videos: ${searchQuery}`);
      return results;
    },
    enabled: false,
    retry: 1,
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to search videos',
        variant: 'destructive',
      });
    },
  });
  
  // Query for recommended videos
  const { isLoading: isRecommendedLoading, refetch: refetchRecommended } = useQuery({
    queryKey: ['recommendedVideos', recentActivities],
    queryFn: async () => {
      if (!recentActivities.length) {
        throw new Error('No recent activities found.');
      }
      
      const results = await getRecommendedVideos(recentActivities);
      setVideos(results);
      return results;
    },
    enabled: false,
    retry: 1,
    onError: (error) => {
      console.error('Error fetching recommended videos:', error);
    },
  });
  
  // Query for video summary
  const { isLoading: isSummaryLoading, refetch: refetchSummary } = useQuery({
    queryKey: ['videoSummary', selectedVideo?.id],
    queryFn: async () => {
      if (!selectedVideo) {
        throw new Error('No video selected.');
      }
      
      const summary = await summarizeYouTubeVideo(selectedVideo.id, selectedVideo.title);
      setVideoSummary(summary);
      addRecentActivity(`Viewed summary of video: ${selectedVideo.title.substring(0, 30)}...`);
      return summary;
    },
    enabled: false,
    retry: 1,
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to summarize video',
        variant: 'destructive',
      });
    },
  });
  
  useEffect(() => {
    if (activeTab === 'recommended' && recentActivities.length > 0) {
      refetchRecommended();
    }
  }, [activeTab, recentActivities, refetchRecommended]);
  
  const handleSearch = () => {
    if (!searchQuery) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a search query.',
        variant: 'destructive',
      });
      return;
    }
    
    refetchSearch();
  };
  
  const handleVideoSelect = (video: VideoItem) => {
    setSelectedVideo(video);
    refetchSummary();
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedVideo(null);
    setVideoSummary('');
    
    if (value === 'recommended' && recentActivities.length > 0) {
      refetchRecommended();
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const isLoading = isSearchLoading || isRecommendedLoading || isSummaryLoading;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/80 to-primary p-6 rounded-lg text-primary-foreground"
      >
        <h1 className="text-3xl font-bold mb-2">Video Resources</h1>
        <p className="text-primary-foreground/90 max-w-3xl">
          Discover curated medical videos with AI-generated summaries. Search for specific topics or 
          get recommendations based on your recent activities within the platform.
        </p>
      </motion.div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recommended" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span>Recommended Videos</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Search Videos</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Medical Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter a medical topic, condition, or treatment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isLoading || !searchQuery}>
                  {isSearchLoading ? (
                    <LoadingIndicator size="sm" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommended" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Based on Your Activities</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivities.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">
                    No recent activities found. Try using some features of the platform first.
                  </p>
                </div>
              ) : isRecommendedLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingIndicator size="lg" />
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Videos</h2>
            
            {isSearchLoading || isRecommendedLoading ? (
              <div className="flex justify-center py-12">
                <LoadingIndicator size="lg" />
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center p-8 border rounded-lg border-dashed">
                <Youtube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Videos Found</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'search'
                    ? 'Try searching for a different medical topic.'
                    : 'Try performing some actions in the system to get recommendations.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {videos.map((video) => (
                  <Card 
                    key={video.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedVideo?.id === video.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="grid grid-cols-[120px_1fr] overflow-hidden">
                      <div className="relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {video.channelTitle} • {formatDate(video.publishedAt)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {selectedVideo ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Video Summary</h2>
              
              <div className="aspect-video w-full rounded-lg overflow-hidden">
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
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{selectedVideo.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    {selectedVideo.channelTitle} • {formatDate(selectedVideo.publishedAt)}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${selectedVideo.id}`, '_blank')}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Watch on YouTube
                  </Button>
                </CardFooter>
              </Card>
              
              {isSummaryLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingIndicator size="lg" />
                </div>
              ) : videoSummary ? (
                <ResultCard title="AI-Generated Summary">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap">{videoSummary}</div>
                  </div>
                </ResultCard>
              ) : null}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border rounded-lg border-dashed">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Video Selected</h3>
              <p className="text-muted-foreground mb-4">
                Select a video from the list to view the AI-generated summary.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VideoResources;
