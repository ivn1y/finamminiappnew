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
      </button>
    </div>
  );
};
