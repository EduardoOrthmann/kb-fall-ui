import { useState, useEffect } from 'react';

const useInternetSpeed = (
  testUrl: string = 'https://jsonplaceholder.typicode.com/posts/1'
) => {
  const [speed, setSpeed] = useState<number | null>(null);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);

  useEffect(() => {
    const measureSpeed = async () => {
      setIsMeasuring(true);
      const startTime = performance.now();
      try {
        const response = await fetch(testUrl, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to fetch test image.');
        }
        const blob = await response.blob();
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;
        const imageSize = blob.size;
        const calculatedSpeed = (imageSize * 8) / duration / 1_000_000;
        setSpeed(calculatedSpeed);
      } catch (error) {
        console.error('Failed to measure internet speed:', error);
        setSpeed(null);
      } finally {
        setIsMeasuring(false);
      }
    };

    measureSpeed();
  }, [testUrl]);

  return { speed, isMeasuring };
};

export default useInternetSpeed;

