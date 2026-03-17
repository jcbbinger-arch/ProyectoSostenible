
import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Lightbulb, Printer, ChevronDown, ChevronUp, Lock, AlertTriangle, Save, CheckCircle } from 'lucide-react';

export const Task2_Analysis: React.FC = () => {
  const { state, updateTaskContent, updateConcept } = useProject();
  const [activeTab, setActiveTab] = useState<'instructions' | 'execution' | 'concept' | 'deliverable'>('instructions');
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handlePrint = () => window.print();

  // Helper to count tasks per member
  const getTaskCount = (memberId: string) => state.task2.tasks.filter(t => t.assignedToId === memberId).length;

  // PERMISOS: Todos tienen permisos de edición (equipo colaborativo total)
  const isCoordinator = true;

  const handleSaveConcept = () => {
    // Visual feedback for the user (data is already in state/localStorage via onChange)
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center no-print gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-900">Tarea 2: Análisis y Conceptualización</h2>
            <p className="text-gray-600 mt-2">Fase 1 - Inmersión | Entrega: Finales Octubre</p>
        </div>
        <div className="flex flex-wrap gap-2">
            {[
                { id: 'instructions', label: '1. Instrucciones' },
                { id: 'execution', label: '2. Investigación' },
                { id: 'concept', label: '3. Decisión' },
                { id: 'deliverable', label: '4. Entregable' },
            ].map(tab => (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        activeTab === tab.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-500 hover:bg-gray-100 border'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* TAB 1: INSTRUCTIONS */}
      {activeTab === 'instructions' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Guía de la Tarea 2</h3>
            <div className="prose max-w-none text-gray-700 space-y-4">
                 <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-bold text-blue-900">Objetivo</h4>
                    <p>Convertiros en expertos de la zona elegida y definir el concepto del restaurante. Trabajo grupal con reparto individual.</p>
                </div>
                
                <h4 className="font-bold text-lg mt-6">Pasos:</h4>
                <ul className="list-disc pl-5">
                    <li><strong>Paso 1: Ejecución.</strong> Cada miembro completa sus "mini-informes" asignados (repartidos en la Tarea 1).</li>
                    <li><strong>Paso 2: Conceptualización.</strong> Definid nombre, concepto y valores.</li>
                </ul>
            </div>
        </div>
      )}

      {/* TAB 3: EXECUTION */}
      {activeTab === 'execution' && (
        <div className="space-y-4">
             <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
                <p className="text-sm text-green-800">
                    <strong>Zona de trabajo:</strong> Selecciona tu tarea asignada y completa el mini-informe.
                    {state.currentUser && <span> Estás identificado como: <strong>{state.team.find(m => m.id === state.currentUser)?.name}</strong></span>}
                </p>
             </div>
             
             {state.task2.tasks.map(task => {
                const assignee = state.team.find(m => m.id === task.assignedToId);
                const isExpanded = expandedTask === task.id;
                const isCompleted = task.content.length > 20;
                
                // LOCK LOGIC: Everyone can edit everything now
                const isLocked = false; 

                return (
                    <div key={task.id} className={`bg-white border rounded-xl transition-all ${isExpanded ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'}`}>
                        <div 
                            className="p-4 flex justify-between items-center cursor-pointer"
                            onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {task.id}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                        {task.title}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                        Responsable: <span className="font-medium text-blue-600">{assignee ? assignee.name : 'Sin asignar'}</span>
                                    </p>
                                </div>
                            </div>
                            {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                        </div>

                        {isExpanded && (
                            <div className="p-4 border-t bg-gray-50 rounded-b-xl">
                                <div className="mb-2 text-xs text-gray-500 font-medium uppercase">
                                    Entregable esperado: {task.deliverableHint}
                                </div>
                                <textarea 
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                                    placeholder="Escribe aquí tu mini-informe..."
                                    value={task.content}
                                    onChange={(e) => updateTaskContent(task.id, e.target.value)}
                                />
                                <div className="mt-2 text-right">
                                    <span className="text-xs text-gray-400">{task.content.length} caracteres</span>
                                </div>
                            </div>
                        )}
                    </div>
                );
             })}
        </div>
      )}

      {/* TAB 4: CONCEPTUALIZATION */}
      {activeTab === 'concept' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
             <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Lightbulb className="text-yellow-500" /> Decisión Grupal: El Concepto
            </h3>

            <p className="text-sm text-gray-600 mb-6">
                Tras analizar toda la información, definid la identidad del restaurante. (Cualquier miembro puede registrar los datos).
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Restaurante</label>
                    <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Raíces del Valle"
                        value={state.concept.name}
                        onChange={(e) => updateConcept('name', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Concepto Principal</label>
                    <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Barra gastronómica de salazones..."
                    />
                    <p className="text-xs text-gray-400 mt-1">Define el tipo de cocina y servicio en una frase.</p>
                </div>
            </div>

            <div className="mb-6">
                 <label className="block text-sm font-bold text-gray-700 mb-2">Propuesta de Valor (Eslogan)</label>
                 <input 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="El eslogan que os define..."
                    value={state.concept.slogan}
                    onChange={(e) => updateConcept('slogan', e.target.value)}
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Público Objetivo Final</label>
                <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                    value={state.concept.targetAudience}
                    onChange={(e) => updateConcept('targetAudience', e.target.value)}
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Valores (3 Adjetivos)</label>
                <div className="flex gap-4">
                    {[0, 1, 2].map((i) => (
                        <input 
                            key={i}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder={`Valor ${i + 1}`}
                            value={state.concept.values[i] || ''}
                            onChange={(e) => {
                                const newValues = [...state.concept.values];
                                newValues[i] = e.target.value;
                                updateConcept('values', newValues);
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* SAVE BUTTON SECTION */}
            <div className="mt-8 flex items-center justify-end gap-4 border-t pt-6">
                {showSaveSuccess && (
                    <div className="flex items-center gap-2 text-green-600 font-bold animate-pulse">
                        <CheckCircle size={20} />
                        <span>¡Cambios guardados correctamente!</span>
                    </div>
                )}
                <button 
                    onClick={handleSaveConcept}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold shadow-md transition-all bg-green-600 text-white hover:bg-green-700 hover:scale-105"
                >
                    <Save size={20} /> Guardar Decisión
                </button>
            </div>
        </div>
      )}

      {/* TAB 5: DELIVERABLE */}
      {activeTab === 'deliverable' && (
        <div className="flex flex-col items-center">
             <div className="mb-6 flex gap-4 no-print">
                 <button 
                    onClick={handlePrint}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Printer size={20} /> Imprimir Entregable Tarea 2
                </button>
            </div>

            <div className="bg-white p-12 shadow-2xl w-full max-w-4xl min-h-[1000px] print:shadow-none print:w-full print:p-0">
                {/* Standard Header */}
                <div className="flex justify-between items-center border-b-2 border-gray-900 pb-4 mb-8">
                    <div className="flex items-center gap-4">
                        {state.schoolLogo && (
                            <img src={state.schoolLogo} alt="Logo Centro" className="h-16 w-auto object-contain" />
                        )}
                        {!state.schoolLogo && <div className="h-16 w-16 bg-gray-100 flex items-center justify-center text-xs text-gray-400">Sin Logo</div>}
                    </div>
                    <div className="text-right">
                        <h2 className="text-lg font-bold text-gray-900">{state.schoolName}</h2>
                        <p className="text-sm text-gray-600">Curso {state.academicYear}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold uppercase tracking-wide text-gray-900 mb-1">Entregable Tarea 2</h1>
                    <h2 className="text-xl text-gray-600">Análisis del Entorno y Conceptualización</h2>
                    <p className="mt-2 text-sm text-gray-500">Equipo: {state.teamName}</p>
                </div>

                {/* PART A */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-blue-900 mb-6 border-b pb-2">Parte A: Anexos de Investigación</h3>
                    <div className="space-y-6">
                        {state.task2.tasks.map(task => {
                            const assignee = state.team.find(m => m.id === task.assignedToId);
                            return (
                                <div key={task.id} className="break-inside-avoid mb-6 bg-gray-50 p-4 rounded border border-gray-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-800">{task.title}</h4>
                                        <span className="text-xs bg-white px-2 py-1 rounded border">
                                            Autor: {assignee?.name || 'N/A'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {task.content || <span className="text-gray-400 italic">Contenido no completado.</span>}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="page-break" />

                {/* PART B */}
                <div className="break-before-page">
                    <h3 className="text-2xl font-bold text-blue-900 mb-6 border-b pb-2">Parte B: Ficha de Conceptualización</h3>
                    
                    <div className="border-2 border-gray-800 p-8 rounded-lg bg-white">
                        <div className="grid gap-8">
                            <div>
                                <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Nombre del Restaurante</h4>
                                <div className="text-3xl font-serif text-gray-900">{state.concept.name || "____________________"}</div>
                            </div>
                            
                            <div>
                                <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Concepto Principal / Eslogan</h4>
                                <div className="text-xl text-gray-800 italic">"{state.concept.slogan || "____________________"}"</div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Público Objetivo Final</h4>
                                <div className="text-md text-gray-700 border p-4 rounded bg-gray-50 min-h-[80px]">
                                    {state.concept.targetAudience || "Definición pendiente."}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Valores Fundamentales</h4>
                                <div className="flex gap-4">
                                    {state.concept.values.map((val, i) => (
                                        <div key={i} className="flex-1 border p-3 text-center font-bold bg-blue-50 rounded">
                                            {val || `Valor ${i+1}`}
                                        </div>
                                    ))}
                                    {state.concept.values.length === 0 && <span className="text-gray-400">Sin valores definidos.</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
                     Murcia Sostenible - Fase 1
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
