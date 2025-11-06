import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Background from '../components/layout/Background';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Asumo que el Footer necesita esto
  const t = { contact_phone: '+54 11 1234-5678', contact_address: 'Buenos Aires, Argentina' }; // Placeholder de traducciones
  const count = 0;

  // NOTA: Esta función asume que tienes un backend (NestJS) listo para recibir el POST en /api/contact.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setStatus('Enviando...');

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || '';
      const FETCH_URL = `${API_BASE_URL}/api/contact`;
      
      const res = await fetch(FETCH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (err) {
        setStatus('Error del servidor. Intenta más tarde.');
        setLoading(false);
        return;
      }

      if (res.ok && data.success) {
        setStatus('¡Mensaje enviado! Te respondemos en menos de 24h');
        setFormData({ name: '', email: '', message: '' });
      } else {
        const errorMsg = data.error || (data.details ? data.details.split('\n')[0] : 'Error desconocido');
        setStatus(`Error: ${errorMsg}`);
      }
    } catch (err) {
      console.error('Error en fetch:', err); 
      setStatus('Sin conexión. Revisa tu internet o la consola.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header onBack={() => window.history.back()} />
        <main className="flex-grow max-w-4xl mx-auto px-4 py-16 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl p-8 border border-neon/30 shadow-neon-lg" // Sin rounded-3xl
          >
            <h1 className="text-4xl md:text-5xl font-black text-center text-neon text-glow mb-8">
              Contáctanos
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white/10 border border-neon/30 text-white placeholder-gray-400 focus:outline-none focus:border-neon disabled:opacity-70" // Sin rounded-xl
                />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white/10 border border-neon/30 text-white placeholder-gray-400 focus:outline-none focus:border-neon disabled:opacity-70" // Sin rounded-xl
                />
                <textarea
                  placeholder="Tu mensaje..."
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white/10 border border-neon/30 text-white placeholder-gray-400 focus:outline-none focus:border-neon disabled:opacity-70 resize-none" // Sin rounded-xl
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-neon py-3 text-lg font-bold disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    'Enviar Mensaje'
                  )}
                </button>

                {status && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center text-sm mt-4 font-medium p-3 border ${ // Sin rounded-lg
                      status.includes('enviado') ? 'text-green-400 bg-green-900/20 border-green-500/30' : 'text-red-400 bg-red-900/20 border-red-500/30'
                    }`}
                  >
                    {status}
                  </motion.p>
                )}
              </form>

              <div className="space-y-6 text-white">
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="w-6 h-6 text-neon" />
                  <p className="font-medium">contacto@pdfpulse.online</p>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="w-6 h-6 text-neon" />
                  <p>{t.contact_phone || '+54 11 1234-5678'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-6 h-6 text-neon" />
                  <p>{t.contact_address || 'Buenos Aires, Argentina'}</p>
                </div>

                <div className="mt-8 p-4 bg-neon/10 border border-neon/30"> {/* Sin rounded-xl */}
                  <p className="text-sm text-gray-300 leading-relaxed">
                    ¿Tienes una idea para una nueva herramienta? 
                    ¿Encontraste un error? 
                    <strong className="text-neon"> ¡Escríbenos!</strong> 
                    Respondemos en menos de 24h.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
        <Footer t={t} count={count} />
      </div>
    </>
  );
}