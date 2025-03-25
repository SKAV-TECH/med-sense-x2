
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, MicOff, User, InfoIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';
import ChatBubble from '@/components/UI/ChatBubble';
import { toast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ButtonPro } from '@/components/ui/button-pro';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// Define a type for speech recognition errors
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

const ChatAssistant: React.FC = () => {
  const { userData, addActivity } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your AI medical assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { speak } = useTextToSpeech();

  // Initialize speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  
  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      
      setInput(transcript);
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      toast({
        title: "Speech Recognition Error",
        description: `Error: ${event.message || event.error || "Unknown error"}`,
        variant: "destructive",
      });
    };
  }

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      content: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Record activity
    addActivity(`Asked medical assistant: ${input}`);
    
    try {
      // Call AI API with user context
      const userInfo = Object.entries(userData)
        .filter(([key, value]) => value !== undefined && value !== '')
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      
      const userContext = userInfo ? `User profile: ${userInfo}` : '';
      const prompt = `${userContext}\n\nUser query: ${input}`;
      
      // Simulate API response for demonstration
      setTimeout(() => {
        const responseContent = generateMockResponse(input);
        const botMessage: Message = {
          content: responseContent,
          isUser: false,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Mock response generator for demonstration
  const generateMockResponse = (query: string): string => {
    if (query.toLowerCase().includes('headache')) {
      return "Headaches can have many causes, from stress to dehydration, lack of sleep, or more serious conditions. For occasional headaches, rest, adequate hydration, and over-the-counter pain relievers may help. If you're experiencing frequent or severe headaches, it would be advisable to consult with a healthcare provider for a proper diagnosis.";
    }
    
    if (query.toLowerCase().includes('blood pressure') || query.toLowerCase().includes('hypertension')) {
      return "Normal blood pressure is typically around 120/80 mmHg. Hypertension (high blood pressure) is generally considered to be 130/80 mmHg or higher. Lifestyle factors like reduced sodium intake, regular exercise, maintaining a healthy weight, limiting alcohol, and stress management can help control blood pressure. If you have concerns about your blood pressure, please consult with your healthcare provider.";
    }
    
    if (query.toLowerCase().includes('diabetes')) {
      return "Diabetes is a chronic condition affecting how your body processes blood sugar. Type 1 diabetes is an autoimmune condition, while Type 2 is influenced by lifestyle factors. Symptoms may include increased thirst, frequent urination, hunger, fatigue, and blurred vision. Management typically involves monitoring blood sugar, medication, healthy eating, and regular physical activity. Regular consultations with healthcare providers are essential for proper management.";
    }
    
    return "Based on your question, I'd recommend discussing your specific health concerns with a qualified healthcare provider who can give you personalized advice. Remember that while I can provide general information, I can't replace professional medical consultation. Is there anything specific about this condition you'd like to know more about?";
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Stop listening if component unmounts
  useEffect(() => {
    return () => {
      if (isListening && recognition) {
        recognition.stop();
      }
    };
  }, [isListening, recognition]);

  const handleTextToSpeech = (text: string) => {
    speak(text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Medical Assistant</h1>
          <p className="text-muted-foreground">
            Consult with our AI medical assistant for health information and guidance
          </p>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Chat with Medical AI</CardTitle>
            <CardDescription>
              Ask questions about symptoms, conditions, or general health advice
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex flex-col">
              {messages.map((message, index) => (
                <div key={index} className="mb-4">
                  <ChatBubble
                    message={message.content}
                    isUser={message.isUser}
                    timestamp={message.timestamp}
                  />
                  {!message.isUser && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="ml-10 mt-1"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground"
                        onClick={() => handleTextToSpeech(message.content)}
                      >
                        🔊 Listen
                      </Button>
                    </motion.div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {isLoading && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground animate-pulse">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>AI is thinking...</span>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="pt-4 border-t">
            <div className="flex w-full items-center space-x-2">
              <ButtonPro
                variant="outline"
                size="icon"
                type="button"
                onClick={toggleListening}
                className={isListening ? 'text-primary animate-pulse' : ''}
              >
                {isListening ? <Mic /> : <MicOff />}
              </ButtonPro>
              
              <Textarea
                placeholder="Type your health question here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 resize-none"
                rows={1}
              />
              
              <ButtonPro
                variant={input.trim() ? 'default' : 'outline'}
                size="icon"
                type="button"
                disabled={!input.trim() || isLoading}
                onClick={handleSendMessage}
              >
                <Send />
              </ButtonPro>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-sm text-muted-foreground flex items-center">
          <InfoIcon size={16} className="mr-2" />
          <p>
            This AI assistant provides general information only and is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatAssistant;
