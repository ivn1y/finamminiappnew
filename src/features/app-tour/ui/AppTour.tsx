'use client';

import React, { useEffect, useState, RefObject } from 'react';

// NOTE: The font "Inter Tight" is not configured in the project.
// I'm using the default sans-serif font. Please configure the font if needed.

interface AppTourProps {
  isOpen: boolean;
  onClose: () => void;
  highlightElementRef: RefObject<HTMLElement>;
}

export const AppTour: React.FC<AppTourProps> = ({
  isOpen,
  onClose,
  highlightElementRef,
}) => {
  const [highlightBox, setHighlightBox] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateHighlightBox = () => {
      if (highlightElementRef.current) {
        setHighlightBox(highlightElementRef.current.getBoundingClientRect());
      }
    };

    if (isOpen) {
      updateHighlightBox();
      window.addEventListener('resize', updateHighlightBox);
      window.addEventListener('scroll', updateHighlightBox, true);
    }

    return () => {
      window.removeEventListener('resize', updateHighlightBox);
      window.removeEventListener('scroll', updateHighlightBox, true);
    };
  }, [isOpen, highlightElementRef]);

  if (!isOpen) {
    return null;
  }

  const handleHighlightedElementClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent overlay click handler from firing
    if (highlightElementRef.current) {
      highlightElementRef.current.click();
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'transparent', // The shadow creates the overlay effect
        zIndex: 9998,
      }}
    >
      {highlightBox && (
        <div
          onClick={handleHighlightedElementClick}
          style={{
            position: 'absolute',
            top: `${highlightBox.top - 2}px`,
            left: `${highlightBox.left - 2}px`,
            width: `${highlightBox.width + 4}px`,
            height: `${highlightBox.height + 4}px`,
            borderRadius: '4px',
            border: '2px solid #2DACE7',
            background: '#1F1F25',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
            cursor: 'pointer',
            zIndex: 9999,
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: '676px',
          left: '20px',
          right: '20px',
          width: '353px',
          height: '163px',
          flexShrink: 0,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="355"
          height="165"
          viewBox="0 0 355 165"
          fill="none"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <path
            d="M1.22069 8.92531L1 32.5609L1.27679 156.018C1.28668 160.429 4.8655 164 9.27678 164H346C350.418 164 354 160.418 354 156V32.1147C354 27.6964 350.418 24.1147 346 24.1147H162.803C158.385 24.1147 154.803 20.5329 154.803 16.1146V9C154.803 4.58172 151.222 1 146.803 1H9.22034C4.8312 1 1.26167 4.53636 1.22069 8.92531Z"
            fill="#1A1A1F"
            stroke="#CD81FF"
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            top: '5px',
            left: '41px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: '16px',
            background:
              'linear-gradient(90deg, #FDB938 6.62%, #DE6D4B 53.31%, #A55AFF 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          AI-Ассистент
        </div>

        {/* 
          IMPORTANT: Please place the assistant image you provided at
          'public/assets/images/bard.png' for it to be displayed correctly.
        */}
        <div
          style={{
            position: 'absolute',
            top: '28px',
            left: '0px',
            width: '153px',
            height: '136px',
            flexShrink: 0,
            aspectRatio: '9 / 8',
            background:
              'url(/assets/images/bard.png?v=4) lightgray -0.09px -6.377px / 100% 113.007% no-repeat',
            backgroundSize: 'cover',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '28px',
            left: '166px',
            width: '173px',
            height: '113px',
            color: '#FFF',
            fontFamily: '"Inter Tight", sans-serif',
            fontSize: '11px',
            fontWeight: 500,
            lineHeight: '13px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Приветствую тебя, путник сетевых миров! Добро пожаловать в наш нейро-хаб, где кочевники данных отдыхают и получают новые миссии. Мы знаем, ты — кодовый герой, готовый к испытаниям в цифровых глубинах.
        </div>
      </div>
    </div>
  );
};
