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
    
    return NextResponse.json({ 
      success: true, 
      messages 
    })
    
  } catch (error) {
    console.error('Error fetching admin messages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
