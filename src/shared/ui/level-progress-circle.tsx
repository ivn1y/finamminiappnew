'use client';

import React, { useState, useEffect } from 'react';
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
  // Размеры из Figma
  const containerSize = 45; // Внешний контейнер
  const borderWidth = 0.844; // Толщина градиентной обводки (одинаковая для внешней и внутренней)
  const innerCircleSize = containerSize - borderWidth * 2; // Размер уровня внутри внешней обводки (43.312px)
  const gapBetweenBorders = 2; // Расстояние между внешней и внутренней обводками (2px)
  // Внешний размер внутренней обводки должен быть таким, чтобы расстояние между внешними краями обводок было 2px
  // Внешняя обводка заканчивается на: containerSize - borderWidth * 2 = innerCircleSize (43.312px)
  // Внутренняя обводка начинается на: innerCircleSize - gapBetweenBorders = 41.312px
  // Но так как внутренняя обводка имеет padding borderWidth, ее внешний размер: innerCircleSize - gapBetweenBorders
  const innerBorderOuterSize = innerCircleSize - gapBetweenBorders; // 41.312px - внешний размер с учетом отступа
  const innerBorderSize = innerBorderOuterSize - borderWidth * 2; // Размер внутренней части внутренней обводки (39.624px)
  const strokeWidth = 1.6875; // Толщина обводки прогресс-бара
  
  // Animated progress value that smoothly transitions
  const [animatedProgress, setAnimatedProgress] = useState(progress);
  
  useEffect(() => {
    // Update animated progress smoothly when progress changes
    setAnimatedProgress(progress);
  }, [progress]);
  
  // Прогресс-бар заполняет пространство между обводками
  // Внешний край внутренней обводки: innerCircleSize / 2 - gapBetweenBorders
  // Внутренний край внешней обводки: innerCircleSize / 2
  // Прогресс-бар должен заполнять это пространство (gapBetweenBorders)
  // Радиус прогресс-бара - посередине между обводками
  // Толщина прогресс-бара = gapBetweenBorders (2px) - пространство между обводками
  // Учитываем strokeLinecap="square" - нужно немного уменьшить радиус, чтобы не выходил за границы
  // Радиус должен быть точно посередине между обводками, чтобы заполнять пространство
  const progressBarRadius = (innerCircleSize / 2 - gapBetweenBorders + innerCircleSize / 2) / 2; // Средний радиус между обводками
  const progressBarThickness = gapBetweenBorders; // Толщина = пространство между обводками (2px)
  const circumference = 2 * Math.PI * progressBarRadius;
  // strokeDashoffset: 0 = полный круг виден, circumference = ничего не видно
  // Начинаем снизу (после rotate(-90)), поэтому начало должно совпадать с внешней обводкой
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  // Радиусы для обводок (SVG) - одинаковой толщины borderWidth везде
  // Внешняя обводка: центр на containerSize/2
  // Внутренний край внешней обводки на innerCircleSize / 2
  // Радиус обводки (центр обводки) = внутренний радиус + borderWidth/2
  const outerBorderRadius = innerCircleSize / 2 + borderWidth / 2;
  
  // Внутренняя обводка: внешний край должен быть на расстоянии 2px от внутреннего края внешней обводки
  // Внешний край внутренней обводки = innerCircleSize / 2 - gapBetweenBorders
  // Радиус внутренней обводки = внешний край - borderWidth/2
  const innerBorderRadius = (innerCircleSize / 2 - gapBetweenBorders) - borderWidth / 2;
  const innerBorderCenterOffset = (innerCircleSize - innerBorderOuterSize) / 2; // Отступ для центрирования внутренней обводки

  return (
    <div
      className={cn('relative', className)}
      style={{ 
        width: containerSize, 
        height: containerSize,
        position: 'relative',
      }}
    >
      {/* Черный фон уровня */}
      <div
        style={{
          position: 'absolute',
          top: borderWidth,
          left: borderWidth,
          width: innerCircleSize,
          height: innerCircleSize,
          borderRadius: '50%',
          background: '#000',
          zIndex: 0,
        }}
      >
        {/* Внешняя градиентная обводка (SVG) */}
        <svg
          width={containerSize}
          height={containerSize}
          style={{
            position: 'absolute',
            top: -borderWidth,
            left: -borderWidth,
            zIndex: -1,
          }}
          viewBox={`0 0 ${containerSize} ${containerSize}`}
        >
          <defs>
            <linearGradient id={`outer-border-gradient-${level}`} x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse" gradientTransform="rotate(305)">
              <stop offset="0%" stopColor="#FEDA3B" />
              <stop offset="41.57%" stopColor="#EF5541" />
              <stop offset="79.84%" stopColor="#801FDB" />
              <stop offset="101.13%" stopColor="#7E2A89" />
            </linearGradient>
          </defs>
          <circle
            cx={containerSize / 2}
            cy={containerSize / 2}
            r={outerBorderRadius}
            stroke={`url(#outer-border-gradient-${level})`}
            strokeWidth={borderWidth}
            fill="none"
            style={{ shapeRendering: 'geometricPrecision' }}
          />
        </svg>

        {/* Внутренняя градиентная обводка (SVG) */}
        <svg
          width={innerBorderOuterSize}
          height={innerBorderOuterSize}
          style={{
            position: 'absolute',
            top: innerBorderCenterOffset,
            left: innerBorderCenterOffset,
            zIndex: 1,
          }}
          viewBox={`0 0 ${innerBorderOuterSize} ${innerBorderOuterSize}`}
        >
          <defs>
            <linearGradient id={`inner-border-gradient-${level}`} x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse" gradientTransform="rotate(305)">
              <stop offset="0%" stopColor="#FEDA3B" />
              <stop offset="41.57%" stopColor="#EF5541" />
              <stop offset="79.84%" stopColor="#801FDB" />
              <stop offset="101.13%" stopColor="#7E2A89" />
            </linearGradient>
          </defs>
          <circle
            cx={innerBorderOuterSize / 2}
            cy={innerBorderOuterSize / 2}
            r={innerBorderRadius}
            stroke={`url(#inner-border-gradient-${level})`}
            strokeWidth={borderWidth}
            fill="none"
            style={{ shapeRendering: 'geometricPrecision' }}
          />
        </svg>

        {/* Прогресс-бар (желтый, заполняет пространство между обводками) */}
        <svg
          width={innerCircleSize}
          height={innerCircleSize}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 3, // Поверх внутренней обводки (zIndex: 1)
            overflow: 'visible',
          }}
          viewBox={`0 0 ${innerCircleSize} ${innerCircleSize}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <mask id={`progress-ring-mask-${level}`} maskUnits="userSpaceOnUse">
              {/* Черный фон - скрывает все */}
              <rect width="100%" height="100%" fill="black" />
              {/* Белый внешний круг - показывает прогресс-бар строго до внутреннего края внешней обводки */}
              {/* Внутренний край внешней обводки: innerCircleSize / 2 */}
              <circle
                cx={innerCircleSize / 2}
                cy={innerCircleSize / 2}
                r={innerCircleSize / 2}
                fill="white"
              />
              {/* Черный внутренний круг - скрывает часть строго до внешнего края внутренней обводки */}
              {/* Внешний край внутренней обводки: innerCircleSize / 2 - gapBetweenBorders */}
              <circle
                cx={innerCircleSize / 2}
                cy={innerCircleSize / 2}
                r={innerCircleSize / 2 - gapBetweenBorders}
                fill="black"
              />
            </mask>
          </defs>
          <g
            transform={`translate(${innerCircleSize / 2}, ${innerCircleSize / 2}) rotate(-90)`}
          >
            <circle
              cx={0}
              cy={0}
              r={progressBarRadius}
              stroke="#FFC759"
              strokeWidth={progressBarThickness}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="square"
              style={{ 
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                shapeRendering: 'geometricPrecision',
              }}
            />
          </g>
        </svg>

        {/* Текст уровня по центру */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: innerCircleSize,
            height: innerCircleSize,
            zIndex: 10,
          }}
        >
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
    </div>
  );
};
