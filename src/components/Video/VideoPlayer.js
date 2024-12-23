
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {FaArrowLeft} from 'react-icons/fa'
// import '../../App.css';
import './Video.css';


const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://video-manage-backend.onrender.com/api/videos/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setVideo(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching video:', err);
      setError('Failed to load video');
      toast.error('Failed to load video');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading video...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!video) {
    return <div className="error">Video not found</div>;
  }

  return (
    <div className="video-player-container">
      <button 
        className="back-button"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> Back to Videos
      </button>

      <div className="video-player">
        <video 
          controls 
          autoPlay
          className="main-video"
        >
          <source src={`http://localhost:5000${video.url}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="video-details">
        <h1>{video.title}</h1>
        <p className="upload-date">
          Uploaded on {new Date(video.createdAt).toLocaleDateString()}
        </p>
        <p className="description">{video.description}</p>
      </div>

      <button 
        id="back-button"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> Back to Videos
      </button>
    </div>
  );
};

export default VideoPlayer;