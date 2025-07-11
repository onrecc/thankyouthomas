import { NextResponse } from 'next/server'
import { db } from '../../../lib/firebase-admin'

export async function GET() {
  try {
    // Get all approved messages from Firestore
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
        // Don't expose email for privacy
      }
    })
    
    const response = NextResponse.json({ 
      success: true, 
      messages,
      timestamp: new Date().toISOString(),
      serverTime: Date.now()
    })

    // NUCLEAR CACHE PREVENTION - every possible header to prevent caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Last-Modified', new Date().toUTCString())
    response.headers.set('ETag', `"${Date.now()}-${Math.random()}"`)
    response.headers.set('Vary', '*')
    response.headers.set('X-Accel-Expires', '0')
    response.headers.set('X-Cache-Control', 'no-cache')
    
    return response
    
  } catch (error) {
    console.error('Error fetching approved messages:', error)
    const errorResponse = NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch messages',
        timestamp: new Date().toISOString(),
        serverTime: Date.now()
      },
      { status: 500 }
    )
    
    // No caching for errors either
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private, max-age=0')
    errorResponse.headers.set('Pragma', 'no-cache')
    errorResponse.headers.set('Expires', '0')
    errorResponse.headers.set('Last-Modified', new Date().toUTCString())
    errorResponse.headers.set('ETag', `"${Date.now()}-${Math.random()}"`)
    
    return errorResponse
  }
}
