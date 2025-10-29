// src/components/tools/MergeTool.jsx
import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function MergeTool({ incrementCounter }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const dropZoneRef = useRef(null);

  // Validación (solo tipo y tamaño)
  const validateFiles = (newFiles) => {
    for (let f of newFiles) {
      if (f.type !== 'application/pdf') return setErrorMsg('Solo PDFs permitidos'), false;
      if (f.size > 10 * 1024 * 1024) return setErrorMsg('Máx 10MB por archivo'), false;
    }
    setErrorMsg('');
    return true;
  };

  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    if (validateFiles(dropped)) {
      setFiles(prev => [...prev, ...dropped]);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  // Eliminar archivo
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Merge
  const handleMerge = async () => {
    if (files.length < 2) return;
    setLoading(true);
    setProgress(0);
    setErrorMsg('');

    try {
      const mergedPdf = await PDFDocument.create();
      let processed = 0;

      for (let file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
        processed++;
        setProgress(Math.round((processed / files.length) * 90));
      }

      const pdfBytes = await mergedPdf.save();
      setProgress(100);

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const now = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
      a.href = url;
      a.download = `pdfpulse_merge_${now}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      incrementCounter();
    } catch (err) {
      setErrorMsg('Error: ' + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Título */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-5xl font-black text-center text-neon text-glow"
      >
        Unir PDFs
      </motion.h1>

      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300
          ${files.length > 0 ? 'border-neon bg-neon/5' : 'border-neon/30 hover:border-neon hover:bg-neon/5'}
        `}
      >
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={(e) => {
            const newFiles = Array.from(e.target.files);
            if (validateFiles(newFiles)) setFiles(prev => [...prev, ...newFiles]);
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        {files.length === 0 ? (
          <div className="space-y-4">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 mx-auto bg-neon/10 rounded-full flex items-center justify-center"
            >
              <DocumentIcon className="w-10 h-10 text-neon" />
            </motion.div>
            <p className="text-xl text-gray-300">Arrastra tus PDFs aquí</p>
            <p className="text-sm text-gray-500">o haz clic para seleccionar (sin límite)</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-lg text-white font-medium">
              {files.length} archivo{files.length > 1 ? 's' : ''} listo{files.length > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-gray-400">Puedes añadir más</p>
          </div>
        )}
      </div>

      {/* Lista de archivos (solo visual) */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((file, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-xl rounded-xl border border-neon/20"
              >
                <DocumentIcon className="w-6 h-6 text-neon" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={() => removeFile(i)}
                  className="p-1 rounded-lg hover:bg-red-500/20 transition"
                >
                  <XMarkIcon className="w-5 h-5 text-red-400" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {errorMsg && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-sm text-center font-medium"
        >
          {errorMsg}
        </motion.p>
      )}

      {/* Botón */}
      {files.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button
            onClick={handleMerge}
            disabled={loading}
            className="btn-neon px-12 py-4 text-xl font-bold disabled:opacity-70"
          >
            {loading ? 'Uniéndose...' : `Unir ${files.length} PDFs`}
          </button>
        </motion.div>
      )}

      {/* Progreso */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="h-3 bg-black/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon to-neon-light"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-center text-sm text-gray-400">{progress}%</p>
        </motion.div>
      )}

      {/* Anuncio */}
      <div className="ad-banner my-8 opacity-70">
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-1234567890123456"
             data-ad-slot="1111111111"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </div>
    </motion.div>
  );
}