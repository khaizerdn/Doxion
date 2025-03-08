// src/utils/useIdleTimeout.jsx
import { useEffect, useCallback, useState, useRef } from 'react'; // Added useRef
import { useNavigate } from 'react-router-dom';
import { config } from '../config';

export function useIdleTimeout() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(config.idleTimeout / 1000); // Initial time in seconds
  const intervalRef = useRef(null); // Store interval ID
  const timeoutRef = useRef(null); // Store timeout ID for redirect

  const resetTimeout = useCallback(() => {
    // Clear existing interval and timeout
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reset timeLeft to initial value
    setTimeLeft(config.idleTimeout / 1000);

    // Start a new interval to count down every second
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // When timer reaches 0, navigate and clear interval
          clearInterval(intervalRef.current);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Set a timeout for redundancy (in case interval fails)
    timeoutRef.current = setTimeout(() => {
      navigate('/');
      setTimeLeft(0);
      clearInterval(intervalRef.current);
    }, config.idleTimeout);
  }, [navigate]);

  useEffect(() => {
    const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) =>
      document.addEventListener(event, resetTimeout)
    );

    resetTimeout(); // Start the timer on mount

    return () => {
      // Cleanup on unmount
      events.forEach((event) =>
        document.removeEventListener(event, resetTimeout)
      );
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

// Wrapper component with embedded timer display
export function IdleTimeoutHandler() {
  const { timeLeft } = useIdleTimeout();

  // Inline styles for the timer (scoped to this component)
  const timerStyles = `
    .timer-container {
      position: fixed;
      top: 10px;
      right: 10px;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 1rem;
      z-index: 2000;
    }
  `;

  return config.showTimer ? (
    <>
      <style>{timerStyles}</style>
      <div className="timer-container">
        Time Left: {Math.floor(timeLeft)}s
      </div>
    </>
  ) : null;
}