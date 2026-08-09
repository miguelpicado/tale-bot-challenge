import React, { useState } from 'react';
import { PRESET_CHALLENGES, MAP_THEMES } from '../utils/presets';
import { generateRandomNoRepeatPath, solveNavigationPath, COMMAND_TYPES } from '../utils/talebotEngine';
import { FileText, PlusCircle, X, Sparkles, Wand2, PenTool } from 'lucide-react';

export default function NewChallengeModal({
  numRows = 3,
  numCols = 4,
  onGenerateA4Pages,
  onOpenShapesMode,
  onClose
}) {
  const [pageCount, setPageCount] = useState(1); // 1 Page = 2 Challenges, 2 Pages = 4 Challenges, 3 Pages = 6 Challenges
  const [selectedTheme, setSelectedTheme] = useState('CLASICO');

  const handleGeneratePages = () => {
    const totalChallengesNeeded = pageCount * 2;
    const generatedList = [];

    for (let i = 0; i < totalChallengesNeeded; i++) {
      // Alternate between BFS navigation path and No-Repeat random path
      if (i % 2 === 0) {
        const randomPath = generateRandomNoRepeatPath(numRows, numCols, 6);
        generatedList.push({
          id: `gen_random_${Date.now()}_${i}`,
          title: `Reto #${i + 1}: ${randomPath.commands.length} Pasos`,
          story: 'Programa a TaleBot para completar el recorrido sin repetir ninguna casilla.',
          difficulty: Math.min(3, Math.floor(i / 2) + 1),
          numRows,
          numCols,
          theme: selectedTheme,
          start: randomPath.start,
          target: randomPath.target,
          obstacles: [],
          commands: randomPath.commands
        });
      } else {
        const start = { r: numRows - 1, c: 0, dir: 0 };
        const target = { r: 0, c: numCols - 1 };
        const obstacles = [{ r: 1, c: 1, type: 'ALTO' }];
        const bfsCmds = solveNavigationPath(start, target, obstacles, numRows, numCols) || [COMMAND_TYPES.FORWARD, COMMAND_TYPES.TURN_RIGHT, COMMAND_TYPES.FORWARD];
        bfsCmds.push(COMMAND_TYPES.DANCE);

        generatedList.push({
          id: `gen_bfs_${Date.now()}_${i}`,
          title: `Reto #${i + 1}: Misión con Obstáculo`,
          story: 'Esquiva la señal de alto y lleva al robot hasta la meta dorada.',
          difficulty: Math.min(3, Math.floor(i / 2) + 1),
          numRows,
          numCols,
          theme: selectedTheme,
          start,
          target,
          obstacles,
          commands: bfsCmds
        });
      }
    }

    onGenerateA4Pages(generatedList);
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
        maxWidth: '560px',
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
              Generar Fichas A4 de Retos
            </h2>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="#64748B" />
          </button>
        </div>

        {/* 1. Select Number of A4 Pages */}
        <div>
          <label style={{ fontSize: '0.9rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>
            📄 ¿Cuántas Páginas de Fichas A4 quieres autogenerar?
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
            {[
              { pages: 1, challenges: 2, label: '1 Página A4', sub: '(2 Retos)' },
              { pages: 2, challenges: 4, label: '2 Páginas A4', sub: '(4 Retos)' },
              { pages: 3, challenges: 6, label: '3 Páginas A4', sub: '(6 Retos)' }
            ].map((opt) => (
              <button
                key={opt.pages}
                onClick={() => setPageCount(opt.pages)}
                style={{
                  padding: '0.8rem 0.5rem',
                  borderRadius: '14px',
                  border: pageCount === opt.pages ? '2.5px solid #FF6900' : '2px solid #E2E8F0',
                  background: pageCount === opt.pages ? '#FFF7ED' : '#F8FAFC',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: '0.95rem', color: pageCount === opt.pages ? '#FF6900' : '#0F172A' }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                  {opt.sub}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Select Theme */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
            🎨 Estilo Visual Ilustrado:
          </label>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: '12px',
              border: '2px solid #CBD5E1',
              fontFamily: 'Fredoka',
              fontSize: '0.9rem',
              background: '#FFFFFF'
            }}
          >
            {Object.values(MAP_THEMES).map((thm) => (
              <option key={thm.id} value={thm.id}>
                {thm.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Button: Auto-generate A4 Pages */}
        <button
          onClick={handleGeneratePages}
          className="tb-btn tb-btn-yellow"
          style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '1rem' }}
        >
          <Wand2 size={20} /> Autogenerar {pageCount * 2} Retos para Impresión A4
        </button>

        {/* Secondary Action: Open Shapes Library Mode */}
        <button
          onClick={() => {
            onOpenShapesMode();
            onClose();
          }}
          className="tb-btn tb-btn-secondary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.6rem', fontSize: '0.85rem' }}
        >
          <PenTool size={16} /> Abrir Catálogo de Formas y Trazados para Rotuladores
        </button>
      </div>
    </div>
  );
}
