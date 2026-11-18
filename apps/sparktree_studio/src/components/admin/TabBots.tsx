import React from "react";
import { Project } from "@/data/projects";
import { X, Bot, Zap, MessageSquare, Brain, Clock, Target, Plus } from "lucide-react";

interface TabBotsProps {
  formData: Partial<Project>;
  setFormData: (data: any) => void;
  handleArrayChange: (field: keyof Project, index: number, value: string) => void;
  addArrayItem: (field: keyof Project) => void;
  removeArrayItem: (field: keyof Project, index: number) => void;
}

export const TabBots: React.FC<TabBotsProps> = ({
  formData,
  setFormData,
  handleArrayChange,
  addArrayItem,
  removeArrayItem,
}) => {
  const predefinedBotFeatures = [
    "Atención 24/7",
    "Calificación de Leads",
    "Respuestas Automáticas",
    "Integración WhatsApp",
    "Integración Messenger",
    "Integración Web Chat",
    "IA Conversacional",
    "Multiidioma",
    "Escalado a Humanos",
    "Analytics y Reportes",
    "CRM Integrado",
    "Personalización de Respuestas",
  ];

  const predefinedBotPlatforms = [
    "WhatsApp Business",
    "Facebook Messenger",
    "Instagram Direct",
    "Web Chat Widget",
    "Telegram",
    "SMS",
    "Email Automatizado",
    "Voice Assistant",
  ];

  return (
    <div className="space-y-8 animate-fade-in-scale">
      {/* Bot Configuration */}
      <div className="bg-gradient-to-br from-indigo-50/30 to-purple-50/30 p-6 rounded-[2rem] border-2 border-indigo-100/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">Configuración del Bot</h3>
            <p className="text-xs text-gray-500">Define las características principales del bot de IA</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Tipo de Bot
            </label>
            <select
              value={(formData as any).botType || ""}
              onChange={(e) => setFormData({ ...formData, botType: e.target.value })}
              className="w-full px-5 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all appearance-none cursor-pointer"
            >
              <option value="">Selecciona el tipo</option>
              <option value="customer-service">Atención al Cliente</option>
              <option value="lead-generation">Generación de Leads</option>
              <option value="sales-automation">Automatización de Ventas</option>
              <option value="support">Soporte Técnico</option>
              <option value="booking">Reservas y Citas</option>
              <option value="survey">Encuestas y Feedback</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Plataforma Principal
            </label>
            <select
              value={(formData as any).botPlatform || ""}
              onChange={(e) => setFormData({ ...formData, botPlatform: e.target.value })}
              className="w-full px-5 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-300 transition-all appearance-none cursor-pointer"
            >
              <option value="">Selecciona la plataforma</option>
              {predefinedBotPlatforms.map((platform) => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Nombre del Bot
            </label>
            <input
              type="text"
              value={(formData as any).botName || ""}
              onChange={(e) => setFormData({ ...formData, botName: e.target.value })}
              className="w-full px-5 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
              placeholder="Ej: SparkBot Assistant"
            />
          </div>
        </div>
      </div>

      {/* Bot Features */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Zap size={14} className="text-amber-500" />
            Características del Bot
          </label>
          <span className="text-[10px] bg-amber-100 text-amber-600 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            {(formData as any).botFeatures?.length || 0} SELECCIONADOS
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {predefinedBotFeatures.map((feature) => {
            const isSelected = (formData as any).botFeatures?.includes(feature);
            return (
              <button
                key={feature}
                onClick={() => {
                  const currentFeatures = (formData as any).botFeatures || [];
                  if (isSelected) {
                    setFormData({
                      ...formData,
                      botFeatures: currentFeatures.filter((f: string) => f !== feature),
                    });
                  } else {
                    setFormData({
                      ...formData,
                      botFeatures: [...currentFeatures, feature],
                    });
                  }
                }}
                className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                  isSelected
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-md shadow-amber-100 hover:shadow-lg hover:scale-105"
                    : "bg-white text-gray-500 border-gray-100 hover:border-amber-200 hover:text-amber-600 hover:shadow-sm"
                }`}
              >
                {feature}
              </button>
            );
          })}
        </div>

        <div className="space-y-3 p-4 bg-gradient-to-br from-gray-50 to-amber-50/30 rounded-2xl border-2 border-gray-100/50">
          {(formData as any).botFeatures?.map((val: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <input
                value={val}
                onChange={(e) => handleArrayChange("botFeatures" as keyof Project, idx, e.target.value)}
                className="flex-1 px-5 py-3 bg-white border-2 border-gray-100 rounded-xl text-sm font-medium focus:ring-4 focus:ring-amber-100 focus:border-amber-300 outline-none transition-all"
                placeholder="Característica personalizada..."
              />
              <button
                onClick={() => removeArrayItem("botFeatures" as keyof Project, idx)}
                className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors hover:shadow-md"
              >
                <X size={18} />
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem("botFeatures" as keyof Project)}
            className="flex items-center gap-2 py-3 px-5 text-xs font-black text-amber-600 hover:bg-amber-50 rounded-xl transition-all w-full border-2 border-dashed border-amber-200 hover:border-amber-300 hover:shadow-md"
          >
            <Plus size={14} /> Añadir Característica Personalizada
          </button>
        </div>
      </div>

      {/* Bot Performance Metrics */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Target size={14} className="text-emerald-500" />
          Métricas de Rendimiento del Bot
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          {(formData as any).botMetrics?.map((val: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <input
                value={val}
                onChange={(e) => handleArrayChange("botMetrics" as keyof Project, idx, e.target.value)}
                className="flex-1 px-5 py-3 bg-gradient-to-br from-gray-50 to-emerald-50/30 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 transition-all"
                placeholder="Ej: 95% Respuesta Automática"
              />
              <button
                onClick={() => removeArrayItem("botMetrics" as keyof Project, idx)}
                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors hover:shadow-md"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem("botMetrics" as keyof Project)}
            className="col-span-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-emerald-400 hover:text-emerald-500 hover:bg-emerald-50/30 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Añadir Métrica de Rendimiento
          </button>
        </div>
      </div>

      {/* Bot Integration Details */}
      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <MessageSquare size={14} className="text-indigo-500" />
            Integraciones
          </label>
          <div className="space-y-2">
            {(formData as any).botIntegrations?.map((val: string, idx: number) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={val}
                  onChange={(e) => handleArrayChange("botIntegrations" as keyof Project, idx, e.target.value)}
                  className="flex-1 px-4 py-2 bg-gradient-to-br from-gray-50 to-indigo-50/30 border-2 border-gray-100 rounded-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
                  placeholder="Ej: Salesforce, HubSpot..."
                />
                <button
                  onClick={() => removeArrayItem("botIntegrations" as keyof Project, idx)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors hover:shadow-md"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem("botIntegrations" as keyof Project)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all flex items-center gap-1"
            >
              <Plus size={12} /> Añadir Integración
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Brain size={14} className="text-purple-500" />
            Capacidades de IA
          </label>
          <div className="space-y-2">
            {(formData as any).botAICapabilities?.map((val: string, idx: number) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={val}
                  onChange={(e) => handleArrayChange("botAICapabilities" as keyof Project, idx, e.target.value)}
                  className="flex-1 px-4 py-2 bg-gradient-to-br from-gray-50 to-purple-50/30 border-2 border-gray-100 rounded-lg focus:ring-4 focus:ring-purple-100 focus:border-purple-300 transition-all"
                  placeholder="Ej: NLP, Machine Learning..."
                />
                <button
                  onClick={() => removeArrayItem("botAICapabilities" as keyof Project, idx)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors hover:shadow-md"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem("botAICapabilities" as keyof Project)}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 rounded-lg transition-all flex items-center gap-1"
            >
              <Plus size={12} /> Añadir Capacidad de IA
            </button>
          </div>
        </div>
      </div>

      {/* Bot Availability */}
      <div className="bg-gradient-to-br from-emerald-50/30 to-teal-50/30 p-6 rounded-[2rem] border-2 border-emerald-100/50">
        <div className="flex items-center gap-3 mb-4">
          <Clock size={20} className="text-emerald-600" />
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
            Disponibilidad y Horario
          </label>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Horario de Atención
            </label>
            <input
              type="text"
              value={(formData as any).botAvailability || ""}
              onChange={(e) => setFormData({ ...formData, botAvailability: e.target.value })}
              className="w-full px-5 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 transition-all"
              placeholder="Ej: 24/7, Lun-Vie 9-18"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Tiempo de Respuesta Promedio
            </label>
            <input
              type="text"
              value={(formData as any).botResponseTime || ""}
              onChange={(e) => setFormData({ ...formData, botResponseTime: e.target.value })}
              className="w-full px-5 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-teal-100 focus:border-teal-300 transition-all"
              placeholder="Ej: < 30 segundos"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Descripción del Funcionamiento
          </label>
          <textarea
            value={(formData as any).botDescription || ""}
            onChange={(e) => setFormData({ ...formData, botDescription: e.target.value })}
            className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 transition-all h-24 resize-none"
            placeholder="Describe cómo funciona el bot, su flujo de conversación y casos de uso..."
          />
        </div>
      </div>
    </div>
  );
};
