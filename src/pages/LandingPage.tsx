
import React, { useState, useEffect } from 'react';
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
  const [typedText, setTypedText] = useState("");
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const headingPhrases = [
    "AI-Powered Healthcare Assistant",
    "Medical Analysis At Your Fingertips",
    "Personalized Health Solutions",
    "Your Digital Medical Companion"
  ];
  
  // Dynamic typing effect for heading
  useEffect(() => {
    const phrase = headingPhrases[currentPhrase];
    let charIndex = 0;
    let typingInterval: NodeJS.Timeout;
    let pauseTimeout: NodeJS.Timeout;
    
    // Typing forward function
    const typeForward = () => {
      if (charIndex <= phrase.length) {
        setTypedText(phrase.substring(0, charIndex));
        charIndex++;
      } else {
        // Pause at the end of typing before erasing
        clearInterval(typingInterval);
        pauseTimeout = setTimeout(() => {
          typingInterval = setInterval(typeBackward, 30);
        }, 2000);
      }
    };
    
    // Typing backward function
    const typeBackward = () => {
      if (charIndex > 0) {
        charIndex--;
        setTypedText(phrase.substring(0, charIndex));
      } else {
        // Move to next phrase
        clearInterval(typingInterval);
        setCurrentPhrase((prev) => (prev + 1) % headingPhrases.length);
        typingInterval = setInterval(typeForward, 100);
      }
    };
    
    // Start typing
    typingInterval = setInterval(typeForward, 100);
    
    // Cleanup
    return () => {
      clearInterval(typingInterval);
      clearTimeout(pauseTimeout);
    };
  }, [currentPhrase]);

  const features = [
    {
      icon: <FileImage className="h-10 w-10 text-violet-500" />,
      title: "Medical Image Analysis",
      description: "Upload X-rays, MRIs, or other medical images for AI-powered analysis and diagnosis suggestions."
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-purple-500" />,
      title: "Medical Assistant",
      description: "Get answers to your medical questions with our AI-powered chat assistant."
    },
    {
      icon: <Clipboard className="h-10 w-10 text-blue-500" />,
      title: "Treatment Planner",
      description: "Receive personalized treatment plans based on your health information and symptoms."
    },
    {
      icon: <Pill className="h-10 w-10 text-green-500" />,
      title: "Medication Analyzer",
      description: "Analyze medications for potential interactions, side effects, and safety considerations."
    },
    {
      icon: <Video className="h-10 w-10 text-indigo-500" />,
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
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700">Get Started</Button>
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 min-h-[4rem]">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600">
              {typedText}
            </span>
            <span className="animate-pulse">|</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Analyze medical images, get personalized treatment plans, and access expert
            medical resources using advanced AI technology.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="px-8 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/image-analysis">
              <Button variant="outline" size="lg" className="px-8 border-violet-300 text-violet-700 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-900/20">
                Try Image Analysis
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-violet-700 dark:text-violet-400">Our AI Medical Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-violet-100 dark:border-violet-900"
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
      <section className="py-20 px-4 md:px-6 bg-gradient-to-r from-violet-50 via-purple-50 to-blue-50 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-purple-700 dark:text-purple-400">Why Choose MedClauseX</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                className="bg-card rounded-lg p-6 shadow-md text-center border border-purple-100 dark:border-purple-900"
              >
                <motion.div 
                  className="mb-4 flex justify-center"
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  {benefit.icon}
                </motion.div>
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
          className="bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-blue-600/10 rounded-2xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-violet-700 dark:text-violet-400">Ready to Experience AI-Powered Healthcare?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get started with MedClauseX today and transform your healthcare experience with
            cutting-edge AI technology.
          </p>
          <Link to="/dashboard">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="px-8 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                Get Started Now
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-6 border-t border-violet-100 dark:border-violet-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <span className="text-xl font-bold text-primary">MedClauseX</span>
            <p className="text-muted-foreground mt-2">AI-powered healthcare assistant</p>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <Link to="/dashboard" className="text-foreground hover:text-violet-600 transition-colors">Dashboard</Link>
            <Link to="/image-analysis" className="text-foreground hover:text-violet-600 transition-colors">Image Analysis</Link>
            <Link to="/chat-assistant" className="text-foreground hover:text-violet-600 transition-colors">Medical Assistant</Link>
            <Link to="/settings" className="text-foreground hover:text-violet-600 transition-colors">Settings</Link>
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
