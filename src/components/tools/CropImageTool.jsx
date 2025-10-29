// src/components/tools/CropImageTool.jsx
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PhotoIcon, ScissorsIcon } from '@heroicons/react/24/outline';
import Cropper from 'react-easy-crop';

export default function CropImageTool({ incrementCounter }) {
  const [file, setFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) setFile(URL.createObjectURL(f));
  };

  const cropImage = async () => {
    if (!file || !croppedAreaPixels) return;
    setLoading(true);

    const image = new Image();
    image.src = file;
    image.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cropped_image.jpg';
        a.click();
        URL.revokeObjectURL(url);
        incrementCounter();
        setLoading(false);
      }, 'image/jpeg', 0.95);
    };
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <motion.h1 className="text-4xl md:text-5xl font-black text-center text-neon text-glow">
        Recortar Imagen
      </motion.h1>

      {!file ? (
        <div className="flex justify-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full max-w-md text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neon file:text-black hover:file:bg-neon-light"
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative h-96 bg-black/20 rounded-2xl overflow-hidden">
            <Cropper
              image={file}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <button
            onClick={cropImage}
            disabled={loading}
            className="w-full btn-neon py-3 text-lg font-bold disabled:opacity-70"
          >
            {loading ? 'Recortando...' : 'Recortar y Descargar'}
          </button>
          <button
            onClick={() => setFile(null)}
            className="w-full bg-gray-700 text-white py-2 rounded-lg text-sm hover:bg-gray-600"
          >
            Cambiar imagen
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
}