import { useState } from 'react';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Navbar = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value.toLowerCase());
  };

  return (
    <nav className="bg-pulse-dark shadow-xl fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-black text-white">
              PDF<span className="text-pulse-red">Pulse</span>
            </h1>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Buscar herramienta..."
                className="pl-10 pr-4 py-2 w-80 bg-pulse-card border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pulse-red focus:border-transparent transition"
              />
            </div>
            <a href="#tools" className="text-gray-300 hover:text-white transition">Herramientas</a>
            <a href="#about" className="text-gray-300 hover:text-white transition">Sobre</a>
          </div>

          {/* Mobile */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
            {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-pulse-dark border-t border-gray-800">
            <div className="px-4 py-3">
              <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 bg-pulse-card border border-gray-700 rounded-full text-white"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;