
import React, { createContext, useContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

// Secret key for encryption (in a real app, this would be securely stored)
const SECRET_KEY = 'medclausex-secure-key';

// Types
type Theme = 'light' | 'dark';
type UserData = {
  name?: string;
  age?: number;
  gender?: string;
  medicalHistory?: string[];
  allergies?: string[];
  medications?: string[];
};

interface AppContextProps {
  theme: Theme;
  toggleTheme: () => void;
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  recentActivities: string[];
  addActivity: (activity: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  encryptData: (data: any) => string;
  decryptData: (encryptedData: string) => any;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  // User data state
  const [userData, setUserData] = useState<UserData>(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      try {
        return JSON.parse(decryptData(savedUserData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        return {};
      }
    }
    return {};
  });

  // Recent activities state
  const [recentActivities, setRecentActivities] = useState<string[]>(() => {
    const savedActivities = localStorage.getItem('recentActivities');
    if (savedActivities) {
      try {
        return JSON.parse(decryptData(savedActivities));
      } catch (error) {
        console.error('Error parsing recent activities:', error);
        return [];
      }
    }
    return [];
  });

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Update user data function
  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prevData) => ({ ...prevData, ...data }));
  };

  // Add activity function
  const addActivity = (activity: string) => {
    setRecentActivities((prevActivities) => {
      const newActivities = [activity, ...prevActivities.slice(0, 9)]; // Keep only the 10 most recent activities
      return newActivities;
    });
  };

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Encrypt data function
  const encryptData = (data: any): string => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  };

  // Decrypt data function
  const decryptData = (encryptedData: string): any => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };

  // Apply theme effect
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save user data effect
  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      localStorage.setItem('userData', encryptData(userData));
    }
  }, [userData]);

  // Save recent activities effect
  useEffect(() => {
    if (recentActivities.length > 0) {
      localStorage.setItem('recentActivities', encryptData(recentActivities));
    }
  }, [recentActivities]);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        userData,
        updateUserData,
        recentActivities,
        addActivity,
        isSidebarOpen,
        toggleSidebar,
        encryptData,
        decryptData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextProps => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
