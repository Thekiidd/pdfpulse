// src/components/tools/CompressTool.jsx
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { DocumentIcon } from '@heroicons/react/24/outline';

// === TU TOKEN DE POSTMAN (válido 1 hora) ===
const BEARER_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuaWxvdmVwZGYuY29tIiwiYXVkIjoiIiwiaWF0IjoxNzYxNjM2MDg0LCJuYmYiOjE3NjE2MzYwODQsImV4cCI6MTc2MTYzOTY4NCwianRpIjoicHJvamVjdF9wdWJsaWNfNTZmYmVhMzBkYjQ4ZjExZTMxYjg5MjM1NjA0ZDFhZmZfTUtZN1k5NjZiNzFiMzVmYTVkNzUwYjhhNGQ3ZGM3NzE5YTE1ZiJ9.2gK0w3jnFBnj1ImL7XREtEBauwQBiita765pjkWYkDU';

const API_BASE = 'https://api.ilovepdf.com/v1';

export default function CompressTool({ incrementCounter }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState('recommended');

  const validateFile = (f) => {
    if (f.type !== 'application/pdf') return setErrorMsg('Solo PDFs'), false;
    if (f.size > 100 * 1024 * 1024) return setErrorMsg('Máx 100MB'), false;
    setErrorMsg('');
    setOriginalSize(f.size);
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && validateFile(dropped)) setFile(dropped);
  };

  const handleDragOver = (e) => e.preventDefault();

  const removeFile = () => {
    setFile(null);
    setOriginalSize(0);
    setCompressedSize(0);
  };

  const startTask = async () => {
    const res = await fetch(`${API_BASE}/start/compress`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
    });
    if (!res.ok) throw new Error(`Start failed: ${await res.text()}`);
    return await res.json();
  };

  const uploadFile = async (server, task, file) => {
    const formData = new FormData();
    formData.append('task', task);
    formData.append('file', file);

    const res = await fetch(`https://${server}/v1/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` },
      body: formData
    });
    if (!res.ok) throw new Error(`Upload failed: ${await res.text()}`);
    return await res.json();
  };

  // === PROCESAR CON filename (CORREGIDO) ===
  const processTask = async (server, task, serverFilename, originalFilename) => {
    const res = await fetch(`https://${server}/v1/process`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        task,
        tool: 'compress',
        files: [{
          server_filename: serverFilename,
          filename: originalFilename  // ← ¡OBLIGATORIO!
        }],
        compression_level: quality
      })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Process failed: ${JSON.stringify(err)}`);
    }
    return await res.json();
  };

  const waitForCompletion = async (server, task) => {
    let attempts = 0;
    while (attempts < 60) {
      const res = await fetch(`https://${server}/v1/task/${task}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
      });
      if (!res.ok) throw new Error('Polling failed');
      const data = await res.json();
      if (data.status === 'TaskSuccess') return data.download_filename;
      if (data.status === 'TaskError') throw new Error('Compresión fallida');
      setProgress(40 + Math.round((attempts / 60) * 50));
      await new Promise(r => setTimeout(r, 3000));
      attempts++;
    }
    throw new Error('Timeout');
  };

  const downloadFile = async (server, task) => {
    const res = await fetch(`https://${server}/v1/download/${task}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
    });
    if (!res.ok) throw new Error('Download failed');
    const blob = await res.blob();
    setCompressedSize(blob.size);

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const now = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
    a.href = url;
    a.download = `pdfpulse_compressed_${quality}_${now}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    setErrorMsg('');
    setCompressedSize(0);

    try {
      setProgress(10);
      const { server, task } = await startTask();

      setProgress(20);
      const { server_filename } = await uploadFile(server, task, file);

      setProgress(30);
      await processTask(server, task, server_filename, file.name); // ← PASA file.name

      setProgress(90);
      await waitForCompletion(server, task);

      setProgress(100);
      await downloadFile(server, task);

      incrementCounter();
    } catch (err) {
      console.error(err);
      setErrorMsg('Error: ' + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  // === UI (igual) ===
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <motion.h1 className="text-4xl md:text-5xl font-black text-center text-neon text-glow">
        Comprimir PDF
      </motion.h1>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300
          ${file ? 'border-neon bg-neon/5' : 'border-neon/30 hover:border-neon hover:bg-neon/5'}
        `}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const f = e.target.files[0];
            if (f && validateFile(f)) setFile(f);
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        {file ? (
          <div className="space-y-3">
            <DocumentIcon className="w-12 h-12 mx-auto text-neon" />
            <p className="text-lg font-medium text-white truncate max-w-xs mx-auto">{file.name}</p>
            <p className="text-sm text-gray-400">{(originalSize / 1024 / 1024).toFixed(2)} MB</p>
            <button onClick={removeFile} className="text-xs text-red-400 hover:text-red-300">
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
            <p className="text-sm text-gray-500">o haz clic (máx 100MB)</p>
          </div>
        )}
      </div>

      {file && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {['low', 'recommended', 'extreme'].map((opt) => (
              <button
                key={opt}
                onClick={() => setQuality(opt)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${quality === opt 
                    ? 'bg-neon text-white shadow-neon-lg' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }
                `}
              >
                {opt === 'low' ? 'Baja' : opt === 'recommended' ? 'Recomendada' : 'Extrema'}
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
            onClick={handleCompress}
            disabled={loading}
            className="btn-neon px-12 py-4 text-xl font-bold disabled:opacity-70"
          >
            {loading ? 'Comprimiendo...' : 'Comprimir PDF'}
          </button>
        </motion.div>
      )}

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
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

      {compressedSize > 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-neon/10 backdrop-blur-xl rounded-2xl border border-neon/30 text-center"
        >
          <p className="text-lg text-white font-bold">¡Comprimido!</p>
          <p className="text-sm text-gray-300 mt-1">
            Reducido de {(originalSize / 1024 / 1024).toFixed(2)} MB → {(compressedSize / 1024 / 1024).toFixed(2)} MB
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}