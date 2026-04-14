
import { Zone, MicroTask, ProjectState, ChecklistItem } from './types';

export const ZONES: Zone[] = [
  {
    id: 1,
    name: 'Altiplano',
    territory: 'Jumilla, Yecla',
    concept: 'Vino y Cordero',
    ingredients: ['Uva Monastrell', 'Pera de Jumilla', 'Cordero Segureño', 'Queso al Vino', 'Aceite de Oliva', 'Embutidos locales']
  },
  {
    id: 2,
    name: 'Noroeste',
    territory: 'Caravaca, Moratalla, Cehegín',
    concept: 'Arroz y Tesoros del Bosque',
    ingredients: ['Arroz de Calasparra', 'Trufa Negra', 'Setas de temporada', 'Miel', 'Nueces', 'Caza menor', 'Dulces tradicionales']
  },
  {
    id: 3,
    name: 'Vega Alta del Segura',
    territory: 'Cieza, Abarán, Blanca',
    concept: 'La Huerta de Fruta Dulce',
    ingredients: ['Melocotón de Cieza', 'Albaricoque', 'Ciruela', 'Uva de mesa', 'Olivas de mesa', 'Almendras']
  },
  {
    id: 4,
    name: 'Valle de Ricote',
    territory: 'Ricote, Ojós, Archena',
    concept: 'Cítricos y Herencia Morisca',
    ingredients: ['Limón', 'Naranja', 'Dátiles', 'Granadas', 'Hierbas aromáticas', 'Aceite de oliva']
  },
  {
    id: 5,
    name: 'Vega Media del Segura',
    territory: 'Molina de Segura, Alguazas',
    concept: 'El Reino de la Hortaliza',
    ingredients: ['Pimiento de bola', 'Brócoli', 'Alcachofa', 'Coliflor', 'Apio', 'Conservas vegetales']
  },
  {
    id: 6,
    name: 'Huerta de Murcia',
    territory: 'Murcia Capital, Santomera',
    concept: 'Tapeo y Tradición Huertana',
    ingredients: ['Pimentón de Murcia', 'Ñora', 'Haba tierna', 'Guisantes', 'Calabacín', 'Berenjena', 'Tomate']
  },
  {
    id: 7,
    name: 'Valle del Guadalentín',
    territory: 'Lorca, Totana, Alhama',
    concept: 'Cerdo, Pimiento y Almendra',
    ingredients: ['Chato Murciano', 'Pimiento', 'Almendra', 'Embutidos de Lorca', 'Alcaparras', 'Tortada Lorquina']
  },
  {
    id: 8,
    name: 'Bajo Guadalentín',
    territory: 'Mazarrón, Águilas',
    concept: 'Gamba Roja y Tomate de Verano',
    ingredients: ['Gamba Roja de Águilas', 'Tomate de Mazarrón', 'Pescado de roca', 'Salazones', 'Ajos']
  },
  {
    id: 9,
    name: 'Campo de Cartagena',
    territory: 'Cartagena, Torre-Pacheco',
    concept: 'Melón y Sabores del Mundo',
    ingredients: ['Melón de Torre-Pacheco', 'Cordero', 'Conejo', 'Patata', 'Almendra', 'Café Asiático']
  },
  {
    id: 10,
    name: 'Mar Menor',
    territory: 'San Javier, San Pedro, Los Alcázares',
    concept: 'Sabores de la Laguna Salada',
    ingredients: ['Pescados del Mar Menor', 'Langostinos', 'Sal de las salinas', 'Arroz Caldero', 'Hueva', 'Mojama']
  }
];

export const INITIAL_MICRO_TASKS: MicroTask[] = [
    { id: 1, title: 'Mapeo de la Competencia', description: 'Identificar restaurantes similares en la zona.', deliverableHint: 'Imagen del mapa o lista de competidores.', assignedToId: null, content: '' },
    { id: 2, title: 'Análisis de Cartas y Precios', description: 'Analizar oferta y precios de 3 competidores.', deliverableHint: 'Resumen de platos y precios medios.', assignedToId: null, content: '' },
    { id: 3, title: 'Reseñas y Reputación Online', description: 'Leer reseñas en Google/TripAdvisor.', deliverableHint: 'Resumen de qué gusta y qué no.', assignedToId: null, content: '' },
    { id: 4, title: 'Perfil del Cliente Local', description: '¿Quién vive allí? ¿Qué buscan?', deliverableHint: 'Informe del perfil del residente.', assignedToId: null, content: '' },
    { id: 5, title: 'Perfil del Turista/Visitante', description: '¿Quién visita la zona?', deliverableHint: 'Informe del perfil del visitante.', assignedToId: null, content: '' },
    { id: 6, title: 'Catálogo de Producto', description: 'Ingredientes clave por temporada.', deliverableHint: 'Lista de 15-20 ingredientes.', assignedToId: null, content: '' },
    { id: 7, title: 'Mapa de Proveedores Km0', description: 'Búsqueda de productores locales.', deliverableHint: 'Ficha de 3-5 proveedores reales.', assignedToId: null, content: '' },
    { id: 8, title: 'Auditoría Sostenible', description: 'Prácticas sostenibles viables en la zona.', deliverableHint: 'Informe sobre sostenibilidad.', assignedToId: null, content: '' },
    { id: 9, title: 'Benchmarking Innovación', description: 'Buscar ideas en otros lugares.', deliverableHint: 'Informe de 2 restaurantes inspiradores.', assignedToId: null, content: '' },
    { id: 10, title: 'Tendencias Visuales', description: 'Estética y Marketing.', deliverableHint: 'Moodboard o enlaces a 5 perfiles de Instagram.', assignedToId: null, content: '' },
];

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 't1_team', label: 'Tarea 1: Configuración del equipo', status: 'not_started', category: 'group' },
  { id: 't1_zone', label: 'Tarea 1: Selección de zona y justificación', status: 'not_started', category: 'group' },
  { id: 't2_research', label: 'Tarea 2: Investigación individual (Micro-tareas)', status: 'not_started', category: 'individual' },
  { id: 't2_concept', label: 'Tarea 2: Definición del concepto del restaurante', status: 'not_started', category: 'group' },
  { id: 't4_menu', label: 'Tarea 4: Diseño del menú y prototipo', status: 'not_started', category: 'group' },
  { id: 't5_financials', label: 'Tarea 5: Escandallos y precios', status: 'not_started', category: 'group' },
  { id: 't6_final', label: 'Tarea 6: Memoria final y roles', status: 'not_started', category: 'group' },
  { id: 'interim_report', label: 'Informe Intermedio', status: 'not_started', category: 'group' },
  { id: 'co_evaluation', label: 'Coevaluación del equipo', status: 'not_started', category: 'individual' },
];

export const ALLERGENS = [
    { id: 'gluten', name: 'Gluten', icon: '🌾' },
    { id: 'crustaceans', name: 'Crustáceos', icon: '🦀' },
    { id: 'eggs', name: 'Huevos', icon: '🥚' },
    { id: 'fish', name: 'Pescado', icon: '🐟' },
    { id: 'peanuts', name: 'Cacahuetes', icon: '🥜' },
    { id: 'soy', name: 'Soja', icon: '🌱' },
    { id: 'milk', name: 'Lácteos', icon: '🥛' },
    { id: 'nuts', name: 'Frutos de Cáscara', icon: '🌰' },
    { id: 'celery', name: 'Apio', icon: '🥬' },
    { id: 'mustard', name: 'Mostaza', icon: '🌭' },
    { id: 'sesame', name: 'Sésamo', icon: '🥯' },
    { id: 'sulphites', name: 'Sulfitos', icon: '🍷' },
    { id: 'lupin', name: 'Altramuces', icon: '🌼' },
    { id: 'molluscs', name: 'Moluscos', icon: '🐙' }
];

export const INITIAL_STATE: ProjectState = {
  currentUser: null,
  schoolName: 'C.I.F.P. de Hostelería y Turismo',
  schoolLogo: null,
  academicYear: '2025/26',
  teamName: '',
  groupPhoto: null,
  selectedZone: null,
  zoneJustification: '',
  task2: {
    tasks: INITIAL_MICRO_TASKS
  },
  concept: {
    name: '',
    slogan: '',
    targetAudience: '',
    values: [],
    restaurantLogo: null
  },
  missions: {
    explorer: { mapUrl: '', menuAnalysis: '', gapAnalysis: '' },
    connector: { targetAudience: '', surveyResults: '', idealCustomer: '' },
    guardian: { ingredients: '', supplierInfo: '', coreIngredients: '' }
  },
  dishes: [],
  menuPrototype: {
    generalStyle: '',
    digitalLink: '',
    physicalPhoto: null,
    physicalDescription: ''
  },
  task6: {
    designerIds: [],
    artisanIds: [],
    editorIds: []
  },
  team: [],
  isTeamClosed: false,
  seasonalProducts: [],
  coEvaluations: [],
  interimReport: {
    summary: '',
    introduction: {
      context: '',
      objectives: '',
      scope: ''
    },
    analysis: {
      companies: {
        identification: '',
        economicAnalysis: '',
        selectionJustification: ''
      },
      products: {
        identification: '',
        targetAudience: '',
        differentiation: ''
      },
      ods: {
        identification: '',
        justification: ''
      },
      laborRisks: {
        identification: '',
        measures: ''
      },
      conclusions: {
        synthesis: '',
        proposals: ''
      }
    },
    development: {
      planning: '',
      methodology: '',
      resources: ''
    },
    results: '',
    conclusions: '',
    recommendations: '',
    bibliography: ''
  },
  checklist: INITIAL_CHECKLIST
};
