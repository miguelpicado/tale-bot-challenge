import React, { useState } from 'react';
import { SHAPE_PRESETS, COMMAND_TYPES, solveNavigationPath, generateRandomNoRepeatPath } from '../utils/talebotEngine';
import { Compass, PenTool, Shuffle, PlusCircle, X } from 'lucide-react';

export default function NewChallengeModal({
  numRows = 3,
  numCols = 4,
  onSelectChallengeMode,
  onClose
}) {
  const [obstacleCount, setObstacleCount] = useState(1);
  const [stepCount, setStepCount] = useState(6);

  const handleGenerateNavigation = () => {
    let start, target, obstacles, commands;
    let attempts = 0;

    while (attempts < 50) {
      attempts++;
      const startR = Math.floor(Math.random() * numRows);
      const startC = Math.floor(Math.random() * numCols);
      const startDir = Math.floor(Math.random() * 4);
      start = { r: startR, c: startC, dir: startDir };

      let targetR = Math.floor(Math.random() * numRows);
      let targetC = Math.floor(Math.random() * numCols);
      while (targetR === startR && targetC === startC) {
        targetR = Math.floor(Math.random() * numRows);
        targetC = Math.floor(Math.random() * numCols);
      }
      target = { r: targetR, c: targetC };

      obstacles = [];
      for (let i = 0; i < obstacleCount; i++) {
        let obsR = Math.floor(Math.random() * numRows);
        let obsC = Math.floor(Math.random() * numCols);
        if (
          (obsR !== start.r || obsC !== start.c) &&
          (obsR !== target.r || obsC !== target.c) &&
          !obstacles.some(o => o.r === obsR && o.c === obsC)
        ) {
          obstacles.push({ r: obsR, c: obsC, type: 'ALTO' });
        }
      }

      commands = solveNavigationPath(start, target, obstacles, numRows, numCols);
      if (commands && commands.length > 0) {
        commands.push(COMMAND_TYPES.DANCE);
        break;
      }
    }

    onSelectChallengeMode({
      modeName: 'Navegación y Obstáculos',
      title: '¡Misión de Navegación Especial!',
      story: 'Ayuda a TaleBot a esquivar los obstáculos y alcanzar la estrella meta.',
      start,
      target,
      obstacles,
      commands,
      penMarkerMode: false,
      isDrawingMode: false
    });
    onClose();
  };

  const handleSelectShapeMode = () => {
    const defaultShape = SHAPE_PRESETS[0];
    onSelectChallengeMode({
      modeName: 'Dibujo y Formas',
      title: `Forma: ${defaultShape.name}`,
      story: defaultShape.description,
      start: defaultShape.start,
      target: defaultShape.start,
      obstacles: [],
      commands: defaultShape.commands,
      penMarkerMode: true,
      isDrawingMode: true
    });
    onClose();
  };

  // Generate random non-repeating path (no cell repeated!)
  const handleGenerateRandomNoRepeat = () => {
    const generated = generateRandomNoRepeatPath(numRows, numCols, stepCount);
    onSelectChallengeMode({
      modeName: 'Ruta Aleatoria (Sin Repetir Casilla)',
      title: '¡Recorrido Aleatorio Sorpresa!',
      story: 'Sigue la secuencia misteriosa sin repetir ninguna casilla del mapa.',
      start: generated.start,
      target: generated.target,
      obstacles: [],
      commands: generated.commands,
      penMarkerMode: false,
      isDrawingMode: false
    });
    onClose();
  };

  const handleBlankChallenge = () => {
    onSelectChallengeMode({
      modeName: 'Lienzo en Blanco',
      title: '¡Nuevo Reto Personalizado!',
      story: 'Dibuja y programa tu propio recorrido en el mapa.',
      start: { r: numRows - 1, c: 0, dir: 0 },
      target: { r: 0, c: numCols - 1 },
      obstacles: [],
      commands: [],
      penMarkerMode: false,
      isDrawingMode: false
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="tb-card" style={{
        width: '100%',
        maxWidth: '620px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        padding: '1.8rem'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <PlusCircle size={26} color="#FF6900" />
            <h2 style={{ fontFamily: 'Fredoka', color: '#0F172A', fontSize: '1.4rem' }}>
              Crear Nuevo Reto para TaleBot Pro
            </h2>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="#64748B" />
          </button>
        </div>

        {/* Options Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          {/* Option 1: Navigation */}
          <div style={{
            background: '#F0F9FF',
            border: '2px solid #BAE6FD',
            borderRadius: '16px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.6rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'Fredoka', fontWeight: 700, color: '#0369A1', fontSize: '1rem' }}>
                <Compass size={20} /> Navegación
              </div>
              <p style={{ fontSize: '0.75rem', color: '#0284C7', marginTop: '4px' }}>
                Desafíos con obstáculos recortables resueltos con IA.
              </p>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369A1', display: 'block', marginBottom: '2px' }}>
                Obstáculos: {obstacleCount}
              </label>
              <input
                type="range"
                min="0"
                max="3"
                value={obstacleCount}
                onChange={(e) => setObstacleCount(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#00A3FF' }}
              />
            </div>

            <button onClick={handleGenerateNavigation} className="tb-btn tb-btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem', justifyContent: 'center' }}>
              Generar Navegación
            </button>
          </div>

          {/* Option 2: Random No-Repeat */}
          <div style={{
            background: '#F5F3FF',
            border: '2px solid #DDD6FE',
            borderRadius: '16px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.6rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'Fredoka', fontWeight: 700, color: '#6D28D9', fontSize: '1rem' }}>
                <Shuffle size={20} /> Ruta Aleatoria (Sin Repetir)
              </div>
              <p style={{ fontSize: '0.75rem', color: '#7C3AED', marginTop: '4px' }}>
                Avanza siempre a casillas sin repetir ninguna casilla previa.
              </p>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6D28D9', display: 'block', marginBottom: '2px' }}>
                Pasos: {stepCount}
              </label>
              <input
                type="range"
                min="3"
                max="8"
                value={stepCount}
                onChange={(e) => setStepCount(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#8B5CF6' }}
              />
            </div>

            <button onClick={handleGenerateRandomNoRepeat} className="tb-btn tb-btn-purple" style={{ fontSize: '0.8rem', padding: '0.5rem', justifyContent: 'center' }}>
              Generar Aleatorio
            </button>
          </div>
        </div>

        {/* Option 3: Drawing Shapes Catalog Drawer Mode */}
        <button
          onClick={handleSelectShapeMode}
          className="tb-btn"
          style={{
            background: '#FFF7ED',
            color: '#C2410C',
            border: '2px solid #FFEDD5',
            justifyContent: 'center',
            padding: '0.7rem'
          }}
        >
          <PenTool size={18} /> Abrir Catálogo Completo de Formas, Letras y Dibujos
        </button>

        {/* Option 4: Blank Canvas */}
        <button
          onClick={handleBlankChallenge}
          className="tb-btn tb-btn-secondary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.6rem' }}
        >
          🎨 Empezar Reto en Blanco
        </button>
      </div>
    </div>
  );
}
