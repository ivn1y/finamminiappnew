'use client';

import React from 'react';
import Image from 'next/image';

export const CompetitionPage: React.FC = () => {
  const handleNavigate = () => {
    const url = 'https://workspace.finam.ru';
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.openLink) {
      (window as any).Telegram.WebApp.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="w-full bg-black overflow-x-hidden">
      <div className="flex justify-center">
        <div 
          className="relative w-[393px] bg-black pb-[100px]"
          style={{ minHeight: '100vh' }}
        >
          {/* Background Ellipse - Hero */}
          <div 
            className="absolute w-[390px] h-[281px] left-0 top-[140px] rounded-[390px] pointer-events-none"
            style={{
              opacity: 0.26,
              background: 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
              filter: 'blur(80px)'
            }}
          />
          
          {/* Background Ellipse - How it works */}
          <div 
            className="absolute w-[284px] h-[150px] left-[73px] top-[499px] rounded-[284px] pointer-events-none -scale-x-100"
            style={{
              opacity: 0.49,
              background: 'linear-gradient(120deg, #141414 39.78%, #371C40 48.19%, #371C40 52.99%, #9D465A 59.21%, #FFB27A 65.42%, #F0E4D8 78.35%)',
              filter: 'blur(80px)'
            }}
          />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center pt-[60px] px-5 gap-[30px]">
            
            {/* Logo */}
            <div className="w-[118px] h-[118px] relative">
              <img
                src="/assets/competition/finam-logo.svg"
                alt="Финам Коллаб"
                width={118}
                height={118}
                className="object-contain"
              />
            </div>

            {/* Hero Section */}
            <div className="flex flex-col items-center gap-5 w-[353px]">
              <div className="flex flex-col items-center gap-[7px]">
                <h1 className="w-[353px] text-white text-center font-inter-tight text-[30px] font-normal leading-[110%] tracking-[-0.6px]">
                  Площадка соревнований по трейдингу, ML и финтех-разработке
                </h1>
                <p className="self-stretch font-inter text-[17px] font-normal text-white/[0.72] text-center leading-[24px] tracking-[-0.17px]">
                  Решай реальные задачи индустрии, выигрывай призы и предложения работы от фондов
                </p>
              </div>
              
              {/* CTA Button */}
              <button
                disabled
                className="px-4 py-3 rounded-lg font-inter font-medium text-[16px] text-white leading-[24px] tracking-[-0.128px] cursor-not-allowed"
                style={{
                  background: 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)'
                }}
              >
                Скоро
              </button>
            </div>

            {/* How it works section */}
            <div className="w-[353px] py-[10px]">
              <h2 className="font-inter-tight text-[24px] text-white leading-[110%] tracking-[-0.48px]">
                Как это работает?
              </h2>
            </div>

            {/* How it works cards */}
            <div className="flex gap-[9px]">
              <div 
                className="relative w-[172px] rounded-lg px-4 py-3 overflow-hidden"
              >
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <Image
                    src="/assets/competition/card-bg-1.png"
                    alt=""
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[rgba(221,221,255,0.1)]" />
                </div>
                <div className="relative flex flex-col gap-[6px] items-center">
                  <div className="w-full aspect-[140/95]" />
                  <p className="font-inter font-medium text-[14px] text-white text-center leading-[20px] tracking-[-0.056px] h-[39px] flex items-center justify-center">
                    Участвуй в соревнованиях
                  </p>
                  <p className="font-inter text-[12px] text-[#6f6f7c] text-center leading-[16px] h-[64px]">
                    Финансовые компании публикуют реальные задачи.
                  </p>
                </div>
              </div>

              <div 
                className="relative w-[172px] rounded-lg px-4 py-3 overflow-hidden"
              >
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <Image
                    src="/assets/competition/card-bg-2.png"
                    alt=""
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[rgba(221,221,255,0.1)]" />
                </div>
                <div className="relative flex flex-col gap-[6px] items-center">
                  <div className="w-full aspect-[140/95]" />
                  <p className="font-inter font-medium text-[14px] text-white text-center leading-[20px] tracking-[-0.056px] h-[39px] flex items-center justify-center">
                    Получай награды
                  </p>
                  <p className="font-inter text-[12px] text-[#6f6f7c] text-center leading-[16px]">
                    Денежные призы, приглашения в команды и карьерные возможности.
                  </p>
                </div>
              </div>
            </div>

            {/* What you get section */}
            <div className="flex flex-col items-center w-[353px] pt-5 pb-[60px] gap-8">
              <h2 className="w-[353px] font-inter-tight text-[30px] text-white text-center leading-[110%] tracking-[-0.6px]">
                Что получаешь
              </h2>

              <div className="flex flex-col gap-5 w-full">
                {/* Prize funds */}
                <div className="relative w-full rounded-lg px-5 py-4 overflow-hidden">
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <Image
                      src="/assets/competition/content-bg-1.png"
                      alt=""
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[rgba(221,221,255,0.1)]" />
                  </div>
                  <div className="relative flex flex-col gap-[10px] w-[228px]">
                    <h3 className="font-inter-tight text-[24px] text-white leading-[110%] tracking-[-0.48px]">
                      Призовые фонды
                    </h3>
                    <p className="font-inter text-[14px] text-[#A4A4B2] leading-[20px] tracking-[-0.056px] w-[198px]">
                      Соревнования с призами до 500 000 ₽
                    </p>
                  </div>
                </div>

                {/* Career opportunities */}
                <div className="relative w-full rounded-lg px-5 py-4 overflow-hidden">
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <Image
                      src="/assets/competition/content-bg-2.png"
                      alt=""
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[rgba(221,221,255,0.1)]" />
                  </div>
                  <div className="relative flex flex-col gap-[10px]">
                    <h3 className="font-inter-tight text-[24px] text-white leading-[110%] tracking-[-0.48px] w-[228px]">
                      Карьерные возможности
                    </h3>
                    <p className="font-inter text-[14px] text-[#A4A4B2] leading-[20px] tracking-[-0.056px] w-[228px]">
                      Лучшие участники получают приглашения в фонды и финтех-команды
                    </p>
                  </div>
                </div>

                {/* Practical experience */}
                <div className="relative w-full rounded-lg px-5 py-4 overflow-hidden">
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <Image
                      src="/assets/competition/content-bg-3.png"
                      alt=""
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[rgba(221,221,255,0.1)]" />
                  </div>
                  <div className="relative flex flex-col gap-[10px] w-[228px]">
                    <h3 className="font-inter-tight text-[24px] text-white leading-[110%] tracking-[-0.48px]">
                      Практический опыт
                    </h3>
                    <p className="font-inter text-[14px] text-[#A4A4B2] leading-[20px] tracking-[-0.056px] w-[285px]">
                      Работа с реальными задачами индустрии
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coming soon section */}
            <div className="relative w-[353px] h-[621px]">
              {/* Background glow */}
              <div 
                className="absolute w-[390px] h-[422px] left-0 top-0 rounded-[422px] pointer-events-none -scale-x-100"
                style={{
                  opacity: 0.3,
                  background: 'linear-gradient(315deg, #FAF1E6 -0.45%, #F9DEC0 15.8%, #ED9FA6 32.05%, #994B69 48.29%, rgba(51, 22, 86, 0.00) 64.54%)',
                  filter: 'blur(80px)'
                }}
              />
              
              <div className="absolute w-full top-[20px]">
                <h2 className="w-full font-inter-tight text-[30px] text-white text-center leading-[110%] tracking-[-0.6px]">
                  Скоро начнутся первые соревнования
                </h2>
              </div>

              {/* Phone mockup */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 top-[113px] w-[264px] h-[349px] rounded-[8px] p-[2px]"
                style={{
                  background: 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)',
                  boxShadow: '0px 74px 21px 0px rgba(255,255,255,0), 0px 47px 19px 0px rgba(255,255,255,0.01), 0px 27px 16px 0px rgba(255,255,255,0.03), 0px 12px 12px 0px rgba(255,255,255,0.04), 0px 3px 6px 0px rgba(255,255,255,0.05)'
                }}
              >
                <div className="relative w-full h-full rounded-[6px] overflow-hidden bg-black">
                  <Image
                    src="/assets/images/trader-diary.png"
                    alt="Дневник трейдера"
                    fill
                    className="object-cover"
                    style={{ objectPosition: 'calc(50% - 55px) center' }}
                  />
                </div>
              </div>

              {/* Card info */}
              <div className="absolute left-1/2 -translate-x-1/2 top-[474px] w-[353px] text-center">
                <h3 className="font-inter-tight text-[24px] text-white leading-[110%] tracking-[-0.48px]">
                  Дневник трейдера
                </h3>
                <p className="font-inter text-[14px] text-[#6f6f7c] leading-[1.2] tracking-[-0.14px] mt-2">
                  ИИ инструмент для успешного трейдинга
                </p>
              </div>

              {/* View button */}
              <button
                disabled
                className="absolute left-1/2 -translate-x-1/2 top-[545px] px-3 py-[10px] rounded-lg font-inter font-medium text-[14px] text-white leading-[20px] tracking-[-0.056px] cursor-not-allowed"
                style={{
                  background: 'linear-gradient(305deg, #FEDA3B -2.67%, #EF5541 38.9%, #801FDB 77.17%, #7E2A89 98.46%)'
                }}
              >
                Скоро
              </button>
            </div>

            {/* Partners section */}
            <div className="relative w-[353px] flex flex-col items-center">
              {/* Background glow */}
              <div 
                className="absolute w-[284px] h-[205px] right-[54px] top-[-23px] rounded-[284px] pointer-events-none"
                style={{
                  opacity: 0.14,
                  background: '#E838C0',
                  filter: 'blur(80px)'
                }}
              />
              
              <div className="relative z-10 flex flex-col items-center gap-8 px-[10px] pt-5">
                <div className="flex flex-col items-center gap-[14px] max-w-[336px] text-center">
                  <h2 className="font-inter-tight text-[30px] text-white text-center leading-[110%] tracking-[-0.6px]">
                    У Воркспейса уже есть партнеры
                  </h2>
                  <p className="font-inter text-[17px] text-white/70 leading-[24px] tracking-[-0.17px]">
                    Заказчики и спонсоры новых соревнований
                  </p>
                </div>

                {/* Partner logos */}
                <div className="flex flex-col gap-2 w-full max-w-[336px]">
                  {/* Финам */}
                  <div className="w-full h-[130px] bg-[#1a1a1f] rounded-lg flex items-center justify-center p-[10px]">
                    <div className="relative w-[160px] h-[72px] flex items-center justify-center">
                      <div className="flex flex-col items-center gap-1">
                        <img
                          src="/assets/competition/partner-finam-union.svg"
                          alt="Финам"
                          width={51}
                          height={47}
                          className="object-contain"
                        />
                        <img
                          src="/assets/competition/partner-finam-vector.svg"
                          alt="Финам"
                          width={96}
                          height={18}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Viking */}
                  <div className="w-full h-[130px] bg-[#1a1a1f] rounded-lg flex items-center justify-center p-[10px]">
                    <div className="relative w-[160px] h-[72px] flex items-center justify-center">
                      <img
                        src="/assets/logos/viking.svg"
                        alt="Viking"
                        width={130}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Финам Дневник */}
                  <div className="w-full h-[130px] bg-[#1a1a1f] rounded-lg flex items-center justify-center p-[10px]">
                    <div className="relative w-[160px] h-[72px] flex items-center justify-center">
                      <img
                        src="/assets/logos/finamDiarygray.svg"
                        alt="Финам Дневник"
                        width={180}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
