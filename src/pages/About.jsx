import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Background from '../components/layout/Background';
import { SparklesIcon, UserGroupIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

export default function About() {
  const count = 0; 

  return (
    <>
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header onBack={null} />
        
        <main className="flex-grow max-w-4xl mx-auto px-4 py-16 text-white">
          <div className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-neon/30 shadow-neon-lg">
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-neon text-glow">
              Acerca de PDFPulse
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              PDFPulse nació de una idea simple: las herramientas para PDF y archivos no deberían ser complicadas ni costosas. 
              Nuestra misión es ofrecer un conjunto de utilidades rápidas, seguras y gratuitas que funcionen 100% en tu navegador.
            </p>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-100">
                  <RocketLaunchIcon className="w-7 h-7 mr-3 text-neon" />
                  Nuestra Misión
                </h2>
                <p className="text-gray-300">
                  Queremos democratizar la edición de documentos. Ya sea que necesites unir un trabajo para la universidad, 
                  comprimir un informe para enviarlo por correo o convertir tus fotos en un solo documento, 
                  PDFPulse está aquí para ayudarte sin necesidad de registros ni descargas.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-100">
                  <SparklesIcon className="w-7 h-7 mr-3 text-neon" />
                  ¿Por qué PDFPulse?
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li><strong>Gratis y Anónimo:</strong> No requerimos registro. Tu privacidad es primordial.</li>
                  <li><strong>Basado en Navegador:</strong> La mayoría de herramientas procesan tus archivos localmente.</li>
                  <li><strong>Rápido y Eficiente:</strong> Creado con tecnología moderna para ser increíblemente rápido.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-100">
                  <UserGroupIcon className="w-7 h-7 mr-3 text-neon" />
                  El Futuro
                </h2>
                <p className="text-gray-300">
                  Esto es solo el comienzo. Planeamos expandirnos a más herramientas de imagen, 
                  audio y todo tipo de archivos, siempre manteniendo la simplicidad y la seguridad como pilares.
                </p>
                <p className="mt-4">
                  ¿Tienes ideas o necesitas ayuda? 
                  <Link to="/contacto" className="text-neon font-bold hover:underline ml-1">
                    ¡Contáctanos!
                  </Link>
                </p>
              </div>
            </div>

          </div>
        </main>
        
        <Footer count={count} />
      </div>
    </>
  );
}