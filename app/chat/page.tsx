//
// chat.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// chat page
//

'use client';

import { useState, useRef } from 'react';
import Image from "next/image";
import { useAudioRecorder } from '@/app/hooks/use-audio-recorder';
import { Card, CardContent } from "@/components/ui/card";
import IntentSelector from '@/app/chat/components/IntentSelector';
import ImagePreviewList from '@/app/chat/components/ImagePreviewList';
import MessageInput from '@/app/chat/components/MessageInput';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [selectedIntent, setSelectedIntent] = useState<'inventory' | 'story' | 'photos' | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isRecording, startRecording, stopRecording } = useAudioRecorder(sendAudioToWhisper);

  async function sendAudioToWhisper(audioBlob: Blob) {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');

    try {
      const response = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.text) {
        setInput(prev => prev + (prev ? ' ' : '') + data.text);
      }
    } catch (err) {
      console.error('Error sending audio to Whisper:', err);
    }
  }

  async function handleSubmit() {
    if (!input.trim() && uploadedImages.length === 0) return;

    let imageUrls: string[] = [];

    if (uploadedImages.length > 0) {
      const formData = new FormData();
      uploadedImages.forEach(file => formData.append('files', file));

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.urls) {
          imageUrls = data.urls;
        }
      } catch (err) {
        console.error('Error uploading images:', err);
        return;
      }
    }
  }
  function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    setUploadedImages(prev => [...prev, ...fileArray]);
  }

  function removeImage(index: number) {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Image src="/logo.svg" alt="Logo" width={150} height={100} priority className="p-4 hover:skew-x-5 transition-transform duration-300" />

      <IntentSelector
        selectedIntent={selectedIntent}
        onSelect={setSelectedIntent}
      />

      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col overflow-y-auto py-2">
          <ImagePreviewList
            uploadedImages={uploadedImages}
            onRemove={removeImage}
          />

          <MessageInput
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            onUploadClick={() => fileInputRef.current?.click()}
            onFileChange={handleImageUpload}
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
            canSubmit={!!selectedIntent && (!!input.trim() || uploadedImages.length > 0)}
          />

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files)}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  );
}
