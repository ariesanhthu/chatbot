"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Send, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
// import { VoiceRecorder } from "@/components/voice-recorder"
// import { CameraCapture } from "@/components/camera-capture"

interface ChatInputProps {
  onSendMessage: (content: string, type?: "text" | "audio" | "image", file?: File) => void
}

// Add a helper function to convert data URI to Blob
function dataURItoBlob(dataURI: string) {
  const byteString = atob(dataURI.split(",")[1])
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new Blob([ab], { type: mimeString })
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onSendMessage(file.name, "image", file)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleVoiceTranscription = (text: string) => {
    if (text.trim()) {
      onSendMessage(text)
    }
  }

  return (
    <div className="relative rounded-2xl bg-white shadow-md">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="min-h-[60px] max-h-[200px] resize-none rounded-2xl border-0 pr-24 focus-visible:ring-2 focus-visible:ring-purple-200"
      />

      <div className="absolute bottom-2 right-2 flex items-center gap-2">
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full hover:bg-gray-100"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-4 w-4" />
          <span className="sr-only">Upload image</span>
        </Button>

        {/* <CameraCapture
          className="scale-75 origin-right"
          onImageCaptured={(imageUrl, emotion) => {
            // Create a file from the data URL
            const blob = dataURItoBlob(imageUrl)
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" })

            // Send the image with emotion info if available
            const message = emotion ? `Captured image with emotion: ${emotion}` : "Captured image"

            onSendMessage(message, "image", file)
          }}
        /> */}

        {/* <VoiceRecorder onTranscriptionComplete={handleVoiceTranscription} /> */}

        <Button
          type="button"
          size="icon"
          className="h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-700"
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  )
}
