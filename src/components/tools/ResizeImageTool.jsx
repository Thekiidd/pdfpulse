// src/components/tools/ResizeImageTool.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PhotoIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

export default function ResizeImageTool({ incrementCounter }) {
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const canvasRef = useRef(null);

  const validateFile = (f) => {
    if (!f.type.startsWith('image/')) return setErrorMsg('Solo imágenes'), false;
    if (f.size > 10 * 1024 * 1024) return setErrorMsg('Máx 10MB'), false;
    setErrorMsg('');
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && validateFile(f)) setFile(f);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && validateFile(f)) setFile(f);
  };

  const resizeImage = () => {
    if (!file || !width || !height) return;
    setLoading(true);
    setErrorMsg('');

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = parseInt(width);
      canvas.height = parseInt(height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resized_${width}x${height}.jpg`;
        a.click();
        URL.revokeObjectURL(url);
        incrementCounter();
        setLoading(false);
      }, 'image/jpeg', 0.9);
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <motion.h1 className="text-4xl md:text-5xl font-black text-center text-neon text-glow">
        Redimensionar Imagen
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
            <button onClick={() => setFile(null)} className="text-xs text-red-400 hover:text-red-300">
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
              <ArrowsPointingOutIcon className="w-10 h-10 text-neon" />
            </motion.div>
            <p className="text-xl text-gray-300">Arrastra tu imagen aquí</p>
            <p className="text-sm text-gray-500">o haz clic (máx 10MB)</p>
          </div>
        )}
      </div>

      {file && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Ancho (px)"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-neon/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon"
            />
            <input
              type="number"
              placeholder="Alto (px)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-neon/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon"
            />
          </div>
          <button
            onClick={resizeImage}
            disabled={loading || !width || !height}
            className="w-full btn-neon py-3 text-lg font-bold disabled:opacity-70"
          >
            {loading ? 'Redimensionando...' : 'Aplicar'}
          </button>
        </motion.div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
}