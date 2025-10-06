'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';

interface LevelProgressCircleProps {
  progress: number; // 0-100
  level: number;
  className?: string;
}

export const LevelProgressCircle: React.FC<LevelProgressCircleProps> = ({
  progress,
  level,
  className,
}) => {
  const size = 42.188;
  const strokeWidth = 1.6875; // From user SVG stroke-width="1.6875" on the path with gradient
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id="level-progress-gradient" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop stopColor="#FEDA3B" offset="0%" />
            <stop stopColor="#EF5541" offset="41.1%" />
            <stop stopColor="#801FDB" offset="78.94%" />
            <stop stopColor="#7E2A89" offset="100%" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#373740" // From the existing SVG in profile page
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#level-progress-gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span style={{
            color: '#FFF',
            textAlign: 'center',
            fontFamily: '"Inter Tight", sans-serif',
            fontSize: '19.688px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '110%',
            letterSpacing: '-0.394px',
          }}>
          {level}
        </span>
      </div>
    </div>
  );
};
