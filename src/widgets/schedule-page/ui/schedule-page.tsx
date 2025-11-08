'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/shared/store/app-store';
import { scheduleData as mockScheduleData } from '@/shared/data/seed';
import { ScheduleFilters } from '@/features/schedule-filters';
import { ScheduleTour } from '@/features/app-tour';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/shared/ui/dialog';
import {
  AccordionChevronIcon,
  ClockIcon,
  CloseIcon,
  DocumentIcon,
  SpeakerIcon,
  TimeArrowIcon,
} from '@/shared/ui/icons';
import { ScheduleEvent } from '@/shared/types/app';

const initialScheduleData = [
  {
    block: 'Рынки в 2025 году',
    time: '11:00 - 12:25',
    events: mockScheduleData.events.filter(e => e.block === 'Блок 1: РЫНКИ в 2025'),
  },
  {
    block: 'Обзор стратегий и тактик',
    time: '12:25 - 16:00',
    events: mockScheduleData.events.filter(e => e.block === 'Блок 2: Обзор стратегий и тактик'),
  },
  {
    block: 'Новые возможности',
    time: '16:00 - 17:40',
    events: mockScheduleData.events.filter(e => e.block === 'Блок 3: Новые возможности'),
  },
  {
    block: 'Пост трейд',
    time: '17:40 - 18:55',
    events: mockScheduleData.events.filter(e => e.block === 'Блок 4: Пост трейд'),
  },
  {
    block: 'Завершение',
    time: '18:55',
    events: mockScheduleData.events.filter(e => e.block === 'Блок 5'),
  },
];

const calculateDuration = (time: string) => {
  const [start, end] = time.split(' - ').map(t => {
    const [hours, minutes] = t.split(':').map(Number);
    return hours * 60 + minutes;
  });
  if (isNaN(start) || isNaN(end)) return null;
  const duration = end - start;
  return `${duration} минут`;
};

const EventDetailsDialogContent = ({ event, onClose }: { event: (typeof mockScheduleData.events)[0], onClose: () => void }) => {
  const duration = calculateDuration(event.time);
  const [startTime, endTime] = event.time.split(' - ');

  return (
    <div className="w-[352px] h-[435px] bg-[#1A1A1F] rounded-[10px] p-5 flex flex-col text-white">
      <div className="flex justify-between items-center mb-[28px]">
        <h3 className="font-inter text-[#6F6F7C] text-[18px] font-semibold leading-6 tracking-[-0.216px]">
          {event.format}
        </h3>
        <button onClick={onClose}>
          <CloseIcon />
        </button>
      </div>

      <div className="flex items-start gap-2 mb-8">
        <div className="w-6 flex-shrink-0 flex justify-center">
          <DocumentIcon className="w-[15.6px] h-[19.6px] mt-[3px]" />
        </div>
        <p className="font-inter text-[18px] font-medium leading-6 tracking-[-0.216px]">
          {event.title}
        </p>
      </div>

      <div className="flex items-start gap-2 mb-8">
        <div className="w-6 flex-shrink-0 flex justify-center">
          <ClockIcon className="w-6 h-6" />
        </div>
        <div className="flex-grow">
          <p className="font-inter-tight text-[16px] font-medium leading-[110%] tracking-[0.96px]">
            Вторник 12 Ноября
          </p>
          <div className="flex items-center mt-2">
            <p className="font-inter-tight text-[16px] font-medium leading-[110%] tracking-[0.96px]">{startTime}</p>
            {endTime && <TimeArrowIcon className="ml-[79px] mr-[25px] w-[15.6px] h-[11.6px]" />}
            {endTime && <p className="font-inter-tight text-[16px] font-medium leading-[110%] tracking-[0.96px]">{endTime}</p>}
            {duration && <p className="ml-auto font-inter-tight text-[#6F6F7C] text-[11px] font-medium leading-[110%] tracking-[0.66px]">{duration}</p>}
          </div>
        </div>
      </div>

      {event.speakers.length > 0 && (
        <div className="flex items-start gap-2">
          <div className="w-6 flex-shrink-0 flex justify-center">
            <SpeakerIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="font-inter-tight text-[16px] font-medium leading-[110%] tracking-[0.96px]">
              Спикер:
            </p>
            <p className="font-inter-tight text-[16px] font-medium leading-[110%] tracking-[0.96px] mt-2">
              {event.speakers.join(', ')}
            </p>
          </div>
        </div>
      )}
      
      <button onClick={onClose} className="mt-auto w-full bg-[rgba(79,79,89,0.24)] rounded-lg py-4 text-[#EBEBF2] text-center font-inter text-[17px] font-semibold leading-6 tracking-[-0.204px]">
        Готово
      </button>
    </div>
  );
};


const EventCard = ({ event }: { event: (typeof mockScheduleData.events)[0] }) => {
  const { openScheduleModal } = useAppStore();
  const duration = calculateDuration(event.time);

  return (
    <>
      <button 
        onClick={() => openScheduleModal(event)}
        className="w-full text-left bg-[#151519] rounded-lg p-4 flex justify-between items-center"
      >
        <div className="flex flex-col flex-grow mr-4">
          <span className="font-inter text-white text-base font-medium leading-6 tracking-[-0.128px]">
            {event.title}
          </span>
          <div className="flex items-center mt-2">
            <span className="font-inter-tight text-[#FDB938] text-base font-medium leading-[110%] tracking-[0.96px]">
              {event.time}
            </span>
          </div>
          {event.speakers.length > 0 && (
            <span className="font-inter text-white text-base font-normal leading-6 tracking-[-0.128px] mt-1">
              Спикер: {event.speakers.join(', ')}
            </span>
          )}
        </div>
        <AccordionChevronIcon className="h-[6px] w-[13px] shrink-0 -rotate-90" />
      </button>
    </>
  );
};


export const SchedulePage: React.FC = () => {
  const { showScheduleTour, completeScheduleTourAndGoToAssistant, showAssistantTour, isScheduleModalOpen, closeScheduleModal, selectedScheduleEvent } = useAppStore();
  const [filteredEvents, setFilteredEvents] = useState<ScheduleEvent[] | null>(null);
  const [accordionValue, setAccordionValue] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (showAssistantTour) {
      router.push('/collab/chat');
    }
  }, [showAssistantTour, router]);

  const handleFilterChange = (events: ScheduleEvent[] | null) => {
    setFilteredEvents(events);
  };
  
  const handleAccordionChange = (value: string) => {
    setAccordionValue(value);
  };
  
  const isFiltering = filteredEvents !== null;
  
  // Динамически увеличиваем высоту при открытии аккордеона, но более разумно
  const containerHeight = accordionValue ? '150vh' : '120vh';
  
  return (
    <div className="w-full bg-black overflow-x-hidden" style={{ minHeight: containerHeight }}>
      <div className="flex justify-center">
        <div
          className="relative font-sans"
          style={{ 
            width: '393px', 
            background: '#000', 
            paddingBottom: '191px'
          }}
        >
      {showScheduleTour && <ScheduleTour onComplete={completeScheduleTourAndGoToAssistant} />}
      {/* Background Ellipse */}
      <div
        className="absolute"
        style={{
          width: '454px',
          height: '536px',
          top: 'calc(50% + 88.5px)',
          left: 'calc(50% + 0.5px)',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
        }}
      >
        <div 
          className="absolute"
          style={{
            inset: '-29.85% -35.24%',
            '--fill-0': 'rgba(126, 42, 137, 1)',
          } as React.CSSProperties}
        >
          <img 
            alt="" 
            className="block max-w-none size-full" 
            src="/assets/backgrounds/schedule-ellipse.png"
          />
        </div>
      </div>
      
      <div className="relative z-10 px-4">
        <div className="mt-8">
            <ScheduleFilters events={mockScheduleData.events} onFilterChange={handleFilterChange} />
        </div>

        <div className="mt-[30px]">
          {isFiltering ? (
            <>
              {filteredEvents.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {filteredEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <p className="text-white text-center">Ничего не найдено.</p>
              )}
            </>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4" value={accordionValue} onValueChange={handleAccordionChange}>
              {initialScheduleData.map((item, index) => (
                <AccordionItem
                  value={`item-${index}`}
                  key={index}
                  className="border-none"
                >
                  <AccordionTrigger className="h-[80px] p-4">
                    <div className="flex flex-col items-start text-left">
                      <span className="text-white font-normal font-inter text-[20px] leading-6 tracking-[-0.28px]">
                        {item.block}
                      </span>
                      <span
                        className="font-inter-tight font-medium text-base leading-[110%] mt-[6px]"
                        style={{ color: 'var(--gradients-text-large-start, #FDB938)' }}
                      >
                        {item.time}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 pt-0 data-[state=closed]:animate-none data-[state=open]:animate-none">
                    <div className="flex flex-col gap-2">
                      {item.events.map(event => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
      
      {/* Schedule Modal */}
      {isScheduleModalOpen && selectedScheduleEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center z-[99999] px-4">
          <div className="mb-[20px]">
            <EventDetailsDialogContent 
              event={selectedScheduleEvent} 
              onClose={closeScheduleModal} 
            />
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};
