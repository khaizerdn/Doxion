import { useEffect } from 'react';

const useKeyboardPadding = (containerClass = '.main-container') => {
  useEffect(() => {
    const mainContainer = document.querySelector(containerClass);

    const handleFocus = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        mainContainer.style.paddingBottom = '300px'; // Match keyboard height
      }
    };

    const handleBlur = () => {
      mainContainer.style.paddingBottom = '0px';
    };

    // Check if input is focused on mount
    const activeElement = document.activeElement;
    if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
      mainContainer.style.paddingBottom = '300px'; // Apply padding immediately
    }

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, [containerClass]);
};

export default useKeyboardPadding;