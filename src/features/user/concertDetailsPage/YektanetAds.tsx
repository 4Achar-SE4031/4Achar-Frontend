// YektanetAnalytics.tsx
import { useEffect } from 'react';

declare global {
  interface Window {
    yektanetAnalyticsObject: string;
    yektanet: {
      q: any[];
      (...args: any[]): void;
    };
  }
}

const YektanetAnalytics: React.FC = () => {
  useEffect(() => {
    // Initialize Yektanet script
    const initYektanet = () => {
      const w = window;
      const d = document;
      const analyticsObject = 'yektanet';
      
      w.yektanetAnalyticsObject = analyticsObject;
      w[analyticsObject] = w[analyticsObject] || function() {
        (w[analyticsObject].q = w[analyticsObject].q || []).push(arguments);
      };
      
      const head = d.getElementsByTagName('head')[0];
      const now = new Date();
      const scriptUrl = `https://cdn.yektanet.com/superscript/DzCcrgxj/native-concertify.ir-41064/yn_pub.js?v=${
        now.getFullYear().toString() +
        '0' + now.getMonth() +
        '0' + now.getDate() +
        '0' + now.getHours()
      }`;

      // Add preload link
      const preloadLink = d.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'script';
      preloadLink.href = scriptUrl;
      head.appendChild(preloadLink);

      // Add script
      const script = d.createElement('script');
      script.async = true;
      script.src = scriptUrl;
      head.appendChild(script);
    };

    initYektanet();

    // Cleanup function
    return () => {
      // Remove the script and preload link if component unmounts
      const scripts = document.getElementsByTagName('script');
      const links = document.getElementsByTagName('link');
      
      Array.from(scripts).forEach(script => {
        if (script.src.includes('yn_pub.js')) {
          script.remove();
        }
      });
      
      Array.from(links).forEach(link => {
        if (link.href.includes('yn_pub.js')) {
          link.remove();
        }
      });
    };
  }, []);

  return (
    <div id="pos-article-display-103849"></div>
  );
};

export default YektanetAnalytics;