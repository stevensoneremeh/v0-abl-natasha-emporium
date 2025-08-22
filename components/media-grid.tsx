"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ImageIcon, Video, File, Copy, Download, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import Image from "next/image"

interface MediaFile {
  id: string
  filename: string
  url: string
  size: number
  type: string
  uploadedAt: string
  category: "image" | "video" | "document"
}

interface MediaGridProps {
  files: MediaFile[]
  onDelete: (id: string) => void
  onCopyUrl: (url: string) => void
}

export function MediaGrid({ files, onDelete, onCopyUrl }: MediaGridProps) {
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (category: string) => {
    switch (category) {
      case "image":
        return ImageIcon
      case "video":
        return Video
      default:
        return File
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "image":
        return "bg-blue-100 text-blue-800"
      case "video":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {files.map((file, index) => {
        const Icon = getFileIcon(file.category)

        return (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="card-luxury group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="aspect-square relative mb-3 bg-luxury-cream rounded-lg overflow-hidden">
                  {file.category === "image" ? (
                    <Image
                      src={file.url || "/placeholder.svg"}
                      alt={file.filename}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="h-12 w-12 text-luxury-charcoal/50" />
                    </div>
                  )}

                  <div className="absolute top-2 right-2">
                    <Badge className={getCategoryColor(file.category)}>{file.category}</Badge>
                  </div>

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white"
                        onClick={() => setSelectedFile(file)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => onCopyUrl(file.url)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy URL
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(file.url, "_blank")}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete(file.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-luxury-navy text-sm truncate">{file.filename}</h4>
                  <div className="flex items-center justify-between text-xs text-luxury-charcoal">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
