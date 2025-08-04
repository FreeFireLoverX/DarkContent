import React, { useState, useMemo } from 'react';
import { Video } from '../types';
import VideoCard from './VideoCard';
import { FilmIcon, VideoCameraIcon } from './icons';

interface VideoGridProps {
  videos: Video[];
  isLoading?: boolean;
  navigate: (page: 'watch', videoId: string) => void;
}

const CategoryFilter: React.FC<{ categories: string[], selected: string, onSelect: (category: string) => void }> = ({ categories, selected, onSelect }) => {
  return (
    <div className="flex items-center overflow-x-auto gap-2 mb-8 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button 
        onClick={() => onSelect('All')}
        className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 flex-shrink-0 ${selected === 'All' ? 'text-brand-start dark:text-brand-dark' : 'text-content-secondary dark:text-dark-content-secondary hover:text-content-primary dark:hover:text-dark-content-primary'}`}
      >
        All
        {selected === 'All' && <div className="mt-1 h-0.5 w-1/2 mx-auto bg-gradient-to-r from-brand-start to-brand-end dark:from-brand-dark dark:to-red-700 rounded-full"></div>}
      </button>
      {categories.map(category => (
        <button 
          key={category}
          onClick={() => onSelect(category)}
          className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 flex-shrink-0 ${selected === category ? 'text-brand-start dark:text-brand-dark' : 'text-content-secondary dark:text-dark-content-secondary hover:text-content-primary dark:hover:text-dark-content-primary'}`}
        >
          {category}
          {selected === category && <div className="mt-1 h-0.5 w-1/2 mx-auto bg-gradient-to-r from-brand-start to-brand-end dark:from-brand-dark dark:to-red-700 rounded-full"></div>}
        </button>
      ))}
    </div>
  )
}


const VideoGrid: React.FC<VideoGridProps> = ({ videos, isLoading, navigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => [...new Set(videos.map(v => v.category))], [videos]);
  
  const filteredVideos = useMemo(() => {
    if (selectedCategory === 'All') return videos;
    return videos.filter(video => video.category === selectedCategory);
  }, [videos, selectedCategory]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-base-200 dark:bg-dark-base-200 rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="aspect-video bg-base-300 dark:bg-dark-base-300"></div>
            <div className="p-5 space-y-3">
              <div className="h-6 bg-base-300 dark:bg-dark-base-300 rounded w-3/4"></div>
              <div className="h-4 bg-base-300 dark:bg-dark-base-300 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const renderEmptyState = () => {
    // Case 1: No videos in the entire library yet.
    if (videos.length === 0) {
      return (
        <div className="text-center py-20 px-4">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-start/20 to-brand-end/20 dark:from-brand-dark/20 dark:to-red-700/20 text-brand-start dark:text-brand-dark">
            <VideoCameraIcon className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-content-primary dark:text-dark-content-primary">No Content Available</h3>
          <p className="mt-2 text-md text-content-secondary dark:text-dark-content-secondary">
            An administrator needs to add videos to the library. Please check back later.
          </p>
        </div>
      );
    }
    // Case 2: Videos exist, but not in the selected category.
    return (
      <div className="text-center py-20 px-4">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-start/20 to-brand-end/20 dark:from-brand-dark/20 dark:to-red-700/20 text-brand-start dark:text-brand-dark">
          <FilmIcon className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-2xl font-semibold text-content-primary dark:text-dark-content-primary">No Videos In This Category</h3>
        <p className="mt-2 text-md text-content-secondary dark:text-dark-content-secondary">
          There are no videos in "{selectedCategory}". Try selecting another category.
        </p>
      </div>
    );
  };

  return (
    <>
      {videos.length > 0 && <CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />}
      
      {filteredVideos.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredVideos.map(video => (
            <VideoCard key={video.id} video={video} navigate={navigate} />
          ))}
        </div>
      )}
    </>
  );
};

export default VideoGrid;