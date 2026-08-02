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
    small: { height: 'clamp(65px, 7vw + 35px, 90px)', width: 'auto' },
    medium: { height: 'clamp(80px, 10vw + 30px, 110px)', width: 'auto' },
    large: { width: 'clamp(240px, 25vw + 120px, 380px)', height: 'auto' },
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
