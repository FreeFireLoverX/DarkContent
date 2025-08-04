import React from 'react';
import { Video } from '../types';
import { PlayIcon } from './icons';

interface VideoCardProps {
  video: Video;
  navigate: (page: 'watch', videoId: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, navigate }) => {
  
  const navigateToWatch = () => {
    navigate('watch', video.id);
  };

  return (
    <div 
      className="group block cursor-pointer" 
      aria-label={`Watch ${video.title}`}
      onClick={navigateToWatch}
    >
      <div className="bg-base-200 dark:bg-dark-base-200/80 dark:backdrop-blur-sm dark:border dark:border-dark-base-300 rounded-lg shadow-md dark:shadow-none overflow-hidden transition-all duration-300 ease-out hover:shadow-xl dark:hover:shadow-glow-red hover:-translate-y-1">
        <div className="relative aspect-video bg-base-300 dark:bg-dark-base-300">
          <img 
            src={video.thumbnail || `https://via.placeholder.com/640x360/e2e8f0/64748b?text=${encodeURIComponent(video.title)}`} 
            alt={`Thumbnail for ${video.title}`}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = `https://via.placeholder.com/640x360/e2e8f0/64748b?text=No+Preview`; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <div className="w-16 h-16 bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
              <PlayIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-content-primary dark:text-dark-content-primary truncate" title={video.title}>
            {video.title}
          </h3>
          <p className="text-sm text-content-secondary dark:text-dark-content-secondary">{video.category}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;