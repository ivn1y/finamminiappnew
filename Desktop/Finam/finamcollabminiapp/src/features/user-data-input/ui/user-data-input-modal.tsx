'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Checkbox } from '@/shared/ui/checkbox';
import styles from './user-data-input-modal.module.css';
import { useAppStore } from '@/shared/store/app-store';
import { validateUserForm, validateEmail, validatePhone, validateName } from '@/shared/lib/validation';
import { RoleSelectionModal } from '@/features/role-carousel/ui/role-selection-modal';
import { roleContent } from '@/shared/data/seed';
import { UserRole } from '@/shared/types/app';
import { PrivacyPolicyModal } from './privacy-policy-modal';
import { AdvertisingConsentModal } from './advertising-consent-modal';

// Feature flag для скрытия кнопки закрытия в модальном окне ввода данных (временное решение для привлечения лидов)
const HIDE_CLOSE_BUTTON = true;

interface UserDataInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserData) => void;
  initialData?: Partial<UserData>;
  onDataChange?: (data: Partial<UserData>) => void;
  title?: string;
  description?: string;
  showOptionalFields?: boolean;
  requiredFields?: (keyof UserData)[];
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  goals: string;
  interests: string;
}

export const UserDataInputModal: React.FC<UserDataInputModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  onDataChange,
  requiredFields = ['name', 'email'],
}) => {
  const [formData, setFormData] = useState<UserData>({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    company: initialData.company || '',
    position: initialData.position || '',
    goals: initialData.goals || '',
    interests: initialData.interests || '',
  });

  const { user, updateUser } = useAppStore();
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof UserData | 'policy', string>>>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAdvertisingModal, setShowAdvertisingModal] = useState(false);
  const inputRefs = {
    name: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
  };

  const currentRole = user?.role || null;
  const currentRoleTitle = currentRole ? roleContent.find(r => r.id === currentRole)?.title : 'Не выбрано';
  const previousRoleRef = useRef<UserRole | null>(currentRole);
  const hasFormDataRef = useRef(false);
  const isRoleChangingRef = useRef(false);

  // Инициализируем форму только при первом открытии или если форма пустая
  useEffect(() => {
    if (isOpen && initialData && !isRoleChangingRef.current) {
      // Если форма еще не заполнена пользователем, инициализируем из initialData
      if (!hasFormDataRef.current) {
        setFormData({
          name: initialData.name || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          company: initialData.company || '',
          position: initialData.position || '',
          goals: initialData.goals || '',
          interests: initialData.interests || '',
        });
      }
    }
  }, [isOpen, initialData]);

  // Отслеживаем, когда пользователь начинает заполнять форму
  useEffect(() => {
    const hasAnyData = formData.name || formData.email || formData.phone || 
                      formData.company || formData.position || formData.goals || formData.interests;
    if (hasAnyData) {
      hasFormDataRef.current = true;
    }
  }, [formData]);

  // Сбрасываем флаг при закрытии модального окна
  useEffect(() => {
    if (!isOpen) {
      hasFormDataRef.current = false;
      previousRoleRef.current = currentRole;
      isRoleChangingRef.current = false;
      setShowThankYou(false); // Сбрасываем экран благодарности при закрытии
    }
  }, [isOpen, currentRole]);

  const handleInputChange = (field: keyof UserData, value: string) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    if (onDataChange) {
      onDataChange({ [field]: value });
    }
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Валидация в реальном времени для лучшего UX
    validateField(field, value);
  };

  const validateField = (field: keyof UserData, value: string) => {
    let validationResult: { isValid: boolean; error?: string; formatted?: string; country?: string } = { isValid: true };

    switch (field) {
      case 'name':
        validationResult = validateName(value);
        break;
      case 'email':
        validationResult = validateEmail(value);
        break;
      case 'phone':
        validationResult = validatePhone(value);
        // Автоматически форматируем номер при вводе только если он полный
        // Для российского номера (начинается с 8) нужно 11 цифр
        // Для международного формата (+7) проверяем, что номер полный
        const digitsOnly = value.replace(/\D/g, '');
        const isCompleteRussianNumber = value.startsWith('8') && digitsOnly.length === 11;
        const isCompleteInternationalNumber = value.startsWith('+') && digitsOnly.length >= 10;
        
        if (validationResult.isValid && validationResult.formatted && 
            (isCompleteRussianNumber || isCompleteInternationalNumber)) {
          setFormData(prev => ({ ...prev, phone: validationResult.formatted! }));
        }
        break;
    }

    if (!validationResult.isValid && value.trim() !== '') {
      setErrors((prev) => ({ ...prev, [field]: validationResult.error }));
    }
  };

  const validateForm = (): { isValid: boolean; formattedData?: Partial<UserData> } => {
    const validationResult = validateUserForm(formData, requiredFields);
    
    const newErrors: Partial<Record<keyof UserData | 'policy', string>> = {
      ...validationResult.errors
    };

    if (!agreedToPolicy) {
      newErrors.policy = 'Необходимо согласиться с политикой обработки персональных данных';
    }

    setErrors(newErrors);
    return { 
      isValid: validationResult.isValid && agreedToPolicy,
      formattedData: validationResult.formattedData
    };
  };

  const handleSave = () => {
    const validation = validateForm();
    if (validation.isValid) {
      // Используем отформатированные данные, если они есть, иначе используем исходные
      const dataToSave: UserData = {
        ...formData,
        ...(validation.formattedData || {})
      };
      onSave(dataToSave);
      // Показываем экран благодарности вместо закрытия
      setShowThankYou(true);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    if (user) {
      // Устанавливаем флаг, что происходит смена роли
      isRoleChangingRef.current = true;
      
      // Сохраняем текущие данные формы перед сменой роли
      const currentFormData = { ...formData };
      
      // Обновляем роль и аватар (персонаж)
      updateUser({
        role,
        avatar: {
          characterId: `${role}_v1`,
          frameId: user.avatar?.frameId,
          accessories: user.avatar?.accessories || [],
        },
      });

      // Восстанавливаем данные формы после обновления роли
      // Используем setTimeout, чтобы обновление произошло после обновления store
      setTimeout(() => {
        setFormData(currentFormData);
        if (onDataChange) {
          onDataChange(currentFormData);
        }
        // Сбрасываем флаг после восстановления данных
        isRoleChangingRef.current = false;
      }, 0);
    }
  };

  // Функция для прокрутки к полю ввода при фокусе (для мобильных устройств)
  const handleInputFocus = (field: 'name' | 'phone' | 'email') => {
    setFocusedInput(field);
    // Используем requestAnimationFrame для того, чтобы скролл произошел после появления клавиатуры
    requestAnimationFrame(() => {
      setTimeout(() => {
        const inputElement = inputRefs[field].current;
        if (inputElement) {
          inputElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 300); // Небольшая задержка для появления клавиатуры
    });
  };

  if (!isOpen) {
    return null;
  }

  // Показываем экран благодарности
  if (showThankYou) {
    return (
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <div className={styles.gradient} />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth: '353px',
              padding: '0 20px',
              textAlign: 'center',
              zIndex: 1,
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
                marginBottom: '20px',
              }}
            >
              Спасибо за ваш отклик
            </h1>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.72)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '17px',
                fontWeight: 400,
                lineHeight: '24px',
                letterSpacing: '-0.17px',
                margin: 0,
              }}
            >
              Мы свяжемся с вами в ближайшее время
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {!HIDE_CLOSE_BUTTON && (
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        )}
        <div className={styles.gradient} />
        <h1 className={styles.title}>Профиль</h1>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className={styles.form}>
          <div className={`${styles.inputGroup} ${styles.nameInput}`}>
            <div className={styles.inputWrapper}>
              {focusedInput === 'name' && (
                <div className={styles.gradientBorder}>
                  <div className={styles.gradientBorderInner} />
                </div>
              )}
              <input
                ref={inputRefs.name}
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onFocus={() => handleInputFocus('name')}
                onBlur={() => setFocusedInput(null)}
                placeholder="Имя, Фамилия*"
                className={`${styles.input} ${errors.name ? styles.error : ''}`}
              />
            </div>
          </div>

          <div className={`${styles.inputGroup} ${styles.phoneInput}`}>
            <div className={styles.inputWrapper}>
              {focusedInput === 'phone' && (
                <div className={styles.gradientBorder}>
                  <div className={styles.gradientBorderInner} />
                </div>
              )}
              <input
                ref={inputRefs.phone}
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onFocus={() => handleInputFocus('phone')}
                onBlur={() => setFocusedInput(null)}
                placeholder="+7 912 345-67-89"
                className={`${styles.input} ${errors.phone ? styles.error : ''}`}
              />
            </div>
          </div>

          <div className={`${styles.inputGroup} ${styles.emailInput}`}>
            <div className={styles.inputWrapper}>
              {focusedInput === 'email' && (
                <div className={styles.gradientBorder}>
                  <div className={styles.gradientBorderInner} />
                </div>
              )}
              <input
                ref={inputRefs.email}
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onFocus={() => handleInputFocus('email')}
                onBlur={() => setFocusedInput(null)}
                placeholder="E-mail*"
                className={`${styles.input} ${errors.email ? styles.error : ''}`}
              />
            </div>
          </div>

          <div className={`${styles.inputGroup} ${styles.roleInput}`}>
            <div className={styles.inputWrapper}>
              <button
                type="button"
                onClick={() => setShowRoleModal(true)}
                className={`${styles.input} ${styles.roleButton}`}
                style={{ cursor: 'pointer', textAlign: 'left' }}
              >
                {currentRoleTitle}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Сохранить
          </button>

          <div className={styles.privacyContainer}>
            <Checkbox
              id="privacy-policy"
              checked={agreedToPolicy}
              onCheckedChange={(checked) => setAgreedToPolicy(checked as boolean)}
              className={styles.checkbox}
            />
            <label 
              htmlFor="privacy-policy" 
              className={styles.privacyText}
              onClick={(e) => {
                // Если клик был на ссылку, не переключаем чекбокс
                const target = e.target as HTMLElement;
                if (target.tagName === 'A' || target.closest('a')) {
                  return;
                }
                // Переключаем чекбокс при клике на текст
                setAgreedToPolicy(!agreedToPolicy);
              }}
            >
              Отправляя форму, я даю согласие на{' '}
              <span 
                className={styles.privacyLink}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowPrivacyModal(true);
                }}
                style={{ cursor: 'pointer' }}
              >
                обработку персональных данных
              </span>
              {' '}и{' '}
              <span 
                className={styles.privacyLink}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowAdvertisingModal(true);
                }}
                style={{ cursor: 'pointer' }}
              >
                получение рекламных рассылок
              </span>
            </label>
          </div>
          {errors.policy && <p style={{ color: 'red', fontSize: '12px', position: 'absolute', top: '612px', left: '28px' }}>{errors.policy}</p>}
        </form>
      </div>

      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onSelect={handleRoleSelect}
        currentRole={currentRole}
      />

      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />

      <AdvertisingConsentModal
        isOpen={showAdvertisingModal}
        onClose={() => setShowAdvertisingModal(false)}
      />
    </div>
  );
};
