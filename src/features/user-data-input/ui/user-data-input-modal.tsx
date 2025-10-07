'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Checkbox } from '@/shared/ui/checkbox';
import styles from './user-data-input-modal.module.css';
import { useAppStore } from '@/shared/store/app-store';

interface UserDataInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserData) => void;
  initialData?: Partial<UserData>;
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
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserData | 'policy', string>> = {};

    requiredFields.forEach((field) => {
      if (!formData[field as keyof UserData]?.trim()) {
        newErrors[field as keyof UserData] = 'Это обязательное поле';
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!agreedToPolicy) {
      newErrors.policy = 'Необходимо согласиться с политикой обработки персональных данных';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
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
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Имя, Фамилия*"
              className={styles.input}
            />
            {errors.name && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
          </div>

          <div className={`${styles.inputGroup} ${styles.phoneInput}`}>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Телефон"
              className={styles.input}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.emailInput}`}>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="E-mail*"
              className={styles.input}
            />
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
