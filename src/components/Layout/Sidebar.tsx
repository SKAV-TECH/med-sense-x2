
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  FileSearch, 
  MessageCircle, 
  Clipboard, 
  Pill, 
  Video, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/image-analysis', icon: FileSearch, label: 'Image Analysis' },
  { path: '/chat-assistant', icon: MessageCircle, label: 'Medical Assistant' },
  { path: '/treatment-planner', icon: Clipboard, label: 'Treatment Planner' },
  { path: '/medication-analyzer', icon: Pill, label: 'Medication Safety' },
  { path: '/video-resources', icon: Video, label: 'Video Resources' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar, theme, toggleTheme } = useApp();

  const sidebarVariants = {
    open: { width: '240px', transition: { duration: 0.3, ease: 'easeInOut' } },
    closed: { width: '72px', transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const textVariants = {
    open: { opacity: 1, display: 'block', transition: { delay: 0.1, duration: 0.2 } },
    closed: { opacity: 0, display: 'none', transition: { duration: 0.1 } },
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial="open"
      animate={isSidebarOpen ? 'open' : 'closed'}
      className="fixed top-0 left-0 h-full bg-sidebar border-r border-sidebar-border z-40 overflow-hidden"
    >
      <div className="flex flex-col h-full py-6">
        <div className="px-4 mb-8 flex items-center justify-between">
          <motion.div variants={textVariants} className="flex items-center">
            <span className="text-xl font-semibold text-primary">MedClauseX</span>
          </motion.div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        <nav className="flex-1 px-2">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center p-2 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-primary text-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <motion.span 
                    variants={textVariants}
                    className="ml-3 whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto px-4">
          <motion.div
            variants={textVariants}
            className="flex justify-between items-center"
          >
            <span className="text-sm text-sidebar-foreground">
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-1"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
