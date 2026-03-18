import React, { useEffect, useState } from 'react';
import { db, collection, query, where, onSnapshot, updateDoc, doc, getDocs, deleteDoc } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  LayoutDashboard, 
  FileText, 
  Search, 
  ShieldCheck,
  Clock,
  ExternalLink,
  Trash2,
  AlertCircle,
  UserCog,
  UserCheck,
  Ghost,
  ShieldAlert,
  LogOut
} from 'lucide-react';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'student' | 'assistant';
  status: 'pending' | 'approved';
  projectId?: string;
}

interface ProjectSummary {
  id: string;
  name: string;
  code: string;
  teamName: string;
  schoolName: string;
  createdAt: string;
  createdBy: string;
}

export const AdminDashboard: React.FC = () => {
  const { profile, realProfile, impersonateUser, logout } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allProjects, setAllProjects] = useState<ProjectSummary[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'projects' | 'audit'>('users');
  const [searchTerm, setSearchTerm] = useState('');

  const isSuperAdmin = realProfile?.role === 'admin';

  useEffect(() => {
    if (realProfile?.role !== 'admin' && realProfile?.role !== 'assistant') return;

    // Listen to all users
    const qAllUsers = query(collection(db, 'users'));
    const unsubAllUsers = onSnapshot(qAllUsers, (snapshot) => {
      setAllUsers(snapshot.docs.map(d => d.data() as UserProfile));
    });

    // Listen to pending users
    const qPending = query(collection(db, 'users'), where('status', '==', 'pending'));
    const unsubPending = onSnapshot(qPending, (snapshot) => {
      setPendingUsers(snapshot.docs.map(d => d.data() as UserProfile));
    });

    // Listen to all projects
    const qProjects = collection(db, 'projects');
    const unsubProjects = onSnapshot(qProjects, (snapshot) => {
      setAllProjects(snapshot.docs.map(d => d.data() as ProjectSummary));
    });

    return () => {
      unsubAllUsers();
      unsubPending();
      unsubProjects();
    };
  }, [realProfile]);

  const approveUser = async (uid: string) => {
    if (!isSuperAdmin) return;
    try {
      await updateDoc(doc(db, 'users', uid), { status: 'approved' });
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleRoleChange = async (uid: string, newRole: 'admin' | 'student' | 'assistant') => {
    if (!isSuperAdmin) return;
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  const enterProject = async (projectId: string) => {
    if (!realProfile?.uid) return;
    try {
      await updateDoc(doc(db, 'users', realProfile.uid), { projectId });
    } catch (error) {
      console.error("Error entering project:", error);
    }
  };

  const rejectUser = async (uid: string) => {
    if (!isSuperAdmin) return;
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  const filteredUsers = allUsers.filter(u => 
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = allProjects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h1 className="text-xl font-bold tracking-tight">Modo DIOS</h1>
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Panel de Control</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Gestión de Usuarios</span>
            {pendingUsers.length > 0 && (
              <span className="ml-auto bg-white text-emerald-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingUsers.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'projects' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Todos los Proyectos</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'audit' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Auditoría</span>
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <img src={profile?.photoURL} alt="" className="w-10 h-10 rounded-full border-2 border-emerald-400" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{profile?.displayName}</p>
              <p className="text-xs text-slate-400 truncate">Administrador</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 py-2 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {activeTab === 'users' ? 'Gestión de Usuarios' : activeTab === 'projects' ? 'Explorador de Proyectos' : 'Registro de Auditoría'}
            </h2>
            <p className="text-slate-500">
              {activeTab === 'users' ? 'Aprueba o rechaza las solicitudes de acceso de los alumnos.' : 'Visualiza y supervisa el progreso de todos los equipos.'}
            </p>
          </div>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
        </header>

        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No se encontraron usuarios.</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.uid} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={user.photoURL} alt="" className="w-12 h-12 rounded-full border-2 border-slate-100" />
                    <div className="overflow-hidden flex-1">
                      <h3 className="font-bold text-slate-900 truncate">{user.displayName}</h3>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    {user.status === 'approved' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Rol del Usuario</label>
                    <div className="flex gap-1">
                      {(['student', 'assistant', 'admin'] as const).map((role) => (
                        <button
                          key={role}
                          disabled={!isSuperAdmin || user.uid === realProfile?.uid}
                          onClick={() => handleRoleChange(user.uid, role)}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                            user.role === role 
                              ? 'bg-slate-900 text-white shadow-sm' 
                              : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {role === 'admin' ? 'ADMIN' : role === 'assistant' ? 'ASISTENTE' : 'ALUMNO'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-auto flex gap-2">
                    {user.status === 'pending' ? (
                      <div className="flex-1 flex gap-2">
                        <button
                          onClick={() => approveUser(user.uid)}
                          disabled={!isSuperAdmin}
                          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Aprobar Acceso
                        </button>
                        <button
                          onClick={() => rejectUser(user.uid)}
                          disabled={!isSuperAdmin}
                          className="px-4 flex items-center justify-center bg-slate-100 text-slate-400 py-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                          title="Rechazar"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => impersonateUser(user.uid)}
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <Ghost className="w-4 h-4" />
                          Suplantar
                        </button>
                        {isSuperAdmin && user.uid !== realProfile?.uid && (
                          <button
                            onClick={() => rejectUser(user.uid)}
                            className="w-10 flex items-center justify-center bg-slate-50 text-slate-400 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Proyecto</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Equipo</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Creado</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">
                      No se encontraron proyectos.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{project.name}</p>
                        <p className="text-xs text-slate-500">{project.schoolName || 'Sin centro'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                          {project.teamName || 'Sin nombre'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                          {project.code}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => enterProject(project.id)}
                            className="p-2 text-slate-400 hover:text-emerald-600 transition-colors" 
                            title="Ver proyecto"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Eliminar">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">El registro de auditoría se implementará en la próxima fase.</p>
          </div>
        )}
      </main>
    </div>
  );
};
