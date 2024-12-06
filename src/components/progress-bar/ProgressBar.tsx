'use client';

import useInternetSpeed from '@/hooks/useInternetSpeed';
import { useMessageContext } from '@/store/AppContextProvider';
import { Progress } from 'antd';
import { useEffect, useState } from 'react';

interface ProgressBarProps {
  onComplete?: () => void;
  isProcessing: boolean;
}

const ProgressBar = ({ onComplete, isProcessing }: ProgressBarProps) => {
  const { speed: networkSpeed } = useInternetSpeed();
  const [progress, setProgress] = useState(0);
  const messageApi = useMessageContext();

  useEffect(() => {
    if (!isProcessing) {
      if (progress < 100) {
        setProgress(100);
        messageApi.success('Processing complete.');
        if (onComplete) onComplete();
      }
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
      const threshold = 95;
      const step = 33;

      for (let i = progress; i < threshold; i += step) {
        const delay =
          delays[Math.min(Math.floor(i / step), delays.length - 1)] || 2000;

        await new Promise((resolve) => {
          timer = setTimeout(() => {
            setProgress((prev) => Math.min(prev + step, threshold));
            resolve(true);
          }, delay);
        });
      }
    };

    simulateProgress().catch((err) => {
      messageApi.error('Progress simulation failed.');
      console.error(err);
    });

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isProcessing, messageApi, networkSpeed, onComplete, progress]);

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

