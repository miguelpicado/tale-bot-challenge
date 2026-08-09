import React, { useState } from 'react';
import { SHAPE_PRESETS, COMMAND_TYPES, solveNavigationPath } from '../utils/talebotEngine';
import { Compass, PenTool, Shuffle, Sparkles } from 'lucide-react';

export default function GeneratorPanel({
  numRows = 3,
  numCols = 4,
  onApplyGeneratedChallenge
}) {
  const [activeTab, setActiveTab] = useState('NAVIGATION'); // NAVIGATION, SHAPES, RANDOM
  const [obstacleCount, setObstacleCount] = useState(1);
  const [stepCount, setStepCount] = useState(6);

  // Mode 1: Generate Navigation Challenge
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

      // Generate random obstacles
      obstacles = [];
      for (let i = 0; i < obstacleCount; i++) {
        let obsR = Math.floor(Math.random() * numRows);
        let obsC = Math.floor(Math.random() * numCols);
        if (
          (obsR !== start.r || obsC !== start.c) &&
          (obsR !== target.r || obsC !== target.c) &&
          !obstacles.some(o => o.r === obsR && o.c === obsC)
        ) {
          obstacles.push({ r: obsR, c: obsC });
        }
      }

      // Try BFS solve
      commands = solveNavigationPath(start, target, obstacles, numRows, numCols);
      if (commands && commands.length > 0) {
        // Add dance at end
        commands.push(COMMAND_TYPES.DANCE);
        break;
      }
    }

    onApplyGeneratedChallenge({
      title: '¡Desafío de Navegación Especial!',
      story: 'Ayuda a TaleBot a sortear los obstáculos y alcanzar la meta dorada.',
      start,
      target,
      obstacles,
      commands,
      penMarkerMode: false
    });
  };

  // Mode 2: Apply Shape Drawing Preset
  const handleSelectShapePreset = (shape) => {
    onApplyGeneratedChallenge({
      title: `Forma: ${shape.name}`,
      story: shape.description,
      start: shape.start,
      target: shape.start,
      obstacles: [],
      commands: shape.commands,
      penMarkerMode: true
    });
  };

  // Mode 3: Generate Random Path Challenge
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

      // Simulate step position to avoid immediate wall bumps
      if (randCmd.id === 'FORWARD') {
        const dy = currDir === 0 ? -1 : currDir === 2 ? 1 : 0;
        const dx = currDir === 1 ? 1 : currDir === 3 ? -1 : 0;
        if (currR + dy >= 0 && currR + dy < numRows && currC + dx >= 0 && currC + dx < numCols) {
          currR += dy;
          currC += dx;
        } else {
          // If hit wall, turn right instead
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

    onApplyGeneratedChallenge({
      title: '¡Recorrido Aleatorio Sorpresa!',
      story: 'Sigue la secuencia misteriosa y descubre dónde terminará bailando TaleBot.',
      start,
      target: { r: currR, c: currC },
      obstacles: [],
      commands,
      penMarkerMode: false
    });
  };

  return (
    <div className="tb-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '2px dashed #E2E8F0', paddingBottom: '0.6rem' }}>
        <Sparkles size={22} color="#FF9500" />
        <h3 style={{ fontSize: '1.15rem', color: '#0F172A' }}>Generador Automático de Retos</h3>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '12px', padding: '4px' }}>
        <button
          onClick={() => setActiveTab('NAVIGATION')}
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '8px',
            border: 'none',
            fontFamily: 'Fredoka',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            background: activeTab === 'NAVIGATION' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'NAVIGATION' ? '#00A3FF' : '#64748B',
            boxShadow: activeTab === 'NAVIGATION' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Compass size={16} /> Navegación
        </button>

        <button
          onClick={() => setActiveTab('SHAPES')}
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '8px',
            border: 'none',
            fontFamily: 'Fredoka',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            background: activeTab === 'SHAPES' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'SHAPES' ? '#F97316' : '#64748B',
            boxShadow: activeTab === 'SHAPES' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <PenTool size={16} /> Formas y Letras
        </button>

        <button
          onClick={() => setActiveTab('RANDOM')}
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '8px',
            border: 'none',
            fontFamily: 'Fredoka',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            background: activeTab === 'RANDOM' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'RANDOM' ? '#8B5CF6' : '#64748B',
            boxShadow: activeTab === 'RANDOM' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Shuffle size={16} /> Aleatorio
        </button>
      </div>

      {/* Tab 1: Navigation */}
      {activeTab === 'NAVIGATION' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Número de Obstáculos: {obstacleCount}
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

          <button
            onClick={handleGenerateNavigation}
            className="tb-btn tb-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}
          >
            <Compass size={18} /> Generar Desafío con BFS
          </button>
        </div>
      )}

      {/* Tab 2: Shapes & Marker Drawing */}
      {activeTab === 'SHAPES' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.5rem',
          maxHeight: '180px',
          overflowY: 'auto'
        }}>
          {SHAPE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectShapePreset(preset)}
              style={{
                background: '#FFF7ED',
                border: '1.5px solid #FFEDD5',
                borderRadius: '12px',
                padding: '0.5rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#F97316'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#FFEDD5'}
            >
              <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: '0.85rem', color: '#C2410C' }}>
                {preset.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#9A3412', marginTop: '2px' }}>
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Tab 3: Random */}
      {activeTab === 'RANDOM' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Número de Pasos: {stepCount}
            </label>
            <input
              type="range"
              min="3"
              max="12"
              value={stepCount}
              onChange={(e) => setStepCount(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#8B5CF6' }}
            />
          </div>

          <button
            onClick={handleGenerateRandom}
            className="tb-btn tb-btn-purple"
            style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}
          >
            <Shuffle size={18} /> Generar Ruta Aleatoria
          </button>
        </div>
      )}
    </div>
  );
}
