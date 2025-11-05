import { NextRequest, NextResponse } from 'next/server';

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

interface CRMSubmissionResult {
  success: boolean;
  message: string;
  details?: any;
}

// ============================================
// CRM Submission Logic (extracted from unified_form)
// ============================================

async function sendToCRM(
  data: CRMFormData, 
  utmParams: Record<string, string>, 
  request: NextRequest
): Promise<CRMSubmissionResult> {
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
      success: true,
      message: "Данные успешно отправлены",
      details: { response: responseData }
    };

  } catch (error: any) {
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      console.error("CRM: timeout");
      return {
        success: false,
        message: "Превышено время ожидания",
        details: { error: "timeout" }
      };
    }
    
    console.error(`CRM error: ${error}`);
    return {
      success: false,
      message: `Ошибка: ${error.message || String(error)}`,
      details: { error: error.message || String(error) }
    };
  }
}

// ============================================
// API Route Handler
// ============================================

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Получен запрос на отправку в CRM');
    
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

    console.log('🚀 Отправка в CRM:', { direction, hasUtm: Object.keys(cleanUtmParams).length > 0 });

    // Отправляем в CRM
    const result = await sendToCRM(formData, cleanUtmParams, request);

    if (result.success) {
      console.log('✅ CRM: заявка успешно отправлена');
      return NextResponse.json(result);
    } else {
      console.error('❌ CRM: ошибка отправки заявки:', result.message);
      return NextResponse.json(result, { status: 500 });
    }

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
