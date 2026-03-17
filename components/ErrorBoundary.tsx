import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    // Removed window.confirm as per guidelines. 
    // In a real app, this should be a custom modal.
    localStorage.removeItem('murcia_project_data');
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="text-red-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Algo salió mal</h1>
            <p className="text-gray-600 mb-6 text-sm">
              La aplicación ha encontrado un error inesperado.
            </p>
            
            <div className="bg-gray-100 p-3 rounded text-left text-xs font-mono text-red-800 mb-6 overflow-auto max-h-32">
                {this.state.error?.message}
            </div>

            <div className="flex flex-col gap-3">
                <button 
                    onClick={this.handleReload}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                    <RefreshCw size={18} /> Recargar Página
                </button>
                <button 
                    onClick={this.handleReset}
                    className="w-full bg-white border border-red-200 text-red-600 py-3 rounded-lg font-bold hover:bg-red-50 flex items-center justify-center gap-2"
                >
                    <Trash2 size={18} /> Borrar datos y Reiniciar
                </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}