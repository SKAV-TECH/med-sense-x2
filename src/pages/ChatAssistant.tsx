
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, MicOff, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import ChatBubble from '@/components/UI/ChatBubble';
import LoadingIndicator from '@/components/UI/LoadingIndicator';
import { askHealthQuestion } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your AI medical assistant. How can I help you today? You can ask me about symptoms, medical conditions, preventive healthcare, or general health information.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addActivity } = useApp();
  const { toast } = useToast();
  
  // Speech recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  
  if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        title: 'Voice input failed',
        description: `Error: ${event.error}. Please try again or type your question.`,
        variant: 'destructive',
      });
    };
  }
  
  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: 'Speech recognition not supported',
        description: 'Your browser does not support speech recognition. Please type your question instead.',
        variant: 'destructive',
      });
      return;
    }
    
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };
  
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await askHealthQuestion(input);
      
      const aiMessage: Message = {
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      addActivity(`Asked medical assistant: ${input.slice(0, 50)}${input.length > 50 ? '...' : ''}`);
    } catch (error) {
      console.error('Error getting response:', error);
      toast({
        title: 'Failed to get response',
        description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Medical Assistant</h1>
        <p className="text-muted-foreground mt-2">
          Ask questions about symptoms, conditions, or health concerns
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 shadow-md">
          <CardContent className="p-0">
            <div className="flex flex-col h-[600px]">
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message, index) => (
                  <ChatBubble
                    key={index}
                    isUser={message.isUser}
                    message={message.text}
                    timestamp={message.timestamp}
                  />
                ))}
                
                {isLoading && (
                  <div className="flex justify-center my-4">
                    <LoadingIndicator text="AI is thinking..." />
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your health question..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleListening}
                        disabled={isLoading}
                      >
                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isListening ? 'Stop voice input' : 'Start voice input'}
                    </TooltipContent>
                  </Tooltip>
                  
                  <Button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-1">
          <Card className="shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center text-primary mb-3">
                <Info size={18} className="mr-2" />
                <h3 className="font-medium">How to Use</h3>
              </div>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Ask specific questions about symptoms or conditions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Request preventive healthcare tips</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Inquire about medication information</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Use voice input for hands-free interaction</span>
                </li>
              </ul>
              
              <div className="mt-4 p-3 bg-accent rounded-md text-xs">
                <p className="mb-2 font-medium">Important Note:</p>
                <p>
                  This AI assistant provides informational guidance only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.
                </p>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Example Questions:</h4>
                <div className="space-y-2">
                  {['What are the symptoms of Type 2 diabetes?', 'How can I reduce high blood pressure naturally?', 'What causes migraines?'].map((question, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="p-2 bg-muted text-xs rounded-md cursor-pointer hover:bg-muted/80"
                      onClick={() => setInput(question)}
                    >
                      {question}
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
