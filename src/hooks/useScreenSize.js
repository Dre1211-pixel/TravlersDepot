import { useEffect, useState } from 'react';

const useScreenSize = () => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = screenWidth < 640;
    const isTablet = screenWidth >= 640 && screenWidth < 1024;
    const isDesktop = screenWidth >= 1024;

    return { screenWidth, isMobile, isTablet, isDesktop };
};

export default useScreenSize;