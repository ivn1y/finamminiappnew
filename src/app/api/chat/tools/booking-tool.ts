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
// ============================================

async function submitBookingToCRM(params: z.infer<typeof bookingSchema>) {
  try {
    console.log('📝 Обработка заявки на запись:', { userId: params.userId, direction: params.direction });

    // Базовый URL CRM
    const crmApiUrl = process.env.CRM_API_URL || "https://api.finam.tech";
    
    // Определяем crm_form_uid по направлению
    const direction = params.direction.toLowerCase();
    const directionMapDefaults = {
      "trader": "779",
      "startup": "778", 
      "expert": "7243",
      "scout": "705",
      "business": "7206",
      "partner": "7206",
    };

    const directionEnvMap = {
      "trader": process.env.CRM_FORM_UID_TRADER || directionMapDefaults["trader"],
      "startup": process.env.CRM_FORM_UID_STARTUP || directionMapDefaults["startup"],
      "expert": process.env.CRM_FORM_UID_EXPERT || directionMapDefaults["expert"],
      "scout": process.env.CRM_FORM_UID_SCOUT || directionMapDefaults["scout"],
      "business": process.env.CRM_FORM_UID_PARTNER || directionMapDefaults["business"],
      "partner": process.env.CRM_FORM_UID_PARTNER || directionMapDefaults["business"],
    };

    const crmFormUid = directionEnvMap[direction as keyof typeof directionEnvMap] || 
                       process.env.CRM_FORM_UID || 
                       "779"; // fallback

    if (!crmApiUrl) {
      throw new Error("CRM_API_URL не настроен");
    }

    // Формируем сообщение
    const messageText = [
      params.message || `Заявка на запись от ${params.fullName}`,
      params.productInterest ? `Интересует продукт: ${params.productInterest}` : '',
      'Источник: чат-ассистент'
    ].filter(Boolean).join('\n');

    // Формируем payload для CRM
    const crmData = {
      url: "https://finamcollab.com/chat",
      userIp: "127.0.0.1", // В серверном контексте IP может быть недоступен
      userAgent: "Chat Assistant",
      utm: params.utmParams || {},
      agent: "",
      agency: "",
      analytics: [],
      data: {
        phone: params.phone || "",
        email: params.email,
        firstname: params.fullName.split(" ")[0] || "",
        lastname: params.fullName.split(" ")[1] || "",
        middlename: params.fullName.split(" ")[2] || "",
        inn: "",
        referer: "https://finamcollab.com/chat",
        direction: params.direction,
        subDirection: "",
        market: "",
        risk: "",
        profile: "",
        interest: "",
        message: messageText,
        sourcePage: "chat-assistant",
      }
    };

    // Отправляем в CRM
    const url = `${crmApiUrl}/form/send/${crmFormUid}`;
    console.log("📤 Отправка в CRM:", { url, direction, crmFormUid });
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(crmData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`CRM API error: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json().catch(() => ({}));
    console.log("✅ Заявка успешно отправлена в CRM");

    return {
      success: true,
      message: "Заявка успешно отправлена",
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
