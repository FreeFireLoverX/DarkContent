import React, { useState, useMemo } from 'react';
import { Video } from '../types';
import { PencilIcon, TrashIcon, PlusIcon, SearchIcon, ListBulletIcon } from './icons';

interface AdminDashboardProps {
  videos: Video[];
  onEdit: (video: Video) => void;
  onDeleteRequest: (videoId: string) => void;
  onAddNew: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ videos, onEdit, onDeleteRequest, onAddNew }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVideos = useMemo(() => {
    if (!searchQuery) {
      return videos;
    }
    return videos.filter(video =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [videos, searchQuery]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-content-primary dark:text-dark-content-primary">Admin Dashboard</h2>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-base-200 dark:bg-dark-base-200 rounded-xl shadow-md p-6 flex items-center space-x-4 border border-base-300 dark:border-dark-base-300">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-brand-start to-brand-end dark:from-brand-dark dark:to-red-700 text-white">
                <ListBulletIcon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-content-secondary dark:text-dark-content-secondary">Total Videos</p>
                <p className="text-2xl font-bold text-content-primary dark:text-dark-content-primary">{videos.length}</p>
            </div>
        </div>
        {/* Other stat cards could go here */}
      </div>

      {/* Video Library Management */}
      <div className="bg-base-200 dark:bg-dark-base-200 border border-base-300 dark:border-dark-base-300 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-base-300 dark:border-dark-base-300">
            <div className="flex justify-between items-center gap-4 flex-wrap">
                <div>
                    <h3 className="text-xl font-bold text-content-primary dark:text-dark-content-primary">Video Library</h3>
                    <p className="text-sm text-content-secondary dark:text-dark-content-secondary mt-1">Manage all video content here.</p>
                </div>
                <button
                onClick={onAddNew}
                className="flex items-center space-x-2 bg-gradient-to-r from-brand-start to-brand-end dark:from-brand-dark dark:to-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-px dark:shadow-glow-red"
                >
                <PlusIcon className="h-5 w-5" />
                <span>Add New Video</span>
                </button>
            </div>
             <div className="mt-6">
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-content-secondary dark:text-dark-content-secondary" />
                    <input
                        type="text"
                        placeholder="Search videos by title or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 focus:border-brand-start dark:focus:border-brand-dark focus:ring-2 focus:ring-brand-start/50 dark:focus:ring-brand-dark/50 rounded-lg py-3 pl-12 pr-4 text-content-primary dark:text-dark-content-primary transition-colors duration-300"
                    />
                </div>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-base-100/50 dark:bg-dark-base-100/50">
              <tr>
                <th scope="col" className="py-4 pl-6 pr-3 text-left text-sm font-semibold text-content-primary dark:text-dark-content-primary">Thumbnail</th>
                <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-content-primary dark:text-dark-content-primary w-2/5">Title</th>
                <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-content-primary dark:text-dark-content-primary">Category</th>
                <th scope="col" className="relative py-4 pl-3 pr-6 text-right text-sm font-semibold text-content-primary dark:text-dark-content-primary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300 dark:divide-dark-base-300 bg-base-200 dark:bg-dark-base-200">
              {filteredVideos.map((video) => (
                <tr key={video.id} className="hover:bg-base-100/50 dark:hover:bg-dark-base-100/50 transition-colors">
                  <td className="py-4 pl-6 pr-3">
                    <img src={video.thumbnail || `https://via.placeholder.com/160x90/e2e8f0/64748b?text=No+Img`} alt="thumbnail" className="h-11 w-20 object-cover rounded-md bg-base-300 dark:bg-dark-base-300" onError={(e) => { e.currentTarget.src = `https://via.placeholder.com/160x90/e2e8f0/64748b?text=Error`; }} />
                  </td>
                  <td className="px-3 py-4 text-sm font-medium text-content-primary dark:text-dark-content-primary truncate" title={video.title}>{video.title}</td>
                  <td className="px-3 py-4 text-sm text-content-secondary dark:text-dark-content-secondary">{video.category}</td>
                  <td className="relative py-4 pl-3 pr-6 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-4">
                        <button onClick={() => onEdit(video)} className="text-content-secondary dark:text-dark-content-secondary hover:text-brand-start dark:hover:text-brand-dark transition-colors duration-300" title="Edit Video">
                            <PencilIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => onDeleteRequest(video.id)} className="text-content-secondary dark:text-dark-content-secondary hover:text-red-500 transition-colors duration-300" title="Delete Video">
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           {filteredVideos.length === 0 && (
                <div className="text-center py-16 px-4">
                    <h3 className="text-xl font-semibold text-content-primary dark:text-dark-content-primary">
                        {searchQuery ? 'No Videos Match Your Search' : 'No Videos Yet'}
                    </h3>
                    <p className="mt-2 text-md text-content-secondary dark:text-dark-content-secondary">
                        {searchQuery ? 'Try searching for something else.' : 'Click "Add New Video" to get started!'}
                    </p>
                </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;