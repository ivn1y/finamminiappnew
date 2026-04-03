import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/db'
import { broadcastMessage } from '@/shared/lib/telegram-bot'

interface BroadcastRequest {
  message: string
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2'
  userIds?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const adminSecret = request.headers.get('x-admin-secret')
    const expectedSecret = process.env.ADMIN_SECRET

    if (!expectedSecret || adminSecret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: BroadcastRequest = await request.json()

    if (!body.message || body.message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    let targetUserIds: bigint[]

    if (body.userIds && body.userIds.length > 0) {
      targetUserIds = body.userIds.map(id => BigInt(id))
    } else {
      const users = await prisma.user.findMany({
        where: { allowsWriteToPm: true },
        select: { telegramId: true },
      })
      targetUserIds = users.map((u: { telegramId: bigint }) => u.telegramId)
    }

    if (targetUserIds.length === 0) {
      return NextResponse.json(
        { error: 'No users to send message to' },
        { status: 400 }
      )
    }

    const broadcast = await prisma.broadcast.create({
      data: {
        message: body.message,
        status: 'sending',
        sentCount: 0,
        failCount: 0,
      },
    })

    const result = await broadcastMessage(
      targetUserIds,
      body.message,
      { parseMode: body.parseMode }
    )

    await prisma.broadcast.update({
      where: { id: broadcast.id },
      data: {
        status: 'completed',
        sentCount: result.success,
        failCount: result.failed,
      },
    })

    return NextResponse.json({
      success: true,
      broadcastId: broadcast.id,
      stats: {
        total: targetUserIds.length,
        sent: result.success,
        failed: result.failed,
      },
      errors: result.errors.slice(0, 10),
    })
  } catch (error) {
    console.error('[Broadcast] Error:', error)
    return NextResponse.json(
      { error: 'Failed to send broadcast' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminSecret = request.headers.get('x-admin-secret')
    const expectedSecret = process.env.ADMIN_SECRET

    if (!expectedSecret || adminSecret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const broadcasts = await prisma.broadcast.findMany({
      orderBy: { sentAt: 'desc' },
      take: 20,
    })

    return NextResponse.json({ broadcasts })
  } catch (error) {
    console.error('[Broadcast] Error getting history:', error)
    return NextResponse.json(
      { error: 'Failed to get broadcast history' },
      { status: 500 }
    )
  }
}
