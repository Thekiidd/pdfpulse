import React from 'react';
// import Header from '../components/layout/Header'; // Mocked below
// import Footer from '../components/layout/Footer'; // Mocked below
// import Background from '../components/layout/Background'; // Mocked below

// --- INICIO DE MOCKS PARA RESOLVER ERRORES DE IMPORTACIÓN ---
const Header = () => <header className="p-4 bg-black/50 text-white text-center">Mock Header</header>;
const Footer = ({ count }) => <footer className="p-4 bg-black/50 text-gray-500 text-center">Mock Footer</footer>;
const Background = () => <div className="fixed inset-0 bg-gray-900 -z-10"></div>;
// --- FIN DE MOCKS ---


export default function PrivacyPolicy() {
  const count = 0;

  return (
    <>
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header onBack={null} />
        
        <main className="flex-grow max-w-4xl mx-auto px-4 py-24 text-white">
          <div 
            // ELIMINADO: rounded-3xl
            className="bg-white/5 backdrop-blur-xl p-8 md:p-12 border border-neon/30 shadow-neon-lg"
          >
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-neon text-glow">
              Política de Privacidad
            </h1>
            
            <p className="text-lg text-gray-200 mb-6">
              Última actualización: 4 de Noviembre, 2025
            </p>

            <div className="prose prose-lg prose-invert max-w-none text-gray-300 space-y-4 
                            prose-headings:text-white prose-a:text-neon prose-strong:text-neon">
              <p>
                En PDFPulse ("nosotros", "nuestro"), respetamos tu privacidad. Esta Política de Privacidad explica cómo manejamos tu información cuando usas nuestro sitio web pdfpulse.online (el "Servicio).
              </p>

              <h2 className="text-2xl font-bold text-gray-100 pt-4">Información que Recopilamos</h2>
              <p>
                Para usuarios anónimos, no recopilamos información de identificación personal (PII).
              </p>
              <p>
                Para usuarios que crean una cuenta, recopilamos la información necesaria para crear y mantener dicha cuenta, como su dirección de correo electrónico, nombre para mostrar y (si se proporciona) foto de perfil.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-100 pt-4">Manejo de Archivos</h2>
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

              <h2 className="text-2xl font-bold text-gray-100 pt-4">Cookies y Anuncios</h2>
              <p>
                Podemos usar cookies para el funcionamiento básico del sitio (como mantener tu sesión iniciada) y para análisis anónimo (como Vercel Analytics o Plausible) 
                para entender cómo se usa nuestro sitio y mejorarlo.
              </p>
              <p>
                Usamos Google AdSense para mostrar anuncios. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores a este y otros sitios en Internet. 
                Puedes optar por no usar la cookie de DART visitando la 
                <a href="https://adssettings.google.com/authenticated" target="_blank" rel="noopener noreferrer" className="hover:underline">Configuración de anuncios de Google</a>.
              </p>

              <h2 className="text-2xl font-bold text-gray-100 pt-4">Enlaces a Otros Sitios</h2>
              <p>
                Nuestro Servicio puede contener enlaces a otros sitios que no son operados por nosotros (como las referencias en nuestro blog). 
                Si haces clic en un enlace de un tercero, serás dirigido al sitio de ese tercero. 
                Te recomendamos encarecidamente que revises la Política de Privacidad de cada sitio que visites.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-100 pt-4">Cambios a esta Política</h2>
              <p>
                Podemos actualizar nuestra Política de Privacidad de vez en cuando. Te notificaremos 
                publicando la nueva política en esta página.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-100 pt-4">Contáctanos</h2>
              <p>
                Si tienes alguna pregunta sobre esta Política de Privacidad, puedes 
                contactarnos en: <a href="mailto:contacto@pdfpulse.online" className="hover:underline">contacto@pdfpulse.online</a>
              </p>
            </div>

          </div>
        </main>
        
        <Footer  count={count} />
      </div>
    </>
  );
}