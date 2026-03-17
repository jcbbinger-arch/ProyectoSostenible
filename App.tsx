
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Sidebar } from './components/Sidebar';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Task1_TeamZone } from './pages/Task1_TeamZone';
import { ProjectSetup } from './pages/ProjectSetup';
import { Task2_Analysis } from './pages/Task2_Analysis';
import { ConceptDefinition } from './pages/ConceptDefinition';
import { MenuDesign } from './pages/MenuDesign';
import { Task4_MenuPrototype } from './pages/Task4_MenuPrototype';
import { Task5_Financials } from './pages/Task5_Financials';
import { Task6_FinalAssembly } from './pages/Task6_FinalAssembly';
import { TeamSync } from './pages/TeamSync';
import { FinalMemory } from './pages/FinalMemory';
import { AcademicGuide } from './pages/AcademicGuide';
import { CoEvaluation } from './pages/CoEvaluation';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { WaitingRoom } from './components/WaitingRoom';
import { ProjectAccess } from './components/ProjectAccess';
import { Loader2 } from 'lucide-react';

// Layout wrapper to conditionally show Sidebar
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans text-gray-900">
      {!isLanding && !isAdmin && <Sidebar />}
      
      <main className={`flex-1 transition-all duration-300 ${!isLanding && !isAdmin ? 'ml-64 print:ml-0 print:w-full' : ''}`}>
        {children}
      </main>
    </div>
  );
};

const AppContent = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { loading: projectLoading } = useProject();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <HashRouter>
      {!user ? (
        <Login />
      ) : profile?.role === 'admin' ? (
        <AdminDashboard />
      ) : profile?.status === 'pending' ? (
        <WaitingRoom />
      ) : !profile?.projectId ? (
        <ProjectAccess />
      ) : projectLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Sincronizando proyecto...</p>
          </div>
        </div>
      ) : (
        <AppLayout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/academic-guide" element={<AcademicGuide />} />
            <Route path="/task-1" element={<Task1_TeamZone />} />
            <Route path="/setup" element={<ProjectSetup />} />
            <Route path="/sync" element={<TeamSync />} />
            <Route path="/task-2" element={<Task2_Analysis />} />
            <Route path="/zone" element={<Navigate to="/task-1" replace />} />
            <Route path="/concept" element={<ConceptDefinition />} />
            <Route path="/menu" element={<MenuDesign />} />
            <Route path="/task-4" element={<Task4_MenuPrototype />} />
            <Route path="/financials" element={<Task5_Financials />} />
            <Route path="/task-6" element={<Task6_FinalAssembly />} />
            <Route path="/co-eval" element={<CoEvaluation />} />
            <Route path="/memory" element={<FinalMemory />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppLayout>
      )}
    </HashRouter>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;

