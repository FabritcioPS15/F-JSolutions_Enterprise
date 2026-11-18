import React from "react";
import { Project } from "@/data/projects";
import { 
  FileText, 
  PencilLine, 
  X, 
  Star, 
  EyeOff 
} from "lucide-react";

interface ProjectListProps {
  projects: Project[];
  editingId: string | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  editingId,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
}) => {
  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="lg:col-span-4 h-[calc(100vh-200px)] sticky top-24 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">
          Inventario Estratégico
        </h2>
        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-black">
          {projects.length} TOTAL
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Buscar proyecto..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
        />
        <FileText
          size={16}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
        />
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={`group bg-white rounded-3xl p-5 border transition-all cursor-pointer relative overflow-hidden ${
              editingId === project.id
                ? "border-indigo-600 ring-4 ring-indigo-50 shadow-2xl scale-[1.02] z-10"
                : "border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-xl"
            } ${!project.isVisible ? "opacity-60 bg-gray-50/50" : ""}`}
            onClick={() => onEdit(project)}
          >
            {editingId === project.id && (
              <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-600 flex items-center justify-center text-white rounded-bl-3xl shadow-lg">
                <PencilLine size={18} />
              </div>
            )}

            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl flex-shrink-0 bg-gray-50 overflow-hidden relative border border-gray-100">
                {project.cardImage || project.heroImage ? (
                  <img
                    src={project.cardImage || project.heroImage}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-300 text-lg font-black">
                    {project.title.charAt(0)}
                  </div>
                )}
                {!project.isVisible && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                    <EyeOff size={16} className="text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <h4 className="font-bold text-gray-900 leading-tight truncate pr-4">
                    {project.title}
                  </h4>
                  {project.isFeatured && (
                    <Star
                      size={12}
                      className="text-amber-500 fill-amber-500 shrink-0"
                    />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                    {project.category}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase truncate max-w-[100px]">
                    {project.client}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">
                Rank #{project.orderRank || 0}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project.id);
                }}
                className="p-2 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-indigo-900 rounded-3xl text-white shadow-2xl shadow-indigo-200">
        <h4 className="font-bold text-lg mb-2">Consejo SEO</h4>
        <p className="text-indigo-100 text-xs leading-relaxed opacity-80 font-medium">
          Asegúrate de que el título sea descriptivo y las categorías sean
          precisas para mejorar el posicionamiento.
        </p>
      </div>
    </div>
  );
};
