'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { UserRole } from '@/shared/types/app';
import { roleContent } from '@/shared/data/seed';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/shared/ui/carousel';

interface RoleCarouselProps {
  onRoleChange: (role: UserRole) => void;
  setApi: (api: CarouselApi) => void;
  currentSlide: number;
}

export const RoleCarousel: React.FC<RoleCarouselProps> = ({
  onRoleChange,
  setApi,
  currentSlide,
}) => {
  return (
    <Carousel
      setApi={setApi}
      opts={{
        loop: true,
        align: 'center',
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-8">
        {roleContent.map((role, index) => {
          const isActive = index === currentSlide;
          return (
            <CarouselItem key={index} className="pl-8 basis-[292px]">
              <div
                className="relative w-[260px] h-[346px] rounded-[4px]"
                style={{
                  border: isActive
                    ? '1px solid var(--Marketing-Gradient-Text-Large, #FDB938)'
                    : '1px solid transparent',
                  boxShadow: isActive
                    ? '0 74px 21px 0 rgba(255, 255, 255, 0.00), 0 47px 19px 0 rgba(255, 255, 255, 0.01), 0 27px 16px 0 rgba(255, 255, 255, 0.03), 0 12px 12px 0 rgba(255, 255, 255, 0.04), 0 3px 6px 0 rgba(255, 255, 255, 0.05)'
                    : 'none',
                  transition: 'border 0.3s ease, box-shadow 0.3s ease',
                }}
              >
                <Image
                  src={role.image}
                  alt={role.title}
                  fill
                  className="object-cover rounded-[4px]"
                />
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
};
