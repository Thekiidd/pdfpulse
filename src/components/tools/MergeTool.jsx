import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Button from '../common/Button';
import Loader from '../common/Loader';

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
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl mb-4 text-gray-800">Unir PDFs</h2>
      <input type="file" multiple accept=".pdf" onChange={(e) => setFiles(Array.from(e.target.files))} className="mb-4 p-2 border rounded w-full" />
      <Button onClick={handleMerge} disabled={files.length < 2 || loading} variant="primary">
        {loading ? <Loader /> : `Unir ${files.length} PDFs`}
      </Button>
    </div>
  );
};

export default MergeTool;