'use client';
import Image from 'next/image';
import React from 'react';
import { useScrollLock } from '@/shared/hooks';

interface ScheduleTourProps {
  onComplete: () => void;
}

const ScheduleTour: React.FC<ScheduleTourProps> = ({ onComplete }) => {
  // Блокируем скролл когда тур активен
  useScrollLock();

  return (
    <div
      className="fixed z-50 pointer-events-auto"
      onClick={onComplete}
      style={{
        top: '-100px',
        left: '-100px',
        right: '-100px',
        bottom: '-100px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }}
    >
      <div
        className="absolute pointer-events-auto"
        style={{
          width: '353px',
          height: '163px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="355"
          height="165"
          viewBox="0 0 355 165"
          fill="none"
          className="absolute inset-0 w-full h-full"
        >
          <path
            d="M1.22069 8.92531L1 32.5609L1.27679 156.018C1.28668 160.429 4.8655 164 9.27678 164H346C350.418 164 354 160.418 354 156V32.1147C354 27.6964 350.418 24.1147 346 24.1147H162.803C158.385 24.1147 154.803 20.5329 154.803 16.1146V9C154.803 4.58172 151.222 1 146.803 1H9.22034C4.8312 1 1.26167 4.53636 1.22069 8.92531Z"
            fill="#1A1A1F"
            stroke="#CD81FF"
          />
        </svg>
        <div className="relative z-10">
          <div
            className="absolute"
            style={{
              top: '5px',
              left: '41px',
            }}
          >
            <p
              style={{
                fontFamily: 'Inter',
                fontSize: '12px',
                fontWeight: 500,
                lineHeight: '16px',
                background:
                  'linear-gradient(90deg, #FDB938 6.62%, #DE6D4B 53.31%, #A55AFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AI-Ассистент
            </p>
          </div>
          <div
            className="absolute"
            style={{
              top: '26px',
              left: '8px',
              width: '146px',
              height: '153px',
            }}
          >
            <Image
              src="/assets/images/bard.png?v=4"
              alt="Assistant"
              width={146}
              height={153}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div
            className="absolute"
            style={{
              top: '36px',
              left: '166px',
              right: '14px',
              bottom: '12px',
              color: 'var(--text-ondark-default, #FFF)',
              fontFamily: '"Inter Tight"',
              fontSize: '11px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '13px',
            }}
          >
            <p style={{ margin: 0 }}>
              Здесь ты откроешь доступ к вещанию мастеров гильдий то есть хранителей знаний и первопроходцев цифровых миров. Они поделятся своими протоколами опыта и помогут откалибровать твой путь.{' '}
              <span
                style={{
                  background: 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Нажми в любое место для продолжения.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ScheduleTour };
