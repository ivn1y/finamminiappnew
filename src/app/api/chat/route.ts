import { convertToModelMessages, streamText, tool, type UIMessage, stepCountIs, smoothStream, Tool, ToolSet } from "ai"
import { openai } from '@ai-sdk/openai'
import { getMcpClient } from './mcp-client'

export async function POST(req: Request) {
  const faqMCPClient = await getMcpClient();
  const { messages }: { messages: UIMessage[] } = await req.json()

  const tools = await faqMCPClient.tools() as ToolSet;

  const result = streamText({
    model: openai('gpt-4o-mini'),
    temperature: 0.7,
    stopWhen: stepCountIs(10),
    tools: tools,
    experimental_transform: smoothStream(),
    onFinish: async () => {
      await faqMCPClient.close();
    },
    messages: convertToModelMessages(messages),
    system: `
      You are a helpful assistant that can answer questions and help with tasks.
      You can use the following tools to help with tasks if you dont have the answer:
      searchFaq: search the FAQ for answers to questions
    `,
  })

  return result.toUIMessageStreamResponse()
}
