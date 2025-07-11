import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const { messageId } = await request.json()
    
    if (!messageId) {
      return NextResponse.json(
        { success: false, error: 'Message ID is required' },
        { status: 400 }
      )
    }

    // Get the message from Firestore
    const messageDoc = await db.collection('responses').doc(messageId).get()
    
    if (!messageDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      )
    }

    const messageData = messageDoc.data()
    
    // Update the message to approved
    await db.collection('responses').doc(messageId).update({
      isApproved: true,
      approvedAt: new Date().toISOString()
    })

    // Here you would typically send an email notification
    // For now, we'll just log it and return success
    console.log(`Message approved for ${messageData?.email}:`, {
      name: messageData?.name,
      email: messageData?.email,
      message: messageData?.message?.substring(0, 100) + '...'
    })

    // In a real implementation, you would use a service like:
    // - SendGrid
    // - Nodemailer
    // - AWS SES
    // - Resend
    // etc.

    return NextResponse.json({ 
      success: true, 
      message: 'Message approved and notification sent!' 
    })
    
  } catch (error) {
    console.error('Error approving message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to approve message' },
      { status: 500 }
    )
  }
}
