
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileSearch, MessageCircle, Clipboard, Pill, Video, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonPro } from '@/components/ui/button-pro';

const features = [
  {
    title: 'AI Image Analysis',
    description: 'Upload medical images for advanced AI diagnosis and insights.',
    icon: FileSearch,
    path: '/image-analysis',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Medical Assistant',
    description: 'Chat with our AI medical assistant for quick health information.',
    icon: MessageCircle,
    path: '/chat-assistant',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400',
  },
  {
    title: 'Treatment Planner',
    description: 'Get personalized treatment plans based on your medical history.',
    icon: Clipboard,
    path: '/treatment-planner',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
  {
    title: 'Medication Safety',
    description: 'Check medication information, conflicts, and safety profiles.',
    icon: Pill,
    path: '/medication-analyzer',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    title: 'Video Resources',
    description: 'Access educational medical videos related to your conditions.',
    icon: Video,
    path: '/video-resources',
    color: 'bg-red-500/10 text-red-600 dark:text-red-400',
  },
  {
    title: 'Health Reports',
    description: 'Upload and analyze your medical reports with AI assistance.',
    icon: BarChart,
    path: '/reports',
    color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  },
];

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="pb-12 md:pb-16">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-gradient">AI-powered</span> Healthcare<br />Diagnosis & Treatment
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Leveraging cutting-edge AI technology to provide early disease detection, 
            medical consultations, and personalized treatment planning.
          </motion.p>
        </div>
        
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="pro-card overflow-hidden"
              onClick={() => navigate(feature.path)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <CardHeader className="pb-2">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                    <feature.icon size={24} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ButtonPro variant="ghost" className="group p-0">
                    Learn more <ArrowRight className="transition-transform group-hover:translate-x-1" />
                  </ButtonPro>
                </CardContent>
              </motion.div>
            </Card>
          ))}
        </motion.div>
      </section>
      
      {/* Featured section */}
      <section className="mt-12 bg-muted py-12 -mx-8 px-8 rounded-xl">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Why Choose MedClauseX?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Data Privacy</h3>
              <p className="text-muted-foreground">Your medical data is securely encrypted and never shared with third parties.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                  <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Medical Accuracy</h3>
              <p className="text-muted-foreground">AI models trained on vast medical datasets for reliable diagnoses and recommendations.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Personalized Care</h3>
              <p className="text-muted-foreground">Tailored medical insights based on your unique health profile and history.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
