
// components/VideoUpload.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {FaUpload} from "react-icons/fa"
import './Video.css';


const VideoUpload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      toast.error('Please select a valid video file');
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast.error('Please select a video file');
      return;
    }

    setUploading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('video', videoFile);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://video-manage-backend.onrender.com/api/videos/upload',
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
          }
        }
      );

      if (response.data.success) {
        toast.success('Video uploaded successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Video</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter video title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter video description"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="video">Video File</label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleFileChange}
            required
          />
        </div>

        {/* <button 
          type="submit" 
          disabled={uploading || !videoFile}
          className="upload-button"
        >
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button> */}
        
<button type="submit" className="upload-button">
  <FaUpload /> {uploading ? 'Uploading...' : 'Upload Video'}
</button>
      </form>
    </div>
  );
};

export default VideoUpload;