'use client';

import React from 'react';
import styles from './user-data-input-modal.module.css';

interface AdvertisingConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvertisingConsentModal: React.FC<AdvertisingConsentModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <button onClick={onClose} className={styles.closeButton}>&times;</button>
        <div className={styles.gradient} />
        <div
          style={{
            position: 'absolute',
            top: '90px',
            left: '28px',
            right: '28px',
            bottom: '90px',
            overflowY: 'auto',
            zIndex: 1,
            paddingBottom: '40px',
          }}
        >
          <h1
            style={{
              color: '#fff',
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: '30px',
              fontWeight: 400,
              lineHeight: '110%',
              letterSpacing: '-0.6px',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            Согласие на получение рекламных рассылок
          </h1>
          
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.72)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: 400,
              lineHeight: '22px',
              letterSpacing: '-0.09px',
            }}
          >
            <p style={{ marginBottom: '16px' }}>
              Настоящее Согласие на получение рекламных рассылок (далее — «Согласие») определяет условия получения вами информационных и рекламных материалов от нашего Сервиса.
            </p>
            
            <h2
              style={{
                color: '#fff',
                fontSize: '20px',
                fontWeight: 500,
                marginTop: '24px',
                marginBottom: '12px',
              }}
            >
              1. Общие положения
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Отмечая галочку «Я даю согласие на получение рекламных рассылок», вы подтверждаете, что согласны получать информационные и рекламные материалы на указанный вами адрес электронной почты и/или номер телефона.
            </p>
            
            <h2
              style={{
                color: '#fff',
                fontSize: '20px',
                fontWeight: 500,
                marginTop: '24px',
                marginBottom: '12px',
              }}
            >
              2. Какие материалы вы будете получать
            </h2>
            <p style={{ marginBottom: '16px' }}>
              С вашего согласия мы можем направлять вам:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
              <li style={{ marginBottom: '8px' }}>Информацию о новых продуктах и услугах</li>
              <li style={{ marginBottom: '8px' }}>Рекламные предложения и специальные акции</li>
              <li style={{ marginBottom: '8px' }}>Новости и обновления Сервиса</li>
              <li style={{ marginBottom: '8px' }}>Приглашения на мероприятия и вебинары</li>
              <li style={{ marginBottom: '8px' }}>Полезные материалы и образовательный контент</li>
              <li style={{ marginBottom: '8px' }}>Другие информационные сообщения, связанные с деятельностью Сервиса</li>
            </ul>
            
            <h2
              style={{
                color: '#fff',
                fontSize: '20px',
                fontWeight: 500,
                marginTop: '24px',
                marginBottom: '12px',
              }}
            >
              3. Способы получения рассылок
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Рекламные рассылки могут направляться вам следующими способами:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
              <li style={{ marginBottom: '8px' }}>На адрес электронной почты, указанный при регистрации</li>
              <li style={{ marginBottom: '8px' }}>В виде SMS-сообщений на указанный номер телефона</li>
              <li style={{ marginBottom: '8px' }}>Через push-уведомления в мобильном приложении</li>
              <li style={{ marginBottom: '8px' }}>Другими способами, указанными при регистрации</li>
            </ul>
            
            <h2
              style={{
                color: '#fff',
                fontSize: '20px',
                fontWeight: 500,
                marginTop: '24px',
                marginBottom: '12px',
              }}
            >
              4. Частота рассылок
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Мы стремимся не перегружать вас информацией. Рассылки будут направляться с разумной периодичностью, не чаще нескольких раз в неделю. Вы всегда можете изменить настройки рассылок или отписаться от них.
            </p>
            
            <h2
              style={{
                color: '#fff',
                fontSize: '20px',
                fontWeight: 500,
                marginTop: '24px',
                marginBottom: '12px',
              }}
            >
              5. Право на отказ от рассылок
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Вы имеете право в любой момент отказаться от получения рекламных рассылок:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
              <li style={{ marginBottom: '8px' }}>Используя ссылку «Отписаться» в каждом письме</li>
              <li style={{ marginBottom: '8px' }}>Изменив настройки в личном кабинете</li>
              <li style={{ marginBottom: '8px' }}>Написав нам по адресу электронной почты, указанному в контактах</li>
              <li style={{ marginBottom: '8px' }}>Отправив SMS с текстом «СТОП» на номер, с которого приходят рассылки</li>
            </ul>
            
            <h2
              style={{
                color: '#fff',
                fontSize: '20px',
                fontWeight: 500,
                marginTop: '24px',
                marginBottom: '12px',
              }}
            >
              6. Персонализация рассылок
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Мы можем персонализировать рассылки на основе информации о ваших интересах, предпочтениях и взаимодействии с Сервисом, чтобы предлагать вам наиболее релевантный контент.
            </p>
            
            <h2
              style={{
                color: '#fff',
                fontSize: '20px',
                fontWeight: 500,
                marginTop: '24px',
                marginBottom: '12px',
              }}
            >
              7. Контактная информация
            </h2>
            <p style={{ marginBottom: '16px' }}>
              По всем вопросам, связанным с рекламными рассылками, вы можете обратиться к нам по адресу электронной почты, указанному в контактах Сервиса.
            </p>
            
            <p style={{ marginTop: '24px', marginBottom: '16px' }}>
              Настоящее Согласие может быть изменено. Актуальная версия всегда доступна на данной странице.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
