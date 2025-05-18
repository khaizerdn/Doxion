import { useEffect } from 'react';

const useKeyboardPadding = (containerClass = '.main-container') => {
  useEffect(() => {
    const mainContainer = document.querySelector(containerClass);

    const handleFocus = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        mainContainer.style.paddingBottom = '500px'; // Match keyboard height
        // Ensure the focused input stays in view minimally
        e.target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    };

    const handleBlur = () => {
      mainContainer.style.paddingBottom = '0px';
    };

    // Check if input is focused on mount
    const activeElement = document.activeElement;
    if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
      mainContainer.style.paddingBottom = '500px';
      activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
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