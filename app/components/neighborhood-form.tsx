"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent } from "../../components/ui/card"
import { Checkbox } from "../../components/ui/checkbox"
import { Mail, User, MessageSquare, ImageIcon, AlertCircle } from "lucide-react"
import Image from "next/image"

export default function NeighborhoodForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    images: null as File[] | null,
    isAnonymous: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

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
      
      // Add images if any
      if (formData.images && formData.images.length > 0) {
        for (let i = 0; i < formData.images.length; i++) {
          formDataToSend.append('images', formData.images[i])
        }
      }

      // Submit to your backend API
      const response = await fetch('/api/submit-message', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        // Reset form
        setFormData({
          name: "",
          email: "",
          message: "",
          images: null,
          isAnonymous: false,
        })
        // Show success message
        alert('Your message has been sent successfully! Thank you for your kind words.')
      } else {
        throw new Error('Failed to submit message')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean | File[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleInputChange("images", Array.from(e.target.files))
    }
  }

  return (
    <>
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

        {/* Logo */}
        <div className="absolute top-8 left-8 z-10 click-animation">
          <div className="bg-white/90 p-8 rounded-2xl shadow-lg border-2 border-amber-200">
            <Image src="/logo.png" alt="Logo" width={200} height={200} className="object-contain" />
          </div>
        </div>

        {/* Approval Banner */}
        <div className="absolute top-8 right-8 z-10">
          <div className="bg-orange-100 border-2 border-orange-300 text-orange-800 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 max-w-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-base font-medium">All submissions subject to approval</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md shadow-2xl border-0" style={{ backgroundColor: "#F5F0E8" }}>
            <CardContent className="p-5">
              {/* Header */}
              <div className="text-center mb-5">
                <h1 className="text-3xl font-bold text-amber-900 mb-2" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                  Thank You Thomas!
                </h1>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Help us thank Thomas Stubblefield for his work in organizing neighborhood!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="rounded-xl border-2 border-amber-200 focus:border-amber-400 bg-white/80 text-amber-900 placeholder:text-amber-600 h-9 text-sm input-focus click-animation"
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
                    className="rounded-xl border-2 border-amber-200 focus:border-amber-400 bg-white/80 text-amber-900 placeholder:text-amber-600 h-9 text-sm input-focus click-animation"
                    required
                  />
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
                    className="rounded-xl border-2 border-amber-200 focus:border-amber-400 bg-white/80 text-amber-900 placeholder:text-amber-600 min-h-[80px] resize-none text-sm input-focus click-animation"
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
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="rounded-xl border-2 border-amber-200 focus:border-amber-400 bg-white/80 text-amber-900 h-12 flex items-center justify-center file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 click-animation text-sm"
                    />
                  </div>
                  <p className="text-xs text-amber-600 -mt-2">
                    Share photos, screenshots, or any images related to your message for Thomas
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-base font-bold rounded-2xl shadow-lg transition-all duration-200 button-click disabled:opacity-50 disabled:cursor-not-allowed"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
