import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, MessageCircle, Database, FileText, Sparkles, Zap, Brain } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            <Brain className="h-8 w-8 text-blue-600 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              GCP Knowledge AI
            </h1>
            <Sparkles className="h-8 w-8 text-purple-600 animate-bounce" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Revolusi cara Anda mengelola dokumen dengan{" "}
            <span className="font-semibold text-blue-600">AI-Powered RAG System</span>
            <br />
            Upload, Analisis, dan Tanyakan Apapun dengan Kecerdasan Buatan
          </p>
          <div className="mt-8 flex justify-center">
            <div className="animate-bounce">
              <Zap className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-sm">
            <CardHeader className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardTitle className="flex items-center gap-3 relative z-10">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-xl">
                  Smart Upload
                </span>
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Upload dokumen Excel dan PDF dengan teknologi AI untuk ekstraksi data otomatis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse"></div>
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span>Support .xlsx, .pdf dengan AI parsing</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-pulse delay-200"></div>
                  <Database className="h-4 w-4 text-purple-500" />
                  <span>Auto-categorization & vector storage</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full animate-pulse delay-400"></div>
                  <Sparkles className="h-4 w-4 text-cyan-500" />
                  <span>Instant processing & embedding</span>
                </div>
              </div>
              <Link href="/upload" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Upload className="h-4 w-4 mr-2" />
                  Mulai Upload Dokumen
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-gradient-to-br from-white to-green-50/50 backdrop-blur-sm">
            <CardHeader className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardTitle className="flex items-center gap-3 relative z-10">
                <div className="p-3 bg-gradient-to-br from-green-500 to-cyan-600 rounded-xl shadow-lg group-hover:shadow-green-500/25 transition-all duration-300 group-hover:scale-110">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent font-bold text-xl">
                  AI Chat RAG
                </span>
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Tanyakan apapun dengan AI yang memahami konteks dokumen Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse"></div>
                  <Brain className="h-4 w-4 text-green-500" />
                  <span>Powered by GPT-4 & RAG Technology</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full animate-pulse delay-200"></div>
                  <Database className="h-4 w-4 text-cyan-500" />
                  <span>Multi-database context selection</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-pulse delay-400"></div>
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span>Real-time streaming responses</span>
                </div>
              </div>
              <Link href="/chat" className="block">
                <Button className="w-full bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Mulai Chat dengan AI
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Process Steps */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Cara Kerja Sistem
          </h2>
          <p className="text-gray-600 mb-12 text-lg">Tiga langkah mudah untuk menggunakan AI Knowledge System</p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Upload Dokumen",
                description: "Drag & drop file Excel atau PDF ke sistem dengan teknologi AI parsing",
                icon: Upload,
                color: "from-blue-500 to-purple-600",
                delay: "0",
              },
              {
                step: "2",
                title: "AI Processing",
                description: "Sistem AI akan mengekstrak, menganalisis, dan menyimpan data ke vector database",
                icon: Brain,
                color: "from-purple-500 to-pink-600",
                delay: "200",
              },
              {
                step: "3",
                title: "Chat & Query",
                description: "Tanyakan apapun dan dapatkan jawaban cerdas berdasarkan dokumen Anda",
                icon: MessageCircle,
                color: "from-green-500 to-cyan-600",
                delay: "400",
              },
            ].map((item, index) => (
              <div key={index} className={`group animate-fade-in-up delay-${item.delay}`}>
                <div className="relative">
                  {/* Connecting Line */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 transform -translate-y-1/2 z-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
                    </div>
                  )}

                  <div className="relative z-10 text-center">
                    <div
                      className={`bg-gradient-to-br ${item.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}
                    >
                      <span className="text-white font-bold text-xl">{item.step}</span>
                    </div>

                    <div
                      className={`bg-gradient-to-br ${item.color} rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 opacity-80`}
                    >
                      <item.icon className="h-6 w-6 text-white" />
                    </div>

                    <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-gray-900 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Siap Menggunakan AI Knowledge System?</h3>
            <p className="text-blue-100 mb-6 text-lg">
              Mulai upload dokumen dan rasakan pengalaman AI yang revolusioner
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Sekarang
                </Button>
              </Link>
              <Link href="/chat">
                <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Coba Chat AI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
