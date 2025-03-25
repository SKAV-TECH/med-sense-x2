
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileImage, FileText, Video, Pill, FileTerminal, AlignJustify } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const features = [
    {
      icon: <FileImage className="h-10 w-10 text-purple-500" />,
      title: "Medical Image Analysis",
      description: "Upload X-rays, MRIs, or other medical images for AI-powered analysis and diagnosis suggestions.",
      link: "/image-analysis",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: <FileText className="h-10 w-10 text-teal-500" />,
      title: "Treatment Planner",
      description: "Generate personalized treatment plans based on patient information and symptoms.",
      link: "/treatment-planner",
      color: "from-teal-500 to-green-600"
    },
    {
      icon: <Video className="h-10 w-10 text-blue-500" />,
      title: "Video Resources",
      description: "Access expert medical videos on various health topics with AI-generated summaries.",
      link: "/video-resources",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Pill className="h-10 w-10 text-rose-500" />,
      title: "Medication Analyzer",
      description: "Get detailed information about medications, potential interactions, and safety considerations.",
      link: "/medication-analyzer",
      color: "from-rose-500 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">AI-Powered Healthcare Assistant</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Analyze medical images, generate treatment plans, and access expert medical resources using advanced AI technology.
          </p>
          
          <div className="mt-6 flex justify-center">
            <Badge variant="outline" className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 flex items-center gap-1">
              <AlignJustify className="h-3.5 w-3.5" />
              <span>New! Concise Mode Available</span>
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className={`p-4 rounded-lg bg-gradient-to-br ${feature.color} mb-4 self-start`}>
                    {feature.icon}
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{feature.description}</p>
                  <Link to={feature.link}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-lg border text-center"
        >
          <h2 className="text-2xl font-bold mb-3 flex items-center justify-center">
            <FileTerminal className="h-6 w-6 mr-2 text-primary" />
            <span>New Feature: Concise Content Mode</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Toggle between detailed and concise views across the application. When enabled, AI-generated content will be summarized to approximately 50 words, making it easier to quickly grasp essential information.
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
