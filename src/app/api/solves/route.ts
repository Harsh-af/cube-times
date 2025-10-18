import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { time, scramble, penalty, puzzleType, sessionId } = await request.json()

    if (!time || !scramble || !puzzleType || !sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.primaryEmail || '' }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify the session belongs to the user
    const cubeSession = await prisma.cubeSession.findFirst({
      where: {
        id: sessionId,
        userId: dbUser.id,
      }
    })

    if (!cubeSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const solve = await prisma.solve.create({
      data: {
        time,
        scramble,
        penalty,
        puzzleType,
        sessionId,
      }
    })

    return NextResponse.json(solve)
  } catch (error) {
    console.error('Error creating solve:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
