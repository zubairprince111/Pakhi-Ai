
import React, { useRef } from 'react';
import { fileToBase64 } from '../utils/fileUtils';

interface ImageUploaderProps {
  id: string;
  label: string;
  imageUrl: string | null;
  onImageUpload: (base64: string) => void;
}

const PlusIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, imageUrl, onImageUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        onImageUpload(base64);
      } catch (error) {
        console.error('Error converting file to base64', error);
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-center text-lg font-medium text-gray-300 mb-2">{label}</label>
      <div
        onClick={handleClick}
        className="relative w-full aspect-square bg-gray-800 border-2 border-dashed border-gray-600 rounded-2xl flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-gray-700 transition-all duration-300 group"
      >
        <input
          type="file"
          id={id}
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={label}
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <div className="text-center text-gray-500">
             <PlusIcon className="w-12 h-12 mx-auto group-hover:text-purple-400 transition-colors" />
            <p className="mt-2">Click to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};
