import React from "react";
import { Project, ContentBlock } from "@/data/projects";
import {
  X,
  GripVertical,
  Type,
  AlignLeft,
  Image as ImageIcon,
  Video,
  Quote,
  List,
  ChevronUp,
  ChevronDown,
  Search,
  Tag,
  FileText,
} from "lucide-react";

interface TabContentProps {
  formData: Partial<Project>;
  setFormData: (data: any) => void;
}

const BLOCK_TYPES = [
  { type: "heading", label: "Encabezado", icon: Type, color: "indigo" },
  { type: "paragraph", label: "Párrafo", icon: AlignLeft, color: "gray" },
  { type: "image", label: "Imagen", icon: ImageIcon, color: "emerald" },
  { type: "video", label: "Video", icon: Video, color: "amber" },
  { type: "quote", label: "Cita", icon: Quote, color: "purple" },
  { type: "list", label: "Lista", icon: List, color: "rose" },
] as const;

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export const TabContent: React.FC<TabContentProps> = ({
  formData,
  setFormData,
}) => {
  const blocks: ContentBlock[] = formData.contentBlocks || [];

  const updateBlocks = (newBlocks: ContentBlock[]) => {
    setFormData({ ...formData, contentBlocks: newBlocks });
  };

  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type,
      content: "",
      level: type === "heading" ? 2 : undefined,
      items: type === "list" ? [""] : undefined,
    };
    updateBlocks([...blocks, newBlock]);
  };

  const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    updateBlocks(newBlocks);
  };

  const removeBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    updateBlocks(newBlocks);
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    updateBlocks(newBlocks);
  };

  const addListItem = (blockIndex: number) => {
    const block = blocks[blockIndex];
    const items = [...(block.items || []), ""];
    updateBlock(blockIndex, { items });
  };

  const updateListItem = (blockIndex: number, itemIndex: number, value: string) => {
    const block = blocks[blockIndex];
    const items = [...(block.items || [])];
    items[itemIndex] = value;
    updateBlock(blockIndex, { items });
  };

  const removeListItem = (blockIndex: number, itemIndex: number) => {
    const block = blocks[blockIndex];
    const items = (block.items || []).filter((_, i) => i !== itemIndex);
    updateBlock(blockIndex, { items });
  };

  const renderBlockEditor = (block: ContentBlock, index: number) => {
    const blockType = BLOCK_TYPES.find(b => b.type === block.type);
    const Icon = blockType?.icon || AlignLeft;

    return (
      <div
        key={block.id}
        className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
      >
        {/* Block Header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 bg-gray-50/50 rounded-t-2xl">
          <div className="text-gray-300 cursor-grab hover:text-gray-500 transition-colors">
            <GripVertical size={16} />
          </div>

          <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-${blockType?.color || 'gray'}-100 text-${blockType?.color || 'gray'}-600`}>
            <Icon size={14} />
          </div>

          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex-1">
            {blockType?.label || "Bloque"}
          </span>

          {/* Move & Delete Controls */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => moveBlock(index, -1)}
              disabled={index === 0}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              title="Mover arriba"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={() => moveBlock(index, 1)}
              disabled={index === blocks.length - 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              title="Mover abajo"
            >
              <ChevronDown size={14} />
            </button>
            <button
              onClick={() => removeBlock(index)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors ml-1"
              title="Eliminar bloque"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Block Content */}
        <div className="p-5">
          {/* HEADING */}
          {block.type === "heading" && (
            <div className="space-y-3">
              <div className="flex gap-2 mb-3">
                {([2, 3, 4] as const).map(level => (
                  <button
                    key={level}
                    onClick={() => updateBlock(index, { level })}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${block.level === level
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      }`}
                  >
                    H{level}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={block.content}
                onChange={(e) => updateBlock(index, { content: e.target.value })}
                className={`w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all outline-none ${block.level === 2 ? "text-2xl font-black" : block.level === 3 ? "text-xl font-bold" : "text-lg font-semibold"
                  }`}
                placeholder="Título de la sección..."
              />
            </div>
          )}

          {/* PARAGRAPH */}
          {block.type === "paragraph" && (
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(index, { content: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-300 transition-all h-32 leading-relaxed resize-y outline-none text-sm"
              placeholder="Escribe el contenido del párrafo..."
            />
          )}

          {/* IMAGE */}
          {block.type === "image" && (
            <div className="space-y-3">
              <input
                type="text"
                value={block.mediaUrl || ""}
                onChange={(e) => updateBlock(index, { mediaUrl: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 transition-all outline-none text-sm"
                placeholder="URL de la imagen..."
              />
              <input
                type="text"
                value={block.caption || ""}
                onChange={(e) => updateBlock(index, { caption: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-emerald-100 transition-all outline-none text-xs text-gray-500"
                placeholder="Pie de imagen (opcional)..."
              />
              {block.mediaUrl && (
                <div className="rounded-xl overflow-hidden border border-gray-100 max-h-48">
                  <img src={block.mediaUrl} alt={block.caption || "Preview"} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}

          {/* VIDEO */}
          {block.type === "video" && (
            <div className="space-y-3">
              <input
                type="text"
                value={block.mediaUrl || ""}
                onChange={(e) => updateBlock(index, { mediaUrl: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-300 transition-all outline-none text-sm"
                placeholder="URL del video (YouTube, Vimeo, Drive, .mp4)..."
              />
              <input
                type="text"
                value={block.caption || ""}
                onChange={(e) => updateBlock(index, { caption: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-amber-100 transition-all outline-none text-xs text-gray-500"
                placeholder="Descripción del video (opcional)..."
              />
            </div>
          )}

          {/* QUOTE */}
          {block.type === "quote" && (
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-400 rounded-full"></div>
              <textarea
                value={block.content}
                onChange={(e) => updateBlock(index, { content: e.target.value })}
                className="w-full px-6 py-3 bg-purple-50/30 border-2 border-purple-100 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-300 transition-all h-24 leading-relaxed resize-y outline-none text-sm italic ml-2"
                placeholder="Escribe una cita destacada..."
              />
            </div>
          )}

          {/* LIST */}
          {block.type === "list" && (
            <div className="space-y-2">
              {(block.items || []).map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-rose-400 rounded-full shrink-0"></div>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem(index, itemIdx, e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all outline-none"
                    placeholder="Elemento de la lista..."
                  />
                  <button
                    onClick={() => removeListItem(index, itemIdx)}
                    className="p-1 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addListItem(index)}
                className="text-[10px] font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg transition-all"
              >
                + Añadir Elemento
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in-scale">

      {/* === SEO Section === */}
      <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl p-6 border border-indigo-100/50">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Search size={16} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 tracking-tight">Configuración SEO</h3>
            <p className="text-[10px] text-gray-400 font-medium">Optimiza el posicionamiento en buscadores</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
              Slug (URL amigable)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono shrink-0">sparktree.pe/portfolio/</span>
              <input
                type="text"
                value={formData.slug || ""}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all outline-none font-mono"
                placeholder="mi-proyecto-web"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
              <FileText size={10} /> Meta Descripción
              <span className="text-gray-300 font-normal normal-case tracking-normal">
                ({(formData.seoDescription || "").length}/160 caracteres)
              </span>
            </label>
            <textarea
              value={formData.seoDescription || ""}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              maxLength={160}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all h-20 resize-none outline-none text-sm leading-relaxed"
              placeholder="Describe brevemente este proyecto para los resultados de Google..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
              <Tag size={10} /> Palabras Clave SEO
            </label>
            <input
              type="text"
              value={formData.seoKeywords || ""}
              onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all outline-none"
              placeholder="diseño web, branding, marketing digital, Lima..."
            />
          </div>
        </div>
      </div>

      {/* === Legacy Content Fields (Preserved) === */}
      <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5">Contenido Base del Proyecto</h3>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Descripción General (Intro)
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all h-28 leading-relaxed resize-none outline-none"
              placeholder="Escribe una breve introducción del proyecto..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              El Desafío (Problemática)
            </label>
            <textarea
              value={formData.challenge || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  challenge: e.target.value,
                })
              }
              className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-300 transition-all h-28 leading-relaxed resize-none outline-none"
              placeholder="¿Cuál era el problema principal a resolver?"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              La Solución (Implementación)
            </label>
            <textarea
              value={formData.solution || ""}
              onChange={(e) =>
                setFormData({ ...formData, solution: e.target.value })
              }
              className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 transition-all h-28 leading-relaxed resize-none outline-none"
              placeholder="¿Cómo abordaste el desafío y qué solución implementaste?"
            />
          </div>
        </div>
      </div>

      {/* === Rich Content Blocks === */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
              <FileText size={16} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 tracking-tight">Publicación / Artículo</h3>
              <p className="text-[10px] text-gray-400 font-medium">Bloques de contenido para la vista detallada</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-black uppercase tracking-widest">
            {blocks.length} bloques
          </span>
        </div>

        {/* Content Blocks */}
        <div className="space-y-4">
          {blocks.map((block, index) => renderBlockEditor(block, index))}
        </div>

        {/* Add Block Menu */}
        <div className="mt-6 p-5 bg-gray-50/70 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">Añadir Bloque de Contenido</p>
          <div className="flex flex-wrap justify-center gap-2">
            {BLOCK_TYPES.map(({ type, label, icon: BlockIcon, color }) => (
              <button
                key={type}
                onClick={() => addBlock(type as ContentBlock["type"])}
                className={`group flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-bold text-gray-500 hover:text-${color}-600 hover:border-${color}-200 hover:bg-${color}-50/30 hover:shadow-md transition-all duration-300`}
              >
                <div className={`w-6 h-6 rounded-lg bg-${color}-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <BlockIcon size={12} className={`text-${color}-500`} />
                </div>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
