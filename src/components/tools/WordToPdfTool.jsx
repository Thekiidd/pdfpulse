import { useState, useRef, useEffect } from 'react';
import { renderAsync } from 'docx-preview';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function WordToPdfTool({ incrementCounter }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const containerRef = useRef(null);

  const validateFile = (f) => {
    if (!f.name.endsWith('.docx')) return setErrorMsg('Solo .docx'), false;
    if (f.size > 15 * 1024 * 1024) return setErrorMsg('>15MB no permitido'), false;
    setErrorMsg('');
    return true;
  };

  const handleConvert = async () => {
    if (!file || !containerRef.current) return;
    setLoading(true);
    setErrorMsg('');

    try {
      // LIMPIAR CONTENEDOR
      containerRef.current.innerHTML = '';

      // ESTILOS PARA RENDERIZADO
      const style = document.createElement('style');
      style.textContent = `
        .docx-wrapper { 
          font-family: 'Times New Roman', serif; 
          padding: 40px; 
          background: white;
          width: 794px;
          margin: 0 auto;
        }
        .docx-wrapper p { margin: 0 0 12px 0; }
        .docx-wrapper img { max-width: 100%; height: auto; }
        .docx-page { page-break-after: always; }
      `;
      containerRef.current.appendChild(style);

      // RENDERIZAR DOCX
      await renderAsync(file, containerRef.current, null, {
        className: "docx-wrapper",
        breakPages: true,
        ignoreWidth: false,
        ignoreHeight: false,
      });

      // ESPERAR A QUE SE RENDERICE COMPLETO
      await new Promise(resolve => setTimeout(resolve, 2000));

      // OBTENER PÁGINAS
      const pages = containerRef.current.querySelectorAll('.docx-page-content') || 
                    containerRef.current.querySelectorAll('.docx-wrapper > div');

      if (pages.length === 0) throw new Error('No se detectaron páginas');

      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();

        const page = pages[i];
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          width: page.offsetWidth || 794,
          height: page.offsetHeight || 1123,
          scrollX: 0,
          scrollY: 0
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const imgHeight = (canvas.height * pageWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, imgHeight);
      }

      // DESCARGAR
      const now = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
      pdf.save(`pdfpulse_word_${now}.pdf`);
      incrementCounter();

    } catch (err) {
      console.error('Error en conversión:', err);
      setErrorMsg('Error: No se pudo renderizar el documento. Prueba con un .docx más simple.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        accept=".docx"
        onChange={(e) => {
          const f = e.target.files[0];
          if (f && validateFile(f)) setFile(f);
        }}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-3"
      />

      <button
        onClick={handleConvert}
        disabled={!file || loading}
        className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-orange-600 transition"
      >
        {loading ? 'Procesando... (15-30 seg)' : 'Convertir Word a PDF'}
      </button>

      {loading && (
        <div className="text-center text-sm text-gray-600 space-y-2">
          <p>Renderizando documento... No cierres la pestaña</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      )}

      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

      {/* CONTENEDOR OCULTO PARA RENDERIZAR */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '794px',
          background: 'white',
          visibility: 'hidden'
        }}
      />

      <div className="ad-banner my-6">
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-1234567890123456"
             data-ad-slot="2222222222"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </div>
    </div>
  );
}