import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function ImgToPdfTool() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [totalCount, setTotalCount] = useState(0); // contador actualizado

  const validateFiles = (newFiles) => {
    if (newFiles.length > 5) return setErrorMsg('Máximo 5 imágenes'), false;
    for (let f of newFiles) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(f.type))
        return setErrorMsg('Solo JPG/PNG'), false;
      if (f.size > 5 * 1024 * 1024) return setErrorMsg('>5MB no permitido'), false;
    }
    setErrorMsg('');
    return true;
  };

  const incrementCounter = async (hash) => {
    try {
      const res = await fetch('https://pdfpulse-4.onrender.com/api/count/increment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'pdf', hash })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error desconocido');
      setTotalCount(data.total);
    } catch (err) {
      console.error('Error incrementCounter:', err);
      setErrorMsg('No se pudo actualizar el contador: ' + err.message);
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const pdfDoc = await PDFDocument.create();
      for (let file of files) {
        const imgBytes = await file.arrayBuffer();
        const img = file.type.includes('png')
          ? await pdfDoc.embedPng(imgBytes)
          : await pdfDoc.embedJpg(imgBytes);
        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      // --- generar hash del PDF ---
      const hashBuffer = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer());
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2,'0')).join('');

      // --- enviar a backend ---
      await incrementCounter(hashHex);

      // --- descargar PDF ---
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const now = new Date().toISOString().slice(0,19).replace('T','_').replace(/:/g,'-');
      a.href = url;
      a.download = `pdfpulse_images_${now}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      setErrorMsg('Error al convertir PDF: ' + err.message);
      console.error('handleConvert error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          const newFiles = Array.from(e.target.files);
          if (validateFiles(newFiles)) setFiles(newFiles);
        }}
        className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
      />
      <button
        onClick={handleConvert}
        disabled={files.length === 0 || loading}
        className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-orange-600"
      >
        {loading ? 'Convirtiendo...' : `Convertir ${files.length} Imágenes`}
      </button>
      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
      <p>Total de archivos procesados: {totalCount}</p>
    </div>
  );
}
