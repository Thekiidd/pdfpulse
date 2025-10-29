// src/components/tools/ExtractPagesTool.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { PDFDocument } from 'pdf-lib';

export default function ExtractPagesTool({ incrementCounter }) {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const extractPages = async () => {
    if (!file || !pages) return;
    setLoading(true);
    setErrorMsg('');

    const pageNumbers = pages.split(',').map(p => parseInt(p.trim()) - 1).filter(p => p >= 0 && p < totalPages);
    if (pageNumbers.length === 0) return setErrorMsg('Páginas inválidas'), setLoading(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      const copiedPages = await newPdf.copyPages(pdfDoc, pageNumbers);
      copiedPages.forEach(page => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      const now = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
      a.href = url;
      a.download = `pdfpulse_extracted_${pages.replace(/,/g, '-')}_${now}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

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
        Extraer Páginas
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
            <button onClick={() => { setFile(null); setTotalPages(0); setPages(''); }} className="text-xs text-red-400 hover:text-red-300">
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
              <DocumentMagnifyingGlassIcon className="w-10 h-10 text-neon" />
            </motion.div>
            <p className="text-xl text-gray-300">Arrastra tu PDF aquí</p>
            <p className="text-sm text-gray-500">o haz clic (máx 50MB)</p>
          </div>
        )}
      </div>

      {file && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <input
            type="text"
            placeholder="Ej: 1, 3-5, 7"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-neon/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon"
          />
          <p className="text-xs text-gray-400 text-center">
            Usa comas y guiones. Ej: 1, 3-5, 7 (máx {totalPages})
          </p>
          <button
            onClick={extractPages}
            disabled={loading || !pages}
            className="w-full btn-neon py-3 text-lg font-bold disabled:opacity-70"
          >
            {loading ? 'Extrayendo...' : 'Extraer Páginas'}
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