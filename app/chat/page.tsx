"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Database, Loader2, Brain, Sparkles, MessageCircle, Zap } from "lucide-react"
import { useChat } from "ai/react"

export default function ChatPage() {
  const [selectedDatabase, setSelectedDatabase] = useState<string>("all")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: {
      database: selectedDatabase,
    },
    onFinish: () => {
      setIsTyping(false)
    },
  })

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (isLoading) {
      setIsTyping(true)
    }
  }, [isLoading])

  const databases = [
    { value: "all", label: "🌐 Semua Database", color: "from-gray-500 to-gray-600" },
    { value: "financial", label: "💰 Financial Data", color: "from-green-500 to-emerald-600" },
    { value: "hr", label: "👥 Human Resources", color: "from-blue-500 to-cyan-600" },
    { value: "operations", label: "⚙️ Operations", color: "from-orange-500 to-red-600" },
    { value: "marketing", label: "📈 Marketing", color: "from-purple-500 to-pink-600" },
    { value: "general", label: "📚 General Knowledge", color: "from-indigo-500 to-purple-600" },
  ]

  const currentDb = databases.find((db) => db.value === selectedDatabase)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/5 to-pink-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <Brain className="h-10 w-10 text-blue-600 animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              AI Chat RAG
            </h1>
            <Sparkles className="h-10 w-10 text-purple-600 animate-bounce" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tanyakan apapun tentang dokumen Anda dengan kecerdasan buatan
          </p>
        </div>

        <Card className="h-[700px] flex flex-col shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <div className="relative">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI Assistant
                  </span>
                  <p className="text-sm text-gray-500 font-normal">Powered by GPT-4 & RAG</p>
                </div>
              </CardTitle>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600 font-medium">Database:</span>
                </div>
                <Select value={selectedDatabase} onValueChange={setSelectedDatabase}>
                  <SelectTrigger className="w-56 border-2 hover:border-blue-400 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {databases.map((db) => (
                      <SelectItem key={db.value} value={db.value}>
                        {db.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
              <div className="space-y-6">
                {messages.length === 0 && (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <MessageCircle className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Mulai Percakapan</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Tanyakan apapun tentang dokumen yang telah Anda upload. AI akan memberikan jawaban berdasarkan
                      konteks yang relevan.
                    </p>

                    {/* Suggestion Cards */}
                    <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      {[
                        "Apa saja data penting dalam dokumen financial?",
                        "Berikan ringkasan dari dokumen HR yang diupload",
                        "Analisis tren dari data marketing",
                        "Jelaskan prosedur operasional yang ada",
                      ].map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 hover:border-blue-300 transition-colors cursor-pointer hover:shadow-md"
                        >
                          <p className="text-sm text-gray-700">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 animate-fade-in-up ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`flex gap-4 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                            : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600"
                        }`}
                      >
                        {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                      </div>

                      <div
                        className={`rounded-2xl px-6 py-4 shadow-lg ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                            : "bg-white border border-gray-200"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        {message.role === "assistant" && selectedDatabase !== "all" && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <Badge
                              variant="secondary"
                              className={`text-xs bg-gradient-to-r ${currentDb?.color} text-white`}
                            >
                              {currentDb?.label}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-4 justify-start animate-fade-in">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 flex items-center justify-center shadow-lg">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span className="text-sm text-gray-500">AI sedang berpikir...</span>
                        <Brain className="h-4 w-4 text-blue-500 animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t bg-gradient-to-r from-blue-50 to-purple-50 p-6">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Tanyakan sesuatu tentang dokumen Anda..."
                    disabled={isLoading}
                    className="h-12 pr-12 text-base border-2 hover:border-blue-400 focus:border-blue-500 transition-colors rounded-xl"
                  />
                  {input && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Zap className="h-4 w-4 text-blue-500 animate-pulse" />
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:scale-100"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </form>

              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
                <Sparkles className="h-3 w-3" />
                <span>Powered by AI dengan teknologi RAG untuk jawaban yang akurat</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
