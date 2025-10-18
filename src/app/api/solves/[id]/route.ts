import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { penalty } = await request.json()

    const dbUser = await prisma.user.findUnique({
      where: { email: user.primaryEmail || '' }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify the solve belongs to the user through the session
    const solve = await prisma.solve.findFirst({
      where: {
        id: id,
        cubeSession: {
          userId: dbUser.id,
        }
      }
    })

    if (!solve) {
      return NextResponse.json({ error: 'Solve not found' }, { status: 404 })
    }

    const updatedSolve = await prisma.solve.update({
      where: { id: id },
      data: { penalty }
    })

    return NextResponse.json(updatedSolve)
  } catch (error) {
    console.error('Error updating solve:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.primaryEmail || '' }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify the solve belongs to the user through the session
    const solve = await prisma.solve.findFirst({
      where: {
        id: id,
        cubeSession: {
          userId: dbUser.id,
        }
      }
    })

    if (!solve) {
      return NextResponse.json({ error: 'Solve not found' }, { status: 404 })
    }

    await prisma.solve.delete({
      where: { id: id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting solve:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
