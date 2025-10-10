'use client';

import React from 'react';
import { ArrowIcon } from './icons';

interface ProductItemProps {
  title: string;
  onClick?: () => void;
  icon?: string;
}

export const ProductItem: React.FC<ProductItemProps> = ({ title, onClick, icon }) => {
  return (
    <div
      className="bg-[#1f1f25] box-border content-stretch cursor-pointer flex items-center justify-center pl-[4px] pr-0 py-0 relative rounded-[4px] shrink-0 w-full max-w-[313px]"
      onClick={onClick}
    >
      <div className="flex-[1_0_0] min-h-px min-w-px relative shrink-0">
        <div className="flex flex-row items-center size-full">
          <div className="box-border content-stretch flex items-center pl-[12px] pr-[8px] py-0 relative w-full">
            <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px overflow-clip relative shrink-0">
              <div className="flex-[1_0_0] min-h-px min-w-px relative shrink-0">
                <div className="flex flex-col justify-center size-full">
                  <div className="box-border content-stretch flex flex-col items-start justify-center pl-0 pr-[8px] py-[13px] relative w-full">
                    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                      {icon && (
                        <div className="w-[24px] h-[24px] relative flex-shrink-0">
                          <img
                            src={icon}
                            alt={title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <p className="font-inter font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-white tracking-[-0.128px]">
                        {title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]">
              <div className="absolute left-1/2 size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
                <ArrowIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
