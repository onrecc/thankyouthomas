"use client"

import { Card, CardContent } from "../../components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "../../components/ui/dialog"
import Image from "next/image"
import { useState } from "react"
import { Expand, X } from "lucide-react"

interface MessageCardProps {
  message: string
  name: string
  isAnonymous: boolean
  imageUrl?: string
  createdAt: string
}

export default function MessageCard({ message, name, isAnonymous, imageUrl, createdAt }: MessageCardProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageDimensions, setImageDimensions] = useState<{width: number, height: number} | null>(null)

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Recently'
    }
  }

  const handleImageLoad = (event: any) => {
    const img = event.target
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    })
  }

  // Calculate display dimensions for the card image
  const getImageDisplayDimensions = () => {
    if (!imageDimensions) return { width: 300, height: 200 }
    
    const maxWidth = 500
    const maxHeight = 500
    const { width, height } = imageDimensions
    
    // If image fits within max bounds, use actual size
    if (width <= maxWidth && height <= maxHeight) {
      return { width, height }
    }
    
    // Scale down proportionally
    const ratio = Math.min(maxWidth / width, maxHeight / height)
    return { 
      width: Math.floor(width * ratio), 
      height: Math.floor(height * ratio)
    }
  }

  const displayDims = getImageDisplayDimensions()
  const needsFullImageButton = imageDimensions && (imageDimensions.width > 500 || imageDimensions.height > 500)

  return (
    <Card 
      className="shadow-lg border-2 border-amber-200 bg-amber-50/90 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] break-inside-avoid mb-4 w-full"
    >
      <CardContent className="p-4">
        {/* Header with name and date */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-sm md:text-base font-bold text-amber-900 leading-tight">
            {isAnonymous ? 'Anonymous' : name}
          </h3>
          <span className="text-xs text-amber-600 ml-2 flex-shrink-0">
            {formatDate(createdAt)}
          </span>
        </div>

        {/* Message Text */}
        <div className="mb-3">
          <p className="text-amber-900 leading-relaxed text-sm">
            {message}
          </p>
        </div>

        {/* Image if present */}
        {imageUrl && (
          <div className="mt-3">
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
              <DialogTrigger asChild>
                <div className="relative cursor-pointer group rounded-lg overflow-hidden border-2 border-amber-200 hover:border-amber-400 transition-all duration-200">
                  <Image
                    src={imageUrl}
                    alt="Attached image"
                    width={displayDims.width}
                    height={displayDims.height}
                    className="w-full h-auto object-cover"
                    onLoad={handleImageLoad}
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                    <Expand className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                  {needsFullImageButton && (
                    <div className="absolute top-2 right-2 bg-amber-900/80 text-white text-xs px-2 py-1 rounded transition-opacity duration-200">
                      Click to view full size
                    </div>
                  )}
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] max-h-[95vh] p-4 bg-white/95 border-2 border-amber-200">
                <div className="relative flex items-center justify-center">
                  <div className="max-w-full max-h-[85vh] overflow-auto rounded-lg">
                    <Image
                      src={imageUrl}
                      alt="Attached image - Full size"
                      width={imageDimensions?.width || 800}
                      height={imageDimensions?.height || 600}
                      className="max-w-full h-auto object-contain"
                      sizes="95vw"
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
