import { useState } from 'react';
import { MAP_THEMES } from '../utils/presets';
import { generateRandomNoRepeatPath, solveNavigationPath, COMMAND_TYPES } from '../utils/talebotEngine';
import { X, Wand2, PenTool } from 'lucide-react';

export default function NewChallengeModal({
  numRows = 3,
  numCols = 4,
  onGenerateA4Pages,
  onOpenShapesMode,
  onClose
}) {
  const [pageCount, setPageCount] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState('CLASICO');

  const handleGeneratePages = () => {
    const totalChallengesNeeded = pageCount * 2;
    const generatedList = [];

    for (let i = 0; i < totalChallengesNeeded; i++) {
      // Alterna recorrido sin repetir casilla y navegación con obstáculo resuelta por BFS
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
    <div className="scrim no-print" onClick={onClose}>
      <div className="sheet" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div className="sheet__head">
          <div>
            <h2 className="sheet__title">Generar retos</h2>
            <p className="sheet__sub">Cada folio lleva 2 retos por delante y sus soluciones por detrás.</p>
          </div>
          <button className="btn btn--quiet btn--icon" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="sheet__body">
          <div>
            <span className="t-label">Cuántos folios</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '.5rem' }}>
              {[1, 2, 3].map((pages) => (
                <button
                  key={pages}
                  className="opt"
                  data-on={pageCount === pages}
                  onClick={() => setPageCount(pages)}
                >
                  <span className="opt__k">{pages} {pages === 1 ? 'folio' : 'folios'}</span>
                  <span className="opt__v">{pages * 2} retos</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="t-label" htmlFor="gen-theme">Estilo del tablero</label>
            <select
              id="gen-theme"
              className="select"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
            >
              {Object.values(MAP_THEMES).map((thm) => (
                <option key={thm.id} value={thm.id}>{thm.emoji} {thm.name}</option>
              ))}
            </select>
          </div>

          <button className="btn btn--accent btn--lg btn--block" onClick={handleGeneratePages}>
            <Wand2 size={18} /> Generar {pageCount * 2} retos
          </button>

          <button
            className="btn btn--outline btn--block"
            onClick={() => { onOpenShapesMode(); onClose(); }}
          >
            <PenTool size={15} /> Abrir catálogo de formas para rotulador
          </button>
        </div>
      </div>
    </div>
  );
}
