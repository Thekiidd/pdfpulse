import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Background from '../components/layout/Background';
import { blogPosts } from '../../blogData'; // <-- ¡LA RUTA CORRECTA!
import { ArrowLeftIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

export default function BlogPost() {
  const { slug } = useParams(); 
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.slug === slug);

  const count = 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    useEffect(() => {
      navigate('/blog');
    }, [navigate]);
    return null; 
  }

  // --- Estilos para los Tooltips (?) ---
  const tooltipStyles = `
    .tooltip-wrapper {
      position: relative;
      border-bottom: 2px dotted rgba(0, 240, 255, 0.6);
      cursor: help;
    }
    .tooltip-text {
      visibility: hidden;
      width: 250px;
      background-color: #1E1E1E;
      color: #fff;
      text-align: left;
      border-radius: 8px;
      padding: 10px;
      position: absolute;
      z-index: 10;
      bottom: 125%;
      left: 50%;
      margin-left: -125px; /* Mitad del width */
      opacity: 0;
      transition: opacity 0.3s, visibility 0.3s;
      border: 1px solid rgba(0, 240, 255, 0.3);
      font-size: 0.9rem;
      font-weight: 400;
      line-height: 1.5;
    }
    .tooltip-wrapper:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }
  `;

  return (
    <>
      <style>{tooltipStyles}</style>
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header onBack={null} />
        
        <main className="flex-grow max-w-4xl mx-auto px-4 py-24 text-white">
          
          <Link 
            to="/blog"
            className="flex items-center gap-2 text-neon font-semibold hover:underline mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Volver al Blog
          </Link>
          
          <span className="text-sm font-semibold text-neon bg-neon/10 px-3 py-1 rounded-full mb-4 inline-block">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neon text-glow">
            {post.title}
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Publicado por <span className="font-semibold text-gray-300">{post.author}</span> el {post.date}
          </p>

          <img 
            src={post.bannerImage} 
            alt={post.title} 
            className="w-full h-64 md:h-96 object-cover rounded-3xl border border-neon/30 mb-12"
            onError={(e) => e.target.src = 'https://placehold.co/1200x600/1E1E1E/00F0FF?text=Error+'}
          />

          {/* --- Contenido del Artículo (Renderizado desde HTML) --- */}
          <div 
            className="prose prose-lg prose-invert max-w-none 
                       prose-headings:text-white prose-a:text-neon prose-strong:text-neon
                       prose-p:text-gray-300 prose-ul:text-gray-300 prose-ol:text-gray-300
                       prose-li:marker:text-neon"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

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
        
        <Footer count={count} />
      </div>
    </>
  );
}