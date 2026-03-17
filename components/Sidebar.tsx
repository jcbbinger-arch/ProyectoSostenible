
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FileText, LayoutDashboard, DollarSign, Printer, Users, Microscope, UtensilsCrossed, Palette, Rocket, Settings, GraduationCap, Scale, Download, LogOut, Copy, Hash, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { db, doc, updateDoc } from '../firebase';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  colorClass: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, colorClass }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
        isActive
          ? colorClass
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

export const Sidebar: React.FC = () => {
  const { state, resetProject } = useProject();
  const { profile, logout } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const exitProject = async () => {
    if (!profile?.uid) return;
    try {
      await updateDoc(doc(db, 'users', profile.uid), { projectId: null });
      resetProject();
    } catch (error) {
      console.error("Error exiting project:", error);
    }
  };

  const handleBackup = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = state.teamName ? state.teamName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'proyecto';
    const date = new Date().toISOString().slice(0, 10);
    
    link.href = url;
    link.download = `BACKUP_MURCIA_${safeName}_${date}.json`;
    link.click();
  };

  const copyCode = () => {
    if (state.code) {
      navigator.clipboard.writeText(state.code);
    }
  };

  const creationItems = [
    { to: "/task-1", icon: <Users size={18} />, label: "1. Equipo y Zona" },
    { to: "/setup", icon: <Settings size={18} />, label: "2. Reparto Global" },
  ];

  const executionItems = [
    { to: "/task-2", icon: <Microscope size={18} />, label: "Tarea 2" },
    { to: "/menu", icon: <UtensilsCrossed size={18} />, label: "4. Carta" },
    { to: "/task-4", icon: <Palette size={18} />, label: "5. Prototipos" },
    { to: "/financials", icon: <DollarSign size={18} />, label: "6. Viabilidad" },
    { to: "/task-6", icon: <Rocket size={18} />, label: "7. Producción Final" },
    { to: "/co-eval", icon: <Scale size={18} />, label: "8. Coevaluación" },
    { to: "/memory", icon: <Printer size={18} />, label: "Memoria Final" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-10 overflow-hidden no-print print:hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50">
        <Link to="/" className="text-xl font-bold text-green-800 flex items-center gap-2 hover:opacity-80 transition-opacity">
            <FileText className="text-green-600" size={24}/>
            Murcia Sostenible
        </Link>
        
        {profile && (
          <div className="mt-4 flex items-center gap-3 p-2 bg-white rounded-xl border border-gray-100 shadow-sm">
            <img src={profile.photoURL} alt="" className="w-8 h-8 rounded-full border border-green-200" />
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-gray-900 truncate">{profile.displayName}</p>
              <p className="text-[9px] text-gray-500 truncate uppercase tracking-wider">{profile.role}</p>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Admin Back Button */}
        {isAdmin && (
            <button 
                onClick={exitProject}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors mb-4"
            >
                <ArrowLeft size={18} />
                Volver al Panel Admin
            </button>
        )}

        {/* General */}
        <div>
            <NavItem 
                to="/dashboard" 
                icon={<LayoutDashboard size={18} />} 
                label="Panel Principal" 
                colorClass="bg-gray-100 text-gray-900 font-bold"
            />
             <NavItem 
                to="/academic-guide" 
                icon={<GraduationCap size={18} />} 
                label="Guía Académica" 
                colorClass="bg-yellow-50 text-yellow-800 border border-yellow-200"
            />
            {isAdmin && (
                <NavItem 
                    to="/teacher-eval" 
                    icon={<ShieldCheck size={18} className="text-emerald-600" />} 
                    label="Evaluación Docente" 
                    colorClass="bg-emerald-50 text-emerald-800 border border-emerald-200"
                />
            )}
        </div>

        {/* Phase 1: Creation (Blue) */}
        <div>
            <h4 className="text-[10px] uppercase font-bold text-blue-800 mb-2 px-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Fase 1: Configuración
            </h4>
            <div className="border-l-2 border-blue-100 pl-2 ml-1">
                {creationItems.map(item => (
                    <NavItem 
                        key={item.to} 
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        colorClass="bg-blue-50 text-blue-700 border border-blue-100"
                    />
                ))}
            </div>
        </div>

        {/* Phase 2: Execution (Green) */}
        <div>
            <h4 className="text-[10px] uppercase font-bold text-green-800 mb-2 px-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Fase 2: Ejecución
            </h4>
            <div className="border-l-2 border-green-100 pl-2 ml-1">
                {executionItems.map(item => (
                    <NavItem 
                        key={item.to} 
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        colorClass="bg-green-50 text-green-700 border border-green-100"
                    />
                ))}
            </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Proyecto</p>
              {state.code && (
                <button 
                  onClick={copyCode}
                  className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded hover:bg-emerald-100 transition-colors"
                >
                  <Hash size={10} />
                  {state.code}
                  <Copy size={10} />
                </button>
              )}
            </div>
            <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                    <span>Equipo:</span>
                    <span className="font-bold truncate max-w-[80px] text-right">{state.teamName || '---'}</span>
                </div>
                <div className="flex justify-between">
                    <span>Carta:</span>
                    <span>{state.dishes.length}/4</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                    <div 
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.min(100, (state.dishes.length / 4) * 100)}%` }}
                    ></div>
                </div>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button 
              onClick={handleBackup}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors"
              title="Descargar Copia JSON"
          >
              <Download size={12} /> Copia
          </button>
          <button 
              onClick={logout}
              className="bg-red-50 text-red-600 border border-red-100 px-3 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-colors"
          >
              <LogOut size={12} /> Salir
          </button>
        </div>

        {/* AUTHOR BADGE */}
        <div className="pt-3 border-t border-gray-100 flex flex-col items-center">
            <div className="bg-[#0f172a] rounded-xl p-2.5 flex items-center gap-3 w-full shadow-md border border-gray-700">
                <div className="bg-white p-0.5 rounded-full w-9 h-9 flex items-center justify-center shrink-0 overflow-hidden">
                    <img src="https://lh3.googleusercontent.com/d/1DkCOqFGdw3PZbyNUnTQNgeaAGjBfv1_e" alt="JCB Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-col flex overflow-hidden">
                    <span className="text-white font-bold text-xs leading-tight">Juan Codina</span>
                    <span className="text-gray-400 text-[9px] truncate">Original Design & Dev</span>
                </div>
            </div>
        </div>
      </div>
    </aside>
  );
};

