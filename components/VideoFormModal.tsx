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

const VideoFormModal: React.FC<VideoFormModalProps> = ({
  onSave,
  onClose,
  videoToEdit,
  existingCategories,
}) => {
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

    const finalTitle = title.trim();
    let finalUrl = url.trim();
    const finalCategory = category.trim();
    const finalThumbnail = thumbnail.trim();

    if (!finalTitle || !finalUrl || !finalCategory) {
      setError('Please fill in all required fields: title, URL, and category.');
      return;
    }

    try {
      // ✅ If it's a TeraBox link, extract direct video link
      if (finalUrl.includes("terabox.com/s/")) {
        const response = await fetch(`https://api.terabox.link/v1/extract?link=${encodeURIComponent(finalUrl)}`);
        const data = await response.json();

        if (data?.success && data?.directLink) {
          finalUrl = data.directLink;
        } else {
          throw new Error('TeraBox link extraction failed');
        }
      }

      new URL(finalUrl);
      if (finalThumbnail) new URL(finalThumbnail);

      setIsLoading(true);

      const videoData: VideoFormData & { id?: string } = {
        title: finalTitle,
        url: finalUrl,
        category: finalCategory,
        thumbnail: finalThumbnail,
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
        setError(`Failed to save video. ${message}`);
        console.error('Error saving video:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4 flex items-center">
          {isEditing ? <PencilIcon className="w-6 h-6 mr-2" /> : <PlusIcon className="w-6 h-6 mr-2" />}
          {isEditing ? 'Edit Video' : 'Add New Video'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Video URL</label>
            <input
              type="url"
              className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Thumbnail URL (optional)</label>
            <input
              type="url"
              className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Category</label>
            <input
              list="category-list"
              className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <datalist id="category-list">
              {existingCategories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading && <SpinnerIcon className="animate-spin w-5 h-5 mr-2" />}
              {isEditing ? 'Update Video' : 'Add Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoFormModal;
