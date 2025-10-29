import { useState, useEffect } from 'react';

export function usePdfCounter() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('pdfpulse_total');
    return saved ? parseInt(saved) : 0;
  });

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem('pdfpulse_total', newCount.toString());
  };

  return { count, increment };
}