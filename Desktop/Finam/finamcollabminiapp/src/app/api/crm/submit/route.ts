import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Валидация обязательных полей
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля: name, email, phone' },
        { status: 400 }
      );
    }

    // TODO: Заменить на реальный URL и логику интеграции с CRM
    // Пример: отправка в AmoCRM, Bitrix24, или другую CRM систему
    const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL;
    
    if (!CRM_WEBHOOK_URL) {
      // В режиме разработки просто логируем данные
      console.log('CRM Data (Development mode):', JSON.stringify(body, null, 2));
      return NextResponse.json({ 
        success: true, 
        message: 'Данные получены (режим разработки)',
        data: body 
      });
    }

    // Отправка данных в реальную CRM систему
    const crmResponse = await fetch(CRM_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Форматируем данные для CRM
        name: body.name,
        email: body.email,
        phone: body.phone,
        role: body.role,
        roleHistory: body.roleHistory || [],
        company: body.company || '',
        position: body.position || '',
        goals: body.goals || '',
        interests: body.interests || '',
        timestamp: body.timestamp || new Date().toISOString(),
        // Дополнительные поля для распределения по ролям
        leadSource: 'finam_collab_miniapp',
        tags: body.role ? [`role_${body.role}`] : [],
      }),
    });

    if (!crmResponse.ok) {
      const errorText = await crmResponse.text();
      console.error('CRM API Error:', errorText);
      return NextResponse.json(
        { error: 'Ошибка при отправке данных в CRM', details: errorText },
        { status: crmResponse.status }
      );
    }

    const crmResult = await crmResponse.json();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Данные успешно отправлены в CRM',
      crmResponse: crmResult 
    });
  } catch (error) {
    console.error('Error in CRM submit route:', error);
    return NextResponse.json(
      { 
        error: 'Внутренняя ошибка сервера',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
