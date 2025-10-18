import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack/server'
import { prisma } from '@/lib/prisma'
import { ensureUserExists } from '@/lib/user-sync'

export async function GET() {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await ensureUserExists(user)
    
    const userWithSessions = await prisma.user.findUnique({
      where: { email: user.primaryEmail || '' },
      include: {
        cubeSessions: {
          include: {
            solves: {
              orderBy: { timestamp: 'desc' }
            }
          }
        }
      }
    })

    if (!userWithSessions) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(userWithSessions.cubeSessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, puzzleType } = await request.json()

    if (!name || !puzzleType) {
      return NextResponse.json({ error: 'Name and puzzle type are required' }, { status: 400 })
    }

    const dbUser = await ensureUserExists(user)

    const cubeSession = await prisma.cubeSession.create({
      data: {
        name,
        puzzleType,
        userId: dbUser.id,
      }
    })

    return NextResponse.json(cubeSession)
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
