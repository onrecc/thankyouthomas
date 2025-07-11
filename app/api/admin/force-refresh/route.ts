import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase-admin'

function verifyAdminSession(request: NextRequest) {
  const session = request.cookies.get('admin-session')?.value
  
  if (!session) {
    return false
  }

  try {
    const decoded = Buffer.from(session, 'base64').toString()
    const [username, timestamp] = decoded.split(':')
    
    const sessionTime = parseInt(timestamp)
    const now = Date.now()
    const eightHours = 8 * 60 * 60 * 1000
    
    return username === process.env.ADMIN_USERNAME && (now - sessionTime) < eightHours
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!verifyAdminSession(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🔥 ADMIN FORCE REFRESH TRIGGERED at', new Date().toISOString())

    // Get fresh data directly from Firebase
    const messagesRef = db.collection('responses')
    const snapshot = await messagesRef.get()
    
    const messages = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        message: data.message,
        name: data.name,
        email: data.email,
        isAnonymous: data.isAnonymous,
        imageUrl: data.imageUrl,
        isApproved: data.isApproved || false,
        createdAt: data.createdAt,
        submittedAt: data.submittedAt,
        approvedAt: data.approvedAt,
        rejectedAt: data.rejectedAt,
        notificationSent: data.notificationSent || false
      }
    })

    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    console.log(`🔄 Admin force refresh found ${messages.length} total messages`)
    
    const response = NextResponse.json({ 
      success: true, 
      messages,
      forceRefresh: true,
      timestamp: new Date().toISOString(),
      serverTime: Date.now(),
      randomId: Math.random().toString(36).substring(2, 15)
    })

    // EXTREME anti-caching headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private, max-age=0, s-maxage=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Last-Modified', new Date().toUTCString())
    response.headers.set('ETag', `"admin-force-${Date.now()}-${Math.random()}"`)
    response.headers.set('Vary', '*')
    response.headers.set('X-Accel-Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    response.headers.set('X-Vercel-Cache', 'MISS')
    
    return response
    
  } catch (error) {
    console.error('Error in admin force refresh:', error)
    const errorResponse = NextResponse.json(
      { success: false, error: 'Admin force refresh failed' },
      { status: 500 }
    )
    
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    errorResponse.headers.set('Pragma', 'no-cache')
    errorResponse.headers.set('Expires', '0')
    
    return errorResponse
  }
}
