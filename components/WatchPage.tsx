import React, { useMemo, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { Video } from '../types';
import VideoCard from './VideoCard';
import { ArrowLeftIcon, PlayIcon, ShareIcon, CheckIcon } from './icons';

interface WatchPageProps {
  video: Video;
  allVideos: Video[];
  navigate: (page: 'home' | 'watch', videoId?: string | null) => void;
}

const WatchPage: React.FC<WatchPageProps> = ({ video, allVideos, navigate }) => {
  const [copied, setCopied] = useState(false);

  const suggestedVideos = useMemo(() => {
    return allVideos.filter(v => v.category === video.category && v.id !== video.id).slice(0, 3);
  }, [allVideos, video]);

  const navigateHome = () => {
    navigate('home');
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?videoId=${video.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }, (err) => {
        console.error('Could not copy text: ', err);
    });
  };

  return (
    <div>
      <button onClick={navigateHome} className="inline-flex items-center space-x-2 text-content-secondary dark:text-dark-content-secondary hover:text-brand-start dark:hover:text-brand-dark mb-6 group transition-colors duration-300">
        <ArrowLeftIcon className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
        <span>Back to All Videos</span>
      </button>

      {/* Main Video Player */}
      <div className="bg-base-200 dark:bg-dark-base-200 rounded-lg shadow-lg overflow-hidden border border-base-300 dark:border-dark-base-300 mb-8">
        <div className="aspect-video bg-black flex items-center justify-center">
          <ReactPlayer
            key={video.id}
            url={video.url}
            controls
            playing
            width="100%"
            height="100%"
            light={video.thumbnail}
            playIcon={<div className="w-20 h-20 bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white"><PlayIcon className="h-10 w-10"/></div>}
          />
        </div>
      </div>

      {/* Video Info */}
      <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
              <h1 className="text-4xl font-bold text-content-primary dark:text-dark-content-primary mb-2">{video.title}</h1>
              <p className="text-lg text-content-secondary dark:text-dark-content-secondary font-medium">{video.category}</p>
          </div>
          <button
              onClick={handleShare}
              className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-base-300 dark:bg-dark-base-300 text-content-primary dark:text-dark-content-primary font-bold py-2 px-5 rounded-lg transition-all duration-300 hover:bg-opacity-80 dark:hover:bg-opacity-80 hover:shadow-md disabled:opacity-50"
              disabled={copied}
          >
              {copied ? <CheckIcon className="h-5 w-5 text-green-500" /> : <ShareIcon className="h-5 w-5" />}
              <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
      </div>

      {/* Suggested Videos */}
      {suggestedVideos.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-content-primary dark:text-dark-content-primary mb-6 border-l-4 border-brand-start dark:border-brand-dark pl-4">Suggested Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {suggestedVideos.map(suggestedVideo => (
              <VideoCard key={suggestedVideo.id} video={suggestedVideo} navigate={navigate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchPage;