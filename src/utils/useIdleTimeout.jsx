import { useEffect, useCallback, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config.jsx';
import { syncLeds } from './utils/ledSync'; // Import the syncLeds function

export function useIdleTimeout() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(config.idleTimeout / 1000); // Initial time in seconds
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const resetTimeout = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setTimeLeft(config.idleTimeout / 1000);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          syncLeds().then(() => navigate('/')); // Sync LEDs before navigating
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      syncLeds().then(() => {
        navigate('/');
        setTimeLeft(0);
        clearInterval(intervalRef.current);
      });
    }, config.idleTimeout);
  }, [navigate]);

  useEffect(() => {
    const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => document.addEventListener(event, resetTimeout));

    resetTimeout(); // Start the timer on mount

    return () => {
      events.forEach((event) => document.removeEventListener(event, resetTimeout));
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimeout]);

  return { timeLeft };
}

export function IdleTimeoutHandler() {
  const { timeLeft } = useIdleTimeout();

  return (
    <config.TimerDisplay
      timeLeft={timeLeft}
      label="Idle Timeout"
      isVisible={config.showTimers}
      timerType="idle"
    />
  );
}