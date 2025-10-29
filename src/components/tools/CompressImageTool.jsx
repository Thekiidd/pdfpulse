// src/components/tools/CompressImageTool.jsx
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PhotoIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

export default function CompressImageTool({ incrementCounter }) {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(0.7);
  const [loading, setLoading] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const canvasRef = useRef(null);

  const validateFile = (f) => {
    if (!f.type.startsWith('image/')) return setErrorMsg('Solo imágenes'), false;
    if (f.size > 10 * 1024 * 1024) return setErrorMsg('Máx 10MB'), false;
    setErrorMsg('');
    setOriginalSize(f.size);
    return true;
  };

  const [errorMsg, setErrorMsg] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && validateFile(f)) setFile(f);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && validateFile(f)) setFile(f);
  };

  const compressImage = () => {
    if (!file) return;
    setLoading(true);
    setCompressedSize(0);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        setCompressedSize(blob.size);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compressed_${quality * 100}%.jpg`;
        a.click();
        URL.revokeObjectURL(url);
        incrementCounter();
        setLoading(false);
      }, 'image/jpeg', quality);
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <motion.h1 className="text-4xl md:text-5xl font-black text-center text-neon text-glow">
        Comprimir Imagen
      </motion.h1>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`
          relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300
          ${file ? 'border-neon bg-neon/5' : 'border-neon/30 hover:border-neon hover:bg-neon/5'}
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        {file ? (
          <div className="space-y-3">
            <PhotoIcon className="w-12 h-12 mx-auto text-neon" />
            <p className="text-lg font-medium text-white truncate max-w-xs mx-auto">{file.name}</p>
            <p className="text-sm text-gray-400">{(originalSize / 1024 / 1024).toFixed(2)} MB</p>
            <button onClick={() => { setFile(null); setOriginalSize(0); }} className="text-xs text-red-400 hover:text-red-300">
              Cambiar imagen
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 mx-auto bg-neon/10 rounded-full flex items-center justify-center"
            >
              <ArrowsUpDownIcon className="w-10 h-10 text-neon" />
            </motion.div>
            <p className="text-xl text-gray-300">Arrastra tu imagen aquí</p>
            <p className="text-sm text-gray-500">o haz clic (máx 10MB)</p>
          </div>
        )}
      </div>

      {file && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Calidad: {Math.round(quality * 100)}%</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <button
            onClick={compressImage}
            disabled={loading}
            className="w-full btn-neon py-3 text-lg font-bold disabled:opacity-70"
          >
            {loading ? 'Comprimiendo...' : 'Comprimir'}
          </button>
        </motion.div>
      )}

      {compressedSize > 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-neon/10 backdrop-blur-xl rounded-2xl border border-neon/30 text-center"
        >
          <p className="text-lg text-white font-bold">¡Comprimido!</p>
          <p className="text-sm text-gray-300 mt-1">
            De {(originalSize / 1024 / 1024).toFixed(2)} MB → {(compressedSize / 1024 / 1024).toFixed(2)} MB
          </p>
        </motion.div>
      )}

      {errorMsg && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center font-medium">
          {errorMsg}
        </motion.p>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
}