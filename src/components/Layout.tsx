import React from 'react';
import Button from './common/Button';
import { Analytics } from "@vercel/analytics/next"

const Layout = ({ tool, setTool }) => (
  <>
    <header className="p-4 text-center bg-white/10 backdrop-blur-sm rounded-b-lg">
      <h1 className="text-4xl font-bold">PDFPulse</h1>
      <p className="mt-2 opacity-90">Herramientas rápidas para PDFs</p>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Button onClick={() => setTool('merge')} className="tool-card">
        <h3 className="text-xl font-bold">Unir PDFs</h3>
        <p>Combina files en segundos</p>
      </Button>
      <Button onClick={() => setTool('compress')} className="tool-card">
        <h3 className="text-xl font-bold">Comprimir</h3>
        <p>Reduce size hasta 80%</p>
      </Button>
      <Button onClick={() => setTool('img-pdf')} className="tool-card">
        <h3 className="text-xl font-bold">IMG a PDF</h3>
        <p>Fotos a doc multi-página</p>
      </Button>
      <Button onClick={() => setTool('word-pdf')} className="tool-card">
        <h3 className="text-xl font-bold">Word a PDF</h3>
        <p>Docx a PDF editable</p>
      </Button>
    </div>
  </>
);

export default Layout;