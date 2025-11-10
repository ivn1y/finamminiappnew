import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy route for chat API
 * Проксирует запросы на указанный endpoint из env переменной CHAT_API_ENDPOINT
 * По умолчанию использует локальный /api/chat
 * Может быть настроен на внешний URL для работы с другим инстансом приложения
 */
export async function POST(request: NextRequest) {
  try {
    // Получаем endpoint из env, по умолчанию локальный
    const chatEndpoint = process.env.CHAT_API_ENDPOINT || '/api/chat';
    
    // Определяем базовый URL для внешних запросов
    const isExternalUrl = chatEndpoint.startsWith('http://') || chatEndpoint.startsWith('https://');
    const baseUrl = isExternalUrl 
      ? '' 
      : process.env.NEXTAUTH_URL || request.nextUrl.origin;
    
    const targetUrl = isExternalUrl ? chatEndpoint : `${baseUrl}${chatEndpoint}`;
    
    console.log('🔄 Проксирование запроса на chat API:', { 
      targetUrl, 
      isExternal: isExternalUrl,
      envEndpoint: chatEndpoint 
    });

    // Получаем тело запроса
    const body = await request.json();
    
    // Получаем заголовки для проксирования (кроме host и connection)
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Проксируем важные заголовки
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
      headers['x-forwarded-for'] = forwardedFor;
    }
    
    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
      headers['x-real-ip'] = realIp;
    }
    
    const userAgent = request.headers.get('user-agent');
    if (userAgent) {
      headers['user-agent'] = userAgent;
    }

    // Отправляем запрос на целевой endpoint
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    // Проверяем статус ответа
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('❌ Ошибка проксирования chat API:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText.substring(0, 200)
      });
      
      return NextResponse.json(
        { 
          error: 'Ошибка проксирования запроса',
          details: errorText.substring(0, 200)
        },
        { status: response.status }
      );
    }

    // Возвращаем ответ как есть (stream или json)
    const contentType = response.headers.get('content-type') || '';
    
    // Проверяем, является ли ответ streaming
    const isStreaming = contentType.includes('text/event-stream') || 
                        contentType.includes('text/plain') ||
                        contentType.includes('application/x-ndjson');
    
    if (isStreaming && response.body) {
      // Для streaming ответов возвращаем поток напрямую
      // Проксируем все важные заголовки
      const streamHeaders: HeadersInit = {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Отключаем буферизацию в nginx
      };
      
      // Проксируем дополнительные заголовки если есть
      const transferEncoding = response.headers.get('transfer-encoding');
      if (transferEncoding) {
        streamHeaders['transfer-encoding'] = transferEncoding;
      }
      
      return new NextResponse(response.body, {
        status: response.status,
        headers: streamHeaders,
      });
    }

    // Для обычных JSON ответов
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });

  } catch (error: any) {
    console.error('❌ Критическая ошибка проксирования chat API:', {
      error: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      {
        error: 'Внутренняя ошибка проксирования',
        details: error.message || String(error)
      },
      { status: 500 }
    );
  }
}

