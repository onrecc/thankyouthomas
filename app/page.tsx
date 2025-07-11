"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import MessageCard from "./components/message-card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog"
import { Heart, MessageSquare, Search, Info, RefreshCw } from "lucide-react"

interface ApprovedMessage {
  id: string
  message: string
  name: string
  isAnonymous: boolean
  imageUrl?: string
  createdAt: string
}

export default function Page() {
  const [messages, setMessages] = useState<ApprovedMessage[]>([])
  const [filteredMessages, setFilteredMessages] = useState<ApprovedMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchApprovedMessages()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMessages(messages)
    } else {
      const filtered = messages.filter((message) => 
        message.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (!message.isAnonymous && message.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredMessages(filtered)
    }
  }, [searchQuery, messages])

  const fetchApprovedMessages = async () => {
    try {
      // NUCLEAR CACHE BUSTING - multiple techniques to force fresh data
      const timestamp = new Date().getTime()
      const randomId = Math.random().toString(36).substring(2, 15)
      const response = await fetch(`/api/approved-messages?t=${timestamp}&r=${randomId}&nocache=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store', // Force no caching
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'If-Modified-Since': '0',
          'If-None-Match': 'no-match-for-this'
        }
      })
      
      // Force browser to not cache by cloning response
      const clonedResponse = response.clone()
      const data = await clonedResponse.json()
      
      if (data.success) {
        // Sort messages by creation date (newest first)
        const sortedMessages = data.messages.sort((a: ApprovedMessage, b: ApprovedMessage) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
        setMessages(sortedMessages)
        setFilteredMessages(sortedMessages)
        console.log(`🔄 Refreshed! Found ${sortedMessages.length} messages at ${new Date().toLocaleTimeString()}`)
      } else {
        console.error('API returned error:', data.error)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#E8D5C4" }}>
      {/* Background Image */}
      <div className="absolute inset-0 opacity-40">
        <Image src="/neighborhood-bg.png" alt="Neighborhood background" fill className="object-cover" priority />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 -mt-12 pb-8 md:pb-16 px-4 md:px-8">
        {/* Logo at the very top */}
        <div className="flex justify-center mb-4 md:mb-0">
          <Image src="/logo.png" alt="Logo" width={180} height={180} className="md:w-[300px] md:h-[300px] object-contain" />
        </div>

        {/* Send Message Button */}
        <div className="flex justify-center mb-1 md:mb-5 md:-mt-20">
          <Link href="/form" className="block">
            <Button 
              className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold px-4 py-3 md:px-6 md:py-3 rounded-xl shadow-lg border-2 border-amber-300 transition-all duration-200 hover:scale-105 cursor-pointer text-sm md:text-base"
            >
              <Heart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Send Message to Thomas
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="bg-white/90 p-4 md:p-6 rounded-2xl shadow-lg border-2 border-amber-200 max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-amber-900 mb-2 md:mb-4" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              Thank You Thomas!
            </h1>
            <p className="text-lg md:text-xl text-amber-800 leading-relaxed">
              Here are heartfelt messages from the community thanking Thomas Stubblefield for his incredible work organizing our neighborhood!
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-6 md:mb-6 px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-600" />
            <Input
              type="text"
              placeholder="Search messages or names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 md:py-3 rounded-xl border-2 border-amber-200 focus:border-amber-400 bg-white/90 text-amber-900 placeholder:text-amber-600 shadow-lg text-base"
            />
          </div>
        </div>

        {/* MANUAL REFRESH BUTTON */}
        <div className="flex justify-center mb-6">
          <Button 
            onClick={async () => {
              setLoading(true)
              console.log('🔥 FORCE REFRESH CLICKED!')
              
              try {
                // Use the new force-refresh endpoint with maximum cache busting
                const timestamp = Date.now()
                const randomId = Math.random().toString(36).substring(2, 15)
                const response = await fetch(`/api/force-refresh?t=${timestamp}&r=${randomId}&bust=${Math.random()}`, {
                  method: 'GET',
                  cache: 'no-store',
                  headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    'X-Requested-With': 'force-refresh'
                  }
                })
                
                const data = await response.json()
                
                if (data.success) {
                  const sortedMessages = data.messages.sort((a: ApprovedMessage, b: ApprovedMessage) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  })
                  setMessages(sortedMessages)
                  setFilteredMessages(sortedMessages)
                  console.log(`✅ FORCE REFRESH SUCCESS! ${sortedMessages.length} messages loaded at ${new Date().toLocaleTimeString()}`)
                } else {
                  console.error('Force refresh failed:', data.error)
                  // Fallback to regular fetch
                  await fetchApprovedMessages()
                }
              } catch (error) {
                console.error('Force refresh error:', error)
                // Fallback to regular fetch
                await fetchApprovedMessages()
              } finally {
                setLoading(false)
              }
            }}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg border-2 border-green-500 transition-all duration-200 hover:scale-105 cursor-pointer text-sm flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Credits Button */}
        <div className="flex justify-center mb-6">
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

        {/* Messages Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12 md:py-20">
            <div className="bg-white/90 p-6 md:p-8 rounded-2xl shadow-lg border-2 border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-amber-900 font-semibold text-sm md:text-base">Loading messages...</span>
              </div>
            </div>
          </div>
        ) : filteredMessages.length === 0 && searchQuery.trim() !== "" ? (
          <div className="flex justify-center items-center py-12 md:py-20">
            <div className="bg-white/90 p-8 md:p-12 rounded-2xl shadow-lg border-2 border-amber-200 text-center max-w-md mx-4">
              <Search className="w-12 h-12 md:w-16 md:h-16 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-amber-900 mb-2">No matches found</h3>
              <p className="text-amber-700 mb-6 text-sm md:text-base">Try searching with different keywords</p>
              <Button 
                onClick={() => setSearchQuery("")}
                className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg border-2 border-amber-300 text-sm md:text-base"
              >
                Clear Search
              </Button>
            </div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex justify-center items-center py-12 md:py-20">
            <div className="bg-white/90 p-8 md:p-12 rounded-2xl shadow-lg border-2 border-amber-200 text-center max-w-md mx-4">
              <MessageSquare className="w-12 h-12 md:w-16 md:h-16 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-amber-900 mb-2">No messages yet</h3>
              <p className="text-amber-700 mb-6 text-sm md:text-base">Be the first to send a message to Thomas!</p>
              <Link href="/form">
                <Button className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg border-2 border-amber-300 text-sm md:text-base">
                  <Heart className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4">
            <div className="masonry-grid">
              {filteredMessages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message.message}
                  name={message.name}
                  isAnonymous={message.isAnonymous}
                  imageUrl={message.imageUrl}
                  createdAt={message.createdAt}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
