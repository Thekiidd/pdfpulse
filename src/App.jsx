import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  ScissorsIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon, // ✅ reemplazo correcto de FileTextIcon
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { PDFDocument } from 'pdf-lib';
import mammoth from 'mammoth';
import html2canvas from 'html2canvas';
import Navbar from './components/Navbar';
import Banner from './components/Banner';

// Merge PDFs Component
const MergeTool = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMerge = async () => {
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
      a.href = url;
      a.download = 'merged.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" multiple accept=".pdf" onChange={(e) => setFiles(Array.from(e.target.files))} className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500" />
      <button onClick={handleMerge} disabled={files.length < 2 || loading} className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 w-full">
        {loading ? 'Uniendose...' : `Unir ${files.length} PDFs`}
      </button>
    </div>
  );
};

// Compress PDF Component
const CompressTool = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCompress = async () => {
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
      a.href = url;
      a.download = `compressed-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500" />
      <button onClick={handleCompress} disabled={!file || loading} className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 w-full">
        {loading ? 'Comprimiendo...' : 'Comprimir y Descargar'}
      </button>
      {file && <p className="text-sm text-gray-600">Size original: {(file.size / 1024).toFixed(0)} KB</p>}
    </div>
  );
};

// IMG a PDF Component (Fix Completo)
const ImgToPdfTool = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
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
      a.href = url;
      a.download = 'imgs-to-pdf.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files))} className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      <button onClick={handleConvert} disabled={files.length === 0 || loading} className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 w-full">
        {loading ? 'Convirtiendo...' : `Convertir ${files.length} Imgs a PDF`}
      </button>
      {files.length > 0 && (
        <p className="text-sm text-gray-600">
          Archivos: {files.map(f => f.name).join(', ')}
        </p>
      )}
    </div>
  );
};

// Word a PDF Component
const WordToPdfTool = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
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
      a.href = url;
      a.download = 'word-to-pdf.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" accept=".docx" onChange={(e) => setFile(e.target.files[0])} className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500" />
      <button onClick={handleConvert} disabled={!file || loading} className="bg-teal-500 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 w-full">
        {loading ? 'Convirtiendo...' : 'Convertir Word a PDF'}
      </button>
    </div>
  );
};

// App Function – Main
function App() {
  const [tool, setTool] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const tools = [
    { id: 'merge', name: 'Unir PDFs', icon: HomeIcon, desc: 'Combina files en segundos', keywords: 'unir combinar pdfs merge' },
    { id: 'compress', name: 'Comprimir', icon: ScissorsIcon, desc: 'Reduce size hasta 80%', keywords: 'comprimir reducir tamaño peso' },
    { id: 'img-pdf', name: 'IMG a PDF', icon: DocumentDuplicateIcon, desc: 'Fotos a doc multi-página', keywords: 'imagen foto jpg png convertir pdf' },
    { id: 'word-pdf', name: 'Word a PDF', icon: DocumentTextIcon, desc: 'Docx a PDF editable', keywords: 'word docx convertir pdf' },
  ];

  const filteredTools = useMemo(() => {
    if (!searchQuery) return tools;
    const query = searchQuery.toLowerCase();
    return tools.filter(t => 
      t.name.toLowerCase().includes(query) ||
      t.desc.toLowerCase().includes(query) ||
      (t.keywords && t.keywords.toLowerCase().includes(query))
    );
  }, [searchQuery, tools]);

  const openTool = (id) => setTool(id);
  const closeTool = () => setTool('');

  return (
    <div className="min-h-screen bg-black">
      <Navbar onSearch={setSearchQuery} />
      
      {!tool && (
        <>
          <Banner />
          <main id="tools" className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTools.map((t, i) => (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => openTool(t.id)}
                  className="bg-pulse-card p-6 rounded-2xl border border-gray-800 hover:border-pulse-red transition-all group"
                >
                  <div className="w-16 h-16 bg-pulse-red/20 rounded-xl mb-4 mx-auto group-hover:bg-pulse-red/40 transition"></div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.name}</h3>
                  <p className="text-gray-400 text-sm">{t.desc}</p>
                </motion.button>
              ))}
            </div>
            {filteredTools.length === 0 && (
              <p className="text-center text-gray-500 py-12">No se encontraron herramientas...</p>
            )}
          </main>
        </>
      )}

      {tool && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="min-h-screen bg-black pt-20 px-4"
        >
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={closeTool}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
            >
              <ArrowLeftIcon className="w-5 h-5" /> Volver
            </button>
            {tool === 'merge' && <MergeTool />}
            {tool === 'compress' && <CompressTool />}
            {tool === 'img-pdf' && <ImgToPdfTool />}
            {tool === 'word-pdf' && <WordToPdfTool />}
          </div>
        </motion.div>
      )}

      <footer className="bg-pulse-dark text-center py-8 text-gray-500 text-sm">
        PDFPulse © 2025 – Herramienta independiente. Usa con responsabilidad.
      </footer>
    </div>
  );
}

export default App;