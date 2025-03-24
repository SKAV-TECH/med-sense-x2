
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileImage, MessageCircle, Clipboard, Pill, Video, BarChart } from 'lucide-react';
import FeatureCard from '@/components/UI/FeatureCard';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userData, recentActivities } = useApp();
  
  const features = [
    {
      title: 'Image Analysis',
      description: 'Upload X-rays, MRIs, CT scans, and pathology slides for AI-based disease detection.',
      icon: FileImage,
      path: '/image-analysis',
    },
    {
      title: 'Medical Assistant',
      description: 'Chat with our AI medical assistant to get answers to your health-related questions.',
      icon: MessageCircle,
      path: '/chat-assistant',
    },
    {
      title: 'Treatment Planner',
      description: 'Get personalized treatment plans based on your symptoms and medical history.',
      icon: Clipboard,
      path: '/treatment-planner',
    },
    {
      title: 'Medication Safety',
      description: 'Analyze medications for safety, interactions, and side effects.',
      icon: Pill,
      path: '/medication-analyzer',
    },
    {
      title: 'Video Resources',
      description: 'Discover curated medical videos with AI-generated summaries.',
      icon: Video,
      path: '/video-resources',
    },
    {
      title: 'Health Reports',
      description: 'View comprehensive reports with risk assessments and visualizations.',
      icon: BarChart,
      path: '/reports',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/80 to-primary p-6 text-primary-foreground shadow-lg"
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome to MedClauseX</h1>
          <p className="text-primary-foreground/90 max-w-2xl">
            Your intelligent healthcare companion powered by AI. Explore our features to get started
            with diagnoses, treatment planning, and health insights.
          </p>
          <Button 
            className="mt-4 bg-white text-primary hover:bg-white/90" 
            onClick={() => navigate(userData.name ? '/image-analysis' : '/settings')}
          >
            {userData.name ? 'Start Diagnosis' : 'Complete Your Profile'}
          </Button>
        </div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-white/10 blur-xl"></div>
        </div>
      </motion.div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-6">Our Features</h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                buttonText="Explore"
                onClick={() => navigate(feature.path)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {recentActivities.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Recent Activities</h2>
          <div className="bg-card rounded-lg shadow p-4">
            <ul className="space-y-2">
              {recentActivities.map((activity, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-md bg-accent text-accent-foreground text-sm"
                >
                  {activity}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
