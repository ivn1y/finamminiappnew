'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/shared/store/app-store';
import { UserRole } from '@/shared/types/app';
import { roleContent } from '@/shared/data/seed';
import { ChevronRight, ChevronLeft, Sparkles, Target, Users, Building2, Lightbulb, AlertCircle, User } from 'lucide-react';
import { RoleCarousel } from '@/features/role-carousel';
import { PrivacyPolicyLink } from '@/features/privacy-policy';
import { TraderProfileForm } from '@/features/credentials-collection/ui/trader-profile-form';
import { StartupProfileForm } from '@/features/credentials-collection/ui/startup-profile-form';
import { ExpertProfileForm } from '@/features/credentials-collection/ui/expert-profile-form';
import { PartnerProfileForm } from '@/features/credentials-collection/ui/partner-profile-form';
import { type CarouselApi } from '@/shared/ui/carousel';

// Логотип Финам
const FinamLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="118" height="118" viewBox="0 0 118 118" fill="none">
    <path d="M89.5059 41.4014C89.4886 41.4305 86.2171 46.9666 81.2451 50.8027C73.4688 56.8024 66.8227 56.7883 61.3037 61.4854C55.7848 66.1824 53.5643 71.1712 53.042 73.4502L46.6328 68.4648C47.1551 66.1859 49.3755 61.197 54.8945 56.5C60.4135 51.8032 67.4209 52.259 74.835 45.8174C82.2491 39.3756 83.0967 36.416 83.0967 36.416L89.5059 41.4014ZM84.9463 24.0244C84.9353 24.0689 82.0782 35.5775 71.8428 43.6807C64.1421 49.7771 57.4204 49.6663 51.9014 54.3633C46.3824 59.0603 44.1619 64.0492 43.6396 66.3281L37.2305 61.3428C37.7527 59.0638 39.9732 54.0749 45.4922 49.3779C51.0111 44.6811 58.0186 45.1369 65.4326 38.6953C76.2524 29.2946 78.5371 19.0391 78.5371 19.0391L84.9463 24.0244ZM73.6943 22.0303C73.6801 22.0756 71.5295 28.8922 62.8701 36.416C55.456 42.8578 48.4477 42.4017 42.9287 47.0986C37.4097 51.7957 35.1893 56.7845 34.667 59.0635L28.2578 54.0781C28.7801 51.7991 31.0006 46.8103 36.5195 42.1133C42.0385 37.4166 49.046 37.8723 56.46 31.4307C65.1419 23.8874 67.2819 17.0554 67.2852 17.0449L73.6943 22.0303Z" fill="url(#paint0_linear_38_1565)"/>
    <path d="M38.2152 92.4246V82.4824H33.691V99.0557H38.2152L45.0383 89.1506V99.0557H49.5442V82.4824H45.0245L38.2152 92.4246ZM24.0964 82.4778H21.403V80.9124H16.8925V82.4917H14.1991C9.34907 82.4778 6.55469 85.5902 6.55469 91.0115C6.55469 95.9941 9.34907 99.0465 14.6029 99.0465H16.8971V100.658H21.4076V99.0465H23.7018C26.3632 99.0465 28.3867 98.2614 29.7633 96.8068C31.1398 95.3522 31.7501 93.4821 31.7501 91.0115C31.7408 85.5902 28.9465 82.4778 24.0964 82.4778ZM16.8925 95.7402H15.8143C12.717 95.7402 11.1661 93.893 11.1661 90.6606C11.1661 87.6405 12.6849 85.8072 15.4793 85.8072H16.8925V95.7402ZM22.4814 95.7402H21.403V85.8211H22.8208C25.6152 85.8211 27.1295 87.7236 27.1295 90.6743C27.1295 93.893 25.5785 95.7402 22.4814 95.7402ZM63.7547 89.1506H56.9271V82.4824H52.4395V99.0557H56.9454V92.4246H63.7731V99.0557H68.279V82.4824H63.7731L63.7547 89.1506ZM106.483 82.4917C104.739 82.4917 103.661 83.4151 103.124 85.0637L100.16 94.1008L97.1497 85.0683C96.6129 83.4106 95.5391 82.4963 93.7909 82.4963H89.6613V99.0465H94.1947V87.3773L98.0215 99.0465H102.298L106.125 87.3773V99.0465H110.631V82.5008L106.483 82.4917ZM84.5038 83.3829C83.6641 82.8057 82.3839 82.4593 80.6312 82.4593H71.6515V85.8072H79.2088C81.7325 85.8072 82.6822 86.6707 82.6822 88.7349V89.1551H76.5015C74.5194 89.1551 73.0372 89.5476 72.0645 90.5635C71.6108 91.03 71.2552 91.5836 71.0187 92.1912C70.7823 92.7991 70.6698 93.4484 70.688 94.1008C70.688 95.8279 71.3441 97.1624 72.4545 97.9752C73.4272 98.6863 74.839 99.0418 76.6897 99.0418H86.8532V89.8063C86.8532 86.6522 86.0869 84.4634 84.5038 83.3829ZM82.6685 95.754H76.7585C75.6526 95.754 74.7395 95.343 74.7395 94.1285C74.7395 92.8079 75.5471 92.4431 76.7585 92.4431H82.7235L82.6685 95.754Z" fill="white"/>
    <path d="M75.7511 114.758V107.739H80.1278V108.65H76.8101V110.57H78.3798C78.9008 110.57 79.3429 110.654 79.7062 110.823C80.0718 110.992 80.3506 111.231 80.5425 111.539C80.7367 111.848 80.8338 112.211 80.8338 112.629C80.8338 113.047 80.7367 113.416 80.5425 113.736C80.3506 114.056 80.0718 114.306 79.7062 114.487C79.3429 114.667 78.9008 114.758 78.3798 114.758H75.7511ZM76.8101 113.867H78.3798C78.6815 113.867 78.9362 113.807 79.1441 113.688C79.3544 113.57 79.5132 113.415 79.6205 113.226C79.7302 113.036 79.7851 112.833 79.7851 112.616C79.7851 112.3 79.664 112.03 79.4218 111.803C79.1796 111.575 78.8323 111.461 78.3798 111.461H76.8101V113.867Z" fill="url(#paint1_linear_38_1565)"/>
    <path d="M68.5243 114.758H67.4001L69.926 107.739H71.1496L73.6755 114.758H72.5514L70.5669 109.014H70.5121L68.5243 114.758ZM68.7128 112.009H72.3594V112.9H68.7128V112.009Z" fill="url(#paint2_linear_38_1565)"/>
    <path d="M59.4017 114.758V113.839L59.6073 113.832C59.8861 113.825 60.1054 113.731 60.2653 113.548C60.4276 113.365 60.5452 113.07 60.6184 112.664C60.6938 112.257 60.744 111.714 60.7692 111.036L60.8891 107.739H65.3275V114.758H64.2822V108.637H61.8865L61.7768 111.317C61.7471 112.068 61.6717 112.7 61.5506 113.212C61.4295 113.722 61.2239 114.107 60.9337 114.367C60.6458 114.627 60.2356 114.758 59.7033 114.758H59.4017Z" fill="url(#paint3_linear_38_1565)"/>
    <path d="M51.4032 114.758V113.839L51.6089 113.832C51.8876 113.825 52.107 113.731 52.2669 113.548C52.4291 113.365 52.5468 113.07 52.6199 112.664C52.6953 112.257 52.7456 111.714 52.7707 111.036L52.8907 107.739H57.3291V114.758H56.2837V108.637H53.888L53.7784 111.317C53.7487 112.068 53.6733 112.7 53.5522 113.212C53.4311 113.722 53.2254 114.107 52.9352 114.367C52.6473 114.627 52.2372 114.758 51.7048 114.758H51.4032Z" fill="url(#paint4_linear_38_1565)"/>
    <path d="M49.5524 111.248C49.5524 111.998 49.4153 112.642 49.1411 113.181C48.8669 113.718 48.491 114.132 48.0135 114.422C47.5382 114.71 46.9979 114.854 46.3924 114.854C45.7846 114.854 45.2419 114.71 44.7644 114.422C44.2891 114.132 43.9144 113.717 43.6402 113.178C43.366 112.638 43.2289 111.995 43.2289 111.248C43.2289 110.499 43.366 109.855 43.6402 109.319C43.9144 108.779 44.2891 108.366 44.7644 108.078C45.2419 107.788 45.7846 107.643 46.3924 107.643C46.9979 107.643 47.5382 107.788 48.0135 108.078C48.491 108.366 48.8669 108.779 49.1411 109.319C49.4153 109.855 49.5524 110.499 49.5524 111.248ZM48.5036 111.248C48.5036 110.677 48.4111 110.196 48.226 109.805C48.0432 109.412 47.7919 109.115 47.472 108.914C47.1544 108.711 46.7945 108.609 46.3924 108.609C45.988 108.609 45.6269 108.711 45.3093 108.914C44.9917 109.115 44.7404 109.412 44.5553 109.805C44.3725 110.196 44.2811 110.677 44.2811 111.248C44.2811 111.819 44.3725 112.301 44.5553 112.694C44.7404 113.085 44.9917 113.382 45.3093 113.586C45.6269 113.787 45.988 113.887 46.3924 113.887C46.7945 113.887 47.1544 113.787 47.472 113.586C47.7919 113.382 48.0432 113.085 48.226 112.694C48.4111 112.301 48.5036 111.819 48.5036 111.248Z" fill="url(#paint5_linear_38_1565)"/>
    <path d="M40.4689 114.758L38.1109 111.611H37.3637V114.758H36.3047V107.739H37.3637V110.703H37.7099L40.3627 107.739H41.6548L38.8478 110.881L41.761 114.758H40.4689Z" fill="url(#paint6_linear_38_1565)"/>
    <defs>
      <linearGradient id="paint0_linear_38_1565" x1="77.8298" y1="17.0449" x2="30.9208" y2="17.0449" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEDA3B"/>
        <stop offset="0.47" stopColor="#EF5541"/>
        <stop offset="0.815" stopColor="#821EE0"/>
        <stop offset="0.98" stopColor="#7F2A8A"/>
      </linearGradient>
      <linearGradient id="paint1_linear_38_1565" x1="35.7419" y1="101.487" x2="81.8387" y2="101.206" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFE479"/>
        <stop offset="1" stopColor="#ED6B51"/>
      </linearGradient>
      <linearGradient id="paint2_linear_38_1565" x1="35.7419" y1="101.487" x2="81.8387" y2="101.206" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFE479"/>
        <stop offset="1" stopColor="#ED6B51"/>
      </linearGradient>
      <linearGradient id="paint3_linear_38_1565" x1="35.7419" y1="101.487" x2="81.8387" y2="101.206" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFE479"/>
        <stop offset="1" stopColor="#ED6B51"/>
      </linearGradient>
      <linearGradient id="paint4_linear_38_1565" x1="35.7419" y1="101.487" x2="81.8387" y2="101.206" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFE479"/>
        <stop offset="1" stopColor="#ED6B51"/>
      </linearGradient>
      <linearGradient id="paint5_linear_38_1565" x1="35.7419" y1="101.487" x2="81.8387" y2="101.206" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFE479"/>
        <stop offset="1" stopColor="#ED6B51"/>
      </linearGradient>
      <linearGradient id="paint6_linear_38_1565" x1="35.7419" y1="101.487" x2="81.8387" y2="101.206" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFE479"/>
        <stop offset="1" stopColor="#ED6B51"/>
      </linearGradient>
    </defs>
  </svg>
);

const roleIcons = {
  trader: Target,
  startup: Lightbulb,
  expert: Users,
  partner: Building2,
  guest: User
};

const SelectedIndicator = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="6" viewBox="0 0 16 6" fill="none">
    <path d="M0 3C0 1.34315 1.34315 0 3 0H13C14.6569 0 16 1.34315 16 3C16 4.65685 14.6569 6 13 6H3C1.34315 6 0 4.65685 0 3Z" fill="#F9A605"/>
  </svg>
);

const UnselectedIndicator = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
    <path d="M0 3C0 1.34315 1.34315 0 3 0C4.65685 0 6 1.34315 6 3C6 4.65685 4.65685 6 3 6C1.34315 6 0 4.65685 0 3Z" fill="#C0C0CC" fillOpacity="0.56"/>
  </svg>
);

export const Onboarding: React.FC = () => {
  const router = useRouter();
  const { setUser, updateUser, completeOnboarding, eventMode } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>('trader');
  const [profileData, setProfileData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customMarkets, setCustomMarkets] = useState<string>('');
  const [carouselApi, setCarouselApi] = useState<CarouselApi | undefined>();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const handleSelect = () => {
      const newIndex = carouselApi.selectedScrollSnap();
      setCurrentSlide(newIndex);
      const newRole = roleContent[newIndex].id;
      setSelectedRole(newRole);
    };

    carouselApi.on('select', handleSelect);
    handleSelect();

    return () => {
      carouselApi.off('select', handleSelect);
    };
  }, [carouselApi]);


  const handleWelcomeNext = () => {
    setCurrentStep(1);
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    // Очищаем ошибки при выборе роли
    if (errors.role) {
      setErrors({...errors, role: ''});
    }
  };

  const handleRoleNext = () => {
    if (selectedRole) {
      setCurrentStep(2);
    } else {
      // Если роль не выбрана, показываем ошибку
      setErrors({...errors, role: 'Выберите роль'});
    }
  };

  const handleProfileNext = async (data?: any) => {
    // Валидация для трейдера
    // if (selectedRole === 'trader') {
    //   if (!profileData.experience) {
    //     setErrors({...errors, experience: 'Выберите опыт торговли'});
    //     return;
    //   }
    //   if (!profileData.markets || profileData.markets.length === 0) {
    //     setErrors({...errors, markets: 'Выберите хотя бы один рынок'});
    //     return;
    //   }
    // }

    if (data) {
      setProfileData(data);
    }
    
    // Валидация для стартапа
    // if (selectedRole === 'startup') {
    //   if (!profileData.projectStage) {
    //     setErrors({...errors, projectStage: 'Выберите стадию проекта'});
    //     return;
    //   }
    //   if (!profileData.productDescription || profileData.productDescription.trim() === '') {
    //     setErrors({...errors, productDescription: 'Опишите свой продукт в трех словах'});
    //     return;
    //   }
    // }
    
    // Валидация для эксперта
    // if (selectedRole === 'expert') {
    //   if (!profileData.expertRole) {
    //     setErrors({...errors, expertRole: 'Выберите роль в Collab'});
    //     return;
    //   }
    //   if (!profileData.expertise || profileData.expertise.trim() === '') {
    //     setErrors({...errors, expertise: 'Укажите область вашей экспертизы'});
    //     return;
    //   }
    //   if (!profileData.experience) {
    //     setErrors({...errors, experience: 'Выберите опыт работы'});
    //     return;
    //   }
    // }
    
    // Валидация для партнера
    // if (selectedRole === 'partner') {
    //   if (!profileData.partnerPackage) {
    //     setErrors({...errors, partnerPackage: 'Выберите что вас интересует'});
    //     return;
    //   }
    // }
    
      await handleFinalSubmit();
  };

  const handleFinalSubmit = async () => {
    if (!selectedRole) {
      console.error('No selected role');
      return;
    }

    try {
      // Очищаем ошибки перед отправкой
      setErrors({});

    const newUser = {
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      role: selectedRole,
        profile: selectedRole === 'guest' ? {} : { [selectedRole]: profileData || {} },
      badges: ['explorer'],
      xp: 100,
      progressSteps: 1,
      name: selectedRole === 'guest' ? 'Гость' : `Пользователь ${selectedRole}`,
      intent7d: selectedRole === 'guest' ? 'Изучить платформу Collab' : 'Изучить возможности платформы'
    };

      console.log('Creating user:', newUser);

    setUser(newUser);
    completeOnboarding();
      
      // Увеличиваем задержку для завершения обновления состояния
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('Navigating to /collab/home');
    router.push('/collab/home');
    } catch (error) {
      console.error('Error creating user:', error);
      // Можно добавить обработку ошибки для пользователя
    }
  };

  const renderWelcomeScreen = () => (
    <div className="relative w-full min-h-screen bg-[#000] overflow-hidden flex flex-col items-center px-4 py-8 sm:px-6 md:px-8">
      {/* Эллипс на заднем фоне */}
      <div 
        className="absolute left-1 top-1/2 transform -translate-y-1/2 w-[387px] h-[268px] rounded-full sm:w-[300px] sm:h-[200px] md:w-[350px] md:h-[240px]"
        style={{
          background: 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
          opacity: 0.12,
          filter: 'blur(80px)',
        }}
      />
      
      {/* Логотип */}
      <div className="relative z-10 mt-8 sm:mt-12" style={{ marginBottom: '92.5px' }}>
        <div className="w-[118px] h-[118px] sm:w-[100px] sm:h-[100px] md:w-[110px] md:h-[110px]">
          <FinamLogo />
              </div>
            </div>

      {/* Текст "Привет!" */}
      <div className="relative z-10" style={{ marginBottom: '13px' }}>
        <h1 
          className="text-white text-center font-inter-tight text-[30px] font-normal leading-[110%] tracking-[-0.6px] sm:text-[28px] md:text-[32px]"
        >
          Привет!
        </h1>
      </div>

      {/* Описательный текст */}
      <div className="relative z-10 max-w-sm sm:max-w-md md:max-w-lg" style={{ marginBottom: '30.5px' }}>
        <p 
          className="text-center text-[17px] font-normal leading-6 tracking-[-0.17px] sm:text-[16px] md:text-[18px]"
          style={{
            color: 'rgba(255, 255, 255, 0.72)',
            fontFamily: 'Inter',
          }}
        >
          Наше мини приложение для конференции{' '}
            <span 
              className="text-[17px] font-normal tracking-[-0.17px]"
              style={{
                background: 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Inter',
                fontSize: '17px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '24px',
                letterSpacing: '-0.17px',
              }}
            >
            TradeId
          </span>{' '}
          поможет найти:
        </p>
            </div>

      {/* Кнопки */}
      <div className="relative z-10 w-full">
        {/* Первая кнопка - 253px для iPhone 16 */}
        <div className="w-full flex justify-center" style={{ marginBottom: '12px' }}>
          <button
            className="flex items-center justify-center gap-10 rounded-lg px-4 py-2 bg-[#59307C] hover:bg-[#6B3A8F] transition-colors"
            style={{
              width: '253px', // длина для iPhone 16
              height: '36px', // ширина для iPhone 16
            }}
          >
            <span 
              className="text-center text-[14px] font-medium leading-[140%] tracking-[-0.196px] sm:text-[13px] md:text-[15px]"
              style={{
                color: '#FFF',
                fontFamily: 'Inter Tight',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '140%',
                letterSpacing: '-0.196px',
              }}
            >
              Посмотреть карту и расписание
            </span>
          </button>
        </div>

        {/* Вторая кнопка - 289px для iPhone 16 */}
        <div className="w-full flex justify-center">
          <button
            className="flex justify-center items-center gap-10 rounded-lg px-4 py-2 bg-[#59307C] hover:bg-[#6B3A8F] transition-colors"
            style={{
              width: '289px', // длина для iPhone 16
              height: '36px', // ширина для iPhone 16
            }}
          >
            <span 
              className="text-center text-[14px] font-medium leading-[140%] tracking-[-0.196px] sm:text-[13px] md:text-[15px]"
              style={{
                color: '#FFF',
                fontFamily: 'Inter Tight',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '140%',
                letterSpacing: '-0.196px',
              }}
            >
              Проходить квесты и получать бонусы
            </span>
          </button>
        </div>
      </div>

      {/* Кнопка "Поехали" */}
      <div className="relative z-10 w-full flex justify-center" style={{ marginTop: '167px', marginBottom: '30px' }}>
          <button
            onClick={handleWelcomeNext}
          className="flex justify-center items-center rounded-lg px-6 py-4 hover:opacity-90 transition-opacity"
          style={{
            width: '353px', // ширина кнопки должна быть больше текста согласия
            background: 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
          }}
        >
          <span 
            className="text-white text-center text-[17px] font-semibold leading-6 tracking-[-0.204px] sm:text-[16px] md:text-[18px]"
            style={{
              fontFamily: 'Inter',
            }}
          >
            Поехали
          </span>
          </button>
      </div>

      {/* Согласие на обработку данных */}
      <div className="relative z-10 w-full flex justify-center" style={{ marginBottom: '28px' }}>
        <div style={{ width: '321px' }}>
          <p 
            className="text-center"
            style={{
              color: 'rgba(255, 255, 255, 0.72)',
              fontFamily: 'Inter',
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '16px',
            }}
          >
            Отправляя форму, я даю согласие на{' '}
            <PrivacyPolicyLink>
              <span 
                style={{
                  background: 'linear-gradient(90deg, #FDB938 6.62%, #DE6D4B 53.31%, #A55AFF 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Inter',
                  fontSize: '12px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '16px',
                }}
              >
                обработку персональных данных
              </span>
            </PrivacyPolicyLink>
          </p>
        </div>
      </div>
    </div>
  );

  const renderRoleSelection = () => (
    <div className="w-full h-screen bg-black flex flex-col items-center px-4 pt-[120px] pb-[90px] overflow-hidden">
      <div className="w-full text-center mb-[15px]">
        <h1
          className="text-white text-[30px] font-normal leading-[110%] tracking-[-0.6px]"
          style={{ fontFamily: '"Inter Tight", sans-serif' }}
        >
          Кто ты?
        </h1>
        <p
          className="text-[17px] font-normal leading-6 tracking-[-0.17px] mt-[13px]"
          style={{
            color: 'rgba(255, 255, 255, 0.72)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Выбери свою роль в экосистеме
        </p>
      </div>

      <div className="w-full">
        <RoleCarousel
          setApi={setCarouselApi}
          onRoleChange={handleRoleSelect}
          currentSlide={currentSlide}
        />
      </div>
      
      <div className="w-full text-center mt-[15px]">
        <h2 
          className="text-white text-[24px] font-normal leading-[110%] tracking-[-0.48px]"
          style={{ fontFamily: '"Inter Tight", sans-serif' }}
        >
          {selectedRole ? roleContent.find(r => r.id === selectedRole)?.title : ''}
        </h2>
        <p 
          className="text-[#6F6F7C] text-[14px] font-normal leading-[120%] tracking-[-0.14px] mt-[6px] max-w-[353px] mx-auto"
          style={{ fontFamily: '"Inter Tight", sans-serif' }}
        >
          {selectedRole ? roleContent.find(r => r.id === selectedRole)?.description : ''}
        </p>
      </div>

      <div className="flex justify-center items-center space-x-2 mt-[20px]">
        {roleContent.map((_, index) => (
          <div key={index}>
            {index === currentSlide ? <SelectedIndicator /> : <UnselectedIndicator />}
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center mt-[44px]">
        <button
          onClick={handleRoleNext}
          className="flex justify-center items-center rounded-lg px-6 py-4 w-[353px] h-[56px]"
          style={{
            background: 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
          }}
        >
          <span
            className="text-white text-center text-[17px] font-semibold leading-6 tracking-[-0.204px]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Поехали
          </span>
        </button>
      </div>
    </div>
  );

  const renderProfileForm = () => {
    if (!selectedRole) return null;

    const role = roleContent.find(r => r.id === selectedRole);
    if (!role) return null;

    // Рендерим форму в зависимости от выбранной роли
    if (selectedRole === 'guest') {
      return renderGuestProfile();
    } else if (selectedRole === 'trader') {
      return renderTraderProfile();
    } else if (selectedRole === 'startup') {
      return renderStartupProfile();
    } else if (selectedRole === 'expert') {
      return renderExpertProfile();
    } else if (selectedRole === 'partner') {
      return renderPartnerProfile();
    }

    return null;
  };

  const renderGuestProfile = () => (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Быстрый профиль</h1>
            <p className="text-gray-600">Расскажи о себе в нескольких словах</p>
            </div>
          
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="text-center py-8">
              <div className="mb-6">
                <User className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Добро пожаловать!</h3>
                <p className="text-gray-600">
                  Как гость, вы можете изучать платформу Collab, знакомиться с сообществом и находить интересные проекты.
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Вы можете в любой момент выбрать конкретную роль и заполнить профиль для получения дополнительных возможностей.
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Назад
            </button>
            <button
              onClick={handleProfileNext}
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              Далее
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    );

  const renderTraderProfile = () => <TraderProfileForm onBack={() => setCurrentStep(1)} onNext={handleProfileNext} />;

  const renderStartupProfile = () => <StartupProfileForm onBack={() => setCurrentStep(1)} onNext={handleProfileNext} />;

  const renderExpertProfile = () => <ExpertProfileForm onBack={() => setCurrentStep(1)} onNext={handleProfileNext} />;

  const renderPartnerProfile = () => <PartnerProfileForm onBack={() => setCurrentStep(1)} onNext={handleProfileNext} />;

  switch (currentStep) {
    case 0:
      return renderWelcomeScreen();
    case 1:
      return renderRoleSelection();
    case 2:
      return renderProfileForm();
    default:
      return renderWelcomeScreen();
  }
};

