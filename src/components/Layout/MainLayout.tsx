
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '@/context/AppContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isSidebarOpen } = useApp();
  
  const contentVariants = {
    expanded: { 
      marginLeft: '240px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    collapsed: { 
      marginLeft: '72px',
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
            transition={{ duration: 0.2 }}
            className="container px-4 py-6 mx-auto"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
};

export default MainLayout;
