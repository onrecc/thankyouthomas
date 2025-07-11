import { NextRequest, NextResponse } from 'next/server'
import { db, type MessageData } from '../../../lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string
    const isAnonymous = formData.get('isAnonymous') === 'true'
    
    // Validate required fields
    if (!message || !email) {
      return NextResponse.json(
        { success: false, error: 'Message and email are required' },
        { status: 400 }
      )
    }

    // Validate message is not empty
    if (message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message cannot be empty' },
        { status: 400 }
      )
    }
    
    // Get images
    const images = formData.getAll('images') as File[]
    let imageDataUrl: string | undefined
    
    // Convert image to base64 data URL if provided
    if (images.length > 0 && images[0].size > 0) {
      const image = images[0]
      
      // Validate image size (5MB limit)
      if (image.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: 'Image size must be less than 5MB' },
          { status: 400 }
        )
      }
      
      // Validate image type
      if (!image.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: 'Please select a valid image file' },
          { status: 400 }
        )
      }
      
      try {
        // Convert image to base64 data URL
        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = buffer.toString('base64')
        imageDataUrl = `data:${image.type};base64,${base64}`
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Failed to process image' },
          { status: 500 }
        )
      }
    }
    
    // Prepare data for Firestore (only include imageUrl if it exists)
    const messageData: any = {
      message: message.trim(),
      name: isAnonymous ? 'Anonymous' : (name?.trim() || 'Anonymous'),
      email: email.trim(),
      isAnonymous,
      timestamp: FieldValue.serverTimestamp(),
      createdAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      isApproved: false, // Default to false, admin needs to approve
      notificationSent: false // Track if approval notification was sent
    }

    // Only add imageUrl if we have an image
    if (imageDataUrl) {
      messageData.imageUrl = imageDataUrl
    }
    
    // Save to Firestore
    const docRef = await db.collection('responses').add(messageData)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for your message! It has been received and will be reviewed for approval.',
      id: docRef.id
    })
    
  } catch (error) {
    console.error('Error processing form submission:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process submission' },
      { status: 500 }
    )
  }
}
