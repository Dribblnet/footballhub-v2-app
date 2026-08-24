import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/branding/logo.png';

/**
 * Official Dribbl.net Brand Logo Component
 * 
 * @param {Object} props
 * @param {'small' | 'medium' | 'large' | 'hero'} [props.size='medium'] - Pre-configured scaling sizes
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.style] - Additional inline styles
 * @param {boolean} [props.clickable=true] - Navigates to home when clicked
 */
const BrandLogo = ({ size = 'medium', className = '', style = {}, clickable = true }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (clickable) {
      navigate('/');
    }
  };

  // Define scale mapping according to design requirements
  const sizeStyles = {
    navIcon: { height: 'clamp(30px, 4vw, 35px)', width: 'auto' },
    small: { height: 'clamp(65px, 7vw + 35px, 90px)', width: 'auto' },
    medium: { height: 'clamp(80px, 10vw + 30px, 110px)', width: 'auto' },
    footer: { width: 'clamp(160px, 20vw + 60px, 320px)', height: 'auto' },
    large: { width: 'clamp(240px, 25vw + 120px, 380px)', height: 'auto' },
    header: { height: 'clamp(110px, 12vw + 40px, 140px)', width: 'auto' }, // Noticeably larger for TopNav
    splash: { height: 'clamp(140px, 15vw + 40px, 180px)', width: 'auto' }, // Noticeably smaller for Splash Screen
    hero: { width: 'clamp(200px, 25vw + 100px, 380px)', height: 'auto' }
  };

  const defaultStyles = {
    cursor: clickable ? 'pointer' : 'default',
    objectFit: 'contain',
    display: 'block',
    transition: 'all 0.3s ease-in-out',
    ...sizeStyles[size],
    ...style
  };

  return (
    <img 
      src={logoImage} 
      alt="Dribbl.net Logo" 
      onClick={handleNavigation}
      style={defaultStyles}
      className={`brand-logo ${className}`}
    />
  );
};

export default BrandLogo;
