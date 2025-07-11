import { NextResponse } from 'next/server'
import { db } from '../../../lib/firebase-admin'

// Force dynamic rendering - NEVER cache this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log('🔥 FORCE REFRESH TRIGGERED at', new Date().toISOString())
    
    // Get fresh data directly from Firebase with aggressive querying
    const messagesRef = db.collection('responses')
    const snapshot = await messagesRef
      .where('isApproved', '==', true)
      .get()
    
    const messages = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        message: data.message,
        name: data.name,
        isAnonymous: data.isAnonymous,
        imageUrl: data.imageUrl,
        createdAt: data.createdAt,
      }
    })
    
    console.log(`🔄 Force refresh found ${messages.length} messages`)
    
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
    response.headers.set('ETag', `"force-${Date.now()}-${Math.random()}"`)
    response.headers.set('Vary', '*')
    response.headers.set('X-Accel-Expires', '0')
    response.headers.set('X-Cache-Control', 'no-cache')
    response.headers.set('Surrogate-Control', 'no-store')
    response.headers.set('X-Vercel-Cache', 'MISS')
    
    return response
    
  } catch (error) {
    console.error('Error in force refresh:', error)
    const errorResponse = NextResponse.json(
      { 
        success: false, 
        error: 'Force refresh failed',
        timestamp: new Date().toISOString(),
        serverTime: Date.now()
      },
      { status: 500 }
    )
    
    // Anti-cache headers for errors too
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    errorResponse.headers.set('Pragma', 'no-cache')
    errorResponse.headers.set('Expires', '0')
    
    return errorResponse
  }
}
