// src/components/admin/ImageUploader.tsx
"use client"

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
}

export default function ImageUploader({ onImageUploaded }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    setIsUploading(true);
    setError('');
    
    // Show preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Upload failed');
      }
      
      const data = await response.json();
      onImageUploaded(data.url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="mt-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload Image
      </label>
      
      <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg">
        {preview ? (
          <div className="mb-4 relative w-full h-40">
            <Image
              src={preview}
              alt="Image preview"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        ) : null}
        
        <div className="text-center">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            disabled={isUploading}
            className="hidden"
            id="image-upload"
          />
          
          <label 
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            {!preview && (
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            <span className="mt-2 block text-sm text-gray-700">
              {isUploading ? 'Uploading...' : preview ? 'Change image' : 'Click to upload image'}
            </span>
            <span className="mt-1 block text-xs text-gray-500">
              PNG, JPG, WebP up to 5MB
            </span>
          </label>
        </div>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}