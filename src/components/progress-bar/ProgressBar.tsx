'use client';

import useInternetSpeed from '@/hooks/useInternetSpeed';
import { message, Progress } from 'antd';
import { useEffect, useState } from 'react';

interface ProgressBarProps {
  onComplete?: () => void;
  isProcessing: boolean;
}

const ProgressBar = ({ onComplete, isProcessing }: ProgressBarProps) => {
  const { speed: networkSpeed } = useInternetSpeed();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      setProgress(0);
      return;
    }

    let timer: NodeJS.Timeout | null = null;
    const baseDelays = [2000, 2000, 2000];

    const getDynamicDelays = (speed: number | null) => {
      if (speed !== null) {
        return baseDelays.map((delay) => delay / (speed > 1 ? speed : 1));
      }
      return baseDelays;
    };

    const delays = getDynamicDelays(networkSpeed);

    const simulateProgress = async () => {
      for (let i = 0; i < 100; i += 33) {
        const delay = delays[Math.min(i / 33, delays.length - 1)] || 2000;
        await new Promise((resolve) => {
          timer = setTimeout(() => {
            setProgress((prev) => Math.min(prev + 33, 100));
            resolve(true);
          }, delay);
        });
      }

      setProgress(100);
      message.success('Processing complete.');
      if (onComplete) onComplete();
    };

    simulateProgress().catch((err) => {
      message.error('Progress simulation failed.');
      console.error(err);
    });

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isProcessing, networkSpeed, onComplete]);

  if (!isProcessing) return null;

  return (
    <div style={{ marginBottom: '16px' }}>
      <span>Searching for the solution...</span>
      <Progress
        percent={progress}
        status={progress === 100 ? 'success' : 'active'}
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
      />
    </div>
  );
};

export default ProgressBar;

