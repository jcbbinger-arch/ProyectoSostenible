
import React, { useRef, useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Upload, FileText, User, LogIn, Download, Hash, Copy, CheckCircle2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { state, setCurrentUser } = useProject();
  const { profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // LOGIC: If team exists but user is not identified, BLOCK access with a modal
  const needsIdentity = state.team.length > 0 && !state.currentUser;

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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleIdentitySelect = (id: string) => {
      setCurrentUser(id);
  };

  // --- RENDER: IDENTITY LOCK SCREEN ---
  if (needsIdentity) {
      return (
          <div className="fixed inset-0 bg-slate-900 bg-opacity-95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full p-10 text-center animate-fade-in border border-white/20">
                  <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-inner">
                      <User size={48} />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">¿Quién eres hoy?</h2>
                  <p className="text-slate-600 mb-10 text-lg font-medium">
                      Estás en el proyecto <strong className="text-emerald-600">{state.name || state.teamName}</strong>. <br/>
                      Selecciona tu nombre para empezar a trabajar.
                  </p>
                  
                  <div className="grid gap-4 max-h-96 overflow-y-auto text-left pr-2 custom-scrollbar">
                      {state.team.map(member => (
                          <button
                              key={member.id}
                              onClick={() => handleIdentitySelect(member.id)}
                              className="group flex items-center justify-between p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all active:scale-[0.98]"
                          >
                              <div className="flex items-center gap-5">
                                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-xl group-hover:bg-emerald-200 group-hover:text-emerald-800 transition-colors">
                                      {member.name.charAt(0)}
                                  </div>
                                  <div>
                                      <span className="block font-black text-slate-900 text-xl">{member.name}</span>
                                      {member.isCoordinator && (
                                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] uppercase font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-lg">Coordinador</span>
                                      )}
                                  </div>
                              </div>
                              <LogIn className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                          </button>
                      ))}
                  </div>
                  <p className="mt-10 text-sm text-slate-400 font-bold uppercase tracking-widest">
                      Tu progreso se guardará automáticamente
                  </p>
              </div>
          </div>
      );
  }

  // --- RENDER: MAIN DASHBOARD ---
  return (
    <div className="p-10 max-w-6xl mx-auto">
      <header className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold mb-6 border border-emerald-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Sincronización en Tiempo Real Activa
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
          Panel de Gestión <span className="text-emerald-600">Murcia Sostenible</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Bienvenido, <span className="text-slate-900 font-bold">{profile?.displayName}</span>. 
            Gestiona tu proyecto de restauración sostenible de forma colaborativa.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* PROJECT INFO CARD */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6">
                <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 group-hover:rotate-12 transition-transform">
                  <FileText size={32} />
                </div>
              </div>
              
              <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">{state.name || 'Proyecto sin nombre'}</h3>
              <p className="text-slate-500 font-medium mb-8">Información general del equipo</p>
              
              <div className="space-y-4 mb-10">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Código de Equipo</span>
                  <button 
                    onClick={copyCode}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-mono font-black text-emerald-600 hover:border-emerald-500 transition-all active:scale-95"
                  >
                    <Hash size={16} />
                    {state.code}
                    {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Miembros</span>
                  <span className="font-black text-slate-900">{state.team.length} / 5</span>
                </div>
              </div>

              <Link 
                to="/task-1"
                className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
              >
                  Configurar Equipo <ArrowRight size={20} />
              </Link>
          </div>

          {/* QUICK ACTIONS CARD */}
          <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
              
              <h3 className="text-3xl font-black mb-2 tracking-tight">Acciones Rápidas</h3>
              <p className="text-slate-400 font-medium mb-10">Herramientas de gestión y backup</p>
              
              <div className="grid gap-4">
                <button 
                  onClick={handleBackup}
                  className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Download size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-white">Descargar Backup</p>
                      <p className="text-xs text-slate-400">Copia de seguridad en formato JSON</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                </button>

                <Link 
                  to="/academic-guide"
                  className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-white">Guía Académica</p>
                      <p className="text-xs text-slate-400">Consulta los requisitos del proyecto</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
                </Link>
              </div>
          </div>
      </div>

      {state.currentUser && (
          <div className="bg-white border border-slate-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between shadow-sm">
              <div className="flex items-center gap-6 mb-6 md:mb-0">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-800 font-black text-2xl shadow-inner">
                      {state.team.find(m => m.id === state.currentUser)?.name.charAt(0)}
                  </div>
                  <div>
                      <p className="text-xs text-emerald-600 font-black uppercase tracking-widest mb-1">Sesión Activa</p>
                      <p className="text-2xl font-black text-slate-900">
                          Hola, {state.team.find(m => m.id === state.currentUser)?.name}
                      </p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <div className="text-right hidden lg:block">
                      <p className="text-sm font-bold text-slate-900">Tu trabajo se sincroniza en vivo</p>
                      <p className="text-xs text-slate-400 font-medium">Última actualización: hace un momento</p>
                  </div>
                  <Link 
                    to="/task-2"
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center gap-3 active:scale-95"
                  >
                      Ir al Análisis <ArrowRight size={18} />
                  </Link>
              </div>
          </div>
      )}
    </div>
  );
};

