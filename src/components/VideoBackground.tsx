import React from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
  fallbackImage?: string;
  overlay?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoSrc,
  fallbackImage,
  overlay = true,
  children,
  className = ''
}) => {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster={fallbackImage}
      >
        <source src={videoSrc} type="video/mp4" />
        {fallbackImage && (
          <img src={fallbackImage} alt="Background" className="w-full h-full object-cover" />
        )}
      </video>
      
      {/* Dark Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      )}
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};
