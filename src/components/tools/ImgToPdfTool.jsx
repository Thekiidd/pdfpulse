// src/components/tools/ImgToPdfTool.jsx
import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { DocumentIcon, PhotoIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';

export default function ImgToPdfTool({ incrementCounter }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const dropZoneRef = useRef(null);

  const validateFiles = (newFiles) => {
    for (let f of newFiles) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(f.type))
        return setErrorMsg('Solo JPG/PNG permitidos'), false;
      if (f.size > 10 * 1024 * 1024) return setErrorMsg('Máx 10MB por imagen'), false;
    }
    setErrorMsg('');
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    if (validateFiles(dropped)) {
      const newFiles = dropped.map(f => ({ file: f, id: crypto.randomUUID() }));
      setFiles(prev => [...prev, ...newFiles]);
      setDownloadUrl(null);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const removeFile = (id) => {
    setFiles(prev => prev.filter(item => item.id !== id));
    setDownloadUrl(null);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setErrorMsg('');
    setProgress(0);
    setDownloadUrl(null);

    console.log(`[${new Date().toISOString()}] Starting ImgToPdf conversion with ${files.length} files`);

    try {
      const pdfDoc = await PDFDocument.create();
      let processed = 0;

      for (let item of files) {
        const file = item.file;
        console.log(`[${new Date().toISOString()}] Processing image: ${file.name}`);

        const imgBytes = await file.arrayBuffer();
        let img;

        if (file.type.includes('png')) {
          img = await pdfDoc.embedPng(imgBytes);
        } else {
          img = await pdfDoc.embedJpg(imgBytes);
        }

        // A4 dimensions in points (approx)
        const pageWidth = 595.28;
        const pageHeight = 841.89;

        // Scale image to fit page while maintaining aspect ratio
        const imgDims = img.scaleToFit(pageWidth, pageHeight);

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Center image
        page.drawImage(img, {
          x: (pageWidth - imgDims.width) / 2,
          y: (pageHeight - imgDims.height) / 2,
          width: imgDims.width,
          height: imgDims.height,
        });

        processed++;
        setProgress(Math.round((processed / files.length) * 90));
      }

      console.log(`[${new Date().toISOString()}] Saving PDF...`);
      const pdfBytes = await pdfDoc.save();
      console.log(`[${new Date().toISOString()}] PDF saved. Size: ${pdfBytes.length} bytes`);

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      // Trigger auto-download
      try {
        const a = document.createElement('a');
        a.href = url;
        a.download = `images_to_pdf_${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log(`[${new Date().toISOString()}] Auto-download triggered`);
      } catch (downloadErr) {
        console.error('Auto-download failed:', downloadErr);
      }

      if (incrementCounter) incrementCounter();

      setProgress(100);
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Conversion error:`, err);
      setErrorMsg('Error al convertir: ' + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <motion.h1 className="text-4xl md:text-5xl font-black text-center text-neon text-glow">
        Imágenes a PDF
      </motion.h1>

      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          relative border-2 border-dashed p-10 text-center transition-all duration-300
          ${files.length > 0 ? 'border-neon bg-neon/5' : 'border-neon/30 hover:border-neon hover:bg-neon/5'}
        `}
      >
        <input
          type="file"
          multiple
          accept="image/jpeg, image/png"
          onChange={(e) => {
            const newFilesRaw = Array.from(e.target.files);
            if (validateFiles(newFilesRaw)) {
              const newFiles = newFilesRaw.map(f => ({ file: f, id: crypto.randomUUID() }));
              setFiles(prev => [...prev, ...newFiles]);
              setDownloadUrl(null);
            }
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        {files.length === 0 ? (
          <div className="space-y-4">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 mx-auto bg-neon/10 flex items-center justify-center"
            >
              <PhotoIcon className="w-10 h-10 text-neon" />
            </motion.div>
            <p className="text-xl text-gray-300">Arrastra tus imágenes aquí</p>
            <p className="text-sm text-gray-500">JPG o PNG (máx 10MB)</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-lg text-white font-medium">
              {files.length} imagen{files.length > 1 ? 'es' : ''} lista{files.length > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-gray-400">Puedes añadir más</p>
          </div>
        )}
      </div>

      {/* List (Reorder) */}
      {files.length > 0 && (
        <Reorder.Group
          axis="y"
          values={files}
          onReorder={(newOrder) => {
            setFiles(newOrder);
            setDownloadUrl(null);
          }}
          className="space-y-2"
        >
          <AnimatePresence mode='popLayout'>
            {files.map((item) => (
              <Reorder.Item
                key={item.id}
                value={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-xl border border-neon/20 cursor-grab active:cursor-grabbing rounded-lg"
              >
                <div className="text-gray-500 hover:text-neon">
                  <Bars3Icon className="w-5 h-5" />
                </div>
                <PhotoIcon className="w-6 h-6 text-neon" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.file.name}</p>
                  <p className="text-xs text-gray-400">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(item.id);
                  }}
                  className="p-1 hover:bg-red-500/20 transition rounded-full"
                >
                  <XMarkIcon className="w-5 h-5 text-red-400" />
                </button>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}

      {errorMsg && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center font-medium">
          {errorMsg}
        </motion.p>
      )}

      {/* Action Button */}
      {files.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          {!downloadUrl ? (
            <button
              onClick={handleConvert}
              disabled={loading}
              className="btn-neon px-12 py-4 text-xl font-bold disabled:opacity-70"
            >
              {loading ? 'Generando PDF...' : 'Convertir a PDF'}
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-green-400 font-medium">¡PDF generado con éxito!</p>
              <a
                href={downloadUrl}
                download={`images_to_pdf_${Date.now()}.pdf`}
                className="inline-block btn-neon px-12 py-4 text-xl font-bold"
              >
                Descargar PDF
              </a>
              <button
                onClick={() => {
                  setFiles([]);
                  setDownloadUrl(null);
                }}
                className="block mx-auto text-sm text-gray-400 hover:text-white mt-4"
              >
                Convertir otras imágenes
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Progress */}
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
    </motion.div>
  );
}
