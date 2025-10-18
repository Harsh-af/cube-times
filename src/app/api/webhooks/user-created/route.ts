import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle Neon Auth user creation webhook
    if (body.type === 'user.created') {
      const { user } = body.data
      
      // Create user in our database
      await prisma.user.create({
        data: {
          id: user.id,
          name: user.displayName,
          email: user.primaryEmail,
          image: user.profileImageUrl,
        }
      })
      
      console.log('User created in database:', user.id)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
