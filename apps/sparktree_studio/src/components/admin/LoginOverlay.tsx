import React from "react";
import { Lock, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectDetail from "@/views/portfolio/ProjectDetail";

interface LoginOverlayProps {
  isPreviewOpen: boolean;
  setIsPreviewOpen: (open: boolean) => void;
  editingId: string | null;
  formData: any;
  loginForm: any;
  setLoginForm: (form: any) => void;
  handleLogin: (e: React.FormEvent) => void;
  loginError: string;
}

export const LoginOverlay: React.FC<LoginOverlayProps> = ({
  isPreviewOpen,
  setIsPreviewOpen,
  editingId,
  formData,
  loginForm,
  setLoginForm,
  handleLogin,
  loginError,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto overflow-x-hidden scroll-smooth">
          <Header currentPage="project-detail" onNavigate={() => {}} />
          <ProjectDetail
            projectId={editingId || "preview"}
            initialData={formData as any}
            isPreview={true}
          />
          <Footer onNavigate={() => {}} currentPage="project-detail" />

          {/* Botón Flotante para salir de Vista Previa */}
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-gray-900/90 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-2xl hover:scale-105 active:scale-95 border border-white/20 group"
          >
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform">
              <X size={20} />
            </div>
            <span>Salir de Vista Previa</span>
          </button>
        </div>
      )}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100 animate-fade-in-scale">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Acceso Restringido
        </h1>
        <p className="text-gray-500 text-center text-sm mb-8">
          Ingresa tus credenciales para administrar el portafolio
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
              className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="admin@sparktree.pe"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="••••••••"
              required
            />
          </div>

          {loginError && (
            <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-md"
          >
            Ingresar al Editor
          </button>
        </form>
      </div>
    </div>
  );
};
