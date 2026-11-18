'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FaCheckCircle, FaTrash, FaChevronUp, FaChevronDown, FaRegFileAlt } from 'react-icons/fa';
import { FaArrowRight } from 'react-icons/fa6';
import { getSelectedServices, removeServiceSelection, clearSelectedServices } from '@/lib/servicesStore';

interface FloatingQuoteBarProps {
  onNavigate: (page: string) => void;
}

export default function FloatingQuoteBar({ onNavigate }: FloatingQuoteBarProps) {
  const pathname = usePathname();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  const isContactPage = pathname === '/contact';

  const updateServicesList = () => {
    const list = getSelectedServices();
    setSelectedServices(list);
    
    // Trigger bounce animation when items change
    if (list.length > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  };

  useEffect(() => {
    // Initial fetch
    updateServicesList();

    // Listen to changes
    const handleServiceChange = () => {
      updateServicesList();
    };

    window.addEventListener('sparktree_services_changed', handleServiceChange);
    return () => {
      window.removeEventListener('sparktree_services_changed', handleServiceChange);
    };
  }, []);

  // Hide on contact page or if no services are selected
  if (isContactPage || selectedServices.length === 0) {
    return null;
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearSelectedServices();
    setIsOpen(false);
  };

  const handleRemoveItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    removeServiceSelection(item);
    if (selectedServices.length <= 1) {
      setIsOpen(false);
    }
  };

  const handleCotizar = () => {
    setIsOpen(false);
    onNavigate('contact');
  };

  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-auto max-w-lg transition-all duration-500 transform ${
        animate ? 'scale-105' : 'scale-100'
      }`}
    >
      {/* Expanded Drawer / Service List Details */}
      {isOpen && (
        <div className="mb-3 bg-gray-950/95 backdrop-blur-xl border border-gray-800 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-white overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-3">
            <h4 className="font-bold text-sm tracking-wider text-gray-400 uppercase flex items-center gap-2">
              <FaRegFileAlt className="text-[#41f0a5]" />
              Servicios Seleccionados
            </h4>
            <button 
              onClick={handleClear}
              className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors flex items-center gap-1 py-1 px-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20"
            >
              <FaTrash size={10} />
              Limpiar todo
            </button>
          </div>
          
          <ul className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {selectedServices.map((service, idx) => (
              <li 
                key={idx}
                className="flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-xl p-3 border border-white/5 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <FaCheckCircle className="text-[#41f0a5] shrink-0" size={14} />
                  <span className="font-medium text-sm text-gray-200">{service}</span>
                </div>
                <button
                  onClick={(e) => handleRemoveItem(e, service)}
                  className="text-gray-500 hover:text-red-400 p-1 rounded-md hover:bg-white/5 transition-all"
                  title="Eliminar"
                >
                  <FaTrash size={11} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Floating Glassmorphic Bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-950/90 backdrop-blur-xl border border-white/10 rounded-full px-4 sm:px-6 py-3.5 flex items-center justify-between gap-6 shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:border-white/20 transition-all cursor-pointer group"
      >
        {/* Count Badge and Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#3750f0] to-[#41f0a5] text-white flex items-center justify-center font-extrabold text-sm shadow-md animate-pulse">
            {selectedServices.length}
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider leading-none">Mi Cotización</p>
            <p className="text-xs sm:text-sm text-white font-bold leading-normal mt-0.5">
              {selectedServices.length === 1 
                ? '1 servicio seleccionado' 
                : `${selectedServices.length} servicios seleccionados`}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Collapse/Expand Toggle Indicator */}
          <button 
            className="p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors hidden sm:block"
            title={isOpen ? "Ocultar detalles" : "Ver detalles"}
          >
            {isOpen ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
          </button>

          {/* Proceed to Quote button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCotizar();
            }}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#3750f0] to-[#41f0a5] hover:from-[#415eff] hover:to-[#52ffb6] text-white font-black rounded-full shadow-lg transition-all duration-300 hover:scale-105 text-xs sm:text-sm tracking-wide"
          >
            Cotizar ahora
            <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
