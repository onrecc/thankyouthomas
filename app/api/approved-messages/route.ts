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
      messages 
    })

    // FORCE NO CACHING - this will prevent Vercel from caching the response
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
    
  } catch (error) {
    console.error('Error fetching approved messages:', error)
    const errorResponse = NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    )
    
    // No caching for errors either
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    errorResponse.headers.set('Pragma', 'no-cache')
    errorResponse.headers.set('Expires', '0')
    
    return errorResponse
  }
}
