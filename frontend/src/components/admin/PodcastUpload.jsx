import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function PodcastUpload({ formData, setFormData, uploading, setUploading }) {
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAudioUpload = async (file) => {
    if (!file) return;

    console.log('Uploading file:', file);
    console.log('File type:', file.type);
    console.log('File name:', file.name);
    console.log('File size:', file.size);

    const validAudioTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/m4a', 'audio/mp4', 'audio/x-m4a', 'audio/ogg'];
    if (!validAudioTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type);
      alert(`Please upload a valid audio file (MP3, WAV, M4A, OGG). Your file type: ${file.type}`);
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('Audio file must be less than 50MB');
      return;
    }

    setAudioFile(file);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'audio');

      console.log('Sending upload request to: http://localhost:5000/v1/upload');

      const response = await fetch('http://localhost:5000/v1/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Upload response data:', data);
        setFormData((prev) => ({ ...prev, audio_url: data.url }));
        alert('Audio uploaded successfully!');
      } else {
        const errorText = await response.text();
        console.error('Upload failed:', response.status, errorText);
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Audio upload error:', error);
      alert(`Failed to upload audio file: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleVideoUpload = async (file) => {
    if (!file) return;

    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validVideoTypes.includes(file.type)) {
      alert('Please upload a valid video file (MP4, WebM, OGG)');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert('Video file must be less than 100MB');
      return;
    }

    setVideoFile(file);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'video');

      const response = await fetch('http://localhost:5000/v1/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({ ...prev, video_url: data.url }));
        alert('Video uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Video upload error:', error);
      alert('Failed to upload video file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <>
      {/* Audio Upload */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
          Audio File
        </label>
        <div className="space-y-2">
          <Input
            value={formData.audio_url || ''}
            onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
            placeholder="https://example.com/audio.mp3"
            className="w-full"
          />
          <div className="flex gap-2">
            <label className="px-3 py-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700 transition-colors">
              {uploading ? 'Uploading...' : 'Upload Audio'}
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => handleAudioUpload(e.target.files[0])}
                disabled={uploading}
              />
            </label>
            {audioFile && (
              <span className="text-sm text-[var(--color-muted)]">
                {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            )}
          </div>
          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Video Upload */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
          Video File
        </label>
        <div className="space-y-2">
          <Input
            value={formData.video_url || ''}
            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
            placeholder="https://example.com/video.mp4"
            className="w-full"
          />
          <div className="flex gap-2">
            <label className="px-3 py-2 bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-700 transition-colors">
              {uploading ? 'Uploading...' : 'Upload Video'}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleVideoUpload(e.target.files[0])}
                disabled={uploading}
              />
            </label>
            {videoFile && (
              <span className="text-sm text-[var(--color-muted)]">
                {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            )}
          </div>
          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
