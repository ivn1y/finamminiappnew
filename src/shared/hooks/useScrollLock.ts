import { useEffect } from 'react';

/**
 * Хук для блокировки скролла страницы
 * Используется в модальных окнах и турах по приложению
 */
export function useScrollLock(isLocked: boolean = true) {
  useEffect(() => {
    if (!isLocked) return;

    // Сохраняем текущие значения
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Вычисляем ширину скроллбара для компенсации
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Блокируем скролл
    document.body.style.overflow = 'hidden';
    
    // Компенсируем ширину скроллбара чтобы избежать сдвига контента
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Предотвращаем touchmove для мобильных устройств
    const preventTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    document.addEventListener('touchmove', preventTouchMove, { passive: false });

    // Восстанавливаем при размонтировании
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.removeEventListener('touchmove', preventTouchMove);
    };
  }, [isLocked]);
}

