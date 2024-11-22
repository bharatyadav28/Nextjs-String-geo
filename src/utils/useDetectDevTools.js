import { useEffect, useState } from 'react';

const useDetectDevTools = () => {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);


  

  useEffect(() => {
    const checkDevTools = () => {
      const threshold = 160; // Adjust this value as needed
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;

      if (widthDiff || heightDiff) {
        setIsDevToolsOpen(true);
      } else {
        setIsDevToolsOpen(false);
      }
    };

    window.addEventListener('resize', checkDevTools);
    checkDevTools(); // Initial check

    return () => {
      window.removeEventListener('resize', checkDevTools);
    };
  }, []);

  return isDevToolsOpen;
};

export default useDetectDevTools;
