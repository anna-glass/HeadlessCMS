// components/ImagePreviewList.tsx
interface ImagePreviewListProps {
    uploadedImages: File[];
    onRemove: (index: number) => void;
  }
  
  export default function ImagePreviewList({ uploadedImages, onRemove }: ImagePreviewListProps) {
    if (uploadedImages.length === 0) return null;
  
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {uploadedImages.map((file, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt={`Uploaded ${index + 1}`}
              className="w-16 h-16 object-cover rounded-md"
            />
            <button
              onClick={() => onRemove(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  }
  