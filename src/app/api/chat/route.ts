import { convertToModelMessages, streamText, tool, type UIMessage, stepCountIs, smoothStream, Tool, ToolSet } from "ai"
import { openai } from '@ai-sdk/openai'
import { getMcpClient } from './mcp-client'
import { bookingTool } from './tools/booking-tool'
import { createProfileTool } from './tools/profile-tool'

export async function POST(req: Request) {
  const faqMCPClient = await getMcpClient();
  const body = await req.json();
  console.log('Request body:', JSON.stringify(body, null, 2));
  
  const { messages, userContext }: { 
    messages: UIMessage[], 
    userContext?: {
      userId: string;
      name: string;
      email: string;
      phone: string;
      role: string;
    }
  } = body;
  
  // Используем данные пользователя из тела запроса или fallback
  const finalUserContext = userContext || {
    userId: 'anonymous',
    name: '',
    email: '',
    phone: '',
    role: '',
  };
  
  console.log('User context:', finalUserContext);
  
  if (!messages || !Array.isArray(messages)) {
    console.error('Invalid messages format:', messages);
    return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const mcpTools = await faqMCPClient.tools({"schemas": "automatic"}) as ToolSet;
  console.log('Available MCP tools:', JSON.stringify(mcpTools, null, 2));
  
  // Создаем tools с контекстом пользователя
  const allTools = {
    ...mcpTools,
    bookingTool,
    profileTool: createProfileTool(finalUserContext),
  };
  
  const result = streamText({
    model: openai('gpt-4o-mini'),
    temperature: 0.7,
    stopWhen: stepCountIs(10),
    tools: allTools,
    experimental_transform: smoothStream(),
    onFinish: async () => {
      await faqMCPClient.close();
    },
    messages: convertToModelMessages(messages),
    system: `Ты AI-ассистент Финама Change, который помогает пользователям с вопросами о продуктах и услугах компании.

КОНТЕКСТ ПОЛЬЗОВАТЕЛЯ:
- ID: ${finalUserContext.userId}
- Имя: ${finalUserContext.name || 'не указано'}
- Email: ${finalUserContext.email || 'не указано'}
- Телефон: ${finalUserContext.phone || 'не указано'}
- Направление: ${finalUserContext.role || 'не указано'}
- Профиль заполнен: ${finalUserContext.name && finalUserContext.email && finalUserContext.role ? 'да' : 'нет'}

У тебя есть доступ к следующим инструментам:
1. SearchRAG - для поиска информации в базе знаний о продуктах Финама
2. profileTool - для получения данных профиля пользователя
3. bookingTool - для записи пользователей на консультации и отправки заявок в CRM

ОБЯЗАТЕЛЬНО используй SearchRAG для поиска ответов на вопросы пользователей о продуктах Финама.

Когда пользователь хочет:
- Записаться на консультацию
- Получить доступ к продукту
- Оставить заявку
- Связаться со специалистом
- Получить персональную помощь

ВАЖНО: Перед использованием bookingTool ВСЕГДА сначала используй profileTool для получения данных пользователя.

Алгоритм работы с записью:
1. Проверь КОНТЕКСТ ПОЛЬЗОВАТЕЛЯ выше - там уже есть все данные профиля
2. Если профиль заполнен (есть имя, email, направление), используй bookingTool сразу с этими данными
3. Если профиль неполный, попроси пользователя заполнить недостающие данные в профиле
4. НЕ запрашивай данные, которые уже есть в контексте пользователя
5. Используй profileTool только если нужно показать пользователю текущее состояние профиля

Используй bookingTool со следующими параметрами из КОНТЕКСТА ПОЛЬЗОВАТЕЛЯ:
- userId: ${finalUserContext.userId}
- fullName: ${finalUserContext.name || 'ТРЕБУЕТСЯ ЗАПОЛНИТЬ'}
- email: ${finalUserContext.email || 'ТРЕБУЕТСЯ ЗАПОЛНИТЬ'}
- phone: ${finalUserContext.phone || 'не указан'}
- direction: ${finalUserContext.role || 'ТРЕБУЕТСЯ ЗАПОЛНИТЬ'}
- message: сообщение с деталями запроса от пользователя
- productInterest: продукт, которым интересуется пользователь (определи из контекста беседы)

Отвечай кратко и по делу. Будь дружелюбным и помогай пользователям решать их задачи.`,
  })

  return result.toUIMessageStreamResponse()
}
