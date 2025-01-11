"use client";

import { useEffect, useState } from 'react';
import './countdown.css';

interface CountdownOverlayProps {
  onComplete: () => void;
}

export default function CountdownOverlay({ onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (count === 0) return null;

  return (
    <div className="countdown-overlay">
      <div className="countdown-number">{count}</div>
    </div>
  );
}