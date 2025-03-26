
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Search, Youtube, ExternalLink, PlaySquare, Video } from 'lucide-react';
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
      
      // Pass the YouTube URL to the API
      const videoUrl = `https://www.youtube.com/watch?v=${selectedVideo.id}`;
      const summary = await summarizeYouTubeVideo(
        selectedVideo.id, 
        selectedVideo.title, 
        isConcise,
        videoUrl
      );
      
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Typwriter effect for empty state
  const [typingText, setTypingText] = useState("");
  const fullText = "Select a video from the list to view and get an AI-generated summary of its content.";
  
  useEffect(() => {
    if (!selectedVideo && videos.length > 0) {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < fullText.length) {
          setTypingText(fullText.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 40);
      
      return () => clearInterval(typingInterval);
    }
  }, [videos, selectedVideo]);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 rounded-lg text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">Medical Video Resources</h1>
        <p className="text-white/90 max-w-3xl">
          Access expert medical videos on various health topics. Search for specific conditions, 
          treatments, or get AI-recommended content based on your recent activities.
        </p>
      </motion.div>
      
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="shadow-md border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
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
                    className="border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                  >
                    {isSearching ? <LoadingIndicator size="sm" /> : <Search className="h-4 w-4 mr-2" />}
                    Search
                  </Button>
                </motion.div>
              </div>
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mt-4"
              >
                <h3 className="text-sm font-medium mb-2">Popular Searches:</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <motion.div key={term} variants={itemVariants}>
                      <Badge 
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800 transition-all duration-300"
                        onClick={() => {
                          setSearchQuery(term);
                          setTimeout(() => handleSearch(), 100);
                        }}
                      >
                        {term}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <div className="mt-5 flex justify-between items-center">
                <h3 className="text-sm font-medium">Recommended For You:</h3>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                </motion.div>
              </div>
            </CardContent>
          </Card>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence>
              {videos.length > 0 ? (
                videos.map((video) => (
                  <motion.div
                    key={video.id}
                    variants={itemVariants}
                    layout
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Card 
                      className={`cursor-pointer overflow-hidden transition-all hover:shadow-md ${
                        selectedVideo?.id === video.id ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                      onClick={() => handleSelectVideo(video)}
                    >
                      <div className="flex md:flex-row flex-col">
                        <div className="md:w-[180px] w-full h-[120px] bg-slate-100 dark:bg-slate-800 relative overflow-hidden group">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <PlaySquare className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
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
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 border rounded-lg border-dashed bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10"
                >
                  <Youtube className="h-16 w-16 mx-auto text-indigo-400 mb-3" />
                  <h3 className="text-lg font-medium mb-1 text-indigo-600 dark:text-indigo-400">No Videos Found</h3>
                  <p className="text-sm text-muted-foreground">
                    Search for videos or get recommendations based on your recent activities.
                  </p>
                  <motion.div
                    className="mt-4"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Search className="h-5 w-5 mx-auto text-indigo-400" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        <div>
          {selectedVideo ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
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
              
              <Card className="shadow-md border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 pb-3">
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
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center mb-3"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Watch on YouTube
                  </a>
                  
                  <h3 className="text-sm font-medium mb-2">AI Summary</h3>
                  
                  {isSummarizing ? (
                    <div className="py-12 flex flex-col items-center">
                      <LoadingIndicator size="lg" className="mb-3 text-indigo-500" />
                      <p className="text-sm text-muted-foreground animate-pulse">Generating video summary...</p>
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
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full"
                    >
                      <Button 
                        onClick={() => summarizeVideo()}
                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all duration-300"
                      >
                        <PlaySquare className="h-4 w-4 mr-2" />
                        Summarize Video
                      </Button>
                    </motion.div>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="h-full flex flex-col items-center justify-center text-center p-12 border rounded-lg border-dashed bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/10 dark:to-violet-900/10"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >
                <Video className="h-20 w-20 text-indigo-400 mb-6" />
              </motion.div>
              <h3 className="text-xl font-medium mb-2 text-indigo-600 dark:text-indigo-400">No Video Selected</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {videos.length > 0 ? typingText : "Search for videos or get recommendations based on your recent activities."}
              </p>
              {videos.length > 0 && (
                <motion.div
                  className="mt-8 text-sm text-indigo-500 font-medium"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  ← Select a video from the list
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoResources;
