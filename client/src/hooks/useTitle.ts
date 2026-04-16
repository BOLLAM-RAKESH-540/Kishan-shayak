import { useEffect } from 'react';

export const useTitle = (title: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | Kisan Sahayak` : 'Kisan Sahayak';
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};
