import React from 'react';
import { Link } from 'react-router-dom';
import { TicketIcon, LockClosedIcon } from '@heroicons/react/24/outline';

// --- INICIO DE MOCKS PARA RESOLVER ERRORES DE IMPORTACIÓN ---
const Header = () => <header className="p-4 bg-black/50 text-white text-center">Mock Header</header>;
const Footer = ({ count }) => <footer className="p-4 bg-black/50 text-gray-500 text-center">Mock Footer</footer>;
const Background = () => <div className="fixed inset-0 bg-gray-900 -z-10"></div>;
// --- FIN DE MOCKS ---

// Componente de la Tienda
export default function Store() {
  const count = 0;

  return (
    <>
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header onBack={null} />
        <main className="flex-grow max-w-5xl mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neon text-glow">
              Tienda de Tokens
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Recarga tu cuenta para seguir usando las herramientas avanzadas.
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 blur-md pointer-events-none select-none">
              <TokenPackage name="Paquete Básico" tokens={100} price="5" />
              <TokenPackage name="Paquete Pro" tokens={500} price="20" popular={true} />
              <TokenPackage nameV="Paquete Business" tokens={1000} price="35" />
            </div>

            <div 
              // ELIMINADO: rounded-3xl
              className="absolute inset-0 flex flex-col items-center justify-center 
                            bg-black/50 backdrop-blur-sm border border-neon/30 text-center p-8"
            >
              
              <LockClosedIcon className="w-16 h-16 text-neon mb-4 animate-pulse" />
              <h2 className="text-3xl font-bold text-white mb-2">
                ¡Tienda en Construcción!
              </h2>
              <p className="text-lg text-gray-300 mb-6 max-w-md">
                Estamos trabajando para traer los pagos seguros a PDFPulse. ¡Vuelve pronto!
              </p>
              <Link
                to="/dashboard"
                // ELIMINADO: rounded-lg
                className="btn-neon px-6 py-3 text-sm font-bold tracking-wider"
              >
                Volver al Dashboard
              </Link>
            </div>
            
          </div>
        </main>
        <Footer count={count} />
      </div>
    </>
  );
}

// --- Componente Falso para el fondo ---
function TokenPackage({ name, tokens, price, popular = false }) {
  return (
    <div 
      // ELIMINADO: rounded-3xl
      className={`p-8 border ${popular ? 'border-neon' : 'border-neon/30'} bg-white/5`}
    >
      {popular && <span 
        // ELIMINADO: rounded-full
        className="text-xs font-bold text-neon bg-neon/10 px-3 py-1"
      >POPULAR</span>}
      <h3 className="text-2xl font-bold text-white mt-4">{name}</h3>
      <div className="flex items-baseline gap-2 my-4">
        <span className="text-5xl font-black text-white">{tokens}</span>
        <span className="text-lg text-gray-300">Tokens</span>
      </div>
      <p className="text-4xl font-bold text-neon mb-6">${price} <span className="text-lg text-gray-400">USD</span></p>
      <button className="w-full btn-neon opacity-50">
        Comprar
      </button>
    </div>
  );
}