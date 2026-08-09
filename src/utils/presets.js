// Map Themes & Preset Challenges for TaleBot Pro
//
// Cada tema define un tapete (mat) y dos tonos de casilla que se alternan en
// damero. Dos tonos, no seis: el color con significado es el del robot, la
// meta y los obstáculos — el tapete solo tiene que sostenerlos.

export const MAP_THEMES = {
  CLASICO: {
    id: 'CLASICO',
    name: 'Estudio',
    emoji: '🎨',
    bgGradient: 'linear-gradient(160deg, #F3EDE3 0%, #EDE5D9 100%)',
    gridBg: '#FFFFFF',
    borderColor: 'rgba(26,20,16,.07)',
    coordColor: 'rgba(26,20,16,.34)',
    blockedBg: '#FDEAE0',
    cellColors: ['#FFFFFF', '#FBF7F1'],
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
    name: 'Órbita',
    emoji: '🚀',
    bgGradient: 'linear-gradient(160deg, #10152E 0%, #171F44 100%)',
    gridBg: '#141B3A',
    borderColor: 'rgba(140,165,255,.16)',
    coordColor: 'rgba(220,230,255,.45)',
    blockedBg: '#2A1B3D',
    cellColors: ['#1A2350', '#151C43'],
    textColor: '#F4F6FF',
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
    name: 'Selva',
    emoji: '🦁',
    bgGradient: 'linear-gradient(160deg, #E4EFDD 0%, #D8E8CF 100%)',
    gridBg: '#F4F9F0',
    borderColor: 'rgba(30,60,25,.10)',
    coordColor: 'rgba(30,60,25,.38)',
    blockedBg: '#FBE7DC',
    cellColors: ['#FBFDF8', '#F0F7EA'],
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
    name: 'Isla',
    emoji: '🏴‍☠️',
    bgGradient: 'linear-gradient(160deg, #F1E2C6 0%, #E8D5B0 100%)',
    gridBg: '#FFFDF6',
    borderColor: 'rgba(90,60,15,.12)',
    coordColor: 'rgba(90,60,15,.42)',
    blockedBg: '#F6DFC8',
    cellColors: ['#FFFCF4', '#F9F1E1'],
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
    name: 'Lienzo',
    emoji: '🖊️',
    bgGradient: '#EFEAE2',
    gridBg: '#FFFFFF',
    borderColor: 'rgba(26,20,16,.10)',
    coordColor: 'rgba(26,20,16,.30)',
    blockedBg: '#F6F2EC',
    cellColors: ['#FFFFFF', '#FFFFFF'],
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
    numRows: 4,
    numCols: 5,
    theme: 'CLASICO',
    start: { r: 3, c: 0, dir: 0 },
    target: { r: 0, c: 4 },
    obstacles: [{ r: 2, c: 2 }],
    commands: [
      { id: 'FORWARD' },
      { id: 'FORWARD' },
      { id: 'FORWARD' },
      { id: 'TURN_RIGHT' },
      { id: 'FORWARD' },
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
    numRows: 4,
    numCols: 5,
    theme: 'ESPACIO',
    start: { r: 3, c: 0, dir: 1 },
    target: { r: 0, c: 4 },
    obstacles: [{ r: 3, c: 2 }, { r: 1, c: 0 }],
    commands: [
      { id: 'FORWARD' },
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
    numRows: 4,
    numCols: 5,
    theme: 'ROTULADOR',
    start: { r: 3, c: 0, dir: 0 },
    target: { r: 3, c: 0 },
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
    numRows: 4,
    numCols: 5,
    theme: 'PIRATA',
    start: { r: 0, c: 0, dir: 1 },
    target: { r: 3, c: 4 },
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
