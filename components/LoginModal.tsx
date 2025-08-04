import React, { useState } from 'react';
import { CloseIcon, UserIcon, LockIcon, VideoCameraIcon, ExclamationTriangleIcon } from './icons';

interface LoginModalProps {
  onLogin: (user: string, pass: string) => void;
  onClose: () => void;
  error: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" aria-modal="true" role="dialog">
      <div className="relative bg-base-200 dark:bg-dark-base-200 rounded-2xl shadow-2xl w-full max-w-sm m-4 animate-fade-in-up dark:border dark:border-dark-base-300 overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-content-secondary dark:text-dark-content-secondary hover:text-brand-start dark:hover:text-brand-dark transition-colors duration-300 z-10">
            <CloseIcon className="h-6 w-6" />
        </button>
        <div className="flex flex-col items-center justify-center p-8 pt-12 text-center">
            <div className="mb-6 h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-start to-brand-end dark:from-brand-dark dark:to-red-700 shadow-lg">
                <VideoCameraIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-content-primary dark:text-dark-content-primary">Welcome, Admin</h2>
            <p className="text-content-secondary dark:text-dark-content-secondary mt-1">Please log in to manage content.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-content-secondary dark:text-dark-content-secondary" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 focus:border-brand-start dark:focus:border-brand-dark focus:ring-2 focus:ring-brand-start/50 dark:focus:ring-brand-dark/50 rounded-lg py-3 pl-12 pr-4 text-content-primary dark:text-dark-content-primary transition-colors duration-300"
              required
            />
          </div>
          <div className="relative">
            <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-content-secondary dark:text-dark-content-secondary" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 focus:border-brand-start dark:focus:border-brand-dark focus:ring-2 focus:ring-brand-start/50 dark:focus:ring-brand-dark/50 rounded-lg py-3 pl-12 pr-4 text-content-primary dark:text-dark-content-primary transition-colors duration-300"
              required
            />
          </div>
          {error && (
            <div className="bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium text-center p-3 rounded-lg flex items-center justify-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5"/>
                <span>{error}</span>
            </div>
          )}
           <p className="text-xs text-content-secondary dark:text-dark-content-secondary text-center !-mt-2">Hint: Use admin / admin</p>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-brand-start to-brand-end dark:from-brand-dark dark:to-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-px shadow-lg hover:shadow-xl dark:shadow-glow-red flex items-center justify-center space-x-2"
          >
            <span>Log In</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;