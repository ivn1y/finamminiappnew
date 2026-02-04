'use client';

import React from 'react';
import styles from './user-data-input-modal.module.css';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
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
            Политика обработки персональных данных
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
              Настоящая Политика обработки персональных данных (далее — «Политика») определяет порядок обработки и защиты персональных данных пользователей веб-сайта и мобильного приложения (далее — «Сервис»).
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
              Используя Сервис, вы даете согласие на обработку ваших персональных данных в соответствии с настоящей Политикой.
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
              2. Какие данные мы обрабатываем
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Мы обрабатываем следующие категории персональных данных:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
              <li style={{ marginBottom: '8px' }}>Имя и фамилия</li>
              <li style={{ marginBottom: '8px' }}>Адрес электронной почты</li>
              <li style={{ marginBottom: '8px' }}>Номер телефона</li>
              <li style={{ marginBottom: '8px' }}>Название компании</li>
              <li style={{ marginBottom: '8px' }}>Должность</li>
              <li style={{ marginBottom: '8px' }}>Другая информация, предоставленная вами при заполнении форм</li>
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
              3. Цели обработки персональных данных
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Мы используем ваши персональные данные для следующих целей:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
              <li style={{ marginBottom: '8px' }}>Предоставление доступа к Сервису</li>
              <li style={{ marginBottom: '8px' }}>Обработка ваших запросов и обращений</li>
              <li style={{ marginBottom: '8px' }}>Отправка информационных и рекламных материалов</li>
              <li style={{ marginBottom: '8px' }}>Улучшение качества Сервиса</li>
              <li style={{ marginBottom: '8px' }}>Соблюдение требований законодательства</li>
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
              4. Права пользователей
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Вы имеете право:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
              <li style={{ marginBottom: '8px' }}>Получать информацию об обработке ваших персональных данных</li>
              <li style={{ marginBottom: '8px' }}>Требовать уточнения, блокирования или уничтожения персональных данных</li>
              <li style={{ marginBottom: '8px' }}>Отозвать согласие на обработку персональных данных</li>
              <li style={{ marginBottom: '8px' }}>Обжаловать действия оператора в уполномоченный орган</li>
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
              5. Меры защиты персональных данных
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Мы применяем необходимые технические и организационные меры для защиты ваших персональных данных от неправомерного доступа, уничтожения, изменения, блокирования, копирования, предоставления, распространения, а также от иных неправомерных действий.
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
              6. Контактная информация
            </h2>
            <p style={{ marginBottom: '16px' }}>
              По всем вопросам, связанным с обработкой персональных данных, вы можете обратиться к нам по адресу электронной почты, указанному в контактах Сервиса.
            </p>
            
            <p style={{ marginTop: '24px', marginBottom: '16px' }}>
              Настоящая Политика может быть изменена. Актуальная версия всегда доступна на данной странице.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
