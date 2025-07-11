import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, createRejectionEmailTemplate } from '../../../../lib/email'

export async function POST(request: NextRequest) {
  try {
    // Test data for rejection email
    const testName = "Test User"
    const testMessage = "This is a test rejection message to verify the email system is working correctly. Thanks for organizing our community!"
    const testReason = "This is a test rejection for development purposes. In a real scenario, this would contain the actual reason for rejection."
    
    // Create test rejection email
    const emailHtml = createRejectionEmailTemplate(testName, testMessage, testReason)
    
    // Send test rejection email
    const result = await sendEmail({
      to: "tmgd.og1@gmail.com",
      subject: "Test Rejection Email - Thank You Thomas System",
      html: emailHtml
    })

    if (result.success) {
      console.log('Test rejection email sent successfully to tmgd.og1@gmail.com')
      return NextResponse.json({
        success: true,
        message: 'Test rejection email sent successfully',
        messageId: result.messageId
      })
    } else {
      console.error('Failed to send test rejection email:', result.error)
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Test rejection email error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
