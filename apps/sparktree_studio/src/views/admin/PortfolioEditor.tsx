'use client';

import { useState, useEffect } from "react";
import { Project } from "@/data/projects";
import { supabase } from "@/lib/supabase";
import {
  FileText,
  PencilLine,
  Rocket,
  Image as ImageIcon,
  Loader2,
  LogOut,
  Eye,
  X,
  CheckCircle2,
  Bot,
} from "lucide-react";
import ProjectDetail from "../portfolio/ProjectDetail";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Modular Admin Components
import { TabGeneral } from "@/components/admin/TabGeneral";
import { TabContent } from "@/components/admin/TabContent";
import { TabImpact } from "@/components/admin/TabImpact";
import { TabMedia } from "@/components/admin/TabMedia";
import { TabBots } from "@/components/admin/TabBots";
import { ProjectList } from "@/components/admin/ProjectList";
import { LoginOverlay } from "@/components/admin/LoginOverlay";

const PREDEFINED_SERVICES: Record<string, string[]> = {
  "Generales": ["Diseño Web", "Branding Corporativo", "Marketing Digital", "Producción Audiovisual", "Desarrollo de Software", "Estrategia Digital"],
  "Webs": ["Desarrollo Web", "E-commerce", "Landing Page", "Diseño UI/UX", "WordPress", "Optimización Web"],
  "Diseño": ["Branding", "Logotipo", "Identidad Visual", "Ilustración", "Packaging", "Diseño Editorial"],
  "Multimedia": ["Video Corporativo", "Fotografía", "Animación 2D/3D", "Edición de Video", "Drone", "Streaming"],
  "Sistemas": ["Software a Medida", "App Móvil", "QA & Testing", "Arquitectura Cloud", "Ciberseguridad", "Soporte TI"],
  "Marketing": ["Social Media", "Google Ads", "Meta Ads", "SEO", "Estrategia de Contenidos", "Inbound Marketing"],
};

export default function PortfolioEditor() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    services: [],
    results: [],
    technologies: [],
    team: [],
    resultImages: [],
    additionalImages: [],
    heroImages: [],
    isVisible: true,
    isFeatured: false,
    orderRank: 0,
  });
  const [activeTab, setActiveTab] = useState<
    "general" | "content" | "impact" | "media" | "bots"
  >("general");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [expandedPreviews, setExpandedPreviews] = useState<Set<string>>(new Set());
  const [projectYear, setProjectYear] = useState<number>(new Date().getFullYear());
  const [projectUrl, setProjectUrl] = useState<string>("");
  const [clientTestimonial, setClientTestimonial] = useState<string>("");
  const [budgetRange, setBudgetRange] = useState<string>("");

  useEffect(() => {
    checkUser();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (isPreviewOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isPreviewOpen]);

  async function checkUser() {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }

  async function fetchProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("orderRank", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
    } else if (data) {
      // Normalize media arrays to ensure they have proper ProjectMedia structure
      const normalizedData = data.map((project: any) => ({
        ...project,
        resultImages: (project.resultImages || []).map((item: any) => {
          // Si es string, verificar si ya es un JSON válido o solo es una URL
          if (typeof item === "string") {
            try {
              const parsed = JSON.parse(item);
              // Si el parseado es un objeto con url, usarlo
              if (typeof parsed === "object" && parsed.url) {
                return parsed;
              }
              // Si no, tratar el string original como URL
              return { url: item, category: "", type: "image" };
            } catch {
              // Si falla el parseo, tratar el string como URL
              return { url: item, category: "", type: "image" };
            }
          }
          // Si ya es objeto, retornarlo directamente
          return typeof item === "object" && item.url ? item : { url: item, category: "", type: "image" };
        }),
        additionalImages: (project.additionalImages || []).map((item: any) => {
          // Si es string, verificar si ya es un JSON válido o solo es una URL
          if (typeof item === "string") {
            try {
              const parsed = JSON.parse(item);
              // Si el parseado es un objeto con url, usarlo
              if (typeof parsed === "object" && parsed.url) {
                return parsed;
              }
              // Si no, tratar el string original como URL
              return { url: item, category: "", type: "image" };
            } catch {
              // Si falla el parseo, tratar el string como URL
              return { url: item, category: "", type: "image" };
            }
          }
          // Si ya es objeto, retornarlo directamente
          return typeof item === "object" && item.url ? item : { url: item, category: "", type: "image" };
        }),
      }));
      setProjectsList(normalizedData as Project[]);
    }
  }

  // Helper for array inputs
  const handleArrayChange = (
    field: keyof Project,
    index: number,
    value: string,
  ) => {
    const arr = (formData[field] as any[]) || [];
    const newArr = [...arr];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const handleMediaChange = (
    field: "resultImages" | "additionalImages",
    index: number,
    value: string,
    property: "url" | "category" | "type" = "url"
  ) => {
    const arr = (formData[field] as any[]) || [];
    const newArr = [...arr];
    const current = newArr[index];

    if (typeof current === "string" || !current) {
      newArr[index] = {
        url: property === "url" ? value : current || "",
        category: property === "category" ? value : "",
        type: property === "type" ? (value as any) : "image",
      };
    } else {
      newArr[index] = { ...current, [property]: value };
    }

    setFormData({ ...formData, [field]: newArr });
  };

  const addArrayItem = (field: keyof Project) => {
    const currentArray = (formData[field] as any[]) || [];
    const newItem = (field === 'resultImages' || field === 'additionalImages')
      ? { url: "", category: "", type: "image" as const }
      : "";

    setFormData({
      ...formData,
      [field]: [...currentArray, newItem],
    });
  };

  const removeArrayItem = (field: keyof Project, index: number) => {
    const newArr = [...(formData[field] as any[])];
    newArr.splice(index, 1);
    setFormData({ ...formData, [field]: newArr });
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    callback: (url: string) => void,
  ) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      const file = event.target.files[0];

      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Correct bucket name
      const { error: uploadError } = await supabase.storage
        .from("PortafolioVirtualSparktree")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("PortafolioVirtualSparktree")
        .getPublicUrl(filePath);

      callback(data.publicUrl);
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error subiendo imagen: ${error.message}`);
      } else {
        alert("Error desconocido al subir imagen");
      }
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = "";
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData(project);
    setProjectYear((project as any).year || new Date().getFullYear());
    setProjectUrl((project as any).projectUrl || "");
    setClientTestimonial((project as any).clientTestimonial || "");
    setBudgetRange((project as any).budgetRange || "");
    setActiveTab("general");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    if (!formData.title) return alert("El título es obligatorio");

    setIsSaving(true);

    const projectId =
      editingId ||
      formData.id ||
      formData.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const projectData = {
      ...formData,
      id: projectId,
      year: projectYear,
      projectUrl,
      clientTestimonial,
      budgetRange,
    };

    const { error } = await supabase.from("projects").upsert(projectData);

    if (error) {
      alert(`Error al guardar: ${error.message}`);
    } else {
      setSaveSuccess(true);
      setEditingId(null);
      setFormData({
        services: [],
        results: [],
        technologies: [],
        team: [],
        resultImages: [],
        additionalImages: [],
        heroImages: [],
        cardImage: "",
      });
      setProjectYear(new Date().getFullYear());
      setProjectUrl("");
      setClientTestimonial("");
      setBudgetRange("");
      fetchProjects();
      setTimeout(() => setSaveSuccess(false), 3000);
    }

    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este proyecto?")
    ) {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) {
        alert(`Error al eliminar: ${error.message}`);
      } else {
        if (editingId === id) {
          setEditingId(null);
          setFormData({
            services: [],
            results: [],
            technologies: [],
            team: [],
            resultImages: [],
            additionalImages: [],
            heroImages: [],
          });
          setProjectYear(new Date().getFullYear());
          setProjectUrl("");
          setClientTestimonial("");
          setBudgetRange("");
        }
        fetchProjects();
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });

    if (error) {
      setLoginError(error.message);
    } else {
      setIsAuthenticated(true);
    }
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginOverlay
        isPreviewOpen={isPreviewOpen}
        setIsPreviewOpen={setIsPreviewOpen}
        editingId={editingId}
        formData={formData}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
        loginError={loginError}
      />
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-emerald-50/30 pb-20 relative">
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[150] bg-white overflow-y-auto overflow-x-hidden scroll-smooth animate-in fade-in duration-300">
          <div className="min-h-screen flex flex-col">
            <Header currentPage="project-detail" onNavigate={() => { }} />
            <main className="flex-grow">
              <ProjectDetail projectId={editingId || "preview"} initialData={formData as any} isPreview={true} />
            </main>
            <Footer onNavigate={() => { }} currentPage="project-detail" />
          </div>

          {/* Botón Flotante para salir de Vista Previa */}
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 border border-white/10 group"
          >
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform shadow-inner">
              <X size={20} />
            </div>
            <span className="tracking-tight">Salir de Vista Previa</span>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Rocket size={24} />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                  Editor Maestro de Portafolio
                </h1>
                <p className="text-gray-500 mt-1 text-sm lg:text-base">
                  Configura cada detalle de tus proyectos con precisión quirúrgica.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-indigo-100 text-indigo-700 font-bold rounded-2xl hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-md hover:shadow-lg flex-1 lg:flex-none justify-center"
            >
              <Eye size={18} /> <span className="hidden sm:inline">Vista Previa</span>
            </button>
            <button
              onClick={() => {
                setFormData({
                  services: [],
                  results: [],
                  technologies: [],
                  team: [],
                  resultImages: [],
                  additionalImages: [],
                  heroImages: [],
                });
                setEditingId(null);
                setActiveTab("general");
              }}
              className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all font-bold shadow-lg shadow-indigo-200 hover:shadow-xl flex-1 lg:flex-none justify-center"
            >
              <Rocket size={18} className="hidden sm:inline" /> Nuevo Proyecto
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-3 bg-white border-2 border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all font-bold shadow-sm hover:shadow-md flex items-center gap-2 justify-center"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Cerrar</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Editing Area */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/60 border border-gray-100/50 overflow-hidden backdrop-blur-sm">
              {/* Area de Título del Proyecto (Editor de Contexto) */}
              <div className="p-6 lg:p-8 pb-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all ${editingId ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-200' : 'bg-gradient-to-br from-indigo-600 to-purple-600 shadow-indigo-200'}`}>
                    {editingId ? <PencilLine size={26} /> : <Rocket size={26} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                      {editingId ? 'Editando Proyecto' : 'Nuevo Proyecto'}
                    </h2>
                    <h3 className="text-xl lg:text-2xl font-black text-gray-900 truncate">
                      {formData.title || "Nuevo Proyecto Estratégico"}
                    </h3>
                    {formData.client && (
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        Cliente: {formData.client}
                      </p>
                    )}
                  </div>
                  {formData.category && (
                    <div className="hidden sm:block px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl">
                      <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
                        {formData.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabs Navigation (Sticky) */}
              <div className="sticky top-0 z-[55] flex border-b border-gray-100/50 bg-white/95 backdrop-blur-xl mt-4 lg:mt-6 px-2 lg:px-4">
                {[
                  {
                    id: "general",
                    label: "General",
                    icon: <FileText size={18} />,
                    color: "indigo",
                  },
                  {
                    id: "content",
                    label: "Contenido",
                    icon: <PencilLine size={18} />,
                    color: "purple",
                  },
                  {
                    id: "impact",
                    label: "Impacto",
                    icon: <Rocket size={18} />,
                    color: "amber",
                  },
                  {
                    id: "media",
                    label: "Multimedia",
                    icon: <ImageIcon size={18} />,
                    color: "emerald",
                  },
                  {
                    id: "bots",
                    label: "Bots",
                    icon: <Bot size={18} />,
                    color: "rose",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setActiveTab(
                        tab.id as "general" | "content" | "impact" | "media" | "bots",
                      )
                    }
                    className={`flex-1 py-4 lg:py-6 text-[10px] lg:text-[11px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 lg:gap-3 border-b-4 ${activeTab === tab.id
                      ? `border-${tab.color}-600 text-${tab.color}-600 bg-${tab.color}-50/10`
                      : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50/50"
                      }`}
                  >
                    <span className={`${activeTab === tab.id ? "scale-110" : "scale-100"} transition-transform`}>{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 lg:p-8">
                {activeTab === "general" && (
                  <TabGeneral
                    formData={formData}
                    setFormData={setFormData}
                    predefinedServices={PREDEFINED_SERVICES}
                    handleArrayChange={handleArrayChange}
                    addArrayItem={addArrayItem}
                    removeArrayItem={removeArrayItem}
                    projectYear={projectYear}
                    setProjectYear={setProjectYear}
                    projectUrl={projectUrl}
                    setProjectUrl={setProjectUrl}
                    clientTestimonial={clientTestimonial}
                    setClientTestimonial={setClientTestimonial}
                    budgetRange={budgetRange}
                    setBudgetRange={setBudgetRange}
                  />
                )}

                {activeTab === "content" && (
                  <TabContent formData={formData} setFormData={setFormData} />
                )}

                {activeTab === "impact" && (
                  <TabImpact
                    formData={formData}
                    handleArrayChange={handleArrayChange}
                    addArrayItem={addArrayItem}
                    removeArrayItem={removeArrayItem}
                  />
                )}

                {activeTab === "media" && (
                  <TabMedia
                    formData={formData}
                    setFormData={setFormData}
                    isUploading={isUploading}
                    handleImageUpload={handleImageUpload}
                    handleArrayChange={handleArrayChange}
                    addArrayItem={addArrayItem}
                    removeArrayItem={removeArrayItem}
                    handleMediaChange={handleMediaChange}
                    expandedPreviews={expandedPreviews}
                    setExpandedPreviews={setExpandedPreviews}
                  />
                )}

                {activeTab === "bots" && (
                  <TabBots
                    formData={formData}
                    setFormData={setFormData}
                    handleArrayChange={handleArrayChange}
                    addArrayItem={addArrayItem}
                    removeArrayItem={removeArrayItem}
                  />
                )}
              </div>

              {/* Action Bar - Sticky and Elevated */}
              <div className="sticky bottom-0 z-[60] bg-white/95 backdrop-blur-xl border-t border-gray-100/50 p-4 lg:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_-20px_50px_rgba(0,0,0,0.04)]">
                <div className="flex-1 w-full sm:w-auto">
                  {saveSuccess && (
                    <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-4 lg:px-6 py-3 rounded-2xl w-fit animate-fade-in-scale border border-emerald-100 shadow-sm">
                      <CheckCircle2 size={20} className="animate-bounce" />
                      <span className="text-xs lg:text-sm font-black uppercase tracking-wider">
                        Guardado con Éxito
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    className="group flex-1 sm:flex-none px-4 lg:px-6 py-3 lg:py-4 bg-white border-2 border-gray-200 text-gray-700 font-black text-[10px] lg:text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Eye size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline">Vista Previa</span>
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`group flex-1 sm:flex-none px-6 lg:px-12 py-3 lg:py-4 text-white rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center justify-center min-w-[200px] lg:min-w-[320px] ${isSaving
                      ? "bg-indigo-400 cursor-not-allowed scale-95"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-[1.02] active:scale-95 shadow-indigo-200"
                      }`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        <span className="hidden sm:inline">Procesando...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 lg:gap-3">
                        <Rocket size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        <span>{editingId ? "Actualizar" : "Publicar"}</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* List Sidebar */}
          <ProjectList
            projects={projectsList}
            editingId={editingId}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}

