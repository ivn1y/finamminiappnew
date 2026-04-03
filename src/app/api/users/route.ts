import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const onlyWithPm = searchParams.get('onlyWithPm') === 'true'

    const where = onlyWithPm ? { allowsWriteToPm: true } : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          telegramId: true,
          username: true,
          firstName: true,
          lastName: true,
          isPremium: true,
          allowsWriteToPm: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      users: users.map((user: { id: string; telegramId: bigint; username: string | null; firstName: string | null; lastName: string | null; isPremium: boolean; allowsWriteToPm: boolean; createdAt: Date }) => ({
        ...user,
        telegramId: user.telegramId.toString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[GetUsers] Error:', error)
    return NextResponse.json(
      { error: 'Failed to get users' },
      { status: 500 }
    )
  }
}
