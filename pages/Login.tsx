import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, ShieldCheck, Users, Globe } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 overflow-hidden relative">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl p-10 relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
            <Globe className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Murcia Sostenible</h1>
          <p className="text-slate-400 font-medium">Plataforma de Gestión de Proyectos Educativos</p>
        </div>

        <div className="space-y-6 mb-10">
          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Colaboración Real</p>
              <p className="text-xs text-slate-400">Trabaja con tu equipo en tiempo real desde cualquier lugar.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Acceso Seguro</p>
              <p className="text-xs text-slate-400">Tus proyectos están protegidos y supervisados por el profesor.</p>
            </div>
          </div>
        </div>

        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 px-6 py-4 rounded-2xl font-black hover:bg-emerald-400 hover:text-slate-900 transition-all active:scale-95 shadow-lg shadow-white/5"
        >
          <LogIn className="w-6 h-6" />
          Entrar con Google
        </button>

        <p className="text-center mt-8 text-xs text-slate-500 font-medium">
          Al entrar, aceptas las condiciones de uso de la plataforma educativa.
        </p>
      </div>
    </div>
  );
};
