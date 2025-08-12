import React, { useEffect } from 'react';
import { useBackground } from '../context/BackgroundContext';
import { useLocation } from 'react-router-dom';

export const BackgroundWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { backgroundImage } = useBackground();
  const location = useLocation();

  useEffect(() => {
    // Don't apply background image on user dashboard pages and facility detail pages
    const isUserDashboard = location.pathname.startsWith('/dashboard/user');
    const isFacilityDetail = location.pathname.startsWith('/facility/');
    
    if (isUserDashboard || isFacilityDetail) {
      // Remove background image for user dashboard and facility detail pages
      document.documentElement.style.removeProperty('background-image');
      document.body.style.removeProperty('background-image');
      // Set black background for user dashboard and facility detail pages
      document.documentElement.style.setProperty('background-color', '#000000', 'important');
      document.body.style.setProperty('background-color', '#000000', 'important');
      // Add CSS class for additional styling
      document.body.classList.add('user-dashboard');
      document.documentElement.classList.add('user-dashboard');
      // Remove CSS custom property
      document.documentElement.style.removeProperty('--background-image');
    } else {
      // Apply background image for other pages (landing page, etc.)
      console.log('BackgroundWrapper: Setting background to:', backgroundImage);
      // Set CSS custom property for background image
      document.documentElement.style.setProperty('--background-image', `url('${backgroundImage}')`, 'important');
      // Apply background image directly
      document.documentElement.style.setProperty('background-image', `url('${backgroundImage}')`, 'important');
      document.body.style.setProperty('background-image', `url('${backgroundImage}')`, 'important');
      // Remove black background
      document.documentElement.style.removeProperty('background-color');
      document.body.style.removeProperty('background-color');
      // Remove CSS class
      document.body.classList.remove('user-dashboard');
      document.documentElement.classList.remove('user-dashboard');
    }
  }, [backgroundImage, location.pathname]);

  return <>{children}</>;
};
