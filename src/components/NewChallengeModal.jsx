import React, { useState } from 'react';
import { SHAPE_PRESETS, COMMAND_TYPES, solveNavigationPath } from '../utils/talebotEngine';
import { Compass, PenTool, Shuffle, Sparkles, PlusCircle, X } from 'lucide-react';

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
      penMarkerMode: false
    });
    onClose();
  };

  const handleSelectShape = (shape) => {
    onSelectChallengeMode({
      modeName: `Dibujo: ${shape.name}`,
      title: `Forma: ${shape.name}`,
      story: shape.description,
      start: shape.start,
      target: shape.start,
      obstacles: [],
      commands: shape.commands,
      penMarkerMode: true
    });
    onClose();
  };

  const handleGenerateRandom = () => {
    const start = {
      r: Math.floor(Math.random() * numRows),
      c: Math.floor(Math.random() * numCols),
      dir: Math.floor(Math.random() * 4)
    };

    let currR = start.r;
    let currC = start.c;
    let currDir = start.dir;

    const availableMoveCmds = [
      COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.FORWARD,
      COMMAND_TYPES.TURN_LEFT,
      COMMAND_TYPES.TURN_RIGHT
    ];

    const commands = [];
    for (let i = 0; i < stepCount; i++) {
      const randCmd = availableMoveCmds[Math.floor(Math.random() * availableMoveCmds.length)];
      commands.push(randCmd);

      if (randCmd.id === 'FORWARD') {
        const dy = currDir === 0 ? -1 : currDir === 2 ? 1 : 0;
        const dx = currDir === 1 ? 1 : currDir === 3 ? -1 : 0;
        if (currR + dy >= 0 && currR + dy < numRows && currC + dx >= 0 && currC + dx < numCols) {
          currR += dy;
          currC += dx;
        } else {
          commands[commands.length - 1] = COMMAND_TYPES.TURN_RIGHT;
          currDir = (currDir + 1) % 4;
        }
      } else if (randCmd.id === 'TURN_LEFT') {
        currDir = (currDir + 3) % 4;
      } else if (randCmd.id === 'TURN_RIGHT') {
        currDir = (currDir + 1) % 4;
      }
    }
    commands.push(COMMAND_TYPES.DANCE);

    onSelectChallengeMode({
      modeName: 'Ruta Aleatoria por Pasos',
      title: '¡Recorrido Aleatorio Sorpresa!',
      story: 'Sigue la secuencia misteriosa de pasos y descubre dónde terminará el robot.',
      start,
      target: { r: currR, c: currC },
      obstacles: [],
      commands,
      penMarkerMode: false
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
      penMarkerMode: false
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
        maxWidth: '640px',
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
                Genera un desafío con obstáculos recortables y meta resuelto con IA.
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

          {/* Option 2: Random */}
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
                <Shuffle size={20} /> Ruta Aleatoria
              </div>
              <p style={{ fontSize: '0.75rem', color: '#7C3AED', marginTop: '4px' }}>
                Secuencia de pasos de movimiento sorpresa para practicar lectura de comandos.
              </p>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6D28D9', display: 'block', marginBottom: '2px' }}>
                Pasos: {stepCount}
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={stepCount}
                onChange={(e) => setStepCount(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#8B5CF6' }}
              />
            </div>

            <button onClick={handleGenerateRandom} className="tb-btn tb-btn-purple" style={{ fontSize: '0.8rem', padding: '0.5rem', justifyContent: 'center' }}>
              Generar Aleatorio
            </button>
          </div>
        </div>

        {/* Option 3: Shapes presets for Marker Pens */}
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
            🖊️ Formas para Dibujar con Rotulador:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {SHAPE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectShape(preset)}
                style={{
                  background: '#FFF7ED',
                  border: '1.5px solid #FFEDD5',
                  borderRadius: '12px',
                  padding: '0.5rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'Fredoka',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#C2410C'
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Option 4: Blank Canvas */}
        <button
          onClick={handleBlankChallenge}
          className="tb-btn tb-btn-secondary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.65rem', marginTop: '0.4rem' }}
        >
          🎨 Empezar Reto en Blanco
        </button>
      </div>
    </div>
  );
}
