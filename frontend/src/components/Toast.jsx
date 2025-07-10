import React, { useEffect } from 'react';
import './Toast.css';

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    const soundMap = {
      success: '/sounds/success.mp3',
      error: '/sounds/error.mp3',
      info: '/sounds/info.mp3',
    };
    const audio = new Audio(soundMap[type] || soundMap.info);
    audio.volume = 0.5;
    audio.play();
  }, [type]);

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
      <div className="toast-progress" />
    </div>
  );
}
