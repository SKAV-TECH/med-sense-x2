
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/context/AppContext';

const Header: React.FC = () => {
  const { isSidebarOpen, userData } = useApp();
  const navigate = useNavigate();
  
  return (
    <header className={`fixed top-0 right-0 z-30 h-16 bg-background/70 backdrop-blur-lg border-b border-border flex items-center px-4 ${isSidebarOpen ? 'left-60' : 'left-[72px]'} transition-all duration-300`}>
      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="search" 
            placeholder="Search..." 
            className="w-full h-10 pl-10 pr-4 rounded-full bg-accent/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <div className="py-2 px-4 hover:bg-accent rounded-md transition-colors cursor-pointer">
                <div className="text-sm font-medium">Treatment plan updated</div>
                <div className="text-xs text-muted-foreground mt-1">3 minutes ago</div>
              </div>
              <div className="py-2 px-4 hover:bg-accent rounded-md transition-colors cursor-pointer">
                <div className="text-sm font-medium">New analysis results available</div>
                <div className="text-xs text-muted-foreground mt-1">1 hour ago</div>
              </div>
              <div className="py-2 px-4 hover:bg-accent rounded-md transition-colors cursor-pointer">
                <div className="text-sm font-medium">Medication reminder</div>
                <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {userData.profileImage ? (
                  <img 
                    src={userData.profileImage} 
                    alt="Profile" 
                    className="h-full w-full object-cover" 
                  />
                ) : (
                  <User size={18} className="text-primary" />
                )}
              </div>
              <span className="hidden sm:inline-block font-medium text-sm">
                {userData.name || 'User Profile'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Medical History</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/settings')}>
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
