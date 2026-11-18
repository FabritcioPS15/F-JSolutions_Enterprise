import React from "react";
import { Project } from "@/data/projects";
import { Eye, EyeOff, Star, X } from "lucide-react";

interface TabGeneralProps {
  formData: Partial<Project>;
  setFormData: (data: any) => void;
  predefinedServices: Record<string, string[]>;
  handleArrayChange: (field: keyof Project, index: number, value: string) => void;
  addArrayItem: (field: keyof Project) => void;
  removeArrayItem: (field: keyof Project, index: number) => void;
  projectYear: number;
  setProjectYear: (year: number) => void;
  projectUrl: string;
  setProjectUrl: (url: string) => void;
  clientTestimonial: string;
  setClientTestimonial: (testimonial: string) => void;
  budgetRange: string;
  setBudgetRange: (range: string) => void;
}

export const TabGeneral: React.FC<TabGeneralProps> = ({
  formData,
  setFormData,
  predefinedServices,
  handleArrayChange,
  addArrayItem,
  removeArrayItem,
  projectYear,
  setProjectYear,
  projectUrl,
  setProjectUrl,
  clientTestimonial,
  setClientTestimonial,
  budgetRange,
  setBudgetRange,
}) => {
  return (
    <div className="grid sm:grid-cols-2 gap-4 lg:gap-6 animate-fade-in-scale">
      <div className="sm:col-span-2">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Título del Proyecto
        </label>
        <input
          type="text"
          value={formData.title || ""}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-5 py-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all text-lg font-semibold"
          placeholder="Nombre comercial del proyecto"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Cliente
        </label>
        <input
          type="text"
          value={formData.client || ""}
          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
          className="w-full px-5 py-3 bg-gradient-to-br from-gray-50 to-purple-50/30 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-300 transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Año del Proyecto
        </label>
        <input
          type="number"
          value={projectYear}
          onChange={(e) => setProjectYear(parseInt(e.target.value) || new Date().getFullYear())}
          className="w-full px-5 py-3 bg-gradient-to-br from-gray-50 to-amber-50/30 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-300 transition-all"
          placeholder="Ej: 2024"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Categoría Principal
        </label>
        <select
          value={formData.category || ""}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-5 py-3 bg-gradient-to-br from-gray-50 to-emerald-50/30 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled>
            Selecciona una categoría
          </option>
          <option value="Webs">Webs (Sitios Web, Landing Pages, E-commerce)</option>
          <option value="Diseño">Diseño (Branding, Identidad Corporativa)</option>
          <option value="Multimedia">Multimedia (Video, Fotografía)</option>
          <option value="Sistemas">Sistemas (Desarrollo a Medida, TI)</option>
          <option value="Marketing">Marketing (SEO, Redes Sociales)</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Duración
        </label>
        <input
          type="text"
          value={formData.duration || ""}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          className="w-full px-5 py-3 bg-gradient-to-br from-gray-50 to-blue-50/30 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all"
          placeholder="Ej: 3 meses"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Orden de Visualización
        </label>
        <input
          type="number"
          value={formData.orderRank || 0}
          onChange={(e) =>
            setFormData({
              ...formData,
              orderRank: parseInt(e.target.value) || 0,
            })
          }
          className="w-full px-5 py-3 bg-gradient-to-br from-gray-50 to-rose-50/30 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-rose-100 focus:border-rose-300 transition-all"
          placeholder="Ej: 1"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          URL del Proyecto
        </label>
        <input
          type="url"
          value={projectUrl}
          onChange={(e) => setProjectUrl(e.target.value)}
          className="w-full px-5 py-3 bg-gradient-to-br from-gray-50 to-cyan-50/30 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-300 transition-all"
          placeholder="https://ejemplo.com"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Rango de Presupuesto
        </label>
        <select
          value={budgetRange}
          onChange={(e) => setBudgetRange(e.target.value)}
          className="w-full px-5 py-3 bg-gradient-to-br from-gray-50 to-violet-50/30 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-violet-100 focus:border-violet-300 transition-all appearance-none cursor-pointer"
        >
          <option value="">Selecciona un rango</option>
          <option value="< $1,000">Menos de $1,000</option>
          <option value="$1,000 - $5,000">$1,000 - $5,000</option>
          <option value="$5,000 - $10,000">$5,000 - $10,000</option>
          <option value="$10,000 - $25,000">$10,000 - $25,000</option>
          <option value="$25,000 - $50,000">$25,000 - $50,000</option>
          <option value="> $50,000">Más de $50,000</option>
        </select>
      </div>

      <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
        <button
          onClick={() =>
            setFormData({
              ...formData,
              isVisible: !formData.isVisible,
            })
          }
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all flex-1 sm:flex-none justify-center ${
            formData.isVisible
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-105"
              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
          }`}
        >
          {formData.isVisible ? (
            <>
              <Eye size={18} /> <span className="hidden sm:inline">Proyecto Visible</span>
            </>
          ) : (
            <>
              <EyeOff size={18} /> <span className="hidden sm:inline">Proyecto Oculto</span>
            </>
          )}
        </button>

        <button
          onClick={() =>
            setFormData({
              ...formData,
              isFeatured: !formData.isFeatured,
            })
          }
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all flex-1 sm:flex-none justify-center ${
            formData.isFeatured
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200 hover:shadow-xl hover:scale-105"
              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
          }`}
        >
          <Star size={18} fill={formData.isFeatured ? "currentColor" : "none"} />
          {formData.isFeatured ? <span className="hidden sm:inline">Proyecto Destacado</span> : <span className="hidden sm:inline">Marcar como Destacado</span>}
        </button>
      </div>

      <div className="sm:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
            Servicios Prestados
          </label>
          <span className="text-[10px] bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            {formData.services?.length || 0} SELECCIONADOS
          </span>
        </div>

        <div className="mb-4">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-2">
                Servicios Generales:
              </p>
              <div className="flex flex-wrap gap-2">
                {predefinedServices["Generales"].map((service) => {
                  const isSelected = formData.services?.includes(service);
                  return (
                    <button
                      key={service}
                      onClick={() => {
                        const currentServices = formData.services || [];
                        if (isSelected) {
                          setFormData({
                            ...formData,
                            services: currentServices.filter((s) => s !== service),
                          });
                        } else {
                          setFormData({
                            ...formData,
                            services: [...currentServices, service],
                          });
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
                        isSelected
                          ? "bg-gradient-to-r from-gray-800 to-gray-900 text-white border-gray-800 shadow-md hover:shadow-lg hover:scale-105"
                          : "bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600 hover:shadow-sm"
                      }`}
                    >
                      {service}
                    </button>
                  );
                })}
              </div>
            </div>

            {formData.category && predefinedServices[formData.category] && (
              <div>
                <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mb-2">
                  Específicos para {formData.category}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {predefinedServices[formData.category].map((service) => {
                    const isSelected = formData.services?.includes(service);
                    return (
                      <button
                        key={service}
                        onClick={() => {
                          const currentServices = formData.services || [];
                          if (isSelected) {
                            setFormData({
                              ...formData,
                              services: currentServices.filter((s) => s !== service),
                            });
                          } else {
                            setFormData({
                              ...formData,
                              services: [...currentServices, service],
                            });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
                          isSelected
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-md shadow-indigo-100 hover:shadow-lg hover:scale-105"
                            : "bg-white text-gray-500 border-gray-100 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-sm"
                        }`}
                      >
                        {service}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-2xl border-2 border-gray-100/50">
          {formData.services?.map((val, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                value={val}
                onChange={(e) => handleArrayChange("services", idx, e.target.value)}
                className="flex-1 px-5 py-3 bg-white border-2 border-gray-100 rounded-xl text-sm font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all"
                placeholder="Nombre del servicio personalizado..."
              />
              <button
                onClick={() => removeArrayItem("services", idx)}
                className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors hover:shadow-md"
              >
                <X size={18} />
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem("services")}
            className="flex items-center gap-2 py-3 px-5 text-xs font-black text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all w-full border-2 border-dashed border-indigo-200 hover:border-indigo-300 hover:shadow-md"
          >
            + Añadir Servicio Personalizado
          </button>
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Testimonio del Cliente
        </label>
        <textarea
          value={clientTestimonial}
          onChange={(e) => setClientTestimonial(e.target.value)}
          className="w-full px-5 py-4 bg-gradient-to-br from-gray-50 to-emerald-50/30 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 transition-all h-24 resize-none"
          placeholder="&quot;El equipo de SparkTree superó todas nuestras expectativas...&quot;"
        />
      </div>
    </div>
  );
};
