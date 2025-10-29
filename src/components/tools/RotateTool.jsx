import { useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { PDFDocument } from 'pdf-lib';

export default function RotateTool({ incrementCounter }) {
  const [file, setFile] = useState(null);
  const [rotation, setRotation] = useState(90);
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
    const dropped = e.dataTransfer.files[0];
    if (dropped && validateFile(dropped)) setFile(dropped);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && validateFile(f)) setFile(f);
  };

  const rotatePdf = async () => {
    if (!file) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach(page => {
        const currentRotation = page.getRotation().angle;
        const newRotation = (currentRotation + rotation) % 360;
        page.setRotation({ type: 'degrees', angle: newRotation });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      const now = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
      a.href = url;
      a.download = `pdfpulse_rotated_${rotation}deg_${now}.pdf`;
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
        Girar PDF
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
            <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <button
              onClick={() => setFile(null)}
              className="text-xs text-red-400 hover:text-red-300"
            >
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
              <DocumentIcon className="w-10 h-10 text-neon" />
            </motion.div>
            <p className="text-xl text-gray-300">Arrastra tu PDF aquí</p>
            <p className="text-sm text-gray-500">o haz clic (máx 50MB)</p>
          </div>
        )}
      </div>

      {file && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex justify-center gap-3">
            {[90, 180, 270].map((deg) => (
              <button
                key={deg}
                onClick={() => setRotation(deg)}
                className={`
                  px-5 py-2 rounded-lg text-sm font-medium transition-all
                  ${rotation === deg 
                    ? 'bg-neon text-white shadow-neon-lg' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }
                `}
              >
                {deg}°
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {errorMsg && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center font-medium">
          {errorMsg}
        </motion.p>
      )}

      {file && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <button
            onClick={rotatePdf}
            disabled={loading}
            className="btn-neon px-12 py-4 text-xl font-bold disabled:opacity-70 flex items-center gap-3 mx-auto"
          >
            {loading ? (
              <>Rotando...</>
            ) : (
              <>
                <ArrowPathIcon className="w-6 h-6" />
                Girar {rotation}°
              </>
            )}
          </button>
        </motion.div>
      )}

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          <div className="h-3 bg-black/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon to-neon-light"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <p className="text-center text-sm text-gray-400">Aplicando rotación...</p>
        </motion.div>
      )}
    </motion.div>
  );
}