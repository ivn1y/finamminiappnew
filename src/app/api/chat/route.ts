import { convertToModelMessages, streamText, tool, type UIMessage, stepCountIs, smoothStream, Tool, ToolSet } from "ai"
import { openai } from '@ai-sdk/openai'
import { getMcpClient } from './mcp-client'

export async function POST(req: Request) {
  const faqMCPClient = await getMcpClient();
  const body = await req.json();
  console.log('Request body:', JSON.stringify(body, null, 2));
  
  const { messages }: { messages: UIMessage[] } = body;
  
  if (!messages || !Array.isArray(messages)) {
    console.error('Invalid messages format:', messages);
    return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const mcpTools = await faqMCPClient.tools({"schemas": "automatic"}) as ToolSet;
  console.log('Available MCP tools:', JSON.stringify(mcpTools, null, 2));
  
  const result = streamText({
    model: openai('gpt-4o-mini'),
    temperature: 0.7,
    stopWhen: stepCountIs(10),
    tools: mcpTools,
    experimental_transform: smoothStream(),
    onFinish: async () => {
      await faqMCPClient.close();
    },
    messages: convertToModelMessages(messages),
    system: `Ты AI-ассистент Финама Change, который помогает пользователям с вопросами о продуктах и услугах компании.

У тебя есть доступ к инструменту SearchRAG для поиска информации в базе знаний.
ОБЯЗАТЕЛЬНО используй SearchRAG для поиска ответов на вопросы пользователей о продуктах Финама.


Отвечай кратко и по делу.`,
  })

  return result.toUIMessageStreamResponse()
}
