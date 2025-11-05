import { convertToModelMessages, streamText, tool, type UIMessage, stepCountIs, smoothStream, Tool, ToolSet } from "ai"
import { openai } from '@ai-sdk/openai'
import { getMcpClient, getTestMcpClient } from './mcp-client'
import { z } from 'zod'

export async function POST(req: Request) {
  const faqMCPClient = await getMcpClient();
  const testMCPClient = await getTestMcpClient();
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

  const mcpToolsRaw = await faqMCPClient.tools();
  console.log('Available MCP tools:', Object.keys(mcpToolsRaw));
  console.log('Test MCP tools:', await testMCPClient.tools());
  
  // Преобразуем MCP инструменты: заменяем inputSchema на parameters с Zod схемой
  const mcpTools: ToolSet = {};
  
  Object.entries(mcpToolsRaw).forEach(([name, toolDef]) => {
    const tool = toolDef as any;
    console.log(`Tool ${name} schema:`, JSON.stringify(tool.inputSchema || tool.parameters, null, 2));
    
    // Если есть inputSchema (JSON Schema), преобразуем в Zod parameters
    if (tool.inputSchema && tool.inputSchema.jsonSchema) {
      const jsonSchema = tool.inputSchema.jsonSchema;
      
      // Для SearchRAG создаем правильную Zod схему
      if (name === 'SearchRAG' && jsonSchema.properties?.chatInput) {
        mcpTools[name] = {
          ...tool,
          parameters: z.object({
            chatInput: z.string().describe(jsonSchema.properties.chatInput.description || 'Запрос для поиска')
          })
        } as any;
        console.log(`Converted ${name} inputSchema to Zod parameters`);
      } else {
        // Для других инструментов оставляем как есть или используем inputSchema
        mcpTools[name] = tool;
      }
    } else {
      // Если уже есть parameters, используем их
      mcpTools[name] = tool;
    }
  });

  const result = streamText({
    model: openai('gpt-4o-mini'),
    temperature: 0.7,
    stopWhen: stepCountIs(10),
    tools: mcpTools,

    // experimental_transform: smoothStream(),
    onFinish: async () => {
      await faqMCPClient.close();
    },
    messages: convertToModelMessages(messages),
    system: `Ты AI-ассистент Финама Change, который помогает пользователям с вопросами о продуктах и услугах компании.

У тебя есть доступ к инструменту SearchRAG для поиска информации в базе знаний.
ОБЯЗАТЕЛЬНО используй SearchRAG для поиска ответов на вопросы пользователей о продуктах Финама.

Параметр chatInput должен быть строкой с запросом пользователя.

Отвечай кратко и по делу.`,
  })

  return result.toUIMessageStreamResponse()
}
