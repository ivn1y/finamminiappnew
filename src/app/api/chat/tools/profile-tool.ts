import { tool } from 'ai';
import { z } from 'zod';

// ============================================
// Profile Tool Schema
// ============================================

const profileSchema = z.object({
  userId: z.string().describe('ID пользователя для получения профиля'),
});

// ============================================
// Profile Tool Factory
// ============================================

export function createProfileTool(userContext: {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}) {
  return tool({
    description: `Инструмент для получения данных профиля пользователя. 
    Используй этот инструмент перед bookingTool, чтобы проверить, 
    есть ли у пользователя заполненные данные (имя, email, направление).`,
    
    inputSchema: profileSchema,
    
    execute: async ({ userId }) => {
      console.log('🔧 Вызван profileTool с контекстом:', { userId, userContext });
      
      // Используем данные из контекста пользователя
      const hasRequiredData = userContext.name && userContext.email && userContext.role;
      
      if (userContext.userId === 'anonymous' || !userContext.userId) {
        return {
          success: false,
          message: 'Пользователь не авторизован. Попроси пользователя войти в систему.',
          profile: null
        };
      }
      
      return {
        success: true,
        message: hasRequiredData 
          ? `Профиль пользователя заполнен. Имя: ${userContext.name}, Email: ${userContext.email}, Направление: ${userContext.role}`
          : `Профиль неполный. Имя: ${userContext.name || 'не указано'}, Email: ${userContext.email || 'не указано'}, Направление: ${userContext.role || 'не указано'}. Попроси пользователя заполнить профиль.`,
        profile: {
          userId: userContext.userId,
          fullName: userContext.name,
          email: userContext.email,
          phone: userContext.phone,
          direction: userContext.role,
          hasCompleteProfile: hasRequiredData
        }
      };
    }
  });
}

// Экспортируем базовую схему для совместимости
export const profileTool = {
  inputSchema: profileSchema
};
