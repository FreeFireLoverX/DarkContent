import React, { useState } from 'react';
import { LoginIcon, LogoutIcon, VideoCameraIcon, UserGroupIcon, SunIcon, MoonIcon, Bars3Icon } from './icons';

interface HeaderProps {
  isLoggedIn: boolean;
  username: string;
  onLoginClick: () => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  navigate: (page: 'home' | 'admin') => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, username, onLoginClick, onLogout, theme, toggleTheme, navigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (page: 'home' | 'admin') => {
    navigate(page);
    setIsMobileMenuOpen(false);
  };
  
  const handleLogout = () => {
    onLogout();
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="bg-base-200/80 dark:bg-dark-base-200/80 backdrop-blur-lg border-b border-base-300 dark:border-dark-base-300 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            onClick={() => handleNavigate('home')}
            className="flex items-center space-x-3 group cursor-pointer" 
            role="button"
            aria-label="Back to Homepage"
          >
            <VideoCameraIcon className="h-8 w-8 text-brand-start dark:text-brand-dark transition-colors" />
            <h1 className="text-2xl font-bold text-content-primary dark:text-dark-content-primary tracking-wider">
              Dark Content
            </h1>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
             <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-content-secondary dark:text-dark-content-secondary hover:bg-base-300 dark:hover:bg-dark-base-300 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
              </button>
            {isLoggedIn ? (
              <>
                <span className="text-content-secondary dark:text-dark-content-secondary">Welcome, <span className="font-semibold text-content-primary dark:text-dark-content-primary">{username}</span></span>
                <button
                  onClick={() => handleNavigate('admin')}
                  className="flex items-center space-x-2 bg-slate-700 dark:bg-dark-base-300 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-px"
                >
                  <UserGroupIcon className="h-5 w-5" />
                  <span>Admin Panel</span>
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 bg-slate-200 dark:bg-dark-base-300 text-slate-800 dark:text-dark-content-primary font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  <LogoutIcon className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center space-x-2 bg-gradient-to-r from-brand-start to-brand-end dark:from-brand-dark dark:to-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-px dark:shadow-glow-red"
              >
                <LoginIcon className="h-5 w-5" />
                <span>Admin Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-content-secondary dark:text-dark-content-secondary hover:bg-base-300 dark:hover:bg-dark-base-300 transition-colors mr-2"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-content-secondary dark:text-dark-content-secondary hover:bg-base-300 dark:hover:bg-dark-base-300">
                  <Bars3Icon className="h-6 w-6"/>
              </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
          <div className="md:hidden bg-base-200/95 dark:bg-dark-base-200/95 backdrop-blur-lg border-t border-base-300 dark:border-dark-base-300 py-4 px-2 space-y-2">
            {isLoggedIn ? (
              <>
                <div className="px-2 py-2 text-content-secondary dark:text-dark-content-secondary">Welcome, <span className="font-semibold text-content-primary dark:text-dark-content-primary">{username}</span></div>
                <button
                  onClick={() => handleNavigate('admin')}
                  className="w-full flex items-center space-x-2 text-content-primary dark:text-dark-content-primary font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:bg-base-300 dark:hover:bg-dark-base-300"
                >
                  <UserGroupIcon className="h-5 w-5" />
                  <span>Admin Panel</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 text-content-primary dark:text-dark-content-primary font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:bg-base-300 dark:hover:bg-dark-base-300"
                >
                  <LogoutIcon className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
               <button
                onClick={onLoginClick}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-start to-brand-end dark:from-brand-dark dark:to-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-px dark:shadow-glow-red"
              >
                <LoginIcon className="h-5 w-5" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
      )}
    </header>
  );
};

export default Header;