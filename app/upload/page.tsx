"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Sparkles, Database, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [database, setDatabase] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      validateAndSetFile(selectedFile)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    const fileType = selectedFile.type
    const fileName = selectedFile.name.toLowerCase()

    if (
      fileType === "application/pdf" ||
      fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      fileName.endsWith(".pdf") ||
      fileName.endsWith(".xlsx")
    ) {
      setFile(selectedFile)
      setUploadStatus("idle")
      setUploadProgress(0)
    } else {
      toast({
        title: "Format file tidak didukung",
        description: "Hanya file PDF dan Excel (.xlsx) yang didukung",
        variant: "destructive",
      })
    }
  }

  const simulateProgress = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 200)
    return interval
  }

  const handleUpload = async () => {
    if (!file || !database) {
      toast({
        title: "Data tidak lengkap",
        description: "Pilih file dan database terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadStatus("idle")

    const progressInterval = simulateProgress()

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("database", database)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        setUploadStatus("success")
        toast({
          title: "Upload berhasil! 🎉",
          description: "File telah diproses dan disimpan ke database dengan AI",
        })

        // Reset form after success
        setTimeout(() => {
          setFile(null)
          setDatabase("")
          setUploadProgress(0)
        }, 2000)
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      clearInterval(progressInterval)
      setUploadStatus("error")
      setUploadProgress(0)
      toast({
        title: "Upload gagal",
        description: "Terjadi kesalahan saat mengupload file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      validateAndSetFile(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Upload className="h-8 w-8 text-blue-600 animate-bounce" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Smart Upload
            </h1>
            <Sparkles className="h-8 w-8 text-purple-600 animate-pulse" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload dokumen Excel atau PDF dan biarkan AI memproses secara otomatis
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Database className="h-6 w-6 text-blue-600" />
              Upload & Process
            </CardTitle>
            <CardDescription className="text-base">
              Sistem AI akan mengekstrak, menganalisis, dan menyimpan data secara otomatis
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 p-8">
            {/* File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                isDragOver
                  ? "border-blue-500 bg-blue-50/50 scale-105"
                  : file
                    ? "border-green-400 bg-green-50/50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {/* Upload Progress */}
              {isUploading && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10">
                  <div className="w-24 h-24 relative mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="h-8 w-8 text-blue-600 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-blue-600 mb-2">AI sedang memproses...</p>
                  <div className="w-64 mb-2">
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                  <p className="text-sm text-gray-600">{Math.round(uploadProgress)}% selesai</p>
                </div>
              )}

              {file ? (
                <div className="space-y-4">
                  <div className="relative">
                    <FileText className="h-16 w-16 text-blue-600 mx-auto animate-pulse" />
                    {uploadStatus === "success" && (
                      <div className="absolute -top-2 -right-2">
                        <CheckCircle className="h-8 w-8 text-green-500 animate-bounce" />
                      </div>
                    )}
                    {uploadStatus === "error" && (
                      <div className="absolute -top-2 -right-2">
                        <AlertCircle className="h-8 w-8 text-red-500 animate-pulse" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  {uploadStatus === "success" && (
                    <div className="flex items-center justify-center gap-2 text-green-600 animate-fade-in">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Upload berhasil! Data telah diproses AI</span>
                    </div>
                  )}
                  {uploadStatus === "error" && (
                    <div className="flex items-center justify-center gap-2 text-red-600 animate-fade-in">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Upload gagal, silakan coba lagi</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <Upload
                      className={`h-16 w-16 mx-auto transition-all duration-300 ${
                        isDragOver ? "text-blue-600 scale-110" : "text-gray-400"
                      }`}
                    />
                    {isDragOver && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 border-2 border-blue-500 border-dashed rounded-full animate-ping"></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-800 mb-2">
                      {isDragOver ? "Drop file di sini!" : "Drag & drop file atau klik untuk browse"}
                    </p>
                    <p className="text-gray-500">
                      Mendukung file <span className="font-semibold text-blue-600">PDF</span> dan{" "}
                      <span className="font-semibold text-green-600">Excel (.xlsx)</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* File Input */}
            <div className="space-y-2">
              <Label htmlFor="file" className="text-base font-semibold text-gray-700">
                Atau pilih file dari komputer
              </Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.xlsx"
                onChange={handleFileChange}
                className="h-12 text-base border-2 hover:border-blue-400 transition-colors"
              />
            </div>

            {/* Database Selection */}
            <div className="space-y-2">
              <Label htmlFor="database" className="text-base font-semibold text-gray-700">
                Pilih Database Kategori
              </Label>
              <Select value={database} onValueChange={setDatabase}>
                <SelectTrigger className="h-12 text-base border-2 hover:border-blue-400 transition-colors">
                  <SelectValue placeholder="Pilih kategori database untuk menyimpan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">💰 Financial Data</SelectItem>
                  <SelectItem value="hr">👥 Human Resources</SelectItem>
                  <SelectItem value="operations">⚙️ Operations</SelectItem>
                  <SelectItem value="marketing">📈 Marketing</SelectItem>
                  <SelectItem value="general">📚 General Knowledge</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!file || !database || isUploading}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:scale-100"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  AI sedang memproses...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-3" />
                  Upload & Process dengan AI
                </>
              )}
            </Button>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 pt-4">
              {[
                { icon: Zap, title: "AI Parsing", desc: "Ekstraksi otomatis", color: "text-yellow-600" },
                { icon: Database, title: "Vector DB", desc: "Penyimpanan cerdas", color: "text-blue-600" },
                { icon: Sparkles, title: "Ready to Chat", desc: "Siap untuk query", color: "text-purple-600" },
              ].map((item, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <item.icon className={`h-8 w-8 mx-auto mb-2 ${item.color}`} />
                  <p className="font-semibold text-sm text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
