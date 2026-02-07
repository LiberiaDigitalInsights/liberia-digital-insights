import React, { useState, useRef, useEffect } from 'react';

export default function AudioWaveform({ audioUrl, currentTime, duration, onSeek }) {
  const canvasRef = useRef(null);
  const [waveformData, setWaveformData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!audioUrl) return;

    // Skip waveform generation for proxy URLs (large files, streaming)
    if (audioUrl.includes('/audio/proxy/')) {
      console.log('Skipping waveform generation for proxy URL');
      return;
    }

    const generateWaveform = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Create audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Fetch audio file
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Decode audio data
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Get waveform data
        const channelData = audioBuffer.getChannelData(0);
        const samples = 500; // Number of samples to display
        const blockSize = Math.floor(channelData.length / samples);
        const filteredData = [];

        for (let i = 0; i < samples; i++) {
          const blockStart = blockSize * i;
          let sum = 0;

          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(channelData[blockStart + j]);
          }

          filteredData.push(sum / blockSize);
        }

        // Normalize data
        const multiplier = Math.pow(Math.max(...filteredData), -1);
        const normalizedData = filteredData.map((n) => n * multiplier);

        setWaveformData(normalizedData);

        // Clean up
        audioContext.close();
      } catch (err) {
        console.error('Error generating waveform:', err);
        setError('Failed to generate waveform');
      } finally {
        setIsLoading(false);
      }
    };

    generateWaveform();
  }, [audioUrl]);

  useEffect(() => {
    if (!waveformData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw waveform
    const barWidth = width / waveformData.length;
    const barGap = 1;

    waveformData.forEach((value, index) => {
      const barHeight = value * height * 0.8; // 80% of canvas height
      const x = index * barWidth;
      const y = (height - barHeight) / 2;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      gradient.addColorStop(0, '#3b82f6'); // Blue-500
      gradient.addColorStop(1, '#1d4ed8'); // Blue-700

      ctx.fillStyle = gradient;
      ctx.fillRect(x + barGap / 2, y, barWidth - barGap, barHeight);
    });

    // Draw progress
    if (duration > 0) {
      const progressWidth = (currentTime / duration) * width;

      // Progress overlay
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'; // Blue with opacity
      ctx.fillRect(0, 0, progressWidth, height);

      // Progress line
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(progressWidth, 0);
      ctx.lineTo(progressWidth, height);
      ctx.stroke();
    }
  }, [waveformData, currentTime, duration]);

  const handleCanvasClick = (event) => {
    if (!duration || !onSeek) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const clickProgress = x / canvas.width;
    const newTime = clickProgress * duration;

    onSeek(newTime);
  };

  return (
    <div className="w-full">
      {isLoading && (
        <div className="flex items-center justify-center h-16 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Generating waveform...</div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-16 bg-red-50 rounded-lg">
          <div className="text-sm text-red-500">{error}</div>
        </div>
      )}

      {!isLoading && !error && (
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={64}
            className="w-full h-16 cursor-pointer rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={handleCanvasClick}
          />
          <div className="absolute inset-0 pointer-events-none">
            <div className="h-full w-full rounded-lg border border-gray-200" />
          </div>
        </div>
      )}
    </div>
  );
}
