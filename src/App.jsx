import { useState } from 'react';
import { motion } from 'framer-motion';
import { HomeIcon, ScissorsIcon, DocumentDuplicateIcon, DocumentTextIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { PDFDocument } from 'pdf-lib';
import mammoth from 'mammoth';
import html2canvas from 'html2canvas';
import { Analytics } from "@vercel/analytics/react"

// Merge PDFs
const MergeTool = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validateFiles = (newFiles) => {
    if (newFiles.length > 10) {
      setErrorMsg('Máximo 10 files');
      return false;
    }
    for (let f of newFiles) {
      if (f.type !== 'application/pdf') {
        setErrorMsg('Solo PDFs permitidos');
        return false;
      }
      if (f.size > 10 * 1024 * 1024) {
        setErrorMsg('File >5MB no permitido');
        return false;
      }
    }
    return true;
  };

  const handleMerge = async () => {
    setErrorMsg('');
    if (files.length < 2) return;
    setLoading(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (let file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
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
    }
  };

  return (
    <div className="space-y-4">
      <input 
        type="file" 
        multiple 
        accept=".pdf" 
        onChange={(e) => {
          const newFiles = Array.from(e.target.files);
          setErrorMsg('');
          if (validateFiles(newFiles)) setFiles(newFiles);
        }} 
        className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" 
        aria-label="Subir PDFs para unir" 
      />
      <button 
        onClick={handleMerge} 
        disabled={files.length < 2 || loading} 
        className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 w-full focus:ring-2 focus:ring-red-300"
        aria-label="Unir PDFs"
      >
        {loading ? 'Uniendose...' : `Unir ${files.length} PDFs`}
      </button>
      {errorMsg && <p className="error">{errorMsg}</p>}
      <div className="ad-banner bg-gray-800 p-4 rounded text-center">Ad Placeholder – Google AdSense</div>
    </div>
  );
};

// Compress PDF (Con Validación Similar)
const CompressTool = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validateFile = (f) => {
    if (f.type !== 'application/pdf') {
      setErrorMsg('Solo PDFs permitidos');
      return false;
    }
    if (f.size > 5 * 1024 * 1024) {
      setErrorMsg('File >5MB no permitido');
      return false;
    }
    return true;
  };

  const handleCompress = async () => {
    setErrorMsg('');
    if (!file) return;
    setLoading(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const pages = pdfDoc.getPages();
      pages.forEach(page => {
        page.node.Resources = page.node.Resources || {};
        if (page.node.Resources.XObject) {
          Object.values(page.node.Resources.XObject).forEach(obj => {
            if (obj.Subtype && obj.Subtype.name === 'Image') {
              obj.Filter = null;
            }
          });
        }
      });
      const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const now = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
      a.href = url;
      a.download = `pdfpulse_compress_${now}.pdf`;
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
    <div className="space-y-4">
      <input 
        type="file" 
        accept=".pdf" 
        onChange={(e) => {
          const f = e.target.files[0];
          setErrorMsg('');
          if (f && validateFile(f)) setFile(f);
        }} 
        className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500" 
        aria-label="Subir PDF para comprimir" 
      />
      <button 
        onClick={handleCompress} 
        disabled={!file || loading} 
        className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 w-full focus:ring-2 focus:ring-yellow-300"
        aria-label="Comprimir PDF"
      >
        {loading ? 'Comprimiendo...' : 'Comprimir y Descargar'}
      </button>
      {errorMsg && <p className="error">{errorMsg}</p>}
      {file && <p className="text-sm text-gray-600">Size original: {(file.size / 1024).toFixed(0)} KB</p>}
      <div className="ad-banner bg-gray-800 p-4 rounded text-center">Ad Placeholder – Google AdSense</div>
    </div>
  );
};

// IMG a PDF (Con Validación)
const ImgToPdfTool = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validateFiles = (newFiles) => {
    if (newFiles.length > 5) {
      setErrorMsg('Máximo 5 images');
      return false;
    }
    for (let f of newFiles) {
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(f.type)) {
        setErrorMsg('Solo JPG/PNG/GIF permitidos');
        return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        setErrorMsg('Image >5MB no permitido');
        return false;
      }
    }
    return true;
  };

  const handleConvert = async () => {
    setErrorMsg('');
    if (files.length === 0) return;
    setLoading(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (let file of files) {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.src = url;
        await new Promise((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = reject;
        });
        const imgBytes = await file.arrayBuffer();
        let embeddedImg;
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          embeddedImg = await pdfDoc.embedJpg(imgBytes);
        } else if (file.type === 'image/png') {
          embeddedImg = await pdfDoc.embedPng(imgBytes);
        } else if (file.type === 'image/gif') {
          embeddedImg = await pdfDoc.embedPng(imgBytes);
        } else {
          throw new Error(`Tipo no soportado: ${file.type}`);
        }
        if (!embeddedImg) throw new Error('No se pudo embedar');
        const page = pdfDoc.addPage([612, 792]);
        const scale = Math.min(612 / img.width, 792 / img.height, 1);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (612 - scaledWidth) / 2;
        const y = (792 - scaledHeight) / 2;
        page.drawImage(embeddedImg, { x, y, width: scaledWidth, height: scaledHeight });
      }
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const now = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
      a.href = url;
      a.download = `pdfpulse_imgages_${now}.pdf`;
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
    <div className="space-y-4">
      <input type="file" multiple accept="image/*" onChange={(e) => {
        const newFiles = Array.from(e.target.files);
        setErrorMsg('');
        if (validateFiles(newFiles)) setFiles(newFiles);
      }} className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label="Subir imágenes para convertir" />
      <button onClick={handleConvert} disabled={files.length === 0 || loading} className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 w-full focus:ring-2 focus:ring-indigo-300" aria-label="Convertir a PDF">
        {loading ? 'Convirtiendo...' : `Convertir ${files.length} Imgs a PDF`}
      </button>
      {errorMsg && <p className="error">{errorMsg}</p>}
      <div className="ad-banner bg-gray-800 p-4 rounded text-center">Ad Placeholder – Google AdSense</div>
    </div>
  );
};

// Word a PDF (Con Validación)
const WordToPdfTool = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validateFile = (f) => {
    if (f.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setErrorMsg('Solo .docx permitidos');
      return false;
    }
    if (f.size > 5 * 1024 * 1024) {
      setErrorMsg('File >5MB no permitido');
      return false;
    }
    return true;
  };

  const handleConvert = async () => {
    setErrorMsg('');
    if (!file) return;
    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      tempDiv.style.width = '612px';
      tempDiv.style.padding = '20px';
      document.body.appendChild(tempDiv);
      const canvas = await html2canvas(tempDiv);
      document.body.removeChild(tempDiv);
      const pdfDoc = await PDFDocument.create();
      const imgBytes = canvas.toDataURL('image/png');
      const img = await pdfDoc.embedPng(imgBytes);
      const page = pdfDoc.addPage([canvas.width / 2, canvas.height / 2]);
      page.drawImage(img, { x: 0, y: 0, width: canvas.width / 2, height: canvas.height / 2 });
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const now = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
      a.href = url;
      a.download = `pdfpulse_word_${now}.pdf`;
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
    <div className="space-y-4">
      <input type="file" accept=".docx" onChange={(e) => {
        const f = e.target.files[0];
        setErrorMsg('');
        if (f && validateFile(f)) setFile(f);
      }} className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500" aria-label="Subir Word para convertir" />
      <button onClick={handleConvert} disabled={!file || loading} className="bg-teal-500 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 w-full focus:ring-2 focus:ring-teal-300" aria-label="Convertir Word a PDF">
        {loading ? 'Convirtiendo...' : 'Convertir Word a PDF'}
      </button>
      {errorMsg && <p className="error">{errorMsg}</p>}
      <div className="ad-banner bg-gray-800 p-4 rounded text-center">Ad Placeholder – Google AdSense</div>
    </div>
  );
}

// ========================================
// MAIN APP – UNE TODO
// ========================================
function App() {
  const translations = {
    es: {
      title: "Transforma tus PDFs al instante",
      subtitle: "100% Gratis • Sin registro • Todo en tu navegador",
      explore: "Explora Herramientas",
      merge: "Unir PDFs",
      mergeDesc: "Combina múltiples archivos",
      compress: "Comprimir",
      compressDesc: "Reduce tamaño hasta 80%",
      imgToPdf: "IMG a PDF",
      imgToPdfDesc: "Fotos a documento",
      wordToPdf: "Word a PDF",
      wordToPdfDesc: "Docx a PDF editable",
      back: "Volver",
      processed: "PDFs procesados",
      footer: "Gratis por ahora • Próximamente Premium",
    },
    en: {
      title: "Transform your PDFs instantly",
      subtitle: "100% Free • No signup • All in your browser",
      explore: "Explore Tools",
      merge: "Merge PDFs",
      mergeDesc: "Combine multiple files",
      compress: "Compress",
      compressDesc: "Reduce size up to 80%",
      imgToPdf: "IMG to PDF",
      imgToPdfDesc: "Photos to document",
      wordToPdf: "Word to PDF",
      wordToPdfDesc: "Docx to editable PDF",
      back: "Back",
      processed: "PDFs processed",
      footer: "Free for now • Premium coming soon",
    },
  };

  const [lang, setLang] = useState('es');
  const t = translations[lang];

  const [totalProcessed, setTotalProcessed] = useState(() => {
    const saved = localStorage.getItem('pdfpulse_total');
    return saved ? parseInt(saved) : 0;
  });

  const incrementCounter = () => {
    const newTotal = totalProcessed + 1;
    setTotalProcessed(newTotal);
    localStorage.setItem('pdfpulse_total', newTotal.toString());
  };

  const [tool, setTool] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const tools = [
    { id: 'merge', name: 'Unir PDFs', icon: HomeIcon, desc: 'Combina múltiples archivos' },
    { id: 'compress', name: 'Comprimir', icon: ScissorsIcon, desc: 'Reduce tamaño hasta 80%' },
    { id: 'img-pdf', name: 'IMG a PDF', icon: DocumentDuplicateIcon, desc: 'Fotos a documento' },
    { id: 'word-pdf', name: 'Word a PDF', icon: DocumentTextIcon, desc: 'Docx a PDF editable' },
  ];

  const filteredTools = tools.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openTool = (id) => setTool(id);
  const closeTool = () => setTool('');

  return (
    <div className="min-h-screen bg-pulse-dark text-white">
      {/* Navbar */}
      <nav className="bg-black/50 backdrop-blur-md shadow-lg fixed w-full z-50 top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black">
            PDF<span className="text-pulse-red animate-pulse">Pulse</span>
          </h1>
          <input
            type="text"
            placeholder="Buscar herramienta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-pulse-red focus:outline-none w-64"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang('es')}
            className={`px-3 py-1 rounded ${lang === 'es' ? 'bg-pulse-red text-white' : 'text-gray-400'}`}
          >
            ES
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded ${lang === 'en' ? 'bg-pulse-red text-white' : 'text-gray-400'}`}
          >
            EN
          </button>
        </div>
      </nav>

      {/* Hero Banner */}
      {!tool && (
        <section className="pt-24 pb-16 text-center bg-gradient-to-b from-black to-pulse-dark">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-6"
          >
            Transforma tus <span className="text-pulse-red">PDFs</span> al instante
          </motion.h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            100% Gratis • Sin registro • Todo en tu navegador
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('tools').scrollIntoView({ behavior: 'smooth' })}
            className="bg-pulse-red text-white px-8 py-4 rounded-full text-lg font-bold shadow-pulse-red"
          >
            Explora Herramientas
          </motion.button>
        </section>
      )}

      {/* Tools Grid */}
      {!tool && (
        <main id="tools" className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTools.map((t, i) => (
              <motion.button
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => openTool(t.id)}
                className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-pulse-red transition-all group text-left"
              >
                <t.icon className="w-12 h-12 text-pulse-red mb-4 group-hover:animate-pulse" />
                <h3 className="text-xl font-bold mb-2">{t.name}</h3>
                <p className="text-gray-400 text-sm">{t.desc}</p>
              </motion.button>
            ))}
          </div>
          {filteredTools.length === 0 && (
            <p className="text-center text-gray-500 py-12">No se encontraron herramientas...</p>
          )}
        </main>
      )}

      {/* Tool Active */}
      {tool && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="min-h-screen pt-20 px-4"
        >
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={closeTool}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
            >
              <ArrowLeftIcon className="w-5 h-5" /> Volver
            </button>
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <h2 className="text-3xl font-bold mb-6 text-pulse-red">
                {tools.find(t => t.id === tool)?.name}
              </h2>
              {tool === 'merge' && <MergeTool />}
              {tool === 'compress' && <CompressTool />}
              {tool === 'img-pdf' && <ImgToPdfTool />}
              {tool === 'word-pdf' && <WordToPdfTool />}
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="bg-black text-center py-6 text-gray-500 text-sm mt-auto">
        <p>
          <span className="text-pulse-red font-bold">{totalProcessed.toLocaleString()}</span> PDFs procesados
        </p>
        <p className="mt-1">
          PDFPulse © 2025 – Herramienta independiente. Usa con responsabilidad.
          <br />
          <span className="text-pulse-red">Gratis por ahora • Próximamente Premium</span>
        </p>
      </footer>

      <Analytics />
    </div>
  );
}

export default App;
