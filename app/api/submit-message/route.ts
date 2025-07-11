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
        { success: false, error: 'Please fill in both your message and email address' },
        { status: 400 }
      )
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate message is not empty
    if (message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please enter a message' },
        { status: 400 }
      )
    }

    if (message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please enter a longer message (at least 5 characters)' },
        { status: 400 }
      )
    }

    if (!isAnonymous && (!name || name.trim().length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Please enter your name or check "Submit anonymously"' },
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
          { success: false, error: `Image is too large (${(image.size / 1024 / 1024).toFixed(1)}MB). Please use an image smaller than 5MB.` },
          { status: 400 }
        )
      }
      
      // Validate image type - be more flexible for mobile uploads
      const isValidImageType = image.type.startsWith('image/') || 
                              image.type === '' || // Mobile files often have no type
                              image.name.match(/\.(jpg|jpeg|png|gif|webp|heic|heif|bmp|tiff)$/i)
      
      if (!isValidImageType) {
        return NextResponse.json(
          { success: false, error: `"${image.name}" is not a supported image format. Please use JPG, PNG, GIF, WEBP, or HEIC images.` },
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
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('permission')) {
        return NextResponse.json(
          { success: false, error: 'Database permission error. Please try again or contact support.' },
          { status: 500 }
        )
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        return NextResponse.json(
          { success: false, error: 'Network error. Please check your internet connection and try again.' },
          { status: 500 }
        )
      } else if (error.message.includes('image') || error.message.includes('file')) {
        return NextResponse.json(
          { success: false, error: 'There was an issue processing your image. Please try a different image.' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { success: false, error: 'Server error occurred. Please try again in a few minutes.' },
      { status: 500 }
    )
  }
}
