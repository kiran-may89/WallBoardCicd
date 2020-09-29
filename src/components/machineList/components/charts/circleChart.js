import React from 'react';
import ProgressCircle from '../../../../components/chart/progress-circle';

export default ({
  format,
  progress,
  progressColor,
  backgroundColor,
  circleSize,
  startAngle = 0,
  endAngle = Math.PI * 2,
}) => {
  const {scale} = format;

  return (
    <ProgressCircle
      style={{
        height: Number(scale(circleSize).toFixed(0)),
        width: Number(scale(circleSize).toFixed(0)),
        position: 'relative',
        zIndex: 2,
      }}
      progress={progress}
      progressColor={progressColor}
      backgroundColor={backgroundColor}
      strokeWidth={scale(2.04)}
      startAngle={startAngle}
      endAngle={endAngle}
    />
  );
};
