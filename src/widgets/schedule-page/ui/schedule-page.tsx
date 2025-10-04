'use client';

import React, { useState } from 'react';
import { scheduleData as mockScheduleData } from '@/shared/data/seed';
import { ScheduleFilters } from '@/features/schedule-filters';
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
    time: '10:00 - 11:15',
    events: mockScheduleData.events.filter(e => e.block === 'Блок 1: РЫНКИ в 2025'),
  },
  {
    block: 'Обзор стратегий и тактик',
    time: '11:35 - 14:50',
    events: mockScheduleData.events.filter(e => e.block === 'Блок 2: Обзор стратегий и тактик'),
  },
  {
    block: 'Новые возможности',
    time: '14:50 - 16:40',
    events: mockScheduleData.events.filter(e => e.block === 'Блок 3: Новые возможности'),
  },
  {
    block: 'Пост трейд',
    time: '17:00 - 18:40',
    events: mockScheduleData.events.filter(e => e.block === 'Блок 4: Пост трейд'),
  },
  {
    block: 'Завершение',
    time: '18:40 - 19:00',
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

const EventDetailsDialogContent = ({ event }: { event: (typeof mockScheduleData.events)[0] }) => {
  const duration = calculateDuration(event.time);
  const [startTime, endTime] = event.time.split(' - ');

  return (
    <div className="w-[352px] h-[435px] bg-[#1A1A1F] rounded-[10px] p-5 flex flex-col text-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-inter text-[#6F6F7C] text-[18px] font-semibold leading-6 tracking-[-0.216px]">
          {event.format}
        </h3>
        <DialogClose asChild>
          <button>
            <CloseIcon />
          </button>
        </DialogClose>
      </div>

      <div className="flex items-start gap-2 mb-8">
        <DocumentIcon className="w-[15.6px] h-[19.6px] flex-shrink-0 mt-1" />
        <p className="font-inter text-[18px] font-medium leading-6 tracking-[-0.216px]">
          {event.title}
        </p>
      </div>

      <div className="flex items-start gap-2 mb-8">
        <ClockIcon className="w-6 h-6 flex-shrink-0" />
        <div className="flex-grow">
          <p className="font-inter-tight text-[16px] font-medium leading-[110%] tracking-[0.96px]">
            Вторник 12 Ноября
          </p>
          <div className="flex items-center mt-2">
            <p className="font-inter-tight text-[16px] font-medium leading-[110%] tracking-[0.96px]">{startTime}</p>
            {endTime && <TimeArrowIcon className="mx-2 w-[15.6px] h-[11.6px]" />}
            {endTime && <p className="font-inter-tight text-[16px] font-medium leading-[110%] tracking-[0.96px]">{endTime}</p>}
            {duration && <p className="ml-auto font-inter-tight text-[#6F6F7C] text-[11px] font-medium leading-[110%] tracking-[0.66px]">{duration}</p>}
          </div>
        </div>
      </div>

      {event.speakers.length > 0 && (
        <div className="flex items-start gap-2">
          <SpeakerIcon className="w-6 h-6 flex-shrink-0" />
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
      
      <DialogClose asChild>
        <button className="mt-auto w-full bg-[rgba(79,79,89,0.24)] rounded-lg py-4 text-[#EBEBF2] text-center font-inter text-[17px] font-semibold leading-6 tracking-[-0.204px]">
          Готово
        </button>
      </DialogClose>
    </div>
  );
};


const EventCard = ({ event }: { event: (typeof mockScheduleData.events)[0] }) => (
  <Dialog>
    <DialogTrigger asChild>
      <button className="w-full text-left bg-[#151519] rounded-lg p-4 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-inter text-white text-base font-medium leading-6 tracking-[-0.128px]">
            {event.title}
          </span>
          <span className="font-inter-tight text-[#FDB938] text-base font-medium leading-[110%] tracking-[0.96px] mt-2">
            {event.time}
          </span>
          {event.speakers.length > 0 && (
            <span className="font-inter text-white text-base font-normal leading-6 tracking-[-0.128px] mt-1">
              Спикер: {event.speakers.join(', ')}
            </span>
          )}
        </div>
        <AccordionChevronIcon className="h-[6px] w-[13px] shrink-0 -rotate-90" />
      </button>
    </DialogTrigger>
    <DialogContent className="bg-transparent border-none p-0 m-0 flex items-end justify-center">
      <div className="mb-2">
        <EventDetailsDialogContent event={event} />
      </div>
    </DialogContent>
  </Dialog>
);


export const SchedulePage: React.FC = () => {
  const [filteredEvents, setFilteredEvents] = useState<ScheduleEvent[] | null>(null);

  const handleFilterChange = (events: ScheduleEvent[] | null) => {
    setFilteredEvents(events);
  };
  
  const isFiltering = filteredEvents !== null;

  return (
    <div
      className="relative mx-auto font-sans pb-24"
      style={{ width: '393px', minHeight: '913px', background: '#000' }}
    >
      {/* Background Gradient */}
      <div
        className="absolute"
        style={{
          width: '454px',
          height: '536px',
          borderRadius: '536px',
          background: 'var(--gradients-bg-01-end, #7E2A89)',
          filter: 'blur(80px)',
          opacity: '0.25',
          top: '277px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 0,
        }}
      />
      
      <div className="relative z-10 p-4">
        <h1
          className="text-white text-center font-inter-tight"
          style={{
            fontSize: '30px',
            fontWeight: 400,
            lineHeight: '110%',
            letterSpacing: '-0.6px',
            marginTop: '120px',
            marginLeft: '28.23px',
            marginRight: '28.77px',
          }}
        >
          Расписание
        </h1>

        <p
          className="text-center"
          style={{
            color: 'rgba(255, 255, 255, 0.72)',
            fontSize: '17px',
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: '-0.17px',
            marginTop: '13px', // 153px from top - 120px - h1 height approx
            marginLeft: '38.23px',
            marginRight: '38.77px'
          }}
        >
          Найди зону и отсканируй QR-код
        </p>
        
        <div style={{
            marginTop: '67px', // 220px from top
            marginLeft: '16px',
            marginRight: '16px'
        }}>
            <ScheduleFilters events={mockScheduleData.events} onFilterChange={handleFilterChange} />
        </div>

        <div className="mt-8 px-4">
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
            <Accordion type="single" collapsible className="w-full space-y-4">
              {initialScheduleData.map((item, index) => (
                <AccordionItem
                  value={`item-${index}`}
                  key={index}
                  className="border-none rounded-lg bg-[rgba(255,255,255,0.05)]"
                >
                  <AccordionTrigger className="h-[80px] p-4">
                    <div className="flex flex-col items-start text-left">
                      <span className="text-white font-normal font-inter-tight text-[20px] leading-6 tracking-[-0.28px]">
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
                  <AccordionContent className="p-4 pt-0">
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
    </div>
  );
};
