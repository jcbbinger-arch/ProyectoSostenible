
import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Palette, ExternalLink, Upload, PenTool, Layout, Eye, FileText, Printer, Save, ChevronRight, ChevronDown } from 'lucide-react';

export const Task4_MenuPrototype: React.FC = () => {
  const { state, updateMenuPrototype, updateInterimReport } = useProject();
  const [activeTab, setActiveTab] = useState<'instructions' | 'development' | 'report'>('instructions');
  const [activeReportSection, setActiveReportSection] = useState<string | null>('resumen');

  // PERMISOS
  const currentUserMember = state.team.find(m => m.id === state.currentUser);
  const isCoordinator = currentUserMember?.isCoordinator || false;
  const isDesigner = state.task6.designerIds.includes(state.currentUser || '');
  const isArtisan = state.task6.artisanIds.includes(state.currentUser || '');
  const isEditor = state.task6.editorIds.includes(state.currentUser || '');

  // Si no hay roles asignados aún, permitimos al coordinador o a todos (dependiendo de la política)
  // Para simplificar y seguir la petición: "solo puedan modificar el suyo"
  // En Tarea 4, dividiremos por roles de la Tarea 6 si están presentes, si no, el coordinador.
  const canEditDigital = isDesigner || isCoordinator || (state.task6.designerIds.length === 0);
  const canEditPhysical = isArtisan || isCoordinator || (state.task6.artisanIds.length === 0);
  const canEditReport = isEditor || isCoordinator || (state.task6.editorIds.length === 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateMenuPrototype({ physicalPhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const reportSections = [
    { id: 'identidad', label: '1. Identidad y Equipo (T1)', field: 'summary' },
    { id: 'analisis', label: '2. Análisis del Entorno (T2)', subfields: [
        { id: 'context', label: '2.1. Contexto y Justificación', parent: 'introduction' },
        { id: 'research', label: '2.2. Síntesis de Investigación Individual', parent: 'analysis.conclusions' },
    ]},
    { id: 'concepto', label: '3. Conceptualización (T2)', subfields: [
        { id: 'objectives', label: '3.1. Objetivos del Restaurante', parent: 'introduction' },
        { id: 'differentiation', label: '3.2. Propuesta de Valor y Diferenciación', parent: 'analysis.products' },
    ]},
    { id: 'gastronomia', label: '4. Oferta Gastronómica (T3)', field: 'results' },
    { id: 'desarrollo', label: '5. Desarrollo y Prototipo (T4)', subfields: [
        { id: 'methodology', label: '5.1. Metodología de Trabajo', parent: 'development' },
        { id: 'planning', label: '5.2. Planificación Temporal', parent: 'development' },
    ]},
    { id: 'conclusiones', label: '6. Conclusiones y ODS', subfields: [
        { id: 'ods', label: '6.1. Relación con los ODS', parent: 'analysis.ods' },
        { id: 'conclusions', label: '6.2. Valoración Final', parent: 'analysis.conclusions' },
    ]},
    { id: 'bibliografia', label: '7. Bibliografía y Fuentes', field: 'bibliography' },
  ];

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const updateNestedValue = (obj: any, path: string, value: any) => {
    const parts = path.split('.');
    const last = parts.pop()!;
    const target = parts.reduce((acc, part) => acc[part], obj);
    target[last] = value;
    return { ...obj };
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 no-print">
        <div>
            <h2 className="text-3xl font-bold text-gray-900">Tarea 4: Prototipo y Memoria</h2>
            <p className="text-gray-600 mt-2">Diseño Visual y Memoria Intermedia</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setActiveTab('instructions')}
                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'instructions' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                Instrucciones
            </button>
            <button 
                onClick={() => setActiveTab('development')}
                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'development' ? 'bg-green-600 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                Prototipo
            </button>
            <button 
                onClick={() => setActiveTab('report')}
                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'report' ? 'bg-slate-800 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                Memoria Intermedia
            </button>
        </div>
      </div>

      {activeTab === 'instructions' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 no-print">
             <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Guía de la Tarea 4</h3>
             <div className="prose max-w-none text-gray-700 space-y-6">
                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-bold text-green-900 mt-0">Objetivo</h4>
                    <p>Crear la carta, documentarla y diseñar una primera versión (un prototipo) de sus soportes visuales. Además, se debe completar la <strong>Memoria Intermedia</strong> del proyecto.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Layout className="text-purple-600" />
                            <h4 className="font-bold text-lg m-0">Misión 4.A: Digital</h4>
                        </div>
                        <p className="text-sm">Crear un borrador de la carta virtual en Canva.</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                         <div className="flex items-center gap-2 mb-4">
                            <PenTool className="text-orange-600" />
                            <h4 className="font-bold text-lg m-0">Misión 4.B: Físico</h4>
                        </div>
                        <p className="text-sm">Crear un boceto o maqueta de la carta física.</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                         <div className="flex items-center gap-2 mb-4">
                            <FileText className="text-slate-600" />
                            <h4 className="font-bold text-lg m-0">Memoria Intermedia</h4>
                        </div>
                        <p className="text-sm">Redactar los apartados de la memoria para la entrega parcial.</p>
                    </div>
                </div>

                 <div className="flex justify-center mt-6">
                    <button onClick={() => setActiveTab('development')} className="bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow hover:bg-green-700">
                        Comenzar Desarrollo
                    </button>
                 </div>
             </div>
        </div>
      )}

      {activeTab === 'development' && (
        <div className="space-y-8 no-print">
            
            <div className={`bg-${(canEditDigital && canEditPhysical) ? 'blue' : 'orange'}-50 border border-${(canEditDigital && canEditPhysical) ? 'blue' : 'orange'}-200 p-4 rounded-lg flex items-center gap-3`}>
                <Eye className={`text-${(canEditDigital && canEditPhysical) ? 'blue' : 'orange'}-600`} />
                <p className={`text-sm text-${(canEditDigital && canEditPhysical) ? 'blue' : 'orange'}-800`}>
                    <strong>Modo Colaborativo:</strong> {(canEditDigital && canEditPhysical) ? 'Tienes acceso para editar los prototipos del equipo.' : 'Solo los miembros asignados (Diseñadores/Artesanos) o el Coordinador pueden editar.'}
                </p>
            </div>

            {/* General Style */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
                {!isCoordinator && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200">
                        <Palette size={14} /> Solo Coordinador
                    </div>
                )}
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Palette size={20} className="text-gray-500" /> Identidad Visual General
                </h3>
                <label className="block text-sm text-gray-600 mb-2">Explica brevemente la idea visual general (colores, tipografías, materiales que evocan la zona...)</label>
                <textarea 
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 min-h-[100px] ${!isCoordinator ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder={isCoordinator ? "Ej: Usaremos tonos ocres y verdes para recordar a la huerta..." : "Solo el Coordinador puede editar esta sección."}
                    value={state.menuPrototype.generalStyle}
                    onChange={(e) => isCoordinator && updateMenuPrototype({ generalStyle: e.target.value })}
                    disabled={!isCoordinator}
                />
            </section>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Digital */}
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
                    {!canEditDigital && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200">
                            <Layout size={14} /> Solo Diseñadores
                        </div>
                    )}
                    <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                        <Layout size={20} /> Misión 4.A (Digital)
                    </h3>
                    <div className="bg-purple-50 p-4 rounded-lg mb-4 text-sm text-purple-800">
                        Pega aquí el enlace de "Solo lectura" de tu diseño en Canva.
                    </div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Enlace Canva (Link Público)</label>
                    <div className="flex gap-2">
                        <input 
                            type="url"
                            className={`flex-1 p-2 border border-gray-300 rounded ${!canEditDigital ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            placeholder={canEditDigital ? "https://www.canva.com/..." : "Solo Diseñadores pueden editar."}
                            value={state.menuPrototype.digitalLink}
                            onChange={(e) => canEditDigital && updateMenuPrototype({ digitalLink: e.target.value })}
                            disabled={!canEditDigital}
                        />
                        {state.menuPrototype.digitalLink && (
                            <a 
                                href={state.menuPrototype.digitalLink} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-600"
                            >
                                <ExternalLink size={20} />
                            </a>
                        )}
                    </div>
                </section>

                {/* Physical */}
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
                    {!canEditPhysical && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200">
                            <PenTool size={14} /> Solo Artesanos
                        </div>
                    )}
                    <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-2">
                        <PenTool size={20} /> Misión 4.B (Físico)
                    </h3>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Foto del Boceto / Maqueta</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 min-h-[200px]">
                            {state.menuPrototype.physicalPhoto ? (
                                <div className="relative w-full h-full">
                                    <img 
                                        src={state.menuPrototype.physicalPhoto} 
                                        alt="Boceto Carta" 
                                        className="w-full h-48 object-contain rounded" 
                                    />
                                    {canEditPhysical && (
                                        <button 
                                            onClick={() => updateMenuPrototype({ physicalPhoto: null })}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <label className={`flex flex-col items-center text-gray-500 ${canEditPhysical ? 'cursor-pointer hover:text-orange-600' : 'cursor-not-allowed'}`}>
                                    <Upload size={32} className="mb-2" />
                                    <span className="text-sm font-bold">{canEditPhysical ? 'Subir Foto' : 'Solo Artesanos'}</span>
                                    {canEditPhysical && <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />}
                                </label>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Explicación del Formato Físico</label>
                        <textarea 
                             className={`w-full p-2 border border-gray-300 rounded ${!canEditPhysical ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                             rows={3}
                             placeholder={canEditPhysical ? "Ej: Será un díptico en papel reciclado con textura..." : "Solo Artesanos pueden editar."}
                             value={state.menuPrototype.physicalDescription}
                             onChange={(e) => canEditPhysical && updateMenuPrototype({ physicalDescription: e.target.value })}
                             disabled={!canEditPhysical}
                        />
                    </div>
                </section>
            </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="grid md:grid-cols-12 gap-8">
            {/* Sidebar Navigation for Report */}
            <div className="md:col-span-4 space-y-2 no-print">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FileText size={18} className="text-blue-600" /> Secciones de la Memoria
                    </h4>
                    <div className="space-y-1">
                        {reportSections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveReportSection(section.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-between ${activeReportSection === section.id ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <span>{section.label}</span>
                                <ChevronRight size={14} className={activeReportSection === section.id ? 'opacity-100' : 'opacity-0'} />
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={() => window.print()}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg"
                >
                    <Printer size={18} /> Imprimir Memoria Completa
                </button>
            </div>

            {/* Content Area for Report Editing */}
            <div className="md:col-span-8 no-print">
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm min-h-[600px] relative">
                    {!canEditReport && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200 z-10">
                            <FileText size={14} /> Solo Editores
                        </div>
                    )}
                    {reportSections.map(section => {
                        if (activeReportSection !== section.id) return null;

                        return (
                            <div key={section.id} className="animate-fade-in">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">{section.label}</h3>
                                
                                {section.field ? (
                                    <div className="space-y-4">
                                        <label className="block text-sm font-bold text-gray-700">Contenido de la sección</label>
                                        <textarea 
                                            className={`w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[400px] ${!canEditReport ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                            placeholder={canEditReport ? `Redacta aquí el contenido para ${section.label}...` : "Solo Editores pueden redactar la memoria."}
                                            value={(state.interimReport as any)[section.field]}
                                            onChange={(e) => canEditReport && updateInterimReport({ [section.field!]: e.target.value })}
                                            disabled={!canEditReport}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {section.subfields?.map(sub => (
                                            <div key={sub.id}>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">{sub.label}</label>
                                                <textarea 
                                                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[120px] ${!canEditReport ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                    placeholder={canEditReport ? `Escribe aquí...` : "Solo Editores pueden redactar la memoria."}
                                                    value={sub.parent ? getNestedValue(state.interimReport, `${sub.parent}.${sub.id}`) : (state.interimReport as any)[sub.id]}
                                                    onChange={(e) => {
                                                        if (!canEditReport) return;
                                                        if (sub.parent) {
                                                            const updatedReport = updateNestedValue({ ...state.interimReport }, `${sub.parent}.${sub.id}`, e.target.value);
                                                            updateInterimReport(updatedReport);
                                                        } else {
                                                            updateInterimReport({ [sub.id]: e.target.value });
                                                        }
                                                    }}
                                                    disabled={!canEditReport}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-8 flex justify-end">
                                    <button className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg border ${canEditReport ? 'text-green-600 bg-green-50 border-green-200' : 'text-gray-400 bg-gray-50 border-gray-200'}`}>
                                        <Save size={18} /> {canEditReport ? 'Autoguardado activo' : 'Modo lectura'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* PRINTABLE VERSION (HIDDEN ON SCREEN) */}
            <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-0 m-0 overflow-visible">
                <div className="p-12 max-w-4xl mx-auto text-gray-900 font-serif leading-relaxed">
                    
                    {/* 1. PORTADA */}
                    <div className="h-screen flex flex-col justify-between border-8 border-double border-slate-900 p-12 mb-12">
                        <div className="text-center">
                            <div className="flex justify-center mb-8">
                                {state.schoolLogo ? (
                                    <img src={state.schoolLogo} alt="Logo Centro" className="h-32 w-auto" />
                                ) : (
                                    <div className="h-32 w-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">Logo Centro</div>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-700">{state.schoolName}</h2>
                            <p className="text-lg text-slate-500 mt-2">Curso Académico {state.academicYear}</p>
                        </div>

                        <div className="text-center py-20">
                            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400 mb-4">Memoria Intermedia de Proyecto</h3>
                            <h1 className="text-6xl font-black uppercase tracking-tighter text-slate-900 mb-6">{state.concept.name || 'PROYECTO SIN NOMBRE'}</h1>
                            <div className="w-24 h-2 bg-slate-900 mx-auto"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-12 text-sm">
                            <div className="space-y-6">
                                <div>
                                    <p className="font-bold uppercase text-slate-400 text-[10px] tracking-widest mb-1">1.2. Ciclo Formativo y Módulos</p>
                                    <p className="font-bold text-slate-800">Grado Superior en Dirección de Cocina / Servicios de Restauración</p>
                                    <p className="text-slate-600 text-xs mt-1">Módulos: Gestión de la Producción, Diseño de Cartas, Sostenibilidad.</p>
                                </div>
                                <div>
                                    <p className="font-bold uppercase text-slate-400 text-[10px] tracking-widest mb-1">1.3. Integrantes del Equipo</p>
                                    <ul className="font-bold text-slate-800">
                                        {state.team.map(m => <li key={m.id}>{m.name} {m.isCoordinator && '(Coordinador/a)'}</li>)}
                                    </ul>
                                </div>
                            </div>
                            <div className="text-right space-y-6">
                                <div>
                                    <p className="font-bold uppercase text-slate-400 text-[10px] tracking-widest mb-1">1.4. Profesor Responsable</p>
                                    <p className="font-bold text-slate-800">Dpto. Hostelería y Turismo</p>
                                </div>
                                <div>
                                    <p className="font-bold uppercase text-slate-400 text-[10px] tracking-widest mb-1">1.5. Fecha de Presentación</p>
                                    <p className="font-bold text-slate-800">{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="page-break" />

                    {/* ÍNDICE */}
                    <div className="py-12 min-h-screen">
                        <h2 className="text-3xl font-bold mb-12 border-b-2 border-slate-900 pb-4">Índice del Trabajo</h2>
                        <div className="space-y-4 text-lg">
                            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                                <span className="font-bold">1. Portada</span>
                                <span>1</span>
                            </div>
                            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                                <span className="font-bold">2. Resumen</span>
                                <span>2</span>
                            </div>
                            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                                <span className="font-bold">3. Introducción</span>
                                <span>3</span>
                            </div>
                            <div className="pl-6 flex justify-between text-sm text-slate-600">
                                <span>3.1. Contexto y justificación del proyecto</span>
                            </div>
                            <div className="pl-6 flex justify-between text-sm text-slate-600">
                                <span>3.2. Objetivos del proyecto</span>
                            </div>
                            <div className="pl-6 flex justify-between text-sm text-slate-600">
                                <span>3.3. Alcance y limitaciones del trabajo</span>
                            </div>
                            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 pt-2">
                                <span className="font-bold">4. Análisis y contextualización de empresas del sector</span>
                                <span>6</span>
                            </div>
                            <div className="pl-6 flex justify-between text-sm text-slate-600">
                                <span>4.1. Caracterización de empresas del sector</span>
                                <span>6</span>
                            </div>
                            <div className="pl-6 flex justify-between text-sm text-slate-600">
                                <span>4.2. Productos y servicios</span>
                                <span>8</span>
                            </div>
                            <div className="pl-6 flex justify-between text-sm text-slate-600">
                                <span>4.3. Relación con los ODS</span>
                                <span>10</span>
                            </div>
                            <div className="pl-6 flex justify-between text-sm text-slate-600">
                                <span>4.4. Prevención de riesgos laborales</span>
                                <span>12</span>
                            </div>
                            <div className="pl-6 flex justify-between text-sm text-slate-600">
                                <span>4.5. Conclusiones del análisis</span>
                                <span>14</span>
                            </div>
                            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 pt-2">
                                <span className="font-bold">5. Desarrollo del Proyecto</span>
                                <span>16</span>
                            </div>
                            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 pt-2">
                                <span className="font-bold">6. Resultados y discusión</span>
                                <span>20</span>
                            </div>
                            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 pt-2">
                                <span className="font-bold">7. Conclusiones y recomendaciones</span>
                                <span>22</span>
                            </div>
                            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 pt-2">
                                <span className="font-bold">8. Bibliografía y fuentes consultadas</span>
                                <span>24</span>
                            </div>
                            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 pt-2">
                                <span className="font-bold">9. Anexos</span>
                                <span>25</span>
                            </div>
                        </div>
                    </div>

                    <div className="page-break" />

                    {/* 2. RESUMEN E IDENTIDAD (T1) */}
                    <div className="py-12">
                        <h2 className="text-2xl font-bold mb-6 border-b-2 border-slate-900 pb-2">1. Resumen e Identidad del Proyecto</h2>
                        <div className="space-y-6">
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">1.1. Concepto de Marca</h3>
                                <p className="text-3xl font-serif text-slate-900 mb-2">{state.concept.name || 'Nombre del Restaurante'}</p>
                                <p className="text-xl italic text-slate-600">"{state.concept.slogan || 'Eslogan del restaurante'}"</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-bold text-slate-700 mb-2">1.2. Logotipo del Restaurante</h3>
                                    {state.concept.restaurantLogo ? (
                                        <img src={state.concept.restaurantLogo} alt="Logo" className="h-32 w-auto object-contain border p-2 bg-white" />
                                    ) : (
                                        <div className="h-32 w-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">Sin Logo</div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-700 mb-2">1.3. Foto de Equipo</h3>
                                    {state.groupPhoto ? (
                                        <img src={state.groupPhoto} alt="Equipo" className="h-32 w-auto object-cover border p-2 bg-white" />
                                    ) : (
                                        <div className="h-32 w-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">Sin Foto</div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-700 mb-2">1.4. Resumen Ejecutivo</h3>
                                <p className="text-justify">{state.interimReport.summary || 'Pendiente de redacción.'}</p>
                            </div>
                        </div>
                    </div>

                    {/* 3. ANÁLISIS DEL ENTORNO (T2) */}
                    <div className="py-12">
                        <h2 className="text-2xl font-bold mb-6 border-b-2 border-slate-900 pb-2">2. Análisis del Entorno y Contextualización</h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold mb-3">2.1. Contexto y justificación del proyecto</h3>
                                <p className="text-justify">{state.interimReport.introduction.context || 'Pendiente de redacción.'}</p>
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-bold mb-4">2.2. Resultados de la Investigación Individual</h3>
                                <div className="grid gap-4">
                                    {state.task2.tasks.map(task => (
                                        <div key={task.id} className="p-4 border border-slate-200 rounded bg-slate-50 break-inside-avoid">
                                            <h4 className="font-bold text-slate-800 border-b border-slate-200 mb-2 pb-1">{task.title}</h4>
                                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{task.content || 'Sin contenido.'}</p>
                                            <p className="text-[10px] text-slate-400 mt-2 text-right italic">Responsable: {state.team.find(m => m.id === task.assignedToId)?.name || 'Sin asignar'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. CONCEPTUALIZACIÓN (T2) */}
                    <div className="py-12">
                        <h2 className="text-2xl font-bold mb-6 border-b-2 border-slate-900 pb-2">3. Conceptualización y Estrategia</h2>
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-bold mb-2">3.1. Público Objetivo</h3>
                                    <p className="text-sm text-slate-700">{state.concept.targetAudience || 'No definido.'}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-2">3.2. Valores de Marca</h3>
                                    <div className="flex gap-2">
                                        {state.concept.values.map((v, i) => (
                                            <span key={i} className="px-2 py-1 bg-slate-200 rounded text-xs font-bold">{v}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-2">3.3. Objetivos del Proyecto</h3>
                                <p className="text-justify">{state.interimReport.introduction.objectives || 'Pendiente de redacción.'}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-2">3.4. Diferenciación y Propuesta de Valor</h3>
                                <p className="text-justify">{state.interimReport.analysis.products.differentiation || 'Pendiente de redacción.'}</p>
                            </div>
                        </div>
                    </div>

                    {/* 5. OFERTA GASTRONÓMICA (T3) */}
                    <div className="py-12">
                        <h2 className="text-2xl font-bold mb-6 border-b-2 border-slate-900 pb-2">4. Oferta Gastronómica</h2>
                        <div className="space-y-8">
                            <p className="text-justify">{state.interimReport.results || 'Descripción general de la oferta gastronómica diseñada.'}</p>
                            
                            <div className="grid grid-cols-2 gap-6">
                                {state.dishes.map(dish => (
                                    <div key={dish.id} className="border border-slate-300 p-4 rounded-lg break-inside-avoid">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-900">{dish.name}</h4>
                                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border">{dish.type}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 mb-2 line-clamp-3">{dish.description}</p>
                                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
                                            <span className="text-[10px] font-bold text-slate-400">Autor: {state.team.find(m => m.id === dish.author)?.name}</span>
                                            <span className="text-sm font-bold text-slate-900">{dish.price}€</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 6. DESARROLLO Y PROTOTIPO (T4) */}
                    <div className="py-12">
                        <h2 className="text-2xl font-bold mb-6 border-b-2 border-slate-900 pb-2">5. Desarrollo del Prototipo</h2>
                        <div className="space-y-8">
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                                <h3 className="text-lg font-bold mb-2">5.1. Identidad Visual</h3>
                                <p className="text-sm italic">{state.menuPrototype.generalStyle || 'No definida.'}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-bold text-slate-700 mb-2">5.2. Prototipo Digital</h3>
                                    <p className="text-xs text-blue-600 underline break-all">{state.menuPrototype.digitalLink || 'Sin enlace.'}</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-700 mb-2">5.3. Prototipo Físico</h3>
                                    <p className="text-xs text-slate-600">{state.menuPrototype.physicalDescription || 'Sin descripción.'}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-2">5.4. Metodología y Planificación</h3>
                                <div className="space-y-4">
                                    <p className="text-justify"><strong>Metodología:</strong> {state.interimReport.development.methodology || 'Pendiente.'}</p>
                                    <p className="text-justify"><strong>Planificación:</strong> {state.interimReport.development.planning || 'Pendiente.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 7. CONCLUSIONES Y ODS */}
                    <div className="py-12">
                        <h2 className="text-2xl font-bold mb-6 border-b-2 border-slate-900 pb-2">6. Conclusiones y Sostenibilidad</h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold mb-2">6.1. Relación con los ODS</h3>
                                <p className="text-justify">{state.interimReport.analysis.ods.justification || 'Pendiente de redacción.'}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-2">6.2. Conclusiones Finales</h3>
                                <p className="text-justify">{state.interimReport.analysis.conclusions.synthesis || 'Pendiente de redacción.'}</p>
                            </div>
                        </div>
                    </div>

                    {/* 8. BIBLIOGRAFÍA */}
                    <div className="py-12">
                        <h2 className="text-2xl font-bold mb-6 border-b-2 border-slate-900 pb-2">7. Bibliografía</h2>
                        <p className="text-justify whitespace-pre-wrap">{state.interimReport.bibliography || 'Pendiente de redacción.'}</p>
                    </div>

                    {/* ANEXOS */}
                    <div className="py-12">
                        <h2 className="text-2xl font-bold mb-6">Anexos</h2>
                        <p className="text-slate-500 italic">Se adjuntan a continuación las fichas de autoevaluación, evidencias fotográficas y documentación técnica generada durante las fases 1, 2 y 3.</p>
                        
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            {state.menuPrototype.physicalPhoto && (
                                <div className="border p-2 rounded">
                                    <img src={state.menuPrototype.physicalPhoto} alt="Boceto" className="w-full h-auto" />
                                    <p className="text-center text-xs mt-2 font-bold">Anexo: Prototipo Físico</p>
                                </div>
                            )}
                            {state.concept.restaurantLogo && (
                                <div className="border p-2 rounded">
                                    <img src={state.concept.restaurantLogo} alt="Logo" className="w-full h-auto" />
                                    <p className="text-center text-xs mt-2 font-bold">Anexo: Identidad Visual</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
