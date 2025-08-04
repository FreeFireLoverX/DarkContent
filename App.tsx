import React, { useState, useEffect, useCallback } from 'react';
import { Video } from './types';
import Header from './components/Header';
import VideoGrid from './components/VideoGrid';
import LoginModal from './components/LoginModal';
import WatchPage from './components/WatchPage';
import AdminDashboard from './components/AdminDashboard';
import VideoFormModal from './components/VideoFormModal';
import ConfirmationModal from './components/ConfirmationModal';
import { getVideos, addVideo, updateVideo, deleteVideo } from './services/firebase';
import { SpinnerIcon, ExclamationTriangleIcon } from './components/icons';


// Hardcoded Admin Credentials
const ADMIN_USERNAME = "SohailFucker";
const ADMIN_PASSWORD = "AntiFucker";

const LOCAL_STORAGE_KEY_THEME = 'video-dashboard-theme';

interface AppView {
  page: 'home' | 'watch' | 'admin';
  videoId?: string | null;
}

const App: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showVideoFormModal, setShowVideoFormModal] = useState<boolean>(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<AppView>({ page: 'home', videoId: null });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [videoToDeleteId, setVideoToDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEY_THEME) as 'light' | 'dark' | null;
    if (savedTheme) {
        setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
      const root = window.document.documentElement;
      root.classList.remove(theme === 'light' ? 'dark' : 'light');
      root.classList.add(theme);
      localStorage.setItem(LOCAL_STORAGE_KEY_THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const navigate = (page: 'home' | 'watch' | 'admin', videoId: string | null = null) => {
    const newPage = page;
    const newVideoId = (page === 'watch') ? videoId : null;

    const url = new URL(window.location.href);
    if (newVideoId) {
        url.searchParams.set('videoId', newVideoId);
    } else {
        url.searchParams.delete('videoId');
    }

    if (url.href !== window.location.href) {
        window.history.pushState({ page: newPage, videoId: newVideoId }, '', url.href);
    }

    setCurrentView({ page: newPage, videoId: newVideoId });
  };
  
  // This effect synchronizes the UI with the URL's query parameters
  useEffect(() => {
    const syncViewWithUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const videoIdFromUrl = params.get('videoId');
        if (videoIdFromUrl) {
            setCurrentView(prev => (prev.page === 'watch' && prev.videoId === videoIdFromUrl) ? prev : { page: 'watch', videoId: videoIdFromUrl });
        } else {
            setCurrentView(prev => (prev.page === 'watch' ? { page: 'home', videoId: null } : (prev.page === 'admin' ? prev : { page: 'home', videoId: null })));
        }
    };
    
    window.addEventListener('popstate', syncViewWithUrl);
    syncViewWithUrl(); // Initial check on page load

    return () => {
        window.removeEventListener('popstate', syncViewWithUrl);
    };
  }, []);

  const fetchVideos = useCallback(async () => {
    setIsLoading(true);
    try {
        const firebaseVideos = await getVideos();
        setVideos(firebaseVideos);
    } catch (error) {
        console.error("Error loading videos from Firebase:", error);
        setVideos([]);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);


  const handleLogin = (user: string, pass: string) => {
    if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('home');
  };

  const saveVideo = useCallback(async (videoData: Omit<Video, 'id'> & { id?: string }) => {
    if (videoData.id) { // isUpdating
        const { id, ...dataToUpdate } = videoData;
        await updateVideo(id, dataToUpdate);
    } else { // isCreating
        const { id, ...newVideoData } = videoData;
        await addVideo(newVideoData);
    }
    await fetchVideos(); // Refetch to get the latest state and order
  }, [fetchVideos]);

  const handleDeleteRequest = (videoId: string) => {
    setVideoToDeleteId(videoId);
  };

  const handleConfirmDelete = async () => {
    if (videoToDeleteId) {
      const idToDelete = videoToDeleteId;
      setVideoToDeleteId(null);
      try {
        await deleteVideo(idToDelete);
        await fetchVideos();
      } catch(e) {
        console.error("Failed to delete video:", e);
      }
    }
  };

  const handleCancelDelete = () => {
    setVideoToDeleteId(null);
  };

  const handleOpenCreateModal = () => {
    setEditingVideo(null);
    setShowVideoFormModal(true);
  };
  
  const handleOpenEditModal = (video: Video) => {
    setEditingVideo(video);
    setShowVideoFormModal(true);
  };
  
  const selectedVideo = currentView.videoId ? videos.find(v => v.id === currentView.videoId) : null;

  const renderContent = () => {
    switch (currentView.page) {
      case 'watch':
        if (isLoading) {
          return (
            <div className="text-center py-20">
              <SpinnerIcon className="h-12 w-12 mx-auto animate-spin text-brand-start dark:text-brand-dark" />
              <p className="mt-4 text-lg">Loading video...</p>
            </div>
          );
        }
        if (!selectedVideo) {
          return (
            <div className="text-center py-20">
              <ExclamationTriangleIcon className="h-12 w-12 mx-auto text-red-500" />
              <h3 className="mt-4 text-2xl font-semibold">Video Not Found</h3>
              <p className="mt-2 text-content-secondary dark:text-dark-content-secondary">The requested video does not exist or has been removed.</p>
              <button onClick={() => navigate('home')} className="mt-6 bg-gradient-to-r from-brand-start to-brand-end dark:from-brand-dark dark:to-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-px dark:shadow-glow-red">
                Go to Homepage
              </button>
            </div>
          );
        }
        return <WatchPage video={selectedVideo} allVideos={videos} navigate={navigate} />;
      case 'admin':
        return isLoggedIn ? <AdminDashboard videos={videos} onEdit={handleOpenEditModal} onDeleteRequest={handleDeleteRequest} onAddNew={handleOpenCreateModal} /> : <VideoGrid videos={videos} isLoading={isLoading} navigate={navigate} />;
      case 'home':
      default:
        return <VideoGrid videos={videos} isLoading={isLoading} navigate={navigate} />;
    }
  }

  return (
    <div className="min-h-screen bg-base-100 dark:bg-dark-base-100 text-content-primary dark:text-dark-content-primary font-sans">
       <div className="fixed inset-0 -z-10 h-full w-full bg-base-100 dark:bg-dark-base-100 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="fixed bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#c9d1ef,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#334155,transparent)]"></div>
       </div>
      <Header
        isLoggedIn={isLoggedIn}
        username={ADMIN_USERNAME}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
        navigate={navigate}
      />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      {showLoginModal && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setShowLoginModal(false)}
          error={loginError}
        />
      )}
      {isLoggedIn && showVideoFormModal && (
        <VideoFormModal
          onSave={saveVideo}
          onClose={() => setShowVideoFormModal(false)}
          videoToEdit={editingVideo}
          existingCategories={[...new Set(videos.map(v => v.category))]}
        />
      )}
      {videoToDeleteId && (
        <ConfirmationModal
          title="Delete Video"
          message="Are you sure you want to delete this video? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isConfirming={false}
        />
      )}
    </div>
  );
};

export default App;
