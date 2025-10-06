'use client';

import React from 'react';

export const CuratorContacts: React.FC = () => {
  const handleTelegramClick = () => {
    window.open('https://t.me/timisworking', '_blank');
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '202px',
        padding: '16px 16px 20px 16px',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '16px',
        alignSelf: 'stretch',
        borderRadius: '8px',
        background: '#1A1A1F',
      }}
    >
      <h3
        style={{
          alignSelf: 'stretch',
          color: '#FFF',
          fontFamily: '"Inter Tight", sans-serif',
          fontSize: '24px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '110%',
          letterSpacing: '-0.48px',
          margin: 0,
        }}
      >
        Контакты твоего куратора
      </h3>
      <p
        style={{
          alignSelf: 'stretch',
          color: '#FFF',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '20px',
          letterSpacing: '-0.056px',
          margin: 0,
        }}
      >
        Твой куратор - Тимур Солдатенков
        <br />
        Project Manager в ФГ "Финам"
      </p>
      <button
        onClick={handleTelegramClick}
        style={{
          display: 'flex',
          padding: '16px 24px',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'stretch',
          borderRadius: '8px',
          background: 'rgba(79, 79, 89, 0.24)',
          border: 'none',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              color: '#EBEBF2',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif',
              fontSize: '17px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '24px',
              letterSpacing: '-0.204px',
            }}
          >
            Написать в Telegram
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z" fill="url(#paint0_linear_telegram_icon_curator)"/>
            <defs>
              <linearGradient id="paint0_linear_telegram_icon_curator" x1="10" y1="0" x2="10" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2AABEE"/>
                <stop offset="1" stopColor="#229ED9"/>
              </linearGradient>
            </defs>
            <g transform="translate(4, 5)">
              <path fillRule="evenodd" clipRule="evenodd" d="M1.02651 3.89397C3.94171 2.62387 5.88563 1.78653 6.85828 1.38197C9.63539 0.22688 10.2124 0.0262276 10.5886 0.0196019C10.6713 0.0181447 10.8563 0.0386461 10.9761 0.135865C11.0772 0.217955 11.1051 0.328847 11.1184 0.406678C11.1317 0.484508 11.1483 0.661808 11.1351 0.800345C10.9846 2.38158 10.3334 6.21883 10.0022 7.98984C9.86198 8.73922 9.58596 8.99048 9.31875 9.01507C8.73803 9.06851 8.29706 8.63129 7.73461 8.2626C6.85448 7.68566 6.35726 7.32652 5.50294 6.76353C4.51563 6.11291 5.15566 5.75531 5.71833 5.1709C5.86558 5.01796 8.42424 2.69066 8.47376 2.47954C8.47996 2.45313 8.4857 2.35471 8.42723 2.30274C8.36876 2.25077 8.28246 2.26854 8.22019 2.28268C8.13191 2.30271 6.72589 3.23204 4.00213 5.07066C3.60303 5.3447 3.24155 5.47823 2.91767 5.47123C2.56062 5.46352 1.87379 5.26935 1.36321 5.10338C0.736959 4.89981 0.239227 4.79218 0.282569 4.44646C0.305143 4.26638 0.553123 4.08222 1.02651 3.89397Z" fill="white"/>
            </g>
          </svg>
        </div>
      </button>
    </div>
  );
};
