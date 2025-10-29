// components/layout/Footer.jsx
export default function Footer({ count }) {
  return (
    <footer className="py-12 border-t border-neon/20 relative">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex justify-center items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-neon rounded animate-pulse"></div>
          <span className="text-lg font-bold text-neon">PDFPulse</span>
        </div>
        <p className="text-xs text-gray-500 mb-1">
          © 2025 PDFPulse.online • Hecho en México
        </p>
        <p className="text-xs text-neon-light animate-pulse">
          {count.toLocaleString()} PDFs procesados
        </p>
        <p className="text-xs text-gray-600 mt-3">
          Gratis ahora · Premium pronto
        </p>
      </div>
    </footer>
  );
}