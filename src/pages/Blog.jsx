import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Background from '../components/layout/Background';
import { translations } from '../utils/translations';
import { Link } from 'react-router-dom';

// Datos de ejemplo del blog. Más adelante, esto vendrá de un CMS o un archivo .md
const blogPosts = [
  {
    id: 1,
    slug: 'como-comprimir-pdf-sin-perder-calidad',
    title: 'Cómo Comprimir un PDF sin Perder Calidad (Guía 2025)',
    excerpt: 'Descubre los métodos para reducir el tamaño de tus archivos PDF hasta en un 80% manteniendo la legibilidad y la calidad de las imágenes...',
    category: 'Tutoriales',
    date: '3 de Noviembre, 2025',
  },
  {
    id: 2,
    slug: '5-razones-para-unir-tus-pdfs',
    title: '5 Razones por las que Deberías Unir tus PDFs',
    excerpt: 'Organizar tus documentos digitales puede ser caótico. Unir tus PDFs en un solo archivo maestro puede ahorrarte tiempo, espacio y estrés. Te explicamos por qué...',
    category: 'Productividad',
    date: '1 de Noviembre, 2025',
  },
  {
    id: 3,
    slug: 'convertir-jpg-a-pdf-seguro',
    title: '¿Es Seguro Convertir JPG a PDF Online? La Verdad',
    excerpt: 'Muchas herramientas online te piden subir tus fotos personales. ¿Es esto seguro? Analizamos los riesgos y te mostramos cómo hacerlo de forma segura...',
    category: 'Seguridad',
    date: '28 de Octubre, 2025',
  },
];

export default function Blog() {
  const t = translations['es'];
  const count = 0;

  return (
    <>
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header onBack={null} />
        
        <main className="flex-grow max-w-5xl mx-auto px-4 py-16 text-white">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neon text-glow">
              Blog de PDFPulse
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Consejos, tutoriales y noticias sobre productividad y manejo de documentos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article 
                key={post.id} 
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-neon/30 shadow-neon-lg overflow-hidden
                           flex flex-col transition-transform duration-300 hover:scale-105 group"
              >
                {/* Por ahora, los enlaces al post individual están comentados.
                  Crear rutas dinámicas (ej. /blog/:slug) será el siguiente paso
                  después de que AdSense te apruebe la página principal del blog.
                */}
                {/* <Link to={`/blog/${post.slug}`} className="block">
                  <img src={`https://placehold.co/600x400/1E1E1E/00F0FF?text=Blog`} alt={post.title} className="w-full h-48 object-cover" />
                </Link> */}
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-neon bg-neon/10 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-gray-100 group-hover:text-neon transition-colors">
                    {post.title}
                    {/* <Link to={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link> */}
                  </h2>
                  <p className="text-gray-300 mb-4 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-gray-400 text-sm">
                    <span>{post.date}</span>
                    {/* <Link to={`/blog/${post.slug}`} className="font-semibold text-neon hover:underline">
                      Leer más &rarr;
                    </Link> */}
                    <span className="font-semibold text-neon">
                      (Próximamente)
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-12">
             <p className="text-lg text-gray-300">
               ¡Estamos creando más contenido útil para ti! Vuelve pronto.
             </p>
          </div>

        </main>
        
        <Footer t={t} count={count} />
      </div>
    </>
  );
}