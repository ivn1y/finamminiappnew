import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/db'

interface RegisterUserRequest {
  telegramId: number
  username?: string
  firstName: string
  lastName?: string
  photoUrl?: string
  languageCode?: string
  isPremium?: boolean
  allowsWriteToPm?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterUserRequest = await request.json()
    
    if (!body.telegramId || !body.firstName) {
      return NextResponse.json(
        { error: 'telegramId and firstName are required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.upsert({
      where: { telegramId: BigInt(body.telegramId) },
      update: {
        username: body.username,
        firstName: body.firstName,
        lastName: body.lastName,
        photoUrl: body.photoUrl,
        languageCode: body.languageCode,
        isPremium: body.isPremium ?? false,
        allowsWriteToPm: body.allowsWriteToPm ?? true,
      },
      create: {
        telegramId: BigInt(body.telegramId),
        username: body.username,
        firstName: body.firstName,
        lastName: body.lastName,
        photoUrl: body.photoUrl,
        languageCode: body.languageCode,
        isPremium: body.isPremium ?? false,
        allowsWriteToPm: body.allowsWriteToPm ?? true,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        telegramId: user.telegramId.toString(),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        isPremium: user.isPremium,
        allowsWriteToPm: user.allowsWriteToPm,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('[RegisterUser] Error:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}
