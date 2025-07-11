import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, createApprovalEmailTemplate } from '../../../../lib/email'

export async function POST(request: NextRequest) {
  try {
    // Test data
    const testName = "Test User"
    const testMessage = "This is a test message to verify the email system is working correctly. Thank you Thomas for all your hard work organizing our neighborhood!"
    
    // Create test email
    const emailHtml = createApprovalEmailTemplate(testName, testMessage)
    
    // Send test email
    const result = await sendEmail({
      to: "tmgd.og1@gmail.com",
      subject: "Test Email - Thank You Thomas System",
      html: emailHtml
    })

    if (result.success) {
      console.log('Test email sent successfully to tmgd.og1@gmail.com')
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId
      })
    } else {
      console.error('Failed to send test email:', result.error)
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
