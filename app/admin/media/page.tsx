"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Search, ImageIcon, Video, File, Grid3X3, List } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { MediaUpload } from "@/components/media-upload"
import { MediaGrid } from "@/components/media-grid"
import { MediaList } from "@/components/media-list"

interface MediaFile {
  id: string
  filename: string
  url: string
  size: number
  type: string
  uploadedAt: string
  category: "image" | "video" | "document"
}

export default function AdminMediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState<"all" | "image" | "video" | "document">("all")
  const [filteredFiles, setFilteredFiles] = useState<MediaFile[]>([])

  useEffect(() => {
    fetchMediaFiles()
  }, [])

  useEffect(() => {
    let filtered = mediaFiles

    if (selectedCategory !== "all") {
      filtered = filtered.filter((file) => file.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter((file) => file.filename.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    setFilteredFiles(filtered)
  }, [mediaFiles, selectedCategory, searchTerm])

  const fetchMediaFiles = async () => {
    try {
      const response = await fetch("/api/admin/media")
      const data = await response.json()
      setMediaFiles(data.files || [])
    } catch (error) {
      console.error("Error fetching media files:", error)
      toast.error("Failed to fetch media files")
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = (files: MediaFile[]) => {
    setMediaFiles((prev) => [...files, ...prev])
    toast.success(`${files.length} file(s) uploaded successfully`)
  }

  const handleDeleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/admin/media/${fileId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMediaFiles((prev) => prev.filter((file) => file.id !== fileId))
        toast.success("File deleted successfully")
      } else {
        throw new Error("Failed to delete file")
      }
    } catch (error) {
      console.error("Error deleting file:", error)
      toast.error("Failed to delete file")
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success("URL copied to clipboard")
  }

  const getFileStats = () => {
    const images = mediaFiles.filter((f) => f.category === "image").length
    const videos = mediaFiles.filter((f) => f.category === "video").length
    const documents = mediaFiles.filter((f) => f.category === "document").length
    const totalSize = mediaFiles.reduce((sum, file) => sum + file.size, 0)

    return { images, videos, documents, totalSize }
  }

  const stats = getFileStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Upload className="h-12 w-12 text-luxury-gold mx-auto mb-4 animate-pulse" />
            <p className="text-luxury-charcoal">Loading media files...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-luxury-navy font-playfair">Media Management</h1>
          <p className="text-luxury-charcoal mt-2">Upload and manage images, videos, and documents</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-luxury-gold text-luxury-navy">{mediaFiles.length} Files</Badge>
          <Badge variant="secondary">{(stats.totalSize / (1024 * 1024)).toFixed(1)} MB</Badge>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Images", count: stats.images, icon: ImageIcon, color: "text-blue-600", bgColor: "bg-blue-50" },
          { label: "Videos", count: stats.videos, icon: Video, color: "text-purple-600", bgColor: "bg-purple-50" },
          { label: "Documents", count: stats.documents, icon: File, color: "text-green-600", bgColor: "bg-green-50" },
          {
            label: "Total Size",
            count: `${(stats.totalSize / (1024 * 1024)).toFixed(1)} MB`,
            icon: Upload,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
          },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-luxury">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-luxury-charcoal">{stat.label}</p>
                      <p className="text-xl font-bold text-luxury-navy">{stat.count}</p>
                    </div>
                    <div className={`p-2 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="manage">Manage Files</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-luxury-gold" />
                Upload Media Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MediaUpload onUploadSuccess={handleUploadSuccess} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card className="card-luxury">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Media Library</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-luxury-charcoal/50" />
                    <Input
                      placeholder="Search files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Files</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                    <option value="document">Documents</option>
                  </select>
                  <div className="flex items-center gap-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredFiles.length === 0 ? (
                <div className="text-center py-12">
                  <Upload className="h-16 w-16 text-luxury-charcoal/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-luxury-navy mb-2">No files found</h3>
                  <p className="text-luxury-charcoal mb-6">
                    {searchTerm || selectedCategory !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Upload some files to get started"}
                  </p>
                </div>
              ) : viewMode === "grid" ? (
                <MediaGrid files={filteredFiles} onDelete={handleDeleteFile} onCopyUrl={handleCopyUrl} />
              ) : (
                <MediaList files={filteredFiles} onDelete={handleDeleteFile} onCopyUrl={handleCopyUrl} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
