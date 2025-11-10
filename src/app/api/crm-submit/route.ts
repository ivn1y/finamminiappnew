import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/shared/lib/auth';

// ============================================
// Types
// ============================================

interface CRMFormData {
  fullName: string;
  email: string;
  phone?: string;
  direction: string;
  subDirection?: string;
  market?: string;
  risk?: string;
  profile?: string;
  interest?: string;
  message?: string;
  sourceUrl?: string;
  referral?: string;
}

interface IntegrationStatus {
  service: string;
  success: boolean;
  message: string;
  details?: any;
}

interface CRMSubmissionResult {
  success: boolean;
  message: string;
  statuses: IntegrationStatus[];
}

// ============================================
// CRM Submission Logic (extracted from unified_form)
// ============================================

async function sendToCRM(
  data: CRMFormData, 
  utmParams: Record<string, string>, 
  request: NextRequest
): Promise<IntegrationStatus> {
  try {
    // Базовый URL CRM с дефолтом
    const crmApiUrl = process.env.CRM_API_URL || "https://api.finam.tech";

    // Извлекаем контекст запроса
    const referer = request.headers.get("referer") || "";
    const userAgent = request.headers.get("user-agent") || "";
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : 
                     request.headers.get("x-real-ip") || "unknown";

    // Определяем crm_form_uid по приоритетам: по направлению -> общий
    const direction = (data.direction || "").trim().toLowerCase();
    const directionMapDefaults = {
      "trader": "779",
      "startup": "778", 
      "expert": "7243",
      "scout": "705",
      "business": "7206",
    };

    const directionEnvMap = {
      "trader": process.env.CRM_FORM_UID_TRADER || directionMapDefaults["trader"],
      "startup": process.env.CRM_FORM_UID_STARTUP || directionMapDefaults["startup"],
      "expert": process.env.CRM_FORM_UID_EXPERT || directionMapDefaults["expert"],
      "scout": process.env.CRM_FORM_UID_SCOUT || directionMapDefaults["scout"],
      "business": process.env.CRM_FORM_UID_PARTNER || directionMapDefaults["business"]
    };

    const directionBasedUid = directionEnvMap[direction as keyof typeof directionEnvMap];
    const genericUid = process.env.CRM_FORM_UID;
    const crmFormUid = directionBasedUid || genericUid;

    console.log(
      "CRM UID selection: direction='%s' -> selected_uid='%s' (env_direction_uid='%s', generic_uid='%s')",
      direction,
      crmFormUid,
      directionBasedUid,
      genericUid,
    );

    if (!crmApiUrl || !crmFormUid) {
      console.warn("CRM не настроена (нет CRM_API_URL или CRM_FORM_UID по приоритетам)");
      return {
        service: "CRM",
        success: false,
        message: "CRM не настроена",
        details: { error: "Missing CRM_API_URL or CRM_FORM_UID" }
      };
    }

    // Формируем payload в рабочем формате
    const crmData = {
      url: referer || "https://finamcollab.com",
      userIp: clientIp,
      userAgent: userAgent,
      utm: utmParams,
      agent: "",
      agency: "",
      analytics: [],
      data: {
        phone: data.phone || "",
        email: data.email,
        firstname: (data.fullName?.trim().split(" ")?.slice(0, 1) || [""])[0],
        lastname: (data.fullName?.trim().split(" ")?.slice(1, 2) || [""])[0],
        middlename: (data.fullName?.trim().split(" ")?.slice(2, 3) || [""])[0],
        inn: "",
        referer: referer,
        direction: data.direction,
        subDirection: data.subDirection || "",
        market: data.market || "",
        risk: data.risk || "",
        profile: data.profile || "",
        interest: data.interest || "",
        message: data.message || "",
        sourcePage: data.sourceUrl || "",
      }
    };

    const url = `${crmApiUrl}/form/send/${crmFormUid}`;
    console.log("CRM отправка: URL=%s, direction=%s, crm_form_uid=%s", url, direction, crmFormUid);
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(crmData),
    });

    if (response.status < 200 || response.status >= 300) {
      console.error(`CRM submission failed: ${response.status} - ${await response.text()}`);
      return {
        service: "CRM",
        success: false,
        message: `Ошибка отправки: ${response.status}`,
        details: { response: (await response.text()).substring(0, 200) }
      };
    }

    // Логируем ответ CRM для отладки
    const responseData = response.headers.get('content-type')?.includes('application/json') 
      ? await response.json() 
      : {};
    console.log("✅ CRM: данные успешно отправлены. Response: %s", JSON.stringify(responseData));
    
    return {
      service: "CRM",
      success: true,
      message: "Данные успешно отправлены",
      details: { response: responseData }
    };

  } catch (error: any) {
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      console.error("CRM: timeout");
      return {
        service: "CRM",
        success: false,
        message: "Превышено время ожидания",
        details: { error: "timeout" }
      };
    }
    
    console.error(`CRM error: ${error}`);
    return {
      service: "CRM",
      success: false,
      message: `Ошибка: ${error.message || String(error)}`,
      details: { error: error.message || String(error) }
    };
  }
}

// ============================================
// Huntflow Fallback Integration
// ============================================

async function sendToHuntflow(data: CRMFormData): Promise<IntegrationStatus> {
  try {
    const huntflowToken = process.env.HUNTFLOW_API_TOKEN;
    const huntflowAccountId = process.env.HUNTFLOW_ACCOUNT_ID;
    const huntflowVacancyId = process.env.HUNTFLOW_VACANCY_ID;
    
    if (!huntflowToken || !huntflowAccountId || !huntflowVacancyId) {
      console.warn("Huntflow не настроен (отсутствуют переменные окружения)");
      return {
        service: "Huntflow",
        success: false,
        message: "Huntflow не настроен",
        details: { error: "Missing environment variables" }
      };
    }
    
    const headers = {
      "Authorization": `Bearer ${huntflowToken}`,
      "Content-Type": "application/json",
    };
    
    // Создание кандидата
    const candidateData = {
      first_name: data.fullName.split(" ")[0] || "Не указано",
      last_name: data.fullName.split(" ").slice(1).join(" ") || "",
      email: data.email,
      phone: data.phone || "",
      position: data.direction || "Не указано",
    };
    
    // Создаем кандидата
    const candidateResponse = await fetch(
      `https://api.huntflow.ru/v2/accounts/${huntflowAccountId}/applicants`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(candidateData),
      }
    );
    
    if (!candidateResponse.ok) {
      console.error(`Huntflow candidate creation failed: ${candidateResponse.status}`);
      return {
        service: "Huntflow",
        success: false,
        message: `Ошибка создания кандидата: ${candidateResponse.status}`,
        details: { response: await candidateResponse.text() }
      };
    }
    
    const candidateResult = await candidateResponse.json();
    const candidateId = candidateResult.id;
    
    // Добавляем кандидата в вакансию
    const applicantData = {
      vacancy: parseInt(huntflowVacancyId),
      status: parseInt(process.env.HUNTFLOW_STATUS_ID || "1"),
    };
    
    const applicantResponse = await fetch(
      `https://api.huntflow.ru/v2/accounts/${huntflowAccountId}/applicants/${candidateId}/vacancy`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(applicantData),
      }
    );
    
    if (!applicantResponse.ok) {
      console.error(`Huntflow applicant creation failed: ${applicantResponse.status}`);
      return {
        service: "Huntflow",
        success: false,
        message: `Ошибка добавления в вакансию: ${applicantResponse.status}`,
        details: { response: await applicantResponse.text() }
      };
    }
    
    console.log(`✅ Huntflow: кандидат создан с ID ${candidateId}`);
    return {
      service: "Huntflow",
      success: true,
      message: "Кандидат успешно добавлен",
      details: { candidate_id: candidateId }
    };
    
  } catch (error: any) {
    console.error(`Huntflow error: ${error}`);
    return {
      service: "Huntflow",
      success: false,
      message: `Ошибка: ${error.message || String(error)}`,
      details: { error: error.message || String(error) }
    };
  }
}

// ============================================
// Telegram Fallback Integration
// ============================================

async function sendToTelegram(data: CRMFormData, statuses: IntegrationStatus[]): Promise<IntegrationStatus> {
  try {
    const botToken = process.env.TELEGRAM_BOT_NOTIFY_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!botToken || !chatId) {
      console.warn("Telegram не настроен");
      return {
        service: "Telegram",
        success: false,
        message: "Telegram не настроен",
        details: { error: "Missing TELEGRAM_BOT_NOTIFY_TOKEN or TELEGRAM_CHAT_ID" }
      };
    }
    
    // Формируем красивое сообщение
    const messageParts = [
      "🔔 <b>Новая заявка из чата</b>\n",
      `👤 <b>Имя:</b> ${data.fullName}`,
      `📧 <b>Email:</b> ${data.email}`,
      `📱 <b>Телефон:</b> ${data.phone || 'Не указан'}`,
      `🎯 <b>Направление:</b> ${data.direction}`,
    ];
    
    if (data.subDirection) messageParts.push(`📌 <b>Поднаправление:</b> ${data.subDirection}`);
    if (data.market) messageParts.push(`📊 <b>Рынок:</b> ${data.market}`);
    if (data.risk) messageParts.push(`⚠️ <b>Риск:</b> ${data.risk}`);
    if (data.profile) messageParts.push(`👔 <b>Профиль:</b> ${data.profile}`);
    if (data.interest) messageParts.push(`💡 <b>Интересы:</b> ${data.interest}`);
    if (data.message) messageParts.push(`💬 <b>Сообщение:</b> ${data.message}`);
    
    // Добавляем статусы интеграций
    messageParts.push("\n📊 <b>Статусы интеграций:</b>");
    for (const status of statuses) {
      const emoji = status.success ? "✅" : "❌";
      messageParts.push(`${emoji} <b>${status.service}:</b> ${status.message}`);
    }
    
    // Московское время
    const moscowTime = new Date().toLocaleString('ru-RU', {
      timeZone: 'Europe/Moscow',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    messageParts.push(`\n🕐 <b>Время:</b> ${moscowTime} (МСК)`);
    
    const telegramMessage = messageParts.join("\n");
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: "HTML",
        disable_web_page_preview: false
      }),
    });
    
    if (!response.ok) {
      console.error(`Telegram error: ${response.status} - ${await response.text()}`);
      return {
        service: "Telegram",
        success: false,
        message: `Ошибка отправки: ${response.status}`,
        details: { response: await response.text() }
      };
    }
    
    console.log("✅ Telegram: уведомление отправлено");
    return {
      service: "Telegram",
      success: true,
      message: "Уведомление отправлено",
      details: {}
    };
    
  } catch (error: any) {
    console.error(`Telegram error: ${error}`);
    return {
      service: "Telegram",
      success: false,
      message: `Ошибка: ${error.message || String(error)}`,
      details: { error: error.message || String(error) }
    };
  }
}

// ============================================
// API Route Handler
// ============================================
// Архитектура с двумя инстансами:
// 1. Инстанс в контуре (этот файл): имеет доступ к CRM, проверяет API ключ через CRM_SUBMIT_API_KEY_VALIDATOR
// 2. Инстанс за контуром: имеет чат и booking-tool, отправляет запросы с CRM_SUBMIT_API_KEY
// 
// Логика проверки:
// - Если передан валидный API ключ -> серверный вызов (пропускаем проверку сессии)
// - Если API ключ не передан -> клиентский вызов (проверяем авторизацию через сессию)
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Проверка API ключа для серверных вызовов (опциональная)
    // CRM_SUBMIT_API_KEY_VALIDATOR - ключ для проверки на инстансе в контуре
    // CRM_SUBMIT_API_KEY - ключ для отправки на инстансе за контуром
    const validatorKey = process.env.CRM_SUBMIT_API_KEY_VALIDATOR || process.env.CRM_SUBMIT_API_KEY;
    let isServerCall = false;
    
    if (validatorKey) {
      const apiKey = request.headers.get('x-api-key') || 
                     request.headers.get('authorization')?.replace('Bearer ', '');
      
      if (apiKey === validatorKey) {
        // Валидный API ключ - это серверный вызов, пропускаем проверку сессии
        isServerCall = true;
        console.log('✅ Валидный API ключ - серверный вызов');
      } else if (apiKey) {
        // Передан неверный API ключ
        console.warn('❌ Неверный API ключ для /api/crm-submit');
        return NextResponse.json(
          { 
            success: false, 
            message: "Unauthorized",
            details: { error: "Invalid API key" }
          },
          { status: 401 }
        );
      }
    }
    
    // Для клиентских вызовов проверяем авторизацию
    // if (!isServerCall) {
    //   try {
    //     // В NextAuth 5 auth() может принимать request для API роутов
    //     const session = await auth();
    //     console.log(session)
    //     if (!session || !session.user) {
    //       console.warn('❌ Неавторизованный запрос к /api/crm-submit');
    //       return NextResponse.json(
    //         { 
    //           success: false, 
    //           message: "Unauthorized",
    //           details: { error: "User not authenticated" }
    //         },
    //         { status: 401 }
    //       );
    //     }
    //     console.log('✅ Авторизованный клиентский запрос:', { 
    //       userId: session.user.id,
    //       userName: session.user.name 
    //     });
    //   } catch (error: any) {
    //     console.error('❌ Ошибка проверки авторизации:', error);
    //     return NextResponse.json(
    //       { 
    //         success: false, 
    //         message: "Unauthorized",
    //         details: { error: "Authentication check failed" }
    //       },
    //       { status: 401 }
    //     );
    //   }
    // }
    
    console.log('📝 Получен запрос на отправку в CRM', { isServerCall });
    
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      direction,
      subDirection,
      market,
      risk,
      profile,
      interest,
      message,
      sourceUrl,
      referral,
      utmParams = {}
    } = body;

    // Валидация обязательных полей
    if (!fullName || !email || !direction) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Обязательные поля не заполнены",
          details: { missing: ['fullName', 'email', 'direction'].filter(field => !body[field]) }
        },
        { status: 400 }
      );
    }

    // Подготавливаем данные формы
    const formData: CRMFormData = {
      fullName,
      email,
      phone,
      direction,
      subDirection,
      market,
      risk,
      profile,
      interest,
      message,
      sourceUrl,
      referral,
    };

    // Извлекаем UTM параметры из заголовков (если переданы)
    const utmHeaders = {
      utm_source: request.headers.get('x-utm-source') || utmParams.utm_source || '',
      utm_medium: request.headers.get('x-utm-medium') || utmParams.utm_medium || '',
      utm_campaign: request.headers.get('x-utm-campaign') || utmParams.utm_campaign || '',
      utm_content: request.headers.get('x-utm-content') || utmParams.utm_content || '',
      utm_term: request.headers.get('x-utm-term') || utmParams.utm_term || '',
      int_source: request.headers.get('x-int-source') || utmParams.int_source || '',
      int_medium: request.headers.get('x-int-medium') || utmParams.int_medium || '',
      int_campaign: request.headers.get('x-int-campaign') || utmParams.int_campaign || '',
      int_term: request.headers.get('x-int-term') || utmParams.int_term || '',
      int_content: request.headers.get('x-int-content') || utmParams.int_content || '',
    };

    // Удаляем пустые значения
    const cleanUtmParams = Object.fromEntries(
      Object.entries(utmHeaders).filter(([_, value]) => value && value.trim() !== '')
    );

    console.log('🚀 Запуск параллельной отправки в 3 точки:', { direction, hasUtm: Object.keys(cleanUtmParams).length > 0 });

    // Параллельная отправка во все интеграции
    const results = await Promise.allSettled([
      sendToCRM(formData, cleanUtmParams, request),
      sendToHuntflow(formData),
    ]);

    // Обрабатываем результаты
    const statuses: IntegrationStatus[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        statuses.push(result.value);
      } else {
        console.error('Ошибка при выполнении интеграции:', result.reason);
        statuses.push({
          service: "Unknown",
          success: false,
          message: `Критическая ошибка: ${result.reason}`,
          details: { error: String(result.reason) }
        });
      }
    }

    // Отправляем в Telegram с результатами всех интеграций
    const telegramStatus = await sendToTelegram(formData, statuses);
    statuses.push(telegramStatus);

    // Определяем общий статус успеха
    const criticalServices = ["CRM", "Huntflow"];
    const criticalSuccesses = statuses.filter(s => criticalServices.includes(s.service) && s.success);
    
    const overallSuccess = criticalSuccesses.length > 0;
    
    let resultMessage = "Заявка успешно обработана";
    if (overallSuccess) {
      if (criticalSuccesses.length < criticalServices.length) {
        resultMessage += " (некоторые интеграции недоступны)";
      }
    } else {
      resultMessage = "Не удалось обработать заявку ни в одной критичной интеграции";
    }

    console.log(`✅ Обработка завершена. Успешных интеграций: ${criticalSuccesses.length}/${criticalServices.length}`);
    
    const response: CRMSubmissionResult = {
      success: overallSuccess,
      message: resultMessage,
      statuses
    };

    return NextResponse.json(response, { 
      status: overallSuccess ? 200 : 500 
    });

  } catch (error: any) {
    console.error("❌ Критическая ошибка API /crm-submit:", {
      error,
      message: error?.message,
      stack: error?.stack
    });
    
    return NextResponse.json(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
        details: { error: error?.message || String(error) }
      },
      { status: 500 }
    );
  }
}
