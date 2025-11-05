import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Background from '../components/layout/Background';
import { blogPosts } from '../../blogData'; // <-- ¡LA RUTA CORRECTA!
import { PencilSquareIcon } from '@heroicons/react/24/outline'; 

export default function Blog() {
  const count = 0;
  // Saca el post más nuevo para destacarlo
  const [featuredPost, ...otherPosts] = blogPosts;

  return (
    <>
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header onBack={null} />
        
        <main className="flex-grow max-w-6xl mx-auto px-4 py-24 text-white">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neon text-glow">
              Blog de PDFPulse
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Consejos, tutoriales y noticias sobre productividad y manejo de documentos.
            </p>
          </div>

          {/* --- Artículo Destacado --- */}
          {featuredPost && (
            <Link 
              to={`/blog/${featuredPost.slug}`}
              className="block group mb-16"
            >
              <article className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/5 backdrop-blur-xl rounded-3xl border border-neon/30 shadow-neon-lg overflow-hidden transition-all duration-300 hover:border-neon/60">
                <div className="order-2 md:order-1 p-8 md:p-12">
                  <span className="text-sm font-semibold text-neon bg-neon/10 px-3 py-1 rounded-full mb-4 inline-block">
                    {featuredPost.category}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white group-hover:text-neon transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-lg text-gray-300 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <span className="font-semibold text-neon group-hover:underline">
                    Leer artículo completo &rarr;
                  </span>
                </div>
                <div className="order-1 md:order-2 h-64 md:h-full min-h-[300px]">
                  <img 
                    src={featuredPost.bannerImage} 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = 'https://placehold.co/1200x600/1E1E1E/00F0FF?text=Error+'}
                  />
                </div>
              </article>
            </Link>
          )}

          {/* --- Grid de Artículos Anteriores --- */}
          <h2 className="text-3xl font-bold text-white mb-8">Más Artículos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <Link 
                key={post.id} 
                to={`/blog/${post.slug}`}
                className="block group"
              >
                <article 
                  className="bg-white/5 backdrop-blur-xl rounded-3xl border border-neon/30 shadow-neon-lg overflow-hidden
                            flex flex-col transition-all duration-300 hover:border-neon/60 h-full"
                >
                  <img 
                    src={post.bannerImage} 
                    alt={post.title} 
                    className="w-full h-48 object-cover"
                    onError={(e) => e.target.src = 'https://placehold.co/600x400/1E1E1E/00F0FF?text=Error+'}
                  />
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-sm font-semibold text-neon bg-neon/10 px-3 py-1 rounded-full mb-3 inline-block self-start">
                      {post.category}
                    </span>
                    <h2 className="text-2xl font-bold mb-3 text-gray-100 group-hover:text-neon transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-300 mb-4 flex-grow">
                      {post.excerpt}
                    </p>
                    <span className="font-semibold text-neon group-hover:underline">
                      Leer más &rarr;
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* --- CTA PARA AUTORES INVITADOS (EMAIL CORREGIDO) --- */}
          <div className="mt-16 p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-neon/30 flex flex-col md:flex-row items-center gap-6">
            <PencilSquareIcon className="w-16 h-16 text-neon flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">¿Quieres escribir para nosotros?</h3>
              <p className="text-gray-300 mb-4">
                Si eres un experto en productividad, tecnología o diseño y quieres compartir tus conocimientos, 
                ¡nos encantaría saber de ti!
              </p>
              <a 
                href="mailto:contacto@pdfpulse.online?subject=Quiero ser autor invitado en PDFPulse"
                className="btn-neon px-6 py-3 text-sm font-bold"
              >
                Envía tu Propuesta
              </a>
            </div>
          </div>

        </main>
        
        <Footer  count={count} />
      </div>
    </>
  );
}