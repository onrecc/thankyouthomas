"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent } from "../../components/ui/card"
import { Checkbox } from "../../components/ui/checkbox"
import { Mail, User, MessageSquare, ImageIcon, AlertCircle, ArrowLeft, Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogTrigger } from "../../components/ui/dialog"

export default function NeighborhoodForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    images: null as File[] | null,
    isAnonymous: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Helper function to convert image to PNG
  const convertImageToPNG = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new window.Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const pngFile = new File([blob], `${file.name.split('.')[0]}.png`, {
              type: 'image/png',
              lastModified: Date.now()
            })
            resolve(pngFile)
          } else {
            resolve(file) // Fallback to original file if conversion fails
          }
        }, 'image/png', 0.9)
      }
      
      img.onerror = () => {
        resolve(file) // Fallback to original file if loading fails
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.isAnonymous ? 'Anonymous' : formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('message', formData.message)
      formDataToSend.append('isAnonymous', formData.isAnonymous.toString())
      
      // Add images if any - convert to PNG first
      if (formData.images && formData.images.length > 0) {
        console.log('Converting images to PNG format...')
        for (let i = 0; i < formData.images.length; i++) {
          const originalFile = formData.images[i]
          const pngFile = await convertImageToPNG(originalFile)
          formDataToSend.append('images', pngFile)
          console.log(`Converted ${originalFile.name} (${originalFile.type}) to ${pngFile.name} (${pngFile.type})`)
        }
      }

      // Submit to your backend API
      const response = await fetch('/api/submit-message', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        const result = await response.json()
        // Reset form
        setFormData({
          name: "",
          email: "",
          message: "",
          images: null,
          isAnonymous: false,
        })
        // Clear file input
        const fileInput = document.getElementById('images') as HTMLInputElement
        if (fileInput) {
          fileInput.value = ''
        }
        // Show success message
        alert(result.message || 'Your message has been sent successfully! It will be reviewed for approval.')
      } else {
        const result = await response.json()
        throw new Error(result.error || 'Failed to submit message')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      // Show specific error message instead of generic "Something went wrong"
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean | File[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      console.log(`Selected ${files.length} images:`, files.map(f => `${f.name} (${f.type})`))
      handleInputChange("images", files)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#E8D5C4" }}>
      {/* Animation Styles */}
      <style jsx global>{`
        .click-animation {
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .click-animation:active {
          transform: scale(0.95);
        }
        
        .button-click {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .button-click:active {
          transform: scale(0.98) translateY(1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        .input-focus {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .input-focus:focus {
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(244, 208, 63, 0.3);
        }

        /* Disable zoom */
        html {
          touch-action: manipulation;
        }
      `}</style>

      <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#E8D5C4" }}>
        {/* Background Image */}
        <div className="absolute inset-0 opacity-40">
          <Image src="/neighborhood-bg.png" alt="Neighborhood background" fill className="object-cover" priority />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-start min-h-screen p-4 pt-8">
          {/* Logo at the very top */}
          <div className="mb-4 click-animation">
            <Image src="/logo.png" alt="Logo" width={200} height={200} className="md:w-[280px] md:h-[280px] object-contain" />
          </div>

          {/* Approval Banner */}
          <div className="mb-6 max-w-sm">
            <div className="bg-orange-100 border-2 border-orange-300 text-orange-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">All submissions subject to approval</span>
            </div>
          </div>

          {/* Form Card */}
          <Card className="w-full max-w-md shadow-2xl border-2 border-amber-200" style={{ backgroundColor: "#F5F0E8" }}>
            <CardContent className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-3" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                  Thank You Thomas!
                </h1>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Help us thank Thomas Stubblefield for his work in organizing neighborhood!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-amber-900 font-semibold flex items-center gap-2 text-sm">
                    <User className="w-3 h-3" />
                    Your Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="What should we call you?"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="rounded-xl border-2 border-amber-200 focus:border-amber-400 bg-white/80 text-amber-900 placeholder:text-amber-600 h-10 md:h-9 text-sm input-focus click-animation"
                    required={!formData.isAnonymous}
                    disabled={formData.isAnonymous}
                  />

                  {/* Anonymous Checkbox */}
                  <div className="flex items-center space-x-2 click-animation">
                    <Checkbox
                      id="anonymous"
                      checked={formData.isAnonymous}
                      onCheckedChange={(checked) => {
                        handleInputChange("isAnonymous", checked as boolean)
                        if (checked) {
                          handleInputChange("name", "")
                        }
                      }}
                      className="border-2 border-amber-300 data-[state=checked]:bg-amber-400 data-[state=checked]:border-amber-500"
                    />
                    <Label htmlFor="anonymous" className="text-amber-800 font-medium cursor-pointer text-sm">
                      Submit anonymously
                    </Label>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-amber-900 font-semibold flex items-center gap-2 text-sm">
                    <Mail className="w-3 h-3" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="rounded-xl border-2 border-amber-200 focus:border-amber-400 bg-white/80 text-amber-900 placeholder:text-amber-600 h-10 md:h-9 text-sm input-focus click-animation"
                    required
                  />
                  <p className="text-xs text-amber-600">
                    (Email will not be shown publicly, just to contact you!)
                  </p>
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-amber-900 font-semibold flex items-center gap-2 text-sm">
                    <MessageSquare className="w-3 h-3" />
                    Message for Thomas *
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Share your appreciation, memories, or thanks for Thomas's work in organizing our neighborhood community!"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    className="rounded-xl border-2 border-amber-200 focus:border-amber-400 bg-white/80 text-amber-900 placeholder:text-amber-600 min-h-[100px] md:min-h-[80px] resize-none text-sm input-focus click-animation"
                    required
                  />
                </div>

                {/* Images Field */}
                <div className="space-y-2">
                  <Label htmlFor="images" className="text-amber-900 font-semibold flex items-center gap-2 text-sm">
                    <ImageIcon className="w-3 h-3" />
                    Images (Optional)
                  </Label>
                  <div className="pb-4">
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*,.heic,.heif,.webp,.avif,.tiff,.tif,.bmp,.svg,.ico,.gif,.apng"
                      onChange={handleImageUpload}
                      className="rounded-xl border-2 border-amber-200 focus:border-amber-400 bg-white/80 text-amber-900 h-12 md:h-12 flex items-center justify-center file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 click-animation text-sm"
                    />
                    {formData.images && formData.images.length > 0 && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs text-green-700 font-semibold mb-1">
                          Selected {formData.images.length} image(s):
                        </p>
                        {formData.images.map((file, index) => (
                          <p key={index} className="text-xs text-green-600">
                            • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        ))}
                        <p className="text-xs text-blue-600 mt-1 italic">
                          Images will be automatically converted to PNG format before upload
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-amber-600 -mt-2">
                    Share any images (iPhone photos, screenshots, etc.). All formats supported and automatically converted to PNG.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 md:h-12 text-base font-bold rounded-2xl shadow-lg transition-all duration-200 button-click disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: isSubmitting ? "#E6C547" : "#F4D03F",
                      color: "#8B4513",
                      border: "3px solid #D4AC0D",
                    }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
                        Sending Thanks...
                      </div>
                    ) : (
                      "Thank Thomas!"
                    )}
                  </Button>
                </div>
              </form>

              {/* Back Button */}
              <div className="mt-6 text-center space-y-4">
                <Link href="/">
                  <Button 
                    className="bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold px-6 py-3 rounded-xl shadow-lg border-2 border-amber-300 transition-all duration-200 hover:scale-105 cursor-pointer text-sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Messages
                  </Button>
                </Link>
                
                {/* Credits Button */}
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl shadow-lg border-2 border-amber-500 transition-all duration-200 hover:scale-105 cursor-pointer text-sm"
                      >
                        <Info className="w-4 h-4 mr-2" />
                        Credits
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-amber-50 border-2 border-amber-200">
                      <div className="text-center p-4">
                        <h2 className="text-2xl font-bold text-amber-900 mb-6" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                          Credits
                        </h2>
                        <div className="space-y-4 text-amber-800">
                          <div>
                            <h3 className="font-bold text-lg mb-1">Site:</h3>
                            <p className="text-base">TM1988</p>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-1">Idea:</h3>
                            <p className="text-base">AERESAL</p>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-1">Domain:</h3>
                            <p className="text-base">Onrecc</p>
                          </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-amber-200">
                          <p className="text-sm text-amber-600">
                            Made with ❤️ for Thomas Stubblefield
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Extra spacing at bottom */}
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  )
}
