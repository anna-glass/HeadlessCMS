'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { FaMicrophone, FaRobot, FaPlus, FaImage } from 'react-icons/fa';
import { Message } from '@/app/types/Message';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<'inventory' | 'story' | 'photos' | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) console.error('Error fetching messages:', error);
    else setMessages(data as Message[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && uploadedImages.length === 0) return;
    
    let imageUrls: string[] = [];
    
    // Upload images if any are selected
    if (uploadedImages.length > 0) {
      const formData = new FormData();
      uploadedImages.forEach(file => {
        formData.append('files', file);
      });

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
        user_id: 'demo_user',
        intent: selectedIntent,
        media: imageUrls.length > 0 ? imageUrls : undefined
      }]);
    
    if (error) console.error('Error inserting message:', error);
    else {
      setInput('');
      setSelectedIntent(null);
      setUploadedImages([]);
      fetchMessages();
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Store files locally
    const fileArray = Array.from(files);
    setUploadedImages(prev => [...prev, ...fileArray]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await sendAudioToWhisper(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const sendAudioToWhisper = async (audioBlob: Blob) => {
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
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background">
      <Image src="/logo.svg" alt="Logo" width={150} height={100} priority className="p-4 hover:skew-x-5 transition-transform duration-300"/>
      {/* Intent Buttons */}
      <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant={selectedIntent === 'inventory' ? "lift" : "liftOutline"}
              onClick={() => setSelectedIntent(selectedIntent === 'inventory' ? null : 'inventory')}
              className="flex-1"
            >
              🌲 Inventory
            </Button>
            <Button
              type="button"
              variant={selectedIntent === 'story' ? "lift" : "liftOutline"}
              onClick={() => setSelectedIntent(selectedIntent === 'story' ? null : 'story')}
              className="flex-1"
            >
              ☕️ Story
            </Button>
            <Button
              type="button"
              variant={selectedIntent === 'photos' ? "lift" : "liftOutline"}
              onClick={() => setSelectedIntent(selectedIntent === 'photos' ? null : 'photos')}
              className="flex-1"
            >
              📷 Photos
            </Button>
          </div>
      <Card className="w-full max-w-2xl">
        <CardContent className="flex flex-col overflow-y-auto py-2">
          {/* Uploaded Images Preview */}
          {uploadedImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {uploadedImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Uploaded ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex w-full gap-2 items-center">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or say something..."
              className="flex-1 resize-none rounded-md border-0 bg-transparent px-3 py-2 text-base text-foreground placeholder:text-muted-foreground transition-[color,box-shadow] outline-none focus:border-0 focus-visible:border-0 focus-visible:ring-0 focus:ring-0 max-h-[600px] min-h-[44px] overflow-auto scrollbar-none"
              rows={1}
              style={{ height: 'auto' }}
            />
          </form>
          
          <div className="flex flex-row gap-2 justify-end mt-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
            />
            <Button
              type="button"
              variant="defaultOutline"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload images"
            >
              <FaPlus className="text-primary" />
            </Button>
            <Button
                type="button"
                variant={isRecording ? "destructive" : "defaultOutline"}
                onClick={isRecording ? stopRecording : startRecording}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                <FaMicrophone className="text-primary" />
              </Button>
              <Button 
                type="submit" 
                variant="lift"
                disabled={!input.trim() && uploadedImages.length === 0 || !selectedIntent}
                onClick={handleSubmit}
              >
                Send
              </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
