import { NextRequest, NextResponse } from 'next/server'
import { userService } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await userService.findByEmail(email)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Email not registered. Please sign up first.' },
        { status: 404 }
      )
    }

    // Verify password
    const isPasswordValid = await userService.verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please try again.' },
        { status: 401 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: 'Sign in successful'
    })
  } catch (error) {
    console.error('Error signing in user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to sign in' },
      { status: 500 }
    )
  }
}
