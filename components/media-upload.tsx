"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon, Video, File, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface UploadFile {
  id: string
  file: File
  progress: number
  status: "pending" | "uploading" | "completed" | "error"
  url?: string
  error?: string
}

interface MediaUploadProps {
  onUploadSuccess: (files: any[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
}

export function MediaUpload({
  onUploadSuccess,
  maxFiles = 10,
  maxSize = 50,
  acceptedTypes = ["image/*", "video/*", "application/pdf"],
}: MediaUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon
    if (type.startsWith("video/")) return Video
    return File
  }

  const getFileCategory = (type: string): "image" | "video" | "document" => {
    if (type.startsWith("image/")) return "image"
    if (type.startsWith("video/")) return "video"
    return "document"
  }

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }

    const isValidType = acceptedTypes.some((type) => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.slice(0, -1))
      }
      return file.type === type
    })

    if (!isValidType) {
      return "File type not supported"
    }

    return null
  }

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const newFiles: UploadFile[] = []

      for (let i = 0; i < Math.min(files.length, maxFiles - uploadFiles.length); i++) {
        const file = files[i]
        const error = validateFile(file)

        newFiles.push({
          id: `${Date.now()}-${i}`,
          file,
          progress: 0,
          status: error ? "error" : "pending",
          error,
        })
      }

      setUploadFiles((prev) => [...prev, ...newFiles])

      if (files.length > maxFiles - uploadFiles.length) {
        toast.error(`Only ${maxFiles - uploadFiles.length} more files can be uploaded`)
      }
    },
    [uploadFiles.length, maxFiles, maxSize, acceptedTypes],
  )

  const uploadFile = async (uploadFile: UploadFile) => {
    const formData = new FormData()
    formData.append("file", uploadFile.file)
    formData.append("category", getFileCategory(uploadFile.file.type))

    try {
      setUploadFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "uploading", progress: 0 } : f)),
      )

      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()

      setUploadFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "completed", progress: 100, url: result.url } : f)),
      )

      return result
    } catch (error) {
      setUploadFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "error", error: "Upload failed" } : f)),
      )
      throw error
    }
  }

  const handleUploadAll = async () => {
    const pendingFiles = uploadFiles.filter((f) => f.status === "pending")
    const uploadPromises = pendingFiles.map(uploadFile)

    try {
      const results = await Promise.allSettled(uploadPromises)
      const successful = results
        .filter((result): result is PromiseFulfilledResult<any> => result.status === "fulfilled")
        .map((result) => result.value)

      if (successful.length > 0) {
        onUploadSuccess(successful)
      }

      const failed = results.filter((result) => result.status === "rejected").length
      if (failed > 0) {
        toast.error(`${failed} file(s) failed to upload`)
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Upload failed")
    }
  }

  const removeFile = (id: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const clearCompleted = () => {
    setUploadFiles((prev) => prev.filter((f) => f.status !== "completed"))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const pendingCount = uploadFiles.filter((f) => f.status === "pending").length
  const completedCount = uploadFiles.filter((f) => f.status === "completed").length

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver ? "border-luxury-gold bg-luxury-gold/10" : "border-luxury-charcoal/30 hover:border-luxury-gold/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-luxury-charcoal/50 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-luxury-navy mb-2">Drop files here or click to upload</h3>
        <p className="text-luxury-charcoal mb-4">Support for images, videos, and documents up to {maxSize}MB</p>
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <Button asChild className="btn-luxury">
          <label htmlFor="file-upload" className="cursor-pointer">
            Select Files
          </label>
        </Button>
      </div>

      {/* Upload Queue */}
      <AnimatePresence>
        {uploadFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-luxury-navy">Upload Queue ({uploadFiles.length})</h4>
              <div className="flex gap-2">
                {pendingCount > 0 && (
                  <Button onClick={handleUploadAll} size="sm">
                    Upload All ({pendingCount})
                  </Button>
                )}
                {completedCount > 0 && (
                  <Button onClick={clearCompleted} variant="outline" size="sm">
                    Clear Completed
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {uploadFiles.map((uploadFile) => {
                const Icon = getFileIcon(uploadFile.file.type)
                return (
                  <motion.div
                    key={uploadFile.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-full ${
                              uploadFile.status === "completed"
                                ? "bg-green-100"
                                : uploadFile.status === "error"
                                  ? "bg-red-100"
                                  : uploadFile.status === "uploading"
                                    ? "bg-blue-100"
                                    : "bg-gray-100"
                            }`}
                          >
                            {uploadFile.status === "completed" ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <Icon
                                className={`h-5 w-5 ${
                                  uploadFile.status === "error"
                                    ? "text-red-600"
                                    : uploadFile.status === "uploading"
                                      ? "text-blue-600"
                                      : "text-gray-600"
                                }`}
                              />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-luxury-navy truncate">{uploadFile.file.name}</p>
                            <p className="text-sm text-luxury-charcoal">
                              {(uploadFile.file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                            {uploadFile.status === "uploading" && (
                              <Progress value={uploadFile.progress} className="mt-2" />
                            )}
                            {uploadFile.error && <p className="text-sm text-red-600 mt-1">{uploadFile.error}</p>}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadFile.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
