"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Textarea } from "../../components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Lock, Eye, Check, X, Mail, Calendar, User, MessageSquare, LogOut, Clock, TestTube, XCircle } from "lucide-react"
import Image from "next/image"

interface AdminMessage {
  id: string
  message: string
  name: string
  email: string
  isAnonymous: boolean
  imageUrl?: string
  isApproved: boolean
  createdAt: string
  submittedAt: string
  approvedAt?: string
  rejectedAt?: string
  notificationSent: boolean
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true) // Start as true to check existing session
  const [rejectionReason, setRejectionReason] = useState("")
  const [selectedMessageId, setSelectedMessageId] = useState("")
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds
  const [showTimeWarning, setShowTimeWarning] = useState(false)
  
  const activityTimeoutRef = useRef<NodeJS.Timeout>()
  const countdownIntervalRef = useRef<NodeJS.Timeout>()
  const lastActivityRef = useRef<number>(Date.now())

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Activity tracking
  const resetActivityTimer = useCallback(() => {
    lastActivityRef.current = Date.now()
    setTimeLeft(15 * 60) // Reset to 15 minutes
    setShowTimeWarning(false)
    
    // Clear existing timers
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current)
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }

    // Set new activity timeout
    activityTimeoutRef.current = setTimeout(() => {
      handleAutoLogout()
    }, 15 * 60 * 1000) // 15 minutes

    // Start countdown when 2 minutes left
    setTimeout(() => {
      if (Date.now() - lastActivityRef.current >= 13 * 60 * 1000) {
        setShowTimeWarning(true)
        countdownIntervalRef.current = setInterval(() => {
          const timeSinceLastActivity = Date.now() - lastActivityRef.current
          const remaining = Math.max(0, 15 * 60 * 1000 - timeSinceLastActivity)
          setTimeLeft(Math.ceil(remaining / 1000))
          
          if (remaining <= 0) {
            handleAutoLogout()
          }
        }, 1000)
      }
    }, 13 * 60 * 1000) // Show warning after 13 minutes
  }, [])

  // Track user activity
  useEffect(() => {
    if (!isAuthenticated) return

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    const activityHandler = () => {
      resetActivityTimer()
    }

    events.forEach(event => {
      document.addEventListener(event, activityHandler, true)
    })

    // Initial timer start
    resetActivityTimer()

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, activityHandler, true)
      })
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current)
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [isAuthenticated, resetActivityTimer])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/admin/messages')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setIsAuthenticated(true)
          setMessages(data.messages)
        }
      }
    } catch (error) {
      console.log('No existing session')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleAutoLogout = async () => {
    await handleLogout()
    window.location.reload() // Refresh the page immediately
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsAuthenticated(false)
      setUsername("")
      setPassword("")
      setMessages([])
      setShowTimeWarning(false)
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current)
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }

  const handleTestEmail = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        alert('Test approval email sent successfully to tmgd.og1@gmail.com!')
      } else {
        alert(`Failed to send test approval email: ${data.error}`)
      }
    } catch (error) {
      console.error('Test email error:', error)
      alert('Failed to send test approval email')
    } finally {
      setLoading(false)
    }
  }

  const handleTestRejectionEmail = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/test-rejection-email', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        alert('Test rejection email sent successfully to tmgd.og1@gmail.com!')
      } else {
        alert(`Failed to send test rejection email: ${data.error}`)
      }
    } catch (error) {
      console.error('Test rejection email error:', error)
      alert('Failed to send test rejection email')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        setIsAuthenticated(true)
        fetchMessages()
      } else {
        alert(data.error || 'Authentication failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  const fetchMessages = async () => {
    setLoading(true)
    try {
      // NUCLEAR CACHE BUSTING for admin panel
      const timestamp = new Date().getTime()
      const randomId = Math.random().toString(36).substring(2, 15)
      const response = await fetch(`/api/admin/messages?t=${timestamp}&r=${randomId}&nocache=${Date.now()}&admin=true`, {
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
        setMessages(data.messages)
        console.log(`🔄 Admin refresh! Found ${data.messages.length} messages at ${new Date().toLocaleTimeString()}`)
      } else {
        alert(data.error || 'Failed to fetch messages')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      alert('Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (messageId: string) => {
    try {
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId }),
      })

      const data = await response.json()

      if (data.success) {
        alert('Message approved and email sent!')
        fetchMessages()
      } else {
        alert(data.error || 'Failed to approve message')
      }
    } catch (error) {
      console.error('Approve error:', error)
      alert('Failed to approve message')
    }
  }

  const handleReject = async (messageId: string, reason?: string) => {
    try {
      const response = await fetch('/api/admin/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId, reason }),
      })

      const data = await response.json()

      if (data.success) {
        alert('Message rejected and email sent!')
        setRejectionReason("")
        setSelectedMessageId("")
        fetchMessages()
      } else {
        alert(data.error || 'Failed to reject message')
      }
    } catch (error) {
      console.error('Reject error:', error)
      alert('Failed to reject message')
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return 'Unknown'
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#E8D5C4" }}>
        <Card className="w-full max-w-md shadow-2xl border-2 border-amber-200">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-amber-900">Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#E8D5C4" }}>
        <Card className="w-full max-w-md shadow-2xl border-2 border-amber-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-xl md:text-2xl text-amber-900">
              <Lock className="w-5 h-5 md:w-6 md:h-6" />
              Admin Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-amber-900 font-semibold">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-2 border-amber-200 focus:border-amber-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-amber-900 font-semibold">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-amber-200 focus:border-amber-400"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={authLoading}
                className="w-full bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold"
              >
                {authLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: "#E8D5C4" }}>
      {/* Activity Warning */}
      {showTimeWarning && (
        <div className="fixed top-2 left-2 right-2 md:top-4 md:right-4 md:left-auto z-50 bg-red-500 text-white p-3 md:p-4 rounded-lg shadow-lg border-2 border-red-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-bold text-sm md:text-base">Session expires in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
          <p className="text-xs md:text-sm mt-1">Click anywhere to stay logged in</p>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <h1 className="text-2xl md:text-4xl font-bold text-amber-900">Admin Panel</h1>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
            <Badge variant="secondary" className="text-sm md:text-lg px-2 py-1 md:px-4 md:py-2">
              {messages.filter(m => !m.isApproved && !m.rejectedAt).length} Pending
            </Badge>
            <Button
              onClick={handleTestEmail}
              disabled={loading}
              variant="outline"
              className="border-2 border-green-500 text-green-600 hover:bg-green-50 text-sm md:text-base px-3 py-2 md:px-4 md:py-2"
            >
              <TestTube className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Test Approval</span>
              <span className="sm:hidden">Test</span>
            </Button>
            <Button
              onClick={handleTestRejectionEmail}
              disabled={loading}
              variant="outline"
              className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 text-sm md:text-base px-3 py-2 md:px-4 md:py-2"
            >
              <XCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Test Rejection</span>
              <span className="sm:hidden">Reject</span>
            </Button>
            <Button
              onClick={async () => {
                setLoading(true)
                console.log('🔥 ADMIN FORCE REFRESH CLICKED!')
                
                try {
                  // Use the new admin force-refresh endpoint
                  const timestamp = Date.now()
                  const randomId = Math.random().toString(36).substring(2, 15)
                  const response = await fetch(`/api/admin/force-refresh?t=${timestamp}&r=${randomId}&bust=${Math.random()}`, {
                    method: 'GET',
                    cache: 'no-store',
                    headers: {
                      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
                      'Pragma': 'no-cache',
                      'Expires': '0',
                      'X-Requested-With': 'admin-force-refresh'
                    }
                  })
                  
                  const data = await response.json()

                  if (data.success) {
                    setMessages(data.messages)
                    console.log(`✅ ADMIN FORCE REFRESH SUCCESS! ${data.messages.length} messages loaded at ${new Date().toLocaleTimeString()}`)
                  } else {
                    console.error('Admin force refresh failed:', data.error)
                    alert(data.error || 'Failed to force refresh messages')
                  }
                } catch (error) {
                  console.error('Admin force refresh error:', error)
                  alert('Failed to force refresh messages')
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm md:text-base px-3 py-2 md:px-4 md:py-2 flex items-center gap-1"
            >
              {loading ? (
                <>
                  <Clock className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                  FORCING...
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 md:w-4 md:h-4" />
                  🔥 FORCE
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                console.log('🔥 NUCLEAR REFRESH - Forcing complete page reload!')
                window.location.reload()
              }}
              variant="outline"
              className="border-2 border-red-500 text-red-600 hover:bg-red-50 text-sm md:text-base px-3 py-2 md:px-4 md:py-2"
            >
              🔥 NUCLEAR
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-2 border-red-500 text-red-600 hover:bg-red-50 text-sm md:text-base px-3 py-2 md:px-4 md:py-2"
            >
              <LogOut className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {messages.map((message) => (
            <Card key={message.id} className="border-2 border-amber-200 bg-white/90">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* Message Content */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-amber-600" />
                        <div>
                          <h3 className="font-bold text-amber-900">
                            {message.isAnonymous ? 'Anonymous' : message.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-amber-600">
                            <Mail className="w-4 h-4" />
                            {message.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {message.isApproved ? (
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            <Check className="w-3 h-3 mr-1" />
                            Approved
                          </Badge>
                        ) : message.rejectedAt ? (
                          <Badge className="bg-red-100 text-red-800 border-red-300">
                            <X className="w-3 h-3 mr-1" />
                            Rejected
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            <Eye className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <div className="flex items-start gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-amber-600 mt-1" />
                        <span className="text-sm font-semibold text-amber-800">Message:</span>
                      </div>
                      <p className="text-amber-900 leading-relaxed">{message.message}</p>
                    </div>

                    {message.imageUrl && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-amber-200">
                        <Image
                          src={message.imageUrl}
                          alt="Attached image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Metadata and Actions */}
                  <div className="space-y-4">
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-600" />
                          <span className="text-amber-800">Submitted: {formatDate(message.createdAt)}</span>
                        </div>
                        {message.approvedAt && (
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-green-800">Approved: {formatDate(message.approvedAt)}</span>
                          </div>
                        )}
                        {message.rejectedAt && (
                          <div className="flex items-center gap-2">
                            <X className="w-4 h-4 text-red-600" />
                            <span className="text-red-800">Rejected: {formatDate(message.rejectedAt)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-amber-600" />
                          <span className={message.notificationSent ? "text-green-800" : "text-red-800"}>
                            Email: {message.notificationSent ? "Sent" : "Not sent"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!message.isApproved && !message.rejectedAt && (
                      <div className="space-y-3">
                        <Button
                          onClick={() => handleApprove(message.id)}
                          className="w-full bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve & Send Email
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => setSelectedMessageId(message.id)}
                              className="w-full bg-red-500 hover:bg-red-600 text-white"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Reject & Send Email
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Message</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Label htmlFor="reason">Reason (Optional)</Label>
                              <Textarea
                                id="reason"
                                placeholder="Provide a reason for rejection..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="border-2 border-amber-200"
                              />
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleReject(selectedMessageId, rejectionReason)}
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                  Reject & Send Email
                                </Button>
                                <Button variant="outline" onClick={() => setSelectedMessageId("")}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {messages.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-xl text-amber-700">No messages found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
