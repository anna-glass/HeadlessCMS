'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useAuth } from '@/app/hooks/use-auth';
import { useAudioRecorder } from '@/app/hooks/use-audio-recorder';
import { fetchMessages } from '@/lib/fetch-messages';
import { Message } from '@/app/types/Message';
import { Card, CardContent } from "@/components/ui/card";
import IntentSelector from '@/app/chat/components/IntentSelector';
import ImagePreviewList from '@/app/chat/components/ImagePreviewList';
import MessageInput from '@/app/chat/components/MessageInput';
import UserAvatar from '@/app/chat/components/UserAvatar';

export default function ChatPage() {
  const { session, supabase } = useAuth();
  const router = useRouter();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedIntent, setSelectedIntent] = useState<'inventory' | 'story' | 'photos' | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isRecording, startRecording, stopRecording } = useAudioRecorder(sendAudioToWhisper);

  useEffect(() => {
    if (session === undefined) return; // wait for Supabase
    if (session === null) {
      router.replace('/login');
    } else {
      fetchMessages().then(setMessages).catch(console.error);
    }
  }, [session, router]);

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

    const { error } = await supabase
      .from('messages')
      .insert([{
        content: input,
        user_id: session?.user?.id || 'demo_user',
        intent: selectedIntent,
        media: imageUrls.length > 0 ? imageUrls : undefined
      }]);

    if (error) {
      console.error('Error inserting message:', error);
    } else {
      setInput('');
      setSelectedIntent(null);
      setUploadedImages([]);
      fetchMessages().then(setMessages).catch(console.error);
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
    <div className="flex flex-col min-h-screen items-center justify-center bg-background">
      <UserAvatar />
      <Image src="/logo.svg" alt="Logo" width={150} height={100} priority className="p-4 hover:skew-x-5 transition-transform duration-300" />

      <IntentSelector
        selectedIntent={selectedIntent}
        onSelect={setSelectedIntent}
      />

      <Card className="w-full max-w-2xl">
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
