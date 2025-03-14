import React, { useMemo } from 'react';

// Base configuration object
const configSettings = {
    idleTimeout: 60000, // 60 seconds in milliseconds for idle timer
    otpTimeout: 120000, // 120 seconds (2 minutes) in milliseconds for OTP timer
    showTimers: true, // Single flag to show all timers (idle and OTP)
    fontFamily: 'Inter, sans-serif' // Default font family
};

// Track active timers based on showTimers
const activeTimers = {
    idle: configSettings.showTimers,
    otp: configSettings.showTimers
};

// TimerDisplay component with dynamic positioning
const TimerDisplay = ({ timeLeft, label, isVisible, timerType }) => {
    // Calculate top offset based on active timers
    const getTopOffset = useMemo(() => {
        if (!isVisible) return '0px'; // Not visible, no offset needed

        let offset = 10; // Base offset in pixels
        const timerHeight = 30; // Approximate height of a timer (adjust based on actual height)

        if (timerType === 'idle') {
            return `${offset}px`; // Idle timer always at the top
        }

        if (timerType === 'otp') {
            if (activeTimers.idle) {
                offset += timerHeight; // Shift down if idle timer is active
            }
            return `${offset}px`;
        }

        return `${offset}px`; // Default fallback
    }, [timerType, isVisible]);

    const styles = `
        .timer-container-${timerType} {
            position: fixed;
            top: ${getTopOffset};
            right: 10px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 1rem;
            z-index: 2000;
            transition: opacity 0.3s ease; /* Smooth fade for visibility changes */
        }
        .timer-container-${timerType}.expired {
            color: var(--color-error); /* Red when expired */
        }
        .timer-container-${timerType}.placeholder {
            opacity: 0.5; /* Dimmed when waiting for data */
        }
    `;

    // Format time as MM:SS, or show placeholder if not ready
    const formatTime = () => {
        if (timeLeft === null || timeLeft === undefined || isNaN(timeLeft)) {
            return '--:--'; // Placeholder when timeLeft is not set
        }
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return isVisible ? (
        <>
            <style>{styles}</style>
            <div className={`timer-container-${timerType} ${timeLeft === 0 ? 'expired' : ''} ${timeLeft === null || timeLeft === undefined || isNaN(timeLeft) ? 'placeholder' : ''}`}>
                {label}: {formatTime()}
            </div>
        </>
    ) : null;
};

// Export both config and TimerDisplay
export const config = {
    ...configSettings,
    TimerDisplay
};