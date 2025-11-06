import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Background from '../components/layout/Background';
import { 
  RocketLaunchIcon, 
  ShieldCheckIcon, 
  SparklesIcon, 
  CodeBracketIcon, 
  UserIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

// Este componente ya no necesita importaciones de translations porque usa texto fijo
// Asumo que tu Footer sí lo necesita, por eso mantenemos count.

export default function About() {
  const count = 0; 

  return (
    <>
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header onBack={null} />
        
        <main className="flex-grow max-w-5xl mx-auto px-4 py-24 text-white">
          
          {/* --- BLOQUE PRINCIPAL: MISIÓN Y VISIÓN --- */}
          <div className="bg-white/5 backdrop-blur-xl p-8 md:p-12 border border-neon/30 shadow-neon-lg mb-16">
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neon text-glow">
              Acerca de PDFPulse
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              PDFPulse nació de la frustración por las herramientas de pago lentas y complicadas. 
              Nuestra misión es clara: ofrecer un conjunto de utilidades rápidas, seguras y accesibles 
              para que el manejo de documentos sea una ventaja, no un obstáculo.
            </p>

            <div className="space-y-8">
              <MissionCard
                icon={RocketLaunchIcon}
                title="Visión Tecnológica"
                text="Democratizar la edición de documentos usando tecnología del lado del cliente (en tu navegador) para tareas simples, y un backend potente y seguro (con NestJS) para el procesamiento avanzado de tokens."
              />

              <MissionCard
                icon={GlobeAltIcon}
                title="Compromiso con el Usuario"
                text="Tu privacidad es primordial. Procesamos tus archivos con la máxima seguridad. Nos enfocamos en ofrecer una experiencia de usuario limpia, sin anuncios molestos en zonas clave y con una separación justa entre funciones gratuitas y de token."
              />
            </div>

          </div>

          {/* --- SECCIÓN DE VALORES (3 Columnas, más visual) --- */}
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white text-center">
            Nuestros Pilares
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <ValueCard
              icon={SparklesIcon}
              title="Simplicidad Extrema"
              description="Diseñado para un solo clic. Accede a la herramienta que necesitas sin pasar por menús complejos, registros obligatorios o configuraciones innecesarias."
            />
            <ValueCard
              icon={ShieldCheckIcon}
              title="Seguridad por Diseño"
              description="La mayoría de las funciones operan localmente en tu dispositivo. Los archivos enviados a nuestro servidor se eliminan automáticamente tras el procesamiento."
            />
            <ValueCard
              icon={CodeBracketIcon}
              title="Transparencia"
              description="Nuestra arquitectura es clara: herramientas gratis (lado del cliente), herramientas de token (lado del servidor con backend NestJS). Siempre sabrás cómo se procesan tus datos."
            />
          </div>
        </main>
        
        <Footer count={count} />
      </div>
    </>
  );
}

// --- Sub-componente para Misión (Nuevo) ---
function MissionCard({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-black/30 border border-neon/20">
      <Icon className="w-8 h-8 text-neon flex-shrink-0 mt-1" />
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300 text-md">{text}</p>
      </div>
    </div>
  );
}

// --- Sub-componente para Tarjeta de Valor (Recto) ---
function ValueCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 border border-neon/30 shadow-neon-lg text-center">
      <div className="w-16 h-16 bg-neon/10 border-2 border-neon/30 text-neon flex items-center justify-center mx-auto mb-6">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

// --- Sub-componente para Tarjeta de Equipo (Recto) ---
function TeamCard({ icon: Icon, name, title, email }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 border border-neon/20 text-center">
      <div className="w-24 h-24 bg-black/30 text-gray-500 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-12 h-12" />
      </div>
      <h4 className="text-lg font-bold text-white">{name}</h4>
      <p className="text-sm text-neon">{title}</p>
      <a href={`mailto:${email}`} className="text-xs text-gray-400 hover:text-white mt-1 block">
        {email}
      </a>
    </div>
  );
}