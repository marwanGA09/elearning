'use client';

import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useConfettiStore } from '@/hooks/useConfettiStore';

export const ConfettiProvider = () => {
  const { isOpen, onClose } = useConfettiStore();
  const { width, height } = useWindowSize();
  const [runConfetti, setRunConfetti] = useState(false);

  //   console.log({ isOpen, width, height, runConfetti });
  useEffect(() => {
    if (isOpen) {
      // Delay ensures canvas is ready before launching particles
      //   setTimeout(() => {
      setRunConfetti(true);
      //   }, 100);
    }
  }, [isOpen]);

  if (!isOpen || !runConfetti || width === 0 || height === 0) return null;

  return (
    <ReactConfetti
      width={width}
      height={height}
      numberOfPieces={200}
      gravity={0.3}
      wind={0.01}
      friction={0.98}
      recycle={false}
      onConfettiComplete={() => {
        setRunConfetti(false);
        onClose();
      }}
      className="pointer-events-none z-[1000]"
    />
  );
};
