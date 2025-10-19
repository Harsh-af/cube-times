import { NextResponse } from 'next/server'
import { stackServerApp } from '@/stack/server'
import { prisma } from '@/lib/prisma'
import { ensureUserExists } from '@/lib/user-sync'

export async function POST() {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await ensureUserExists(user)

    // Delete all existing cube sessions for this user (this will cascade delete solves)
    await prisma.cubeSession.deleteMany({
      where: {
        userId: dbUser.id
      }
    })

    // Create exactly 2 new sessions
    const defaultSession = await prisma.cubeSession.create({
      data: {
        name: 'Default Session',
        puzzleType: '3x3',
        userId: dbUser.id,
      }
    })

    const playgroundSession = await prisma.cubeSession.create({
      data: {
        name: 'Playground',
        puzzleType: '3x3',
        userId: dbUser.id,
      }
    })

    return NextResponse.json({
      message: 'Sessions reset successfully',
      sessions: [defaultSession, playgroundSession]
    })
  } catch (error) {
    console.error('Error resetting sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

