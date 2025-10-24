import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Button from '../common/Button';  // Si lo tienes, sino usa <button>

const ImgToPdfTool = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) {
      console.log('DEBUG: No hay files seleccionados');
      return;
    }
    setLoading(true);
    console.log('DEBUG: Iniciando conversión para', files.length, 'files');
    try {
      const pdfDoc = await PDFDocument.create();
      console.log('DEBUG: PDFDoc creado OK');

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`DEBUG: Procesando file ${i + 1}: ${file.name}, tipo: ${file.type}, size: ${file.size}`);

        // Carga img para dimensions
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve, reject) => {
          img.onload = () => {
            console.log(`DEBUG: Img ${i + 1} cargada: width ${img.width}, height ${img.height}`);
            resolve(img);
          };
          img.onerror = (err) => {
            console.error(`DEBUG: Error cargando img ${i + 1}:`, err);
            reject(err);
          };
        });

        // ArrayBuffer
        const imgBytes = await file.arrayBuffer();
        console.log(`DEBUG: ArrayBuffer de ${i + 1}: ${imgBytes.byteLength} bytes`);

        // Embed según tipo (fix principal)
        let embeddedImg;
        if (file.type === 'image/jpeg') {
          console.log(`DEBUG: Embed JPG para ${i + 1}`);
          embeddedImg = await pdfDoc.embedJpg(imgBytes);
        } else if (file.type === 'image/png') {
          console.log(`DEBUG: Embed PNG para ${i + 1}`);
          embeddedImg = await pdfDoc.embedPng(imgBytes);
        } else {
          console.error(`DEBUG: Tipo no soportado para ${i + 1}: ${file.type}`);
          throw new Error(`Tipo de imagen no soportado: ${file.type}`);
        }

        if (!embeddedImg) {
          console.error(`DEBUG: EmbeddedImg undefined para ${i + 1}`);
          throw new Error('No se pudo embedar la imagen');
        }
        console.log(`DEBUG: Embedded OK para ${i + 1}`);

        // Página A4
        const page = pdfDoc.addPage([612, 792]);
        const scale = Math.min(612 / img.width, 792 / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (612 - scaledWidth) / 2;
        const y = (792 - scaledHeight) / 2;

        page.drawImage(embeddedImg, { x, y, width: scaledWidth, height: scaledHeight });
        console.log(`DEBUG: Página agregada para ${i + 1}`);
      }

      const pdfBytes = await pdfDoc.save();
      console.log('DEBUG: PDF guardado:', pdfBytes.length, 'bytes');
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'imgs-to-pdf.pdf';
      a.click();
      URL.revokeObjectURL(url);
      incrementCounter();
      console.log('DEBUG: Download completado');
    } catch (err) {
      console.error('DEBUG ERROR COMPLETO:', err);  // Log full error
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl mb-4">IMG a PDF</h2>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          const newFiles = Array.from(e.target.files);
          console.log('DEBUG: Files seleccionados:', newFiles.map(f => ({ name: f.name, type: f.type })));
          setFiles(newFiles);
        }}
        className="mb-4 p-2 border rounded w-full"
      />
      <button
        onClick={handleConvert}
        disabled={files.length === 0 || loading}
        className="bg-indigo-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Convirtiendo...' : `Convertir ${files.length} Imgs a PDF`}
      </button>
      {files.length > 0 && (
        <p className="mt-2 text-sm text-gray-600">
          Archivos: {files.map(f => f.name).join(', ')}
        </p>
      )}
    </div>
  );
};

export default ImgToPdfTool;