// src/components/tools/EditPdfTool.jsx
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { DocumentIcon, PencilIcon } from '@heroicons/react/24/outline';
import { PDFDocument } from 'pdf-lib';

export default function EditPdfTool({ incrementCounter }) {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validateFile = (f) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) return setErrorMsg('Solo PDFs'), false;
    if (f.size > 30 * 1024 * 1024) return setErrorMsg('Máx 30MB'), false;
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

  const handleImageChange = (e) => {
    const img = e.target.files[0];
    if (img && img.type.startsWith('image/')) setImage(img);
  };

  const editPdf = async () => {
    if (!file) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const page = pages[0]; // Edita solo primera página

      if (text) {
        const font = await pdfDoc.embedFont('Helvetica');
        page.drawText(text, {
          x: 50, y: page.getHeight() - 100,
          size: 24, font, color: { type: 'RGB', red: 1, green: 0, blue: 0 }
        });
      }

      if (image) {
        const imgBytes = await image.arrayBuffer();
        const img = image.type.includes('png')
          ? await pdfDoc.embedPng(imgBytes)
          : await pdfDoc.embedJpg(imgBytes);
        page.drawImage(img, {
          x: 50, y: page.getHeight() - 300,
          width: 200, height: 200
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      const now = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
      a.href = url;
      a.download = `pdfpulse_edited_${now}.pdf`;
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
        Editar PDF
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
            <button onClick={() => setFile(null)} className="text-xs text-red-400 hover:text-red-300">
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
              <PencilIcon className="w-10 h-10 text-neon" />
            </motion.div>
            <p className="text-xl text-gray-300">Arrastra tu PDF aquí</p>
            <p className="text-sm text-gray-500">o haz clic (máx 30MB)</p>
          </div>
        )}
      </div>

      {file && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <input
            type="text"
            placeholder="Texto a añadir"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-neon/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neon file:text-black hover:file:bg-neon-light"
          />
        </motion.div>
      )}

      {errorMsg && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center font-medium">
          {errorMsg}
        </motion.p>
      )}

      {file && (text || image) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <button
            onClick={editPdf}
            disabled={loading}
            className="btn-neon px-12 py-4 text-xl font-bold disabled:opacity-70"
          >
            {loading ? 'Editando...' : 'Aplicar Cambios'}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}