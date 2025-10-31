'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

interface ProfileTourProps {
  highlightedElementRect: DOMRect;
  onComplete: () => void;
}

const ProfileTour: React.FC<ProfileTourProps> = ({
  highlightedElementRect,
  onComplete,
}) => {
  const [assistantBlockTop, setAssistantBlockTop] = useState<number | null>(null);

  useEffect(() => {
    if (!highlightedElementRect) {
      setAssistantBlockTop(null);
      return;
    }

    const assistantBlockHeight = 163; // The height of the assistant block
    const offsetBelow = 76;
    const offsetAbove = 20; // A bit of space for positioning above

    const spaceBelow = window.innerHeight - highlightedElementRect.bottom;
    const spaceNeededBelow = assistantBlockHeight + offsetBelow;

    let newTop;

    // Check if there's not enough space below AND there is enough space above
    if (spaceBelow < spaceNeededBelow && highlightedElementRect.top > assistantBlockHeight + offsetAbove) {
      newTop = highlightedElementRect.top - assistantBlockHeight - offsetAbove;
    } else {
      // Default to placing it below
      newTop = highlightedElementRect.bottom + offsetBelow;
    }
    
    setAssistantBlockTop(newTop);

  }, [highlightedElementRect]);

  if (!highlightedElementRect || assistantBlockTop === null) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 9998,
    pointerEvents: 'auto',
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Блокируем клики по overlay - тур нельзя пропустить
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* 4-part overlay */}
      <div 
        style={{ ...overlayStyle, top: 0, left: 0, width: '100%', height: highlightedElementRect.top }} 
        className="pointer-events-auto"
        onClick={handleOverlayClick}
      />
      <div 
        style={{ ...overlayStyle, top: highlightedElementRect.bottom, left: 0, width: '100%', bottom: 0 }} 
        className="pointer-events-auto"
        onClick={handleOverlayClick}
      />
      <div 
        style={{ ...overlayStyle, top: highlightedElementRect.top, left: 0, width: highlightedElementRect.left, height: highlightedElementRect.height }} 
        className="pointer-events-auto"
        onClick={handleOverlayClick}
      />
      <div 
        style={{ ...overlayStyle, top: highlightedElementRect.top, left: highlightedElementRect.right, right: 0, height: highlightedElementRect.height }} 
        className="pointer-events-auto"
        onClick={handleOverlayClick}
      />


      <div
        className="absolute pointer-events-none"
        style={{
          width: highlightedElementRect.width,
          height: highlightedElementRect.height,
          top: highlightedElementRect.top,
          left: highlightedElementRect.left,
          borderRadius: '4px',
          border: '2px solid #2DACE7',
          zIndex: 9999,
        }}
      />

      <div
        className="absolute pointer-events-auto"
        style={{
          width: '353px',
          height: '163px',
          top: assistantBlockTop,
          left: '20px',
          right: '20px',
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
              top: '23px',
              left: '8px',
              width: '146px',
              height: '153px',
            }}
          >
            <Image
              src="/assets/images/bard.png?v=3"
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
              Расскажи о себе, странник. Коснись руны самопознания, и мы узнаем тебя ближе. Мы ищем соратников, разделяющих наши цели. Что привело тебя к нам? Какие испытания ты преодолел? Чем готов пожертвовать ради общего дела?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProfileTour };
