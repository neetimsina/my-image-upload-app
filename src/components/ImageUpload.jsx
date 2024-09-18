import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const ImageUpload = () => {
  const [images, setImages] = useState([]);

  const convertToWebP = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                type: 'image/webp',
              });
              resolve(webpFile);
            } else {
              reject(new Error('WebP conversion failed'));
            }
          }, 'image/webp');
        };
        img.src = event.target.result;
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const newImages = [];

    for (const file of files) {
      if (file.type.substr(0, 5) !== "image") {
        alert(`File ${file.name} is not an image.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is larger than 5MB.`);
        continue;
      }

      try {
        const webpFile = await convertToWebP(file);
        const preview = URL.createObjectURL(file);
        newImages.push({ file: webpFile, preview, name: file.name });
      } catch (error) {
        console.error("Error converting image:", error);
        alert(`Error processing ${file.name}`);
      }
    }

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (images.length > 0) {
      // Here you would typically send the files to your server
      console.log("Uploading WebP files:", images.map(img => img.file.name));
      // For demonstration, let's create download links
      images.forEach(img => {
        const url = URL.createObjectURL(img.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = img.file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
      
      // Reset the component state after upload
      setImages([]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg">
      <label className="flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
        <Upload className="w-8 h-8" />
        <span className="mt-2 text-base leading-normal">Select files</span>
        <input type='file' className="hidden" onChange={handleFileChange} accept="image/*" multiple />
      </label>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {images.map((img, index) => (
          <div key={index} className="relative">
            <img src={img.preview} alt={`Preview ${index}`} className="w-full h-32 object-cover rounded" />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
            >
              <X size={16} />
            </button>
            <p className="text-xs mt-1">{(img.file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ))}
      </div>
      <button
        onClick={handleUpload}
        disabled={images.length === 0}
        className={`mt-4 px-4 py-2 rounded ${
          images.length > 0
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Upload {images.length} WebP {images.length === 1 ? 'Image' : 'Images'}
      </button>
    </div>
  );
};

export default ImageUpload;