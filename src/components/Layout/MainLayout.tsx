
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isSidebarOpen, toggleSidebar } = useApp();
  const isMobile = useIsMobile();
  
  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      toggleSidebar();
    }
  }, [isMobile]);
  
  // Content animation variants
  const contentVariants = {
    expanded: { 
      marginLeft: isMobile ? '0px' : '256px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    collapsed: { 
      marginLeft: isMobile ? '0px' : '80px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <motion.main 
        className="flex-1 overflow-y-auto pt-16 pb-6"
        variants={contentVariants}
        initial="expanded"
        animate={isSidebarOpen ? 'expanded' : 'collapsed'}
      >
        <Header />
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 py-6 md:px-6 lg:px-8 pt-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
};

export default MainLayout;
