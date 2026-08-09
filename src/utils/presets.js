// Map Themes & Preset Challenges for TaleBot Pro

export const MAP_THEMES = {
  CLASICO: {
    id: 'CLASICO',
    name: 'Matata Clásico 🎨',
    bgGradient: 'linear-gradient(135deg, #E0F2FE 0%, #F0F9FF 100%)',
    gridBg: '#FFFFFF',
    borderColor: '#93C5FD',
    cellColors: ['#FEF08A', '#BBF7D0', '#BFDBFE', '#FED7AA', '#FBCFE8', '#DDD6FE'],
    icons: {
      start: '🤖',
      target: '⭐️',
      obstacle: '🛑',
      checkpoint: '📍',
      dance: '💃',
      sound: '🎵'
    }
  },
  ESPACIO: {
    id: 'ESPACIO',
    name: 'Espacio Estelar 🚀',
    bgGradient: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
    gridBg: '#0F172A',
    borderColor: '#6366F1',
    cellColors: ['#1E293B', '#334155', '#1E1B4B', '#312E81'],
    textColor: '#F8FAFC',
    icons: {
      start: '🚀',
      target: '🪐',
      obstacle: '☄️',
      checkpoint: '🌌',
      dance: '👽',
      sound: '📡'
    }
  },
  SELVA: {
    id: 'SELVA',
    name: 'Selva Salvaje 🦁',
    bgGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    gridBg: '#F0FDF4',
    borderColor: '#34D399',
    cellColors: ['#DCFCE7', '#FEF9C3', '#E0E7FF', '#FFEDD5'],
    icons: {
      start: '🚙',
      target: '🦁',
      obstacle: '🐍',
      checkpoint: '🍌',
      dance: '🦜',
      sound: '🪘'
    }
  },
  PIRATA: {
    id: 'PIRATA',
    name: 'Isla del Tesoro 🏴‍☠️',
    bgGradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    gridBg: '#FFFBEB',
    borderColor: '#F59E0B',
    cellColors: ['#FEF3C7', '#BAE6FD', '#FDE68A', '#FECA57'],
    icons: {
      start: '🏴‍☠️',
      target: '💎',
      obstacle: '💣',
      checkpoint: '🪙',
      dance: '🦜',
      sound: '⛵️'
    }
  },
  ROTULADOR: {
    id: 'ROTULADOR',
    name: 'Lienzo Limpio (Para Rotuladores) 🖊️',
    bgGradient: '#FFFFFF',
    gridBg: '#FFFFFF',
    borderColor: '#CBD5E1',
    cellColors: ['#FFFFFF'],
    icons: {
      start: '🤖',
      target: '🎯',
      obstacle: '⛔️',
      checkpoint: '📍',
      dance: '💃',
      sound: '🎵'
    }
  }
};

export const PRESET_CHALLENGES = [
  {
    id: 'challenge_1',
    title: '¡El primer viaje del robot!',
    story: 'Ayuda a TaleBot a llegar hasta la estrella dorada evitando la señal de alto.',
    difficulty: 1,
    orientation: 'landscape',
    numRows: 5,
    numCols: 4,
    theme: 'CLASICO',
    start: { r: 4, c: 0, dir: 0 },
    target: { r: 0, c: 3 },
    obstacles: [{ r: 2, c: 1 }],
    commands: [
      { id: 'FORWARD' },
      { id: 'FORWARD' },
      { id: 'FORWARD' },
      { id: 'FORWARD' },
      { id: 'TURN_RIGHT' },
      { id: 'FORWARD' },
      { id: 'FORWARD' },
      { id: 'FORWARD' },
      { id: 'DANCE' }
    ]
  },
  {
    id: 'challenge_2',
    title: 'Misión Espacial: Planeta Saturno',
    story: 'Pilota la nave TaleBot esquivando los meteoritos para llevar la sonda a Saturno.',
    difficulty: 2,
    orientation: 'landscape',
    numRows: 5,
    numCols: 4,
    theme: 'ESPACIO',
    start: { r: 4, c: 0, dir: 1 },
    target: { r: 0, c: 3 },
    obstacles: [{ r: 4, c: 2 }, { r: 2, c: 0 }],
    commands: [
      { id: 'FORWARD' },
      { id: 'FORWARD' },
      { id: 'FORWARD' },
      { id: 'TURN_LEFT' },
      { id: 'FORWARD' },
      { id: 'FORWARD' },
      { id: 'FORWARD' },
      { id: 'SOUND' }
    ]
  },
  {
    id: 'challenge_3',
    title: 'Dibujando un Cuadrado Perfecto',
    story: '¡Coloca el rotulador a TaleBot y haz que dibuje un cuadrado en el lienzo!',
    difficulty: 2,
    orientation: 'landscape',
    numRows: 5,
    numCols: 4,
    theme: 'ROTULADOR',
    start: { r: 4, c: 0, dir: 0 },
    target: { r: 4, c: 0 },
    obstacles: [],
    penMarkerMode: true,
    commands: [
      { id: 'PEN_DOWN' },
      { id: 'FORWARD' }, { id: 'FORWARD' },
      { id: 'TURN_RIGHT' },
      { id: 'FORWARD' }, { id: 'FORWARD' },
      { id: 'TURN_RIGHT' },
      { id: 'FORWARD' }, { id: 'FORWARD' },
      { id: 'TURN_RIGHT' },
      { id: 'FORWARD' }, { id: 'FORWARD' },
      { id: 'DANCE' }
    ]
  },
  {
    id: 'challenge_4',
    title: 'Búsqueda del Tesoro en la Isla',
    story: 'Consigue la moneda de oro y luego navega con cuidado hasta el gran cofre con diamantes.',
    difficulty: 3,
    orientation: 'landscape',
    numRows: 5,
    numCols: 4,
    theme: 'PIRATA',
    start: { r: 0, c: 0, dir: 1 },
    target: { r: 4, c: 3 },
    obstacles: [{ r: 0, c: 2 }, { r: 2, c: 1 }],
    commands: [
      { id: 'FORWARD' },
      { id: 'TURN_RIGHT' },
      { id: 'FORWARD' },
      { id: 'FORWARD' },
      { id: 'TURN_LEFT' },
      { id: 'FORWARD' },
      { id: 'FORWARD' },
      { id: 'DANCE' }
    ]
  }
];
