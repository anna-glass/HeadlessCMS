//
// MessageInput.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// message input component for chat
//

import { useRef, useEffect } from 'react';
import { FaMicrophone, FaPlus } from 'react-icons/fa';
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  input: string;
  setInput: (val: string) => void;
  onSubmit: () => void;
  onUploadClick: () => void;
  onFileChange: (files: FileList | null) => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  canSubmit: boolean;
}

export default function MessageInput({
  input,
  setInput,
  onSubmit,
  onUploadClick,
  onFileChange,
  isRecording,
  startRecording,
  stopRecording,
  canSubmit
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="flex w-full gap-2 items-center">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or say something..."
          className="flex-1 resize-none rounded-md border-0 bg-transparent px-3 py-2 text-base text-foreground placeholder:text-muted-foreground transition-[color,box-shadow] outline-none focus-visible:ring-0 max-h-[600px] min-h-[44px] overflow-auto scrollbar-none"
          rows={1}
        />
      </form>

      <div className="flex flex-row gap-2 justify-end mt-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => onFileChange(e.target.files)}
          className="hidden"
        />
        <Button
          type="button"
          variant="defaultOutline"
          onClick={onUploadClick}
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
          disabled={!canSubmit}
          onClick={onSubmit}
        >
          Send
        </Button>
      </div>
    </>
  );
}
