// src/components/tools/PdfToImgTool.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentIcon, PhotoIcon, ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import * as pdfjsLib from 'pdfjs-dist';

// Configurar worker con versión fija para evitar desajustes
const PDFJS_VERSION = '5.4.296';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`;
console.log('PDF.js Version:', pdfjsLib.version);
console.log('PDF.js Worker:', pdfjsLib.GlobalWorkerOptions.workerSrc);

export default function PdfToImgTool({ incrementCounter }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState([]);

  const validateFile = (f) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) return setErrorMsg('Solo PDFs'), false;
    if (f.size > 50 * 1024 * 1024) return setErrorMsg('Máx 50MB'), false;
    setErrorMsg('');
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && validateFile(f)) {
      setFile(f);
      setImages([]);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && validateFile(f)) {
      setFile(f);
      setImages([]);
    }
  };

  const convertToImages = async () => {
    if (!file) return;
    setLoading(true);
    setErrorMsg('');
    setProgress(0);
    setImages([]);

    console.log(`[${new Date().toISOString()}] Starting conversion for ${file.name}`);

    try {
      const arrayBuffer = await file.arrayBuffer();

      // Add timeout to PDF load
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

      const pdf = await Promise.race([
        loadingTask.promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Tiempo de espera agotado al cargar el PDF. Verifique su conexión.')), 10000))
      ]);

      const numPages = pdf.numPages;
      console.log(`[${new Date().toISOString()}] PDF loaded. Pages: ${numPages}`);

      const newImages = [];

      for (let i = 1; i <= numPages; i++) {
        console.log(`[${new Date().toISOString()}] Rendering page ${i}/${numPages}`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // High quality
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        newImages.push({
          id: i,
          url: imgData,
          name: `${file.name.replace('.pdf', '')}_pag_${i}.jpg`
        });

        setProgress(Math.round((i / numPages) * 100));
      }

      setImages(newImages);
      console.log(`[${new Date().toISOString()}] Conversion complete. ${newImages.length} images generated.`);

      if (incrementCounter) incrementCounter();

    } catch (err) {
      console.error(`[${new Date().toISOString()}] Conversion error:`, err);
      setErrorMsg('Error al convertir: ' + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const downloadImage = (img) => {
    const a = document.createElement('a');
    a.href = img.url;
    a.download = img.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = async () => {
    // Warning: Browser might block multiple downloads
    if (!confirm('Esto intentará descargar todas las imágenes una por una. Es posible que tu navegador te pida permiso para permitir múltiples descargas. ¿Continuar?')) return;

    for (const img of images) {
      downloadImage(img);
      await new Promise(r => setTimeout(r, 500)); // Small delay to help browser cope
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <motion.h1 className="text-4xl md:text-5xl font-black text-center text-neon text-glow">
        PDF a Imágenes
      </motion.h1>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`
          relative border-2 border-dashed p-10 text-center transition-all duration-300
          ${file ? 'border-neon bg-neon/5' : 'border-neon/30 hover:border-neon hover:bg-neon/5'}
        `}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        {file ? (
          <div className="space-y-3">
            <DocumentIcon className="w-12 h-12 mx-auto text-neon" />
            <p className="text-lg font-medium text-white truncate max-w-xs mx-auto">{file.name}</p>
            <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setImages([]);
              }}
              className="text-xs text-red-400 hover:text-red-300 z-10 relative"
            >
              Cambiar archivo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 mx-auto bg-neon/10 flex items-center justify-center"
            >
              <PhotoIcon className="w-10 h-10 text-neon" />
            </motion.div>
            <p className="text-xl text-gray-300">Arrastra tu PDF aquí</p>
            <p className="text-sm text-gray-500">o haz clic (máx 50MB)</p>
          </div>
        )}
      </div>

      {errorMsg && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center font-medium">
          {errorMsg}
        </motion.p>
      )}

      {/* Action Button */}
      {file && images.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <button
            onClick={convertToImages}
            disabled={loading}
            className="btn-neon px-12 py-4 text-xl font-bold disabled:opacity-70 flex items-center gap-3 mx-auto"
          >
            {loading ? 'Procesando...' : 'Convertir a JPG'}
          </button>
        </motion.div>
      )}

      {/* Progress Bar */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          <div className="h-3 bg-black/50 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon to-neon-light"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <p className="text-center text-sm text-gray-400">{progress}%</p>
        </motion.div>
      )}

      {/* Results Grid */}
      {images.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Imágenes Generadas ({images.length})</h2>
            <button
              onClick={downloadAll}
              className="btn-neon px-6 py-2 text-sm font-bold flex items-center gap-2"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Descargar Todo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 border border-neon/20 p-3 flex flex-col gap-3 group hover:border-neon/50 transition-colors"
              >
                <div className="aspect-[3/4] bg-black/50 overflow-hidden relative">
                  <img
                    src={img.url}
                    alt={`Página ${img.id}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Pág. {img.id}</span>
                  <button
                    onClick={() => downloadImage(img)}
                    className="p-2 hover:bg-neon/20 rounded-full text-neon transition-colors"
                    title="Descargar esta imagen"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}