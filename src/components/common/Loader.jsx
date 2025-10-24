import React from 'react';

const Loader = () => (
  <div className="flex items-center space-x-2">
    <div className="w-5 h-5 border-2 border-pulse-600 border-t-transparent rounded-full animate-spin"></div>
    <span>Procesando...</span>
  </div>
);

export default Loader;