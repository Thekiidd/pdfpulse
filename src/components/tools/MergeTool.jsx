// src/components/tools/MergeTool.jsx
import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { DocumentIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';

export default function MergeTool({ incrementCounter }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
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
      const newFiles = dropped.map(f => ({ file: f, id: crypto.randomUUID() }));
      setFiles(prev => [...prev, ...newFiles]);
      setDownloadUrl(null);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  // Eliminar archivo
  const removeFile = (id) => {
    setFiles(prev => prev.filter(item => item.id !== id));
    setDownloadUrl(null);
  };

  // Merge
  const handleMerge = async () => {
    if (files.length < 2) return;
    setLoading(true);
    setProgress(0);
    setErrorMsg('');
    setDownloadUrl(null);

    console.log(`[${new Date().toISOString()}] Starting merge process with ${files.length} files`);

    try {
      const mergedPdf = await PDFDocument.create();
      let processed = 0;

      for (let item of files) {
        const file = item.file;
        console.log(`[${new Date().toISOString()}] Processing file: ${file.name} (${file.size} bytes)`);
        try {
          const bytes = await file.arrayBuffer();
          const pdf = await PDFDocument.load(bytes);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach(page => mergedPdf.addPage(page));
          processed++;
          setProgress(Math.round((processed / files.length) * 90));
        } catch (e) {
          console.error(`[${new Date().toISOString()}] Error processing file ${file.name}:`, e);
          throw new Error(`No se pudo procesar "${file.name}". El archivo podría estar dañado o encriptado.`);
        }
      }

      const pageCount = mergedPdf.getPageCount();
      console.log(`[${new Date().toISOString()}] Merged PDF page count: ${pageCount}`);

      if (pageCount === 0) {
        throw new Error('No se pudieron extraer páginas de los archivos seleccionados.');
      }

      console.log(`[${new Date().toISOString()}] Saving merged PDF...`);
      const pdfBytes = await mergedPdf.save();
      console.log(`[${new Date().toISOString()}] PDF saved. Size: ${pdfBytes.length} bytes`);

      if (pdfBytes.length === 0) {
        throw new Error('El PDF generado está vacío (0 bytes).');
      }

      // Create Blob and URL
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      console.log(`[${new Date().toISOString()}] Blob URL created: ${url}`);
      setDownloadUrl(url);

      // Trigger auto-download
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = `merged_${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log(`[${new Date().toISOString()}] Auto-download triggered successfully`);
      } catch (downloadError) {
        console.error(`[${new Date().toISOString()}] Auto-download failed:`, downloadError);
        // We don't throw here because we have the manual button as fallback
      }

      if (typeof incrementCounter === 'function') {
        incrementCounter();
      }

      setProgress(100);
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Merge error:`, err);
      setErrorMsg(err.message || 'Error desconocido al unir los archivos');
      setLoading(false);
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
          relative border-2 border-dashed p-10 text-center transition-all duration-300
          ${files.length > 0 ? 'border-neon bg-neon/5' : 'border-neon/30 hover:border-neon hover:bg-neon/5'}
        `}
      >
        <input
          type="file"
          multiple
          accept=".pdf"
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

      {/* Lista de archivos (Reorder) */}
      {files.length > 0 && (
        <Reorder.Group
          axis="y"
          values={files}
          onReorder={(newOrder) => {
            setFiles(newOrder);
            setDownloadUrl(null); // Reset download URL on reorder
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
                <DocumentIcon className="w-6 h-6 text-neon" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.file.name}</p>
                  <p className="text-xs text-gray-400">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent drag start
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

      {/* Botón de Acción o Descarga */}
      {files.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          {!downloadUrl ? (
            <button
              onClick={handleMerge}
              disabled={loading}
              className="btn-neon px-12 py-4 text-xl font-bold disabled:opacity-70"
            >
              {loading ? 'Uniéndose...' : `Unir ${files.length} PDFs`}
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-green-400 font-medium">¡PDFs unidos con éxito!</p>
              <a
                href={downloadUrl}
                download={`merged_${Date.now()}.pdf`}
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
                Unir otros archivos
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Progreso */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="h-3 bg-black/50 overflow-hidden">
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
        <script>(adsbygoogle = window.adsbygoogle || []).push({ });</script>
      </div>
    </motion.div>
  );
}