import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../../lib/firebase-admin'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { approved } = await request.json()
    
    // Update the message approval status
    await db.collection('responses').doc(id).update({
      isApproved: approved
    })
    
    return NextResponse.json({ 
      success: true, 
      message: `Message ${approved ? 'approved' : 'rejected'} successfully` 
    })
    
  } catch (error) {
    console.error('Error updating message approval:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update message approval' },
      { status: 500 }
    )
  }
}
