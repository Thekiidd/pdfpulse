// src/hooks/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);

  // LOCAL: localStorage | PROD: Render
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_URL = isLocal ? null : 'https://pdfpulse-4.onrender.com';

  useEffect(() => {
    if (isLocal) {
      const saved = localStorage.getItem('pdfpulse_count');
      setCount(saved ? parseInt(saved) : 0);
    } else {
      fetch(`${API_URL}/api/count`)
        .then(r => r.json())
        .then(d => setCount(d.total || 0))
        .catch(() => setCount(0));
    }
  }, [isLocal, API_URL]);

  const increment = async (type = 'pdf', hash = null) => {
    if (isLocal) {
      const newCount = count + 1;
      localStorage.setItem('pdfpulse_count', newCount);
      setCount(newCount);
    } else {
      try {
        await fetch(`${API_URL}/api/count/increment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, hash })
        });
        setCount(c => c + 1);
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  return { count, increment };
}