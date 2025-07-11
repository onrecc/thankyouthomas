import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase-admin'
import { sendEmail, createApprovalEmailTemplate } from '../../../../lib/email'

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

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminSession(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { messageId } = await request.json()
    
    if (!messageId) {
      return NextResponse.json(
        { success: false, error: 'Message ID is required' },
        { status: 400 }
      )
    }

    const messageDoc = await db.collection('responses').doc(messageId).get()
    
    if (!messageDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      )
    }

    const messageData = messageDoc.data()
    
    await db.collection('responses').doc(messageId).update({
      isApproved: true,
      approvedAt: new Date().toISOString(),
      rejectedAt: null
    })

    const emailResult = await sendEmail({
      to: messageData?.email,
      subject: 'Your Thank You Message Has Been Approved!',
      html: createApprovalEmailTemplate(
        messageData?.name || 'Friend',
        messageData?.message || ''
      )
    })

    if (emailResult.success) {
      await db.collection('responses').doc(messageId).update({
        notificationSent: true
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Message approved and notification sent!',
      emailSent: emailResult.success
    })
    
  } catch (error) {
    console.error('Error approving message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to approve message' },
      { status: 500 }
    )
  }
}
