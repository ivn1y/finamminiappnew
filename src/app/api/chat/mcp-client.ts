// import { experimental_createMCPClient } from 'ai'
import { experimental_createMCPClient } from '@ai-sdk/mcp'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';


// ============================================
// MCP CLIENT CONFIGURATION
// ============================================

// Вариант 2: Если ваш MCP сервер работает через HTTP/SSE (как у вас сейчас)

export const getMcpClient = async () => {
  console.log('Creating new MCP client...');
  const client = await experimental_createMCPClient({
    transport: {
      type: 'sse',
      url: process.env.MCP_SERVER_URL || 'https://flow.changesandbox.ru/mcp/2353930c-19b8-42e1-8068-61e89505310a',
    }
    // transport: new StreamableHTTPClientTransport(new URL(process.env.MCP_SERVER_URL || 'https://flow.changesandbox.ru/mcp/change-faq'))
    // transport: new StreamableHTTPClientTransport(new URL(process.env.MCP_SERVER_URL || 'https://flow.changesandbox.ru/mcp/2353930c-19b8-42e1-8068-61e89505310a'))
  });
  console.log('MCP client created successfully');
  return client;
}


export const getTestMcpClient = async () => {
  console.log('Creating new MCP client...');
  const client = await experimental_createMCPClient({
    transport: {
      type: 'sse',
      url: process.env.MCP_SERVER_URL || 'http://localhost:8005/mcp',
    }
  });
  console.log('Test MCP client created successfully');
  return client;
}

// ============================================
// HELPER TYPES
// ============================================

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Parse MCP tool result into structured data
 */
export function parseMCPResult<T = any>(result: any): {
  success: boolean
  data?: T
  error?: string
} {
  try {
    if (result.isError) {
      return {
        success: false,
        error: result.content?.[0]?.text || 'Unknown error'
      }
    }

    const content = result.content?.[0]
    if (!content) {
      return {
        success: false,
        error: 'No content in response'
      }
    }

    // Если это текст, пробуем распарсить как JSON
    if (content.type === 'text') {
      try {
        const parsed = JSON.parse(content.text)
        return {
          success: true,
          data: parsed
        }
      } catch {
        // Если не JSON, возвращаем как есть
        return {
          success: true,
          data: content.text as T
        }
      }
    }

    // Если это изображение или другие типы
    if (content.type === 'image' || content.type === 'resource') {
      return {
        success: true,
        data: content as T
      }
    }

    return {
      success: true,
      data: content as T
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse result'
    }
  }
}
