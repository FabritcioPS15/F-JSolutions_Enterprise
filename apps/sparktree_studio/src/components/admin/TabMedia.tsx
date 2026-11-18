import React from "react";
import { Project } from "@/data/projects";
import {
  Upload,
  Loader2,
  Image as ImageIcon,
  Video,
  X,
  CheckCircle2,
  Eye as EyeIcon,
  Globe,
  Tag,
  Monitor
} from "lucide-react";

interface TabMediaProps {
  formData: Partial<Project>;
  setFormData: (data: any) => void;
  isUploading: boolean;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => void;
  handleArrayChange: (field: keyof Project, index: number, value: string) => void;
  addArrayItem: (field: keyof Project) => void;
  removeArrayItem: (field: keyof Project, index: number) => void;
  handleMediaChange: (field: "resultImages" | "additionalImages", index: number, value: string, property: "url" | "category" | "type") => void;
  expandedPreviews: Set<string>;
  setExpandedPreviews: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export const TabMedia: React.FC<TabMediaProps> = ({
  formData,
  setFormData,
  isUploading,
  handleImageUpload,
  handleArrayChange,
  addArrayItem,
  removeArrayItem,
  handleMediaChange,
  expandedPreviews,
  setExpandedPreviews,
}) => {
  const togglePreview = (id: string) => {
    setExpandedPreviews((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderMediaItem = (
    field: "resultImages" | "additionalImages",
    item: any,
    idx: number,
    colorClass: string
  ) => {
    const val = typeof item === "string" ? item : item?.url || "";
    const category = typeof item === "string" ? "" : item?.category || "";
    const type = typeof item === "string" ? "image" : item?.type || "image";
    const previewId = `${field}-${idx}`;

    return (
      <div
        key={idx}
        className={`group bg-white p-6 rounded-[2.5rem] border border-gray-100 space-y-4 shadow-sm hover:shadow-xl hover:border-${colorClass}-100 transition-all duration-500 relative`}
      >
        <button
          onClick={() => removeArrayItem(field, idx)}
          className="absolute -top-2 -right-2 bg-white text-red-400 p-2 shadow-lg border border-red-50 rounded-full hover:bg-red-500 hover:text-white transition-all scale-0 group-hover:scale-100 z-10"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shrink-0 shadow-inner">
            <button
              onClick={() => handleMediaChange(field, idx, "image", "type")}
              className={`p-2.5 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter ${type === "image"
                  ? "bg-white text-indigo-600 shadow-md"
                  : "text-gray-400 hover:text-gray-600"
                }`}
              title="Imagen"
            >
              <ImageIcon size={14} />
              {type === "image" && <span>Imagen</span>}
            </button>
            <button
              onClick={() => handleMediaChange(field, idx, "video", "type")}
              className={`p-2.5 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter ${type === "video"
                  ? "bg-white text-amber-500 shadow-md"
                  : "text-gray-400 hover:text-gray-600"
                }`}
              title="Video"
            >
              <Video size={14} />
              {type === "video" && <span>Video</span>}
            </button>
            <button
              onClick={() => handleMediaChange(field, idx, "web", "type")}
              className={`p-2.5 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter ${type === "web"
                  ? "bg-white text-emerald-500 shadow-md"
                  : "text-gray-400 hover:text-gray-600"
                }`}
              title="Sitio Web"
            >
              <Globe size={14} />
              {type === "web" && <span>Web</span>}
            </button>
          </div>

          <div className="flex-1 w-full relative group/input">
            <input
              placeholder="URL, link de YouTube, Drive..."
              value={val}
              onChange={(e) =>
                handleMediaChange(field, idx, e.target.value, "url")
              }
              className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] text-sm focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-200 transition-all outline-none"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {val && (
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center opacity-0 group-focus-within/input:opacity-100 transition-opacity">
                  <CheckCircle2 size={14} />
                </div>
              )}
              <button
                onClick={() => togglePreview(previewId)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Ver vista previa"
              >
                <EyeIcon size={14} className="text-gray-600" />
              </button>
              <label className="w-8 h-8 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors">
                <Upload size={14} />
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) =>
                    handleImageUpload(e, (url) =>
                      handleMediaChange(field, idx, url, "url")
                    )
                  }
                />
              </label>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div
            className={`flex items-center gap-3 bg-gray-50/30 px-5 py-3 rounded-2xl border border-gray-100/50 group-hover:border-${colorClass}-50 group-hover:bg-white transition-all`}
          >
            <Tag
              size={12}
              className={`text-gray-400 group-hover:text-${colorClass}-400 transition-colors`}
            />
            <input
              placeholder="Categoría del medio (ej: Diseño UI, Video Drone...)"
              value={category}
              onChange={(e) =>
                handleMediaChange(field, idx, e.target.value, "category")
              }
              className="flex-1 bg-transparent border-none rounded-xl text-xs font-bold text-gray-600 outline-none placeholder:font-normal"
            />
          </div>

          {val && (
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest bg-gray-50/20 px-4 rounded-xl truncate">
              <Monitor size={10} />
              Preview URL Detectado
            </div>
          )}
        </div>

        {/* Vista Previa Desplegable */}
        {val && expandedPreviews.has(previewId) && (
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mt-4 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                Vista Previa
              </span>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-lg ${type === "image"
                    ? "bg-indigo-100 text-indigo-600"
                    : type === "video"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
              >
                {type === "image" ? "IMAGEN" : type === "video" ? "VIDEO" : "WEB"}
              </span>
            </div>

            <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
              {type === "image" && (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <img
                    src={val}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-image.png";
                    }}
                  />
                </div>
              )}

              {type === "video" && (
                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                  {val.includes("youtube.com") || val.includes("youtu.be") ? (
                    <iframe
                      src={val.replace("watch?v=", "embed/").split("&")[0]}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : (
                    <div className="text-center text-white">
                      <Video size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">Video URL: {val}</p>
                    </div>
                  )}
                </div>
              )}

              {type === "web" && (
                <div className="aspect-video bg-gradient-to-br from-indigo-50 to-emerald-50 flex items-center justify-center text-center p-6">
                  <div>
                    <Globe size={48} className="mx-auto mb-2 text-emerald-500" />
                    <p className="text-sm text-gray-600 font-medium truncate max-w-xs">
                      {val}
                    </p>
                    <a
                      href={val}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-4 text-xs bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-100 font-bold"
                    >
                      Abrir Sitio Web
                      <Globe size={10} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in-scale">
      {/* Miniatura del Portafolio */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Imagen de Tarjeta (Miniatura del Portafolio)
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={formData.cardImage || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                cardImage: e.target.value,
              })
            }
            className="flex-1 px-5 py-3 bg-gradient-to-br from-gray-50 to-indigo-50/30 border-2 border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
            placeholder="URL de la imagen para la miniatura..."
          />
          <label
            className={`flex items-center gap-2 px-6 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-600 font-bold rounded-2xl cursor-pointer hover:from-indigo-100 hover:to-indigo-200 transition-all ${isUploading ? "opacity-50 pointer-events-none" : ""
              }`}
          >
            {isUploading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Upload size={16} />
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleImageUpload(e, (url) =>
                  setFormData({ ...formData, cardImage: url })
                )
              }
            />
          </label>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 italic">
          Se recomienda una imagen de 800x600px aproximadamente.
        </p>
      </div>

      {/* Hero Principal */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Media Principal (Hero - Imagen o Video)
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={formData.heroImage || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                heroImage: e.target.value,
              })
            }
            className="flex-1 px-5 py-3 bg-gradient-to-br from-gray-50 to-purple-50/30 border-2 border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-purple-100 focus:border-purple-300 transition-all"
            placeholder="URL de imagen, video o link de YouTube..."
          />
          <label
            className={`flex items-center gap-2 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 ${isUploading ? "opacity-50 pointer-events-none" : ""
              }`}
          >
            {isUploading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Upload size={16} />
            )}
            <span className="hidden sm:inline">Subir Archivo</span>
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) =>
                handleImageUpload(e, (url) =>
                  setFormData({ ...formData, heroImage: url })
                )
              }
            />
          </label>
        </div>
      </div>

      {/* Hero Slider */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Imágenes para el Slider (Hero Carrusel)
        </label>
        <div className="grid gap-3 mb-6 bg-gradient-to-br from-emerald-50/20 to-teal-50/20 p-6 rounded-[2rem] border-2 border-emerald-100/50">
          {formData.heroImages?.map((val, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <input
                  placeholder="URL de imagen o link de Youtube..."
                  value={val}
                  onChange={(e) =>
                    handleArrayChange("heroImages", idx, e.target.value)
                  }
                  className="w-full px-5 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm pr-12 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 transition-all"
                />
                {(val.includes("youtube.com") ||
                  val.includes("youtu.be") ||
                  val.includes("vimeo.com") ||
                  val.includes("drive.google.com") ||
                  val.toLowerCase().endsWith(".mp4")) && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500">
                      <Video size={18} />
                    </div>
                  )}
              </div>
              <label className="flex items-center gap-2 px-3 py-3 bg-white text-indigo-600 font-bold rounded-2xl cursor-pointer hover:bg-indigo-50 border-2 border-gray-100 hover:border-indigo-200 transition-all">
                <Upload size={16} />
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) =>
                    handleImageUpload(e, (url) =>
                      handleArrayChange("heroImages", idx, url)
                    )
                  }
                />
              </label>
              <button
                onClick={() => removeArrayItem("heroImages", idx)}
                className="text-red-400 p-2 hover:bg-red-50 rounded-2xl transition hover:shadow-md"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem("heroImages")}
            className="flex items-center gap-2 text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 rounded-xl w-fit hover:scale-105 transition-all shadow-lg shadow-emerald-200"
          >
            <ImageIcon size={14} /> + Añadir Imagen al Slider
          </button>
        </div>
      </div>

      {/* Galería de Resultados */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <ImageIcon size={14} className="text-indigo-500" />
          Galería de Resultados (Universal)
        </label>
        <div className="grid gap-6">
          {formData.resultImages?.map((item, idx) =>
            renderMediaItem("resultImages", item, idx, "indigo")
          )}

          <button
            onClick={() => addArrayItem("resultImages")}
            className="group flex items-center justify-center gap-3 text-sm font-black text-indigo-600 bg-white border-2 border-dashed border-indigo-100 p-8 rounded-[2.5rem] hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-500 hover:shadow-lg"
          >
            <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImageIcon size={20} />
            </div>
            <span>Añadir nuevo elemento a la galería estratégica</span>
          </button>
        </div>
      </div>

      {/* Media Adicional */}
      <div className="pt-8 border-t-2 border-gray-100">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Monitor size={14} className="text-amber-500" />
          Media Adicional / Extras
        </label>
        <div className="grid gap-6">
          {formData.additionalImages?.map((item, idx) =>
            renderMediaItem("additionalImages", item, idx, "amber")
          )}

          <button
            onClick={() => addArrayItem("additionalImages")}
            className="group flex items-center justify-center gap-3 text-sm font-black text-amber-600 bg-white border-2 border-dashed border-amber-100 p-8 rounded-[2.5rem] hover:bg-amber-50 hover:border-amber-300 transition-all duration-500 hover:shadow-lg"
          >
            <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Video size={20} />
            </div>
            <span>Añadir multimedia de apoyo o secundaria</span>
          </button>
        </div>
      </div>
    </div>
  );
};
