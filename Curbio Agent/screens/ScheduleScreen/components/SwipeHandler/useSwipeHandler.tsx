import React, { useState } from 'react';
import { NativeSyntheticEvent, NativeTouchEvent, View } from 'react-native';

interface SwipeHandlers {
  onTouchStart: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
  onTouchEnd: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
}

interface Props {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

const useSwipeHandler = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}: Props): SwipeHandlers => {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const defaultSwipeAmount = 80;

  const onTouchStart = (e: NativeSyntheticEvent<NativeTouchEvent>) => {
    setStartX(e.nativeEvent.locationX);
    setStartY(e.nativeEvent.locationY);
  };

  const onTouchEnd = (e: NativeSyntheticEvent<NativeTouchEvent>) => {
    const endX = e.nativeEvent.locationX;
    const endY = e.nativeEvent.locationY;
    const dx = endX - startX;
    const dy = endY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx >= defaultSwipeAmount) {
        onSwipeRight?.();
      } else if (dx <= -defaultSwipeAmount) {
        onSwipeLeft?.();
      }
    } else {
      if (dy >= defaultSwipeAmount) {
        onSwipeDown?.();
      } else if (dy <= -defaultSwipeAmount) {
        onSwipeUp?.();
      }
    }
  };

  return {
    onTouchStart,
    onTouchEnd,
  };
};

export default useSwipeHandler;
