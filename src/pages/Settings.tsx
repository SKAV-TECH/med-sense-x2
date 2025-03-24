
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Trash2, 
  AlertCircle, 
  Bot, 
  User, 
  Moon, 
  Sun, 
  RefreshCw 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/context/AppContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { resetUserData, theme, toggleTheme } = useApp();
  
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [aiModel, setAiModel] = useState('gemini-2.0-flash');
  
  const handleResetUserData = () => {
    resetUserData();
    toast({
      title: "Data Reset",
      description: "All your user data has been reset successfully",
    });
    setOpenResetDialog(false);
  };
  
  const handleModelChange = (model: string) => {
    setAiModel(model);
    toast({
      title: "AI Model Changed",
      description: `AI model switched to ${model}`,
    });
    
    // In a real app, this would update a global setting
    localStorage.setItem('aiModel', model);
  };
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-700 to-slate-900 p-6 rounded-lg text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-white/90 max-w-3xl">
          Customize your application preferences, manage your data, and configure AI settings.
        </p>
      </motion.div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-md border-0 h-full">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-slate-500" />
                <span>User Data</span>
              </CardTitle>
              <CardDescription>
                Manage your personal data stored on this device
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="border-b pb-4">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => setOpenResetDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reset All User Data
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  This will erase all your profile information and activity history from this device.
                  This action cannot be undone.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Theme Preference</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Light</span>
                  </div>
                  <Switch 
                    checked={theme === 'dark'} 
                    onCheckedChange={toggleTheme} 
                  />
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm">Dark</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-md border-0 h-full">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-slate-500" />
                <span>AI Settings</span>
              </CardTitle>
              <CardDescription>
                Configure AI models and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">AI Model Selection</h3>
                <RadioGroup value={aiModel} onValueChange={handleModelChange} className="space-y-3">
                  <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <RadioGroupItem value="gemini-1.5-flash" id="model-1" />
                    <Label htmlFor="model-1" className="flex-grow cursor-pointer">
                      <div className="font-medium">Gemini 1.5 Flash</div>
                      <div className="text-xs text-muted-foreground">Balanced performance model, good for most tasks</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <RadioGroupItem value="gemini-2.0-flash" id="model-2" />
                    <Label htmlFor="model-2" className="flex-grow cursor-pointer">
                      <div className="font-medium">Gemini 2.0 Flash</div>
                      <div className="text-xs text-muted-foreground">Recommended for most use cases, high performance</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <RadioGroupItem value="gemini-2.0-flash-lite" id="model-3" />
                    <Label htmlFor="model-3" className="flex-grow cursor-pointer">
                      <div className="font-medium">Gemini 2.0 Flash Lite</div>
                      <div className="text-xs text-muted-foreground">Fastest response times, light processing</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <div className="mt-8 bg-slate-50 dark:bg-slate-800/20 rounded-lg p-5 border shadow-sm">
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
          <span>About Local Storage</span>
        </h3>
        <p className="text-sm text-muted-foreground">
          This application stores your profile data and activity history locally on your device using browser storage.
          No data is transmitted to external servers. If you clear your browser data or use a different device,
          you will need to set up your profile again.
        </p>
      </div>
      
      <AlertDialog open={openResetDialog} onOpenChange={setOpenResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your profile information and activity history
              from this device. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResetUserData}
              className="bg-red-600 hover:bg-red-700"
            >
              Reset All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
