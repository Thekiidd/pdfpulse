import React from 'react';
import { Analytics } from "@vercel/analytics/next"

const Button = ({ children, onClick, disabled, variant = 'primary', className = '' }) => {
  const base = 'px-6 py-3 rounded font-medium transition-colors disabled:opacity-50';
  const variants = {
    primary: 'bg-pulse-600 text-white hover:bg-pulse-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default Button;