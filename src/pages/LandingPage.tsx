
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileImage, 
  MessageCircle, 
  Clipboard, 
  Pill, 
  Video,
  ArrowRight,
  Shield,
  Brain,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const features = [
    {
      icon: <FileImage className="h-10 w-10 text-primary" />,
      title: "Medical Image Analysis",
      description: "Upload X-rays, MRIs, or other medical images for AI-powered analysis and diagnosis suggestions."
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-primary" />,
      title: "Medical Assistant",
      description: "Get answers to your medical questions with our AI-powered chat assistant."
    },
    {
      icon: <Clipboard className="h-10 w-10 text-primary" />,
      title: "Treatment Planner",
      description: "Receive personalized treatment plans based on your health information and symptoms."
    },
    {
      icon: <Pill className="h-10 w-10 text-primary" />,
      title: "Medication Analyzer",
      description: "Analyze medications for potential interactions, side effects, and safety considerations."
    },
    {
      icon: <Video className="h-10 w-10 text-primary" />,
      title: "Video Resources",
      description: "Access curated medical videos with AI-generated summaries on various health topics."
    }
  ];

  const benefits = [
    {
      icon: <Shield className="h-8 w-8 text-teal-500" />,
      title: "Secure & Private",
      description: "Your medical data stays private with our secure platform."
    },
    {
      icon: <Brain className="h-8 w-8 text-indigo-500" />,
      title: "AI-Powered Insights",
      description: "Advanced AI analysis provides accurate medical information."
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-amber-500" />,
      title: "User-Friendly",
      description: "Simple interface with complex medical terms translated for easy understanding."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      {/* Header/Navigation */}
      <header className="px-4 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-primary">MedClauseX</span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">Dashboard</Link>
          <Link to="/image-analysis" className="text-foreground hover:text-primary transition-colors">Image Analysis</Link>
          <Link to="/chat-assistant" className="text-foreground hover:text-primary transition-colors">Medical Assistant</Link>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/dashboard">
            <Button variant="outline" size="sm">Login</Button>
          </Link>
          <Link to="/dashboard">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-4 md:px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            AI-Powered Healthcare Assistant
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Analyze medical images, get personalized treatment plans, and access expert
            medical resources using advanced AI technology.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="px-8">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/image-analysis">
              <Button variant="outline" size="lg" className="px-8">
                Try Image Analysis
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Our AI Medical Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border"
            >
              <div className="mb-4 bg-primary/10 rounded-full p-3 inline-block">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 md:px-6 bg-accent/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose MedClauseX</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-lg p-6 shadow-md text-center border"
              >
                <div className="mb-4 flex justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-primary/10 rounded-2xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Experience AI-Powered Healthcare?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get started with MedClauseX today and transform your healthcare experience with
            cutting-edge AI technology.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="px-8">
              Get Started Now
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-6 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <span className="text-xl font-bold text-primary">MedClauseX</span>
            <p className="text-muted-foreground mt-2">AI-powered healthcare assistant</p>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/image-analysis" className="text-foreground hover:text-primary transition-colors">Image Analysis</Link>
            <Link to="/chat-assistant" className="text-foreground hover:text-primary transition-colors">Medical Assistant</Link>
            <Link to="/settings" className="text-foreground hover:text-primary transition-colors">Settings</Link>
          </div>
          <div>
            <p className="text-muted-foreground">© 2023 MedClauseX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
