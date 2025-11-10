import { tool } from 'ai';
import { z } from 'zod';

// ============================================
// Booking Tool Schema
// ============================================

const bookingSchema = z.object({
  userId: z.string().describe('ID пользователя'),
  fullName: z.string().describe('Полное имя пользователя'),
  email: z.string().email().describe('Email пользователя'),
  phone: z.string().optional().describe('Телефон пользователя'),
  direction: z.string().describe('Направление пользователя (trader, startup, expert, etc.)'),
  message: z.string().optional().describe('Дополнительное сообщение от пользователя'),
  productInterest: z.string().optional().describe('Продукт, которым интересуется пользователь'),
  utmParams: z.record(z.string()).optional().describe('UTM параметры для аналитики'),
});

// ============================================
// CRM Submission Logic (server-side)
// Использует /api/crm-submit через env переменную CRM_SUBMIT_ENDPOINT
// ============================================

async function submitBookingToCRM(params: z.infer<typeof bookingSchema>) {
  try {
    console.log('📝 Обработка заявки на запись:', { userId: params.userId, direction: params.direction });

    // Получаем endpoint из env, по умолчанию локальный /api/crm-submit
    const crmSubmitEndpoint = process.env.CRM_SUBMIT_ENDPOINT || '/api/crm-submit';
    
    // Определяем базовый URL для внешних запросов
    const isExternalUrl = crmSubmitEndpoint.startsWith('http://') || crmSubmitEndpoint.startsWith('https://');
    const baseUrl = isExternalUrl 
      ? '' 
      : process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    const targetUrl = isExternalUrl ? crmSubmitEndpoint : `${baseUrl}${crmSubmitEndpoint}`;
    
    console.log('📤 Отправка заявки через CRM_SUBMIT_ENDPOINT:', { 
      targetUrl, 
      isExternal: isExternalUrl,
      envEndpoint: crmSubmitEndpoint 
    });

    // Формируем сообщение
    const messageText = [
      params.message || `Заявка на запись от ${params.fullName}`,
      params.productInterest ? `Интересует продукт: ${params.productInterest}` : '',
      'Источник: чат-ассистент'
    ].filter(Boolean).join('\n');

    // Формируем payload для /api/crm-submit (соответствует интерфейсу CRMFormData)
    const crmSubmitData = {
      fullName: params.fullName,
      email: params.email,
      phone: params.phone || '',
      direction: params.direction,
      subDirection: '',
      market: '',
      risk: '',
      profile: '',
      interest: params.productInterest || '',
      message: messageText,
      sourceUrl: 'https://finamcollab.com/chat',
      referral: '',
      utmParams: params.utmParams || {},
    };

    // Отправляем запрос на /api/crm-submit
    // CRM_SUBMIT_API_KEY - ключ для отправки запросов (используется на инстансе за контуром)
    const apiKey = process.env.CRM_SUBMIT_API_KEY;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    // Добавляем API ключ, если он задан (для вызовов из другого инстанса)
    if (apiKey) {
      headers["x-api-key"] = apiKey;
      console.log('🔑 Отправка запроса с API ключом');
    } else {
      console.warn('⚠️ CRM_SUBMIT_API_KEY не задан - запрос будет отправлен без ключа');
    }
    
    const response = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(crmSubmitData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Ошибка отправки в CRM_SUBMIT:', {
        status: response.status,
        error: errorText.substring(0, 200)
      });
      throw new Error(`CRM Submit API error: ${response.status} - ${errorText.substring(0, 200)}`);
    }

    const responseData = await response.json().catch(() => ({}));
    console.log("✅ Заявка успешно отправлена через CRM_SUBMIT_ENDPOINT");

    return {
      success: responseData.success || true,
      message: responseData.message || "Заявка успешно отправлена",
      crmResponse: responseData,
    };

  } catch (error: any) {
    console.error("❌ Ошибка отправки заявки в CRM:", error);
    return {
      success: false,
      message: error.message || "Ошибка при отправке заявки",
      error: error.message,
    };
  }
}

// ============================================
// Tool Definition
// ============================================

export const bookingTool = tool({
  description: `Инструмент для записи пользователя и отправки заявки в CRM. 
  Используй этот инструмент когда пользователь хочет записаться на консультацию, 
  получить доступ к продукту или оставить заявку.`,
  inputSchema: bookingSchema,
  execute: async ({ userId, fullName, email, phone, direction, message, productInterest, utmParams }) => {
    console.log('🔧 Вызван bookingTool:', { userId: userId });
    
    try {
      const result = await submitBookingToCRM({ userId, fullName, email, phone, direction, message, productInterest, utmParams });
      
      if (result.success) {
        return {
          success: true,
          message: `✅ Отлично! Я записал тебя на консультацию. 
          
Твоя заявка успешно отправлена нашим специалистам. Мы свяжемся с тобой в ближайшее время по указанным контактам.

Если у тебя есть срочные вопросы, можешь написать нам в поддержку или продолжить общение со мной.`,
          details: result.crmResponse,
          error: undefined,
        };
      } else {
        return {
          success: false,
          message: `❌ Произошла ошибка при отправке заявки: ${result.message}
          
Попробуй еще раз или обратись в поддержку напрямую.`,
          error: result.error as any | undefined,
          details: result.crmResponse as any | undefined,
        };
      }
    } catch (error: any) {
      console.error('❌ Критическая ошибка в bookingTool:', error);
      return {
        success: false,
        message: `❌ Произошла техническая ошибка. Попробуй еще раз позже или обратись в поддержку.`,
        error: error.message as any | undefined,
        details: undefined,
      };
    }
  }
});
