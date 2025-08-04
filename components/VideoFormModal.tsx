import React, { useState, useEffect } from 'react';
import { PlusIcon, SpinnerIcon, CloseIcon, PencilIcon } from './icons';
import { Video } from '../types';

type VideoFormData = Omit<Video, 'id'>;

interface VideoFormModalProps {
  onSave: (data: VideoFormData & { id?: string }) => Promise<void>;
  onClose: () => void;
  videoToEdit?: Video | null;
  existingCategories: string[];
}

const VideoFormModal: React.FC<VideoFormModalProps> = ({ onSave, onClose, videoToEdit, existingCategories }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!videoToEdit;

  useEffect(() => {
    if (isEditing) {
      setTitle(videoToEdit.title);
      setUrl(videoToEdit.url);
      setCategory(videoToEdit.category);
      setThumbnail(videoToEdit.thumbnail || '');
    }
  }, [videoToEdit, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Trim all inputs once at the beginning
    const finalTitle = title.trim();
    const finalUrl = url.trim();
    const finalCategory = category.trim();
    const finalThumbnail = thumbnail.trim();

    if (!finalTitle || !finalUrl || !finalCategory) {
      setError('Please fill in all required fields: title, URL, and category.');
      return;
    }

    try {
      // URL validation
      new URL(finalUrl);
      if (finalThumbnail) {
        new URL(finalThumbnail);
      }

      setIsLoading(true);
      const videoData: VideoFormData & { id?: string } = {
        title: finalTitle,
        url: finalUrl,
        category: finalCategory,
        thumbnail: finalThumbnail, // This is now guaranteed to be a string
      };

      if (isEditing) {
        videoData.id = videoToEdit.id;
      }

      await onSave(videoData);
      onClose();

    } catch (err) {
      if (err instanceof TypeError) {
        setError('Please enter valid URLs for the video and/or thumbnail.');
      } else {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setError(`Failed to save video. Please try again. (${message})`);
        console.error("Error saving video:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300" aria-modal="true" role="dialog">
      <div className="bg-base-200 dark:bg-dark-base-200 rounded-lg shadow-2xl w-full max-w-lg m-4 transform transition-all duration-300 dark:border dark:border-dark-base-300">
        <div className="flex justify-between items-center p-5 border-b border-base-300 dark:border-dark-base-300">
            <h2 className="text-2xl font-bold text-content-primary dark:text-dark-content-primary">{isEditing ? 'Edit Video' : 'Add New Video'}</h2>
            <button onClick={onClose} className="text-content-secondary dark:text-dark-content-secondary hover:text-brand-start dark:hover:text-brand-dark transition-colors duration-300" disabled={isLoading}>
                <CloseIcon className="h-6 w-6" />
            </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
                <label htmlFor="video-title" className="block text-sm font-medium text-content-secondary dark:text-dark-content-secondary mb-2">Video Title</label>
                <input
                    id="video-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., My Awesome Video"
                    className="w-full bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 focus:border-brand-start dark:focus:border-brand-dark focus:ring-2 focus:ring-brand-start/50 dark:focus:ring-brand-dark/50 rounded-lg py-3 px-4 text-content-primary dark:text-dark-content-primary transition-colors duration-300"
                    required disabled={isLoading}
                />
            </div>
             <div>
                <label htmlFor="video-category" className="block text-sm font-medium text-content-secondary dark:text-dark-content-secondary mb-2">Category</label>
                <input
                    id="video-category" type="text" value={category} onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Sci-Fi, Music, Tech"
                    className="w-full bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 focus:border-brand-start dark:focus:border-brand-dark focus:ring-2 focus:ring-brand-start/50 dark:focus:ring-brand-dark/50 rounded-lg py-3 px-4 text-content-primary dark:text-dark-content-primary transition-colors duration-300"
                    required list="category-suggestions" disabled={isLoading}
                />
                <datalist id="category-suggestions">
                    {existingCategories.map(cat => <option key={cat} value={cat} />)}
                </datalist>
            </div>
            <div>
                <label htmlFor="video-url" className="block text-sm font-medium text-content-secondary dark:text-dark-content-secondary mb-2">Video URL</label>
                <input
                    id="video-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 focus:border-brand-start dark:focus:border-brand-dark focus:ring-2 focus:ring-brand-start/50 dark:focus:ring-brand-dark/50 rounded-lg py-3 px-4 text-content-primary dark:text-dark-content-primary transition-colors duration-300"
                    required disabled={isLoading}
                />
            </div>
             <div>
                <label htmlFor="thumbnail-url" className="block text-sm font-medium text-content-secondary dark:text-dark-content-secondary mb-2">Thumbnail URL (Optional)</label>
                <input
                    id="thumbnail-url" type="url" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 focus:border-brand-start dark:focus:border-brand-dark focus:ring-2 focus:ring-brand-start/50 dark:focus:ring-brand-dark/50 rounded-lg py-3 px-4 text-content-primary dark:text-dark-content-primary transition-colors duration-300"
                    disabled={isLoading}
                />
            </div>
            <p className="text-xs text-content-secondary dark:text-dark-content-secondary -mt-2">
                Note: You can use links from YouTube, Vimeo, Twitch, etc. If you provide a thumbnail, it will be used as the preview image.
            </p>
            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
            
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-start to-brand-end dark:from-brand-dark dark:to-red-700 disabled:from-slate-500 disabled:to-slate-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:-translate-y-px shadow-lg hover:shadow-xl dark:shadow-glow-red disabled:shadow-none"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <SpinnerIcon className="animate-spin h-5 w-5 mr-2" />
                        <span>Saving...</span>
                    </>
                ) : (
                    isEditing ? (
                        <>
                            <PencilIcon className="h-5 w-5"/>
                            <span>Update Video</span>
                        </>
                    ) : (
                        <>
                            <PlusIcon className="h-5 w-5"/>
                            <span>Add Video</span>
                        </>
                    )
                )}
            </button>
        </form>
      </div>
    </div>
  );
};

export default VideoFormModal;
