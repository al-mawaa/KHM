import { useEffect } from 'react';

/**
 * Lightweight visitor tracking hook
 * Tracks page visits without affecting performance
 * Uses fire-and-forget approach with sendBeacon for reliability
 */
export function useVisitorTracking(pageName: string) {
  useEffect(() => {
    // Skip tracking during development or if not in browser
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'development') {
      return;
    }

    // Get client IP address (will be proxied through the API)
    // For now, we'll let the API handle IP detection
    const trackVisit = async () => {
      try {
        // Use navigator.sendBeacon for reliable tracking even if page is closed
        const data = {
          ipAddress: '', // API will detect this
          page: pageName,
          userAgent: navigator.userAgent,
        };

        // Use fetch with keepalive for better reliability
        await fetch('/api/visitor/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          keepalive: true, // Ensures request completes even if page is closed
        });
      } catch (error) {
        // Silently fail to not affect user experience
        console.error('Visitor tracking failed:', error);
      }
    };

    // Track visit immediately
    trackVisit();

    // Optional: Track on page visibility changes (user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        trackVisit();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pageName]);
}
