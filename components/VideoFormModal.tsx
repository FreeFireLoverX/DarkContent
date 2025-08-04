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
    if (isEditing && videoToEdit) {
      setTitle(videoToEdit.title);
      setUrl(videoToEdit.url);
      setCategory(videoToEdit.category);
      setThumbnail(videoToEdit.thumbnail || '');
    }
  }, [isEditing, videoToEdit]);

  const extractTeraBoxLink = async (inputUrl: string): Promise<string> => {
    try {
      const response = await fetch(`https://api.teraboxapp.com/v1/extract?url=${encodeURIComponent(inputUrl)}`);
      const data = await response.json();
      return data?.direct_url || inputUrl;
    } catch (err) {
      console.error('TeraBox extraction failed:', err);
      return inputUrl;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let finalUrl = url;

      if (url.includes("terabox.com/s/")) {
        finalUrl = await extractTeraBoxLink(url);
      }

      await onSave({
        title,
        url: finalUrl,
        category,
        thumbnail,
        id: videoToEdit?.id,
      });

      onClose();
    } catch (err) {
      setError('Failed to save video. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <h2>{isEditing ? 'Edit Video' : 'Add New Video'}</h2>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          
          <label>Video URL</label>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
          
          <label>Category</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
          
          <label>Thumbnail URL (optional)</label>
          <input type="url" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} />
          
          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Add Video'}
          </button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default VideoFormModal;
