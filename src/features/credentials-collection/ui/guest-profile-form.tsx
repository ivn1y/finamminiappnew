"use client";

import React, { useState, useEffect } from "react";
import { UserDataInputModal, type UserData } from '@/features/user-data-input';
import { useAppStore } from '@/shared/store/app-store';

const BackArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="20"
    viewBox="0 0 10 20"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.70448 0.259227C9.3289 -0.103986 8.74026 -0.0829544 8.38971 0.306203L0.250181 9.34234C-0.0833931 9.71266 -0.0833931 10.2873 0.250181 10.6577L8.38971 19.6938C8.74026 20.083 9.3289 20.104 9.70448 19.7408C10.0801 19.3776 10.1004 18.7676 9.74982 18.3785L2.20268 10L9.74982 1.62151C10.1004 1.23236 10.0801 0.622441 9.70448 0.259227Z"
      fill="white"
    />
  </svg>
);

export interface GuestProfileFormProps {
  onBack: () => void;
  onNext: (data: any) => void;
}

export function GuestProfileForm({ onBack, onNext }: GuestProfileFormProps) {
  const { isUserDataInputModalOpen, openUserDataInputModal, closeUserDataInputModal } = useAppStore();
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    goals: '',
    interests: '',
  });

  // Автоматически открываем модальное окно при монтировании компонента
  useEffect(() => {
    openUserDataInputModal();
  }, [openUserDataInputModal]);

  const handleUserDataSave = (data: UserData) => {
    setFormData(data);
    closeUserDataInputModal();
    // Передаем данные в родительский компонент
    onNext({
      name: data.name,
      email: data.email,
      phone: data.phone,
    });
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: "393px", height: "852px", backgroundColor: "#000", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "44px", left: "50%", transform: "translateX(-50%)", width: "284px", height: "205px", borderRadius: "284px", opacity: 0.5, background: "#59307C", filter: "blur(80px)", flexShrink: 0 }} />

        <div className="text-white text-center font-inter-tight text-[30px] font-normal leading-[110%] tracking-[-0.6px]" style={{ position: "absolute", top: "111px", left: "50%", transform: "translateX(-50%)", width: "361px" }}>
          Быстрый профиль
        </div>

        <div className="text-center font-inter text-[17px] font-normal leading-[24px] tracking-[-0.17px]" style={{ position: "absolute", top: "144px", left: "50%", transform: "translateX(-50%)", width: "361px", color: "rgba(255, 255, 255, 0.72)" }}>
          Введите свои данные
        </div>

        {/* Кнопка назад */}
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            top: "60px",
            left: "20px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BackArrowIcon />
        </button>

        {/* User Data Input Modal */}
        <UserDataInputModal
          isOpen={isUserDataInputModalOpen}
          onClose={closeUserDataInputModal}
          onSave={handleUserDataSave}
          initialData={formData}
          onDataChange={(newData) => setFormData(prev => ({...prev, ...newData}))}
          requiredFields={['name', 'email', 'phone']}
        />
      </div>
    </div>
  );
}

