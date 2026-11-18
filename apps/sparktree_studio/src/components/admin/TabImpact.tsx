import React from "react";
import { Project } from "@/data/projects";
import { X } from "lucide-react";

interface TabImpactProps {
  formData: Partial<Project>;
  handleArrayChange: (field: keyof Project, index: number, value: string) => void;
  addArrayItem: (field: keyof Project) => void;
  removeArrayItem: (field: keyof Project, index: number) => void;
}

export const TabImpact: React.FC<TabImpactProps> = ({
  formData,
  handleArrayChange,
  addArrayItem,
  removeArrayItem,
}) => {
  return (
    <div className="space-y-8 animate-fade-in-scale">
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Resultados Obtenidos (Métricas)
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          {formData.results?.map((val, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                value={val}
                onChange={(e) =>
                  handleArrayChange("results", idx, e.target.value)
                }
                className="flex-1 px-5 py-3 bg-gradient-to-br from-gray-50 to-emerald-50/30 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 transition-all"
                placeholder="Ej: +45% Retención"
              />
              <button
                onClick={() => removeArrayItem("results", idx)}
                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors hover:shadow-md"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem("results")}
            className="col-span-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-emerald-400 hover:text-emerald-500 hover:bg-emerald-50/30 transition-all"
          >
            + Añadir Métrica de Éxito
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Tecnologías Usadas
          </label>
          <div className="space-y-2">
            {formData.technologies?.map((val, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={val}
                  onChange={(e) =>
                    handleArrayChange("technologies", idx, e.target.value)
                  }
                  className="flex-1 px-4 py-2 bg-gradient-to-br from-gray-50 to-indigo-50/30 border-2 border-gray-100 rounded-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
                  placeholder="Ej: React, Supabase..."
                />
                <button
                  onClick={() => removeArrayItem("technologies", idx)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors hover:shadow-md"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem("technologies")}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all"
            >
              + Añadir Tecnología
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Equipo del Proyecto
          </label>
          <div className="space-y-2">
            {formData.team?.map((val, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={val}
                  onChange={(e) =>
                    handleArrayChange("team", idx, e.target.value)
                  }
                  className="flex-1 px-4 py-2 bg-gradient-to-br from-gray-50 to-purple-50/30 border-2 border-gray-100 rounded-lg focus:ring-4 focus:ring-purple-100 focus:border-purple-300 transition-all"
                  placeholder="Nombre y Rol"
                />
                <button
                  onClick={() => removeArrayItem("team", idx)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors hover:shadow-md"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem("team")}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 rounded-lg transition-all"
            >
              + Añadir Miembro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
