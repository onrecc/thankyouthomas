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
    
    return NextResponse.json({ 
      success: true, 
      messages 
    })
    
  } catch (error) {
    console.error('Error fetching approved messages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
