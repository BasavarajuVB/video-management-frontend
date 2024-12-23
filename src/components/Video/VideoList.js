
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
// import '../../App.css';
import './Video.css';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOption, setFilterOption] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVideos = videos.filter(video => {
    if (searchQuery) {
      return video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             video.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    switch (filterOption) {
      case 'recent':
        return new Date(video.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      case 'oldest':
        return true;
      default:
        return true;
    }
  });

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (filterOption === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://video-manage-backend.onrender.com/api/videos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setVideos(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos');
      toast.error('Failed to load videos');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading videos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="video-list-container">
         <div className="video-list-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-controls">
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="all">All Videos</option>
            <option value="recent">Last 7 Days</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
      <div className="video-list-header">
        <h2>My Videos</h2>
        <Link to="/upload" className="upload-button">
          Upload New Video
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="no-videos">
          <p>No videos uploaded yet</p>
          <Link to="/upload" className="upload-link">
            Upload your first video
          </Link>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <Link 
              to={`/video/${video._id}`} 
              key={video._id} 
              className="video-card"
            >
              <div className="video-thumbnail">
                <video>
                  <source src={`http://localhost:5000${video.url}`} type="video/mp4" />
                </video>
              </div>
              <div className="video-info">
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                <span className="upload-date">
                  {new Date(video.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoList;