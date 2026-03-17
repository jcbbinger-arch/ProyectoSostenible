
import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Palette, ExternalLink, Upload, PenTool, Layout, Eye } from 'lucide-react';

export const Task4_MenuPrototype: React.FC = () => {
  const { state, updateMenuPrototype } = useProject();
  const [activeTab, setActiveTab] = useState<'instructions' | 'development'>('instructions');

  // PERMISOS: Habilitados para todos
  const isCoordinator = true;

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

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-900">Tarea 4: Prototipo de Carta</h2>
            <p className="text-gray-600 mt-2">Diseño Visual (Noviembre - Diciembre)</p>
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
                Desarrollo
            </button>
        </div>
      </div>

      {activeTab === 'instructions' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
             <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Guía de la Tarea 4</h3>
             <div className="prose max-w-none text-gray-700 space-y-6">
                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-bold text-green-900 mt-0">Objetivo</h4>
                    <p>Crear la carta, documentarla y diseñar una primera versión (un prototipo) de sus soportes visuales.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Layout className="text-purple-600" />
                            <h4 className="font-bold text-lg m-0">Misión 4.A: El Prototipador Digital</h4>
                        </div>
                        <p className="text-sm"><strong>Tarea:</strong> Crear una versión 0.1 (borrador) de la carta virtual en Canva. No tiene que ser perfecta, pero debe mostrar la estructura y el estilo visual.</p>
                        <p className="text-sm mt-2 font-bold">Entregable: Enlace público al diseño de Canva.</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                         <div className="flex items-center gap-2 mb-4">
                            <PenTool className="text-orange-600" />
                            <h4 className="font-bold text-lg m-0">Misión 4.B: El Prototipador Físico</h4>
                        </div>
                        <p className="text-sm"><strong>Tarea:</strong> Crear un boceto o una maqueta sencilla de la carta física (dibujo, collage, cartulina...).</p>
                         <p className="text-sm mt-2 font-bold">Entregable: Foto del boceto y breve explicación.</p>
                    </div>
                </div>

                 <div className="mt-4 bg-gray-50 p-4 rounded text-sm text-gray-600">
                    <strong>Nota:</strong> Estos entregables se añadirán automáticamente al Nuevo Capítulo "Prototipo de Diseño de Carta" en la Memoria Parcial.
                </div>
                 <div className="flex justify-center mt-6">
                    <button onClick={() => setActiveTab('development')} className="bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow hover:bg-green-700">
                        Comenzar Prototipado
                    </button>
                 </div>
             </div>
        </div>
      )}

      {activeTab === 'development' && (
        <div className="space-y-8">
            
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-center gap-3">
                <Eye className="text-blue-600" />
                <p className="text-sm text-blue-800">
                    <strong>Modo Colaborativo:</strong> Todos los miembros tienen acceso para ver y editar los prototipos del equipo.
                </p>
            </div>

            {/* General Style */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Palette size={20} className="text-gray-500" /> Identidad Visual General
                </h3>
                <label className="block text-sm text-gray-600 mb-2">Explica brevemente la idea visual general (colores, tipografías, materiales que evocan la zona...)</label>
                <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 min-h-[100px]"
                    placeholder="Ej: Usaremos tonos ocres y verdes para recordar a la huerta..."
                    value={state.menuPrototype.generalStyle}
                    onChange={(e) => updateMenuPrototype({ generalStyle: e.target.value })}
                />
            </section>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Digital */}
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
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
                            className="flex-1 p-2 border border-gray-300 rounded"
                            placeholder="https://www.canva.com/..."
                            value={state.menuPrototype.digitalLink}
                            onChange={(e) => updateMenuPrototype({ digitalLink: e.target.value })}
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
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
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
                                    <button 
                                        onClick={() => updateMenuPrototype({ physicalPhoto: null })}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ) : (
                                <label className="cursor-pointer flex flex-col items-center text-gray-500 hover:text-orange-600">
                                    <Upload size={32} className="mb-2" />
                                    <span className="text-sm font-bold">Subir Foto</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                </label>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Explicación del Formato Físico</label>
                        <textarea 
                             className="w-full p-2 border border-gray-300 rounded"
                             rows={3}
                             placeholder="Ej: Será un díptico en papel reciclado con textura..."
                             value={state.menuPrototype.physicalDescription}
                             onChange={(e) => updateMenuPrototype({ physicalDescription: e.target.value })}
                        />
                    </div>
                </section>
            </div>
        </div>
      )}
    </div>
  );
};
