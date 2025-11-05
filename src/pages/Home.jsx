import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCounter } from '../hooks/useCounter';
import Background from '../components/layout/Background';
import Header from '../components/layout/Header';
import Hero from '../components/layout/Hero';
import ToolsGrid from '../components/layout/ToolsGrid'; 
import WhyChoose from '../components/layout/WhyChoose';
import CTA from '../components/layout/CTA';
import Footer from '../components/layout/Footer';

// === TODAS LAS HERRAMIENTAS ===
import MergeTool from '../components/tools/MergeTool';
import CompressTool from '../components/tools/CompressTool';
import ImgToPdfTool from '../components/tools/ImgToPdfTool';
import WordToPdfTool from '../components/tools/WordToPdfTool';
import SplitTool from '../components/tools/SplitTool';
import RotateTool from '../components/tools/RotateTool';
import PageNumbersTool from '../components/tools/PageNumbersTool';
import PdfToImgTool from '../components/tools/PdfToImgTool';
import EditPdfTool from '../components/tools/EditPdfTool';
import ExtractPagesTool from '../components/tools/ExtractPagesTool';
import ResizeImageTool from '../components/tools/ResizeImageTool';
import CropImageTool from '../components/tools/CropImageTool';
import CompressImageTool from '../components/tools/CompressImageTool';

import { 
  DocumentIcon, ScissorsIcon, PhotoIcon, DocumentTextIcon,
  DocumentDuplicateIcon, ArrowPathIcon, HashtagIcon,
  ArrowsPointingOutIcon, PencilIcon, DocumentMagnifyingGlassIcon,
  Square2StackIcon, ArrowsUpDownIcon, PhotoIcon as PhotoIcon2,
  LockOpenIcon, LockClosedIcon, ArrowDownTrayIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function Home() {
  const [lang] = useState('es');
  const { count, increment, isLimitReached } = useCounter();
  const [activeTool, setActiveTool] = useState(null);

  const { currentUser, userData, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const tools = [
    // === Herramientas GRATIS (en navegador) ===
    { id: 'merge', name: "Unir PDFs", desc: "Combina múltiples archivos", icon: DocumentDuplicateIcon, component: <MergeTool incrementCounter={increment} /> },
    { id: 'img-pdf', name: "IMG a PDF", desc: "Fotos a documento", icon: PhotoIcon, component: <ImgToPdfTool incrementCounter={increment} /> },
    { id: 'split', name: "Dividir PDF", desc: "Separa por páginas", icon: DocumentIcon, component: <SplitTool incrementCounter={increment} /> },
    { id: 'rotate', name: "Girar PDF", desc: "Rotar páginas", icon: ArrowPathIcon, component: <RotateTool incrementCounter={increment} /> },
    { id: 'page-numbers', name: "Números de página", desc: "Añade numeración", icon: HashtagIcon, component: <PageNumbersTool incrementCounter={increment} /> },
    { id: 'pdf-img', name: "PDF a IMG", desc: "Exporta páginas como JPG", icon: PhotoIcon2, component: <PdfToImgTool incrementCounter={increment} /> },
    { id: 'edit-pdf', name: "Editar PDF", desc: "Añade texto o imágenes", icon: PencilIcon, component: <EditPdfTool incrementCounter={increment} /> },
    { id: 'extract-pages', name: "Extraer páginas", desc: "Guarda rangos específicos", icon: DocumentMagnifyingGlassIcon, component: <ExtractPagesTool incrementCounter={increment} /> },
    { id: 'resize-image', name: "Redimensionar imagen", desc: "Cambia tamaño", icon: ArrowsPointingOutIcon, component: <ResizeImageTool incrementCounter={increment} /> },
    { id: 'crop-image', name: "Recortar imagen", desc: "Selecciona área", icon: Square2StackIcon, component: <CropImageTool incrementCounter={increment} /> },

    // === Herramientas con TOKEN (usan API) ===
    { id: 'compress', name: "Comprimir PDF", desc: "Reduce hasta 80% (API)", icon: ScissorsIcon, component: <CompressTool incrementCounter={increment} />, requiresToken: true },
    { id: 'word-pdf', name: "Word a PDF", desc: "Docx a PDF", icon: DocumentTextIcon, component: <WordToPdfTool incrementCounter={increment} />, requiresToken: true },
    { id: 'compress-image', name: "Comprimir imagen", desc: "Reduce peso (JPG/PNG)", icon: ArrowsUpDownIcon, component: <CompressImageTool incrementCounter={increment} />, requiresToken: true },

    // === Próximamente ===
    { id: 'unlock', name: "Desbloquear PDF", desc: "Quita contraseña", icon: LockOpenIcon, soon: true },
    { id: 'protect', name: "Proteger PDF", desc: "Añade contraseña", icon: LockClosedIcon, soon: true },
    { id: 'ocr', name: "OCR (Extraer texto)", desc: "De escaneados", icon: ArrowDownTrayIcon, soon: true },
  ];

  const openTool = (id) => {
    const tool = tools.find(t => t.id === id);

    if (tool.soon) {
      alert(`${tool.name} – ¡Próximamente!`);
      return;
    }

    if (!tool.requiresToken) {
      setActiveTool(id);
      return;
    }

    if (authLoading) {
      return; 
    }

    if (!currentUser) {
      navigate('/auth');
      return;
    }

    if (currentUser && !userData) {
      navigate('/crear-perfil');
      return;
    }

    if (userData && userData.tokens.remaining === 0) {
      alert("¡Ups! Se te acabaron tus tokens de prueba. Próximamente podrás comprar más.");
      return;
    }

    setActiveTool(id);
  };

  const closeTool = () => setActiveTool(null);

  return (
    <>
      <Background />
      <div className="relative z-10 min-h-screen">
        {activeTool ? (
          <ToolView
            tool={tools.find(t => t.id === activeTool)}
            onBack={closeTool}
            incrementCounter={increment}
            user={currentUser}
            userData={userData}
          />
        ) : (
          <>
            <Header onBack={null} />
            <Hero />
            <section className="py-20">
              <div className="max-w-7xl mx-auto px-4">
                <ToolsGrid 
                tools={tools} 
                onToolClick={openTool} 
                isLimitReached={isLimitReached} 
              />
              </div>
            </section>
            <WhyChoose />
            <CTA />
            <Footer count={count} />
          </>
        )}
      </div>
    </>
  );
}

// --- SUB-COMPONENTE: VISTA DE HERRAMIENTA ---
function ToolView({ tool, onBack, incrementCounter, user, userData }) {
  const ToolComponent = tool.component.type;
  // Clonamos el componente para inyectarle los props de usuario
  const toolWithUserProps = React.cloneElement(tool.component, {
    user: user,
    userData: userData
  });

  return (
    <>
      <Header onBack={onBack} />
      <main className="max-w-4xl mx-auto px-4 py-8 mt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          // ELIMINADO: rounded-3xl
          className="bg-white/5 backdrop-blur-xl p-8 border border-neon/30 shadow-neon-lg"
        >
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-neon text-glow">
                {tool.name}
              </h2>
            {tool.requiresToken ? (
              <span 
                // ELIMINADO: rounded-full
                className="flex-shrink-0 ml-4 flex items-center gap-1 bg-neon/10 text-neon text-xs font-bold px-3 py-1"
              >
                <TicketIcon className="w-4 h-4" />
                USA TOKEN
              </span>
            ) : (
              <span 
                // ELIMINADO: rounded-full
                className="flex-shrink-0 ml-4 bg-gray-500/20 text-gray-300 text-xs font-bold px-3 py-1"
              >
                GRATIS
              </span>
            )}
          </div>
          {toolWithUserProps}
      </motion.div>
    </main>
  </>
  );
}