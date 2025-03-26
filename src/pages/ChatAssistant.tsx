import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, MicOff, Info, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatBubble from '@/components/UI/ChatBubble';
import LoadingIndicator from '@/components/UI/LoadingIndicator';
import { askHealthQuestion } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import ConciseToggle from '@/components/UI/ConciseToggle';

// Add WebSpeech API TypeScript declarations
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

// Add proper type for SpeechRecognitionError
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Language configuration
const LANGUAGES = {
  english: {
    code: 'en-US',
    name: 'English',
    welcomeMessage: "Hello! I'm your AI medical assistant. How can I help you today? You can ask me about symptoms, medical conditions, preventive healthcare, or general health information.",
    nonMedicalToast: {
      title: 'Non-medical query detected',
      description: 'I can only answer medical-related questions. Please ask me about health, symptoms, or medical conditions.',
    },
    voiceInputToast: {
      title: 'Speech recognition not supported',
      description: 'Your browser does not support speech recognition. Please type your question instead.',
    },
    errorToast: {
      title: 'Failed to get response',
      description: 'Something went wrong. Please try again.',
    },
    placeholderText: 'Type your health question...',
  },
  telugu: {
    code: 'te-IN',
    name: 'Telugu',
    welcomeMessage: "నమస్కారం! నేను మీ AI వైद్య సహాయకుడిని. నేడు నేను మీకు ఎలా సహాయం చేయగలను? లక్షణాలు, వైद్య పరిస్థితులు, ప్రారంభ ఆరోగ్య సంరక్షణ లేదా సాధారణ ఆరోగ్య సమాచారం గురించి అడగండి.",
    nonMedicalToast: {
      title: 'వైద్య వ్యతిరేక ప్రశ్న గుర్తించబడింది',
      description: 'నేను కేవలం వైద్య సంబంధిత ప్రశ్నలకు సమాధానం ఇవ్వగలను. ఆరోగ్యం, లక్షణాలు లేదా వైద్య పరిస్థితుల గురించి అడగండి.',
    },
    voiceInputToast: {
      title: 'స్పీచ్ గుర్తింపు అందుబాటులో లేదు',
      description: 'మీ బ్రౌజర్ స్పీచ్ గుర్తింపుకు అనుమతి ఇవ్వలేదు. దయచేసి మీ ప్రశ్నను టైప్ చేయండి.',
    },
    errorToast: {
      title: 'సమాధానం పొందడంలో వైఫల్యం',
      description: 'ఏదో తప్పు జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.',
    },
    placeholderText: 'మీ ఆరోగ్య ప్రశ్నను టైప్ చేయండి...',
  },
  hindi: {
    code: 'hi-IN',
    name: 'Hindi',
    welcomeMessage: "नमस्ते! मैं आपका AI चिकित्सा सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ? आप लक्षणों, चिकित्सा स्थितियों, निवारक स्वास्थ्य सेवा या सामान्य स्वास्थ्य जानकारी के बारे में पूछ सकते हैं।",
    nonMedicalToast: {
      title: 'गैर-चिकित्सा प्रश्न का पता चला',
      description: 'मैं केवल चिकित्सा संबंधित प्रश्नों का उत्तर दे सकता हूँ। कृपया स्वास्थ्य, लक्षणों या चिकित्सा स्थितियों के बारे में पूछें।',
    },
    voiceInputToast: {
      title: 'स्पीच पहचान समर्थित नहीं है',
      description: 'आपका ब्राउज़र स्पीच पहचान का समर्थन नहीं करता। कृपया अपना प्रश्न टाइप करें।',
    },
    errorToast: {
      title: 'प्रतिक्रिया प्राप्त करने में विफल',
      description: 'कुछ गलत हो गया। कृपया फिर से प्रयास करें।',
    },
    placeholderText: 'अपना स्वास्थ्य प्रश्न टाइप करें...',
  },
  tamil: {
    code: 'ta-IN',
    name: 'Tamil',
    welcomeMessage: "வணக்கம்! நான் உங்கள் AI மருத்துவ உதவி. இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்? நீங்கள் அறிகுறிகள், மருத்துவ நிலைமைகள், தடுப்பு சுகாதார அல்லது பொது சுகாதார தகவல் பற்றி கேட்கலாம்.",
    nonMedicalToast: {
      title: 'மருத்துவ அல்லாத கேள்வி கண்டறியப்பட்டது',
      description: 'நான் மருத்துவ தொடர்பான கேள்விகளுக்கு மட்டுமே பதிலளிக்க முடியும். சுகாதாரம், அறிகுறிகள் அல்லது மருத்துவ நிலைமைகள் பற்றி கேட்கவும்.',
    },
    voiceInputToast: {
      title: 'பேச்சு அங்கீகாரம் ஆதரிக்கப்படவில்லை',
      description: 'உங்கள் மேலாளர் பேச்சு அங்கீகாரத்தை ஆதரிக்கவில்லை. தயவுசெய்து உங்கள் கேள்வியை தட்டச்சு செய்யவும்.',
    },
    errorToast: {
      title: 'பதிலைப் பெற முடியவில்லை',
      description: 'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.',
    },
    placeholderText: 'உங்கள் சுகாதார கேள்வியை தட்டச்சு செய்யவும்...',
  }
};

type LanguageKey = keyof typeof LANGUAGES;

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isConcise, setIsConcise] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('english');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addActivity } = useApp();
  const { toast } = useToast();
  
  // Initial welcome message based on selected language
  useEffect(() => {
    const languageConfig = LANGUAGES[currentLanguage];
    setMessages([{
      text: languageConfig.welcomeMessage,
      isUser: false,
      timestamp: new Date(),
    }]);
  }, [currentLanguage]);
  
  // Speech recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  
  if (recognition) {
    recognition.continuous = false;
    recognition.lang = LANGUAGES[currentLanguage].code;
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      const languageConfig = LANGUAGES[currentLanguage];
      toast({
        title: languageConfig.voiceInputToast.title,
        description: languageConfig.voiceInputToast.description,
        variant: 'destructive',
      });
    };
  }
  
  const toggleListening = () => {
    if (!recognition) {
      const languageConfig = LANGUAGES[currentLanguage];
      toast({
        title: languageConfig.voiceInputToast.title,
        description: languageConfig.voiceInputToast.description,
        variant: 'destructive',
      });
      return;
    }
    
    if (isListening) {
      recognition.stop();
    } else {
      recognition.lang = LANGUAGES[currentLanguage].code;
      recognition.start();
      setIsListening(true);
    }
  };
  
  const handleToggleConcise = (value: boolean) => {
    setIsConcise(value);
  };
  
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    // Check if the query is medical-related
    const nonMedicalKeywords = ['math', 'recipe', 'cooking', 'calcul', 'solve', 'politics', 'sports'];
    const isMedicalQuery = !nonMedicalKeywords.some(keyword => 
      input.toLowerCase().includes(keyword)
    );
    
    const languageConfig = LANGUAGES[currentLanguage];
    
    if (!isMedicalQuery) {
      toast({
        title: languageConfig.nonMedicalToast.title,
        description: languageConfig.nonMedicalToast.description,
        variant: 'destructive',
      });
      return;
    }
    
    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Modify askHealthQuestion to accept language parameter
      const response = await askHealthQuestion(input, isConcise, currentLanguage);
      
      const aiMessage: Message = {
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      addActivity(`Asked medical assistant in ${languageConfig.name}: ${input.slice(0, 50)}${input.length > 50 ? '...' : ''}`);
    } catch (error) {
      console.error('Error getting response:', error);
      toast({
        title: languageConfig.errorToast.title,
        description: languageConfig.errorToast.description,
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
        <h1 className="text-3xl font-bold flex items-center">
          <Globe className="mr-2" /> Medical Assistant
        </h1>
        <p className="text-muted-foreground mt-2">
          Ask questions about symptoms, conditions, or health concerns
        </p>
      </div>
      
      {/* Language Selection Tabs */}
      <Tabs 
        defaultValue="english" 
        value={currentLanguage}
        onValueChange={(value: LanguageKey) => setCurrentLanguage(value)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          {Object.keys(LANGUAGES).map((lang) => (
            <TabsTrigger key={lang} value={lang}>
              {LANGUAGES[lang as LanguageKey].name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
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
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-muted-foreground">
                    Ask me about medical topics only
                  </div>
                  <ConciseToggle isConcise={isConcise} onChange={handleToggleConcise} />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={LANGUAGES[currentLanguage].placeholderText}
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
                  <span>Select your preferred language</span>
                </li>
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
