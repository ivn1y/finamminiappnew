'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Checkbox } from '@/shared/ui/checkbox';
import styles from './user-data-input-modal.module.css';
import { useAppStore } from '@/shared/store/app-store';
import { validateUserForm, validateEmail, validatePhone, validateName } from '@/shared/lib/validation';

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

  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof UserData | 'policy', string>>>({});
  const [phoneCountry, setPhoneCountry] = useState<string>('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const inputRefs = {
    name: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    if (initialData) {
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
  }, [initialData]);

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
        // Автоматически форматируем номер при вводе
        if (validationResult.isValid && validationResult.formatted) {
          setFormData(prev => ({ ...prev, phone: validationResult.formatted! }));
          setPhoneCountry(validationResult.country || '');
        } else {
          setPhoneCountry('');
        }
        break;
    }

    if (!validationResult.isValid && value.trim() !== '') {
      setErrors((prev) => ({ ...prev, [field]: validationResult.error }));
    }
  };

  const validateForm = (): boolean => {
    const validationResult = validateUserForm(formData, requiredFields);
    
    const newErrors: Partial<Record<keyof UserData | 'policy', string>> = {
      ...validationResult.errors
    };

    if (!agreedToPolicy) {
      newErrors.policy = 'Необходимо согласиться с политикой обработки персональных данных';
    }

    setErrors(newErrors);
    return validationResult.isValid && agreedToPolicy;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
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

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <button onClick={onClose} className={styles.closeButton}>&times;</button>
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
            {errors.name && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
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
                placeholder="+7 912 345-67-89 или +971 50 123-45-67"
                className={`${styles.input} ${errors.phone ? styles.error : ''}`}
              />
            </div>
            {errors.phone && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.phone}</p>}
            {phoneCountry && !errors.phone && (
              <p style={{ color: '#6F6F7C', fontSize: '12px', marginTop: '4px' }}>
                Страна: {phoneCountry}
              </p>
            )}
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
            {errors.email && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
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
            <label htmlFor="privacy-policy" className={styles.privacyText}>
              Отправляя форму, я даю согласие на{' '}
              <Link href="/privacy-policy">
                <span className={styles.privacyLink}>обработку персональных данных</span>
              </Link>
            </label>
          </div>
          {errors.policy && <p style={{ color: 'red', fontSize: '12px', position: 'absolute', top: '510px', left: '28px' }}>{errors.policy}</p>}
        </form>
      </div>
    </div>
  );
};
