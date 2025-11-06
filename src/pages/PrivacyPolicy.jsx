import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Background from '../components/layout/Background';
import { 
  ShieldCheckIcon, 
  UserCircleIcon, 
  ServerStackIcon, 
  VariableIcon,
  LinkIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

export default function PrivacyPolicy() {
  // Asumo que el Footer necesita esto
  const count = 0; 

  return (
    <>
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header onBack={null} />
        
        <main className="flex-grow max-w-5xl mx-auto px-4 py-24 text-white">
          <div 
            // SIN rounded-3xl
            className="bg-white/5 backdrop-blur-xl p-8 md:p-12 border border-neon/30 shadow-neon-lg"
          >
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neon text-glow text-center">
              Política de Privacidad
            </h1>
          	<p className="text-lg text-gray-300 mb-12 text-center">
              Última actualización: 4 de Noviembre, 2025
            </p>

            {/* --- Resumen de Compromiso --- */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Nuestro Compromiso Contigo</h2>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <CommitmentCard
                  icon={LockClosedIcon}
                  title="No Espiamos"
                  text="No leemos, vendemos ni compartimos tus archivos personales. Punto."
                />
                <CommitmentCard
                  icon={UserCircleIcon}
                  title="Tú Tienes el Control"
                  text="Tú decides qué subir y qué borrar. Tus archivos en el servidor se eliminan en 1 hora."
                />
                <CommitmentCard
                  icon={ShieldCheckIcon}
                  title="Solo lo Necesario"
                  text="Solo recopilamos los datos mínimos indispensables para que la app funcione (como tu email)."
                />
              </div>
            </div>

            {/* --- Secciones de la Política --- */}
            <div className="space-y-10">

              <PolicySection
                icon={UserCircleIcon}
                title="1. Información que Recopilamos"
                summary="Recopilamos cero datos de usuarios anónimos y solo lo básico (email, nombre) de usuarios registrados."
              >
                <div className="prose prose-lg prose-invert max-w-none text-gray-300 space-y-4 prose-a:text-neon prose-strong:text-neon">
                  <p>
                    Para usuarios anónimos, no recopilamos información de identificación personal (PII).
                  </p>
                  <p>
                    Para usuarios que crean una cuenta, recopilamos la información necesaria para crear y mantener dicha cuenta, como su dirección de correo electrónico, nombre para mostrar y (si se proporciona) foto de perfil.
                  </p>
                </div>
              </PolicySection>

              <PolicySection
                icon={ServerStackIcon}
                title="2. Manejo de Archivos"
                summary="Tus archivos se procesan en tu navegador (gratis) o se borran de nuestros servidores en 1 hora (tokens)."
              >
                <div className="prose prose-lg prose-invert max-w-none text-gray-300 space-y-4 prose-a:text-neon prose-strong:text-neon">
                  <p>
                    <strong>Herramientas Gratuitas (Lado del Cliente):</strong> La mayoría de nuestras herramientas gratuitas (ej. Rotar, Dividir) procesan tus archivos 
                    directamente en tu navegador. Tus archivos NO se suben a nuestros servidores.
                  </p>
                  <p>
                    <strong>Herramientas con Token (Lado del Servidor):</strong> Para herramientas avanzadas que requieren procesamiento en el servidor (como "Comprimir PDF" o "Word a PDF"), 
                    tus archivos se suben temporalmente a un servidor seguro (vía nuestro backend de NestJS), se procesan y se te entregan para la descarga. 
                    Estos archivos se eliminan automáticamente de nuestros servidores después de un corto período (ej. 1 hora). 
                    No los almacenamos ni los compartimos con terceros.
                  </p>
                </div>
              </PolicySection>

              <PolicySection
                icon={VariableIcon}
                title="3. Cookies y Anuncios"
                summary="Usamos cookies para que la sesión funcione y Google AdSense para mostrar anuncios."
              >
                <div className="prose prose-lg prose-invert max-w-none text-gray-300 space-y-4 prose-a:text-neon prose-strong:text-neon">
                  <p>
                    Podemos usar cookies para el funcionamiento básico del sitio (como mantener tu sesión iniciada) y para análisis anónimo (como Vercel Analytics o Plausible) 
                    para entender cómo se usa nuestro sitio y mejorarlo.
                  </p>
                  <p>
                    Usamos Google AdSense para mostrar anuncios. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores a este y otros sitios en Internet. 
                    Puedes optar por no usar la cookie de DART visitando la 
                    <a href="https://adssettings.google.com/authenticated" target="_blank" rel="noopener noreferrer" className="hover:underline">Configuración de anuncios de Google</a>.
                  </p>
                </div>
              </PolicySection>
              
              <PolicySection
                icon={LinkIcon}
                title="4. Enlaces a Otros Sitios"
                summary="No somos responsables por el contenido o la privacidad de los sitios externos que enlazamos."
              >
                <div className="prose prose-lg prose-invert max-w-none text-gray-300 space-y-4 prose-a:text-neon prose-strong:text-neon">
                  <p>
                    Nuestro Servicio puede contener enlaces a otros sitios que no son operados por nosotros (como las referencias en nuestro blog). 
                    Si haces clic en un enlace de un tercero, serás dirigido al sitio de ese tercero. 
                    Te recomendamos encarecidamente que revises la Política de Privacidad de cada sitio que visites.
                  </p>
                </div>
              </PolicySection>

              <PolicySection
                icon={ArrowPathIcon}
                title="5. Cambios a esta Política"
                summary="Si cambiamos esta política, te lo notificaremos publicando los cambios en esta misma página."
              >
                <div className="prose prose-lg prose-invert max-w-none text-gray-300 space-y-4 prose-a:text-neon prose-strong:text-neon">
                  <p>
                    Podemos actualizar nuestra Política de Privacidad de vez en cuando. Te notificaremos 
                    publicando la nueva política en esta página.
                  </p>
                </div>
              </PolicySection>

              <PolicySection
                icon={EnvelopeIcon}
                title="6. Contáctanos"
                summary="¿Dudas? Escríbenos a contacto@pdfpulse.online."
              >
                <div className="prose prose-lg prose-invert max-w-none text-gray-300 space-y-4 prose-a:text-neon prose-strong:text-neon">
                  <p>
                    Si tienes alguna pregunta sobre esta Política de Privacidad, puedes 
                    contactarnos en: <a href="mailto:contacto@pdfpulse.online" className="hover:underline">contacto@pdfpulse.online</a>
                  </p>
                </div>
              </PolicySection>

            </div>
          </div>
        </main>
        
        <Footer  count={count} />
      </div>
    </>
  );
}

// --- Sub-componente para Resumen de Compromiso ---
function CommitmentCard({ icon: Icon, title, text }) {
  return (
    // SIN rounded-lg
    <div className="bg-white/5 p-6 border border-neon/20"> 
      {/* SIN rounded-full */}
      <Icon className="w-10 h-10 text-neon mb-4 mx-auto" />
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-300">{text}</p>
    </div>
  );
}

// --- Sub-componente para Secciones de Política ---
function PolicySection({ icon: Icon, title, summary, children }) {
  return (
    <section>
      {/* El Resumen "Mágico" */}
      {/* SIN rounded-lg */}
      <div className="flex items-start gap-4 p-4 bg-black/30 border border-neon/20 mb-6">
        <Icon className="w-8 h-8 text-neon flex-shrink-0 mt-1" />
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
          <p className="text-md text-gray-300">{summary}</p>
        </div>
      </div>
      
      {/* El Contenido "Legalese" */}
      <div className="pl-12">
        {children}
      </div>
    </section>
  );
}