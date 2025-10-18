import { prisma } from './prisma'

interface NeonUser {
  id: string;
  displayName: string | null;
  primaryEmail: string;
  profileImageUrl: string | null;
}

export async function ensureUserExists(neonUser: unknown) {
  const user = neonUser as NeonUser;
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: user.primaryEmail }
    })

    if (existingUser) {
      return existingUser
    }

    // Create user if they don't exist
    const newUser = await prisma.user.create({
      data: {
        id: user.id,
        name: user.displayName,
        email: user.primaryEmail,
        image: user.profileImageUrl,
      }
    })

    console.log('User created in database:', newUser.id)
    return newUser
  } catch (error) {
    console.error('Error ensuring user exists:', error)
    throw error
  }
}
