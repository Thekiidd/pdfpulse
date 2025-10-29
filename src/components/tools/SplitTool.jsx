// src/components/tools/SplitTool.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { PDFDocument } from 'pdf-lib';

export default function SplitTool({ incrementCounter }) {
  const [file, setFile] = useState(null);
  const [chunkSize, setChunkSize] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validateFile = (f) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) return setErrorMsg('Solo PDFs'), false;
    if (f.size > 100 * 1024 * 1024) return setErrorMsg('Máx 100MB'), false;
    setErrorMsg('');
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && validateFile(f)) {
      setFile(f);
      loadPageCount(f);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && validateFile(f)) {
      setFile(f);
      loadPageCount(f);
    }
  };

  const loadPageCount = async (f) => {
    const arrayBuffer = await f.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    setTotalPages(pdfDoc.getPageCount());
  };

  const splitPdf = async () => {
    if (!file) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      for (let i = 0; i < totalPages; i += chunkSize) {
        const newPdf = await PDFDocument.create();
        const end = Math.min(i + chunkSize, totalPages);
        const pageIndices = Array.from({ length: end - i }, (_, j) => i + j);
        const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach(page => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name.replace('.pdf', '')}_parte_${i + 1}-${end}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }

      incrementCounter();
    } catch (err) {
      setErrorMsg('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <motion.h1 className="text-4xl md:text-5xl font-black text-center text-neon text-glow">
        Dividir PDF
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
          accept=".pdf"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        {file ? (
          <div className="space-y-3">
            <DocumentIcon className="w-12 h-12 mx-auto text-neon" />
            <p className="text-lg font-medium text-white truncate max-w-xs mx-auto">{file.name}</p>
            <p className="text-sm text-gray-400">{totalPages} página{totalPages > 1 ? 's' : ''}</p>
            <button onClick={() => { setFile(null); setTotalPages(0); }} className="text-xs text-red-400 hover:text-red-300">
              Cambiar archivo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 mx-auto bg-neon/10 rounded-full flex items-center justify-center"
            >
              <ArrowDownTrayIcon className="w-10 h-10 text-neon" />
            </motion.div>
            <p className="text-xl text-gray-300">Arrastra tu PDF aquí</p>
            <p className="text-sm text-gray-500">o haz clic (máx 100MB)</p>
          </div>
        )}
      </div>

      {file && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Páginas por archivo: {chunkSize}</label>
            <input
              type="range"
              min="1"
              max={totalPages}
              value={chunkSize}
              onChange={(e) => setChunkSize(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <button
            onClick={splitPdf}
            disabled={loading}
            className="w-full btn-neon py-3 text-lg font-bold disabled:opacity-70 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>Dividiendo...</>
            ) : (
              <>
                <ArrowDownTrayIcon className="w-6 h-6" />
                Dividir en {Math.ceil(totalPages / chunkSize)} archivos
              </>
            )}
          </button>
        </motion.div>
      )}

      {errorMsg && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center font-medium">
          {errorMsg}
        </motion.p>
      )}
    </motion.div>
  );
}