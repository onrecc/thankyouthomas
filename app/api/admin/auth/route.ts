import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    // Trim whitespace from inputs
    const trimmedUsername = username?.trim()
    const trimmedPassword = password?.trim()
    
    if (!trimmedUsername || !trimmedPassword) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Check username
    if (trimmedUsername !== process.env.ADMIN_USERNAME) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check password hash
    const isValidPassword = await bcrypt.compare(trimmedPassword, process.env.ADMIN_PASSWORD_HASH || '')
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create a simple session token (in production, use JWT or proper session management)
    const sessionToken = Buffer.from(`${trimmedUsername}:${Date.now()}`).toString('base64')

    const response = NextResponse.json({ 
      success: true, 
      message: 'Authentication successful',
      token: sessionToken
    })

    // Set session cookie with longer expiration
    response.cookies.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours (but will be managed by client-side activity tracking)
    })

    return response
    
  } catch (error) {
    console.error('Error during authentication:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
