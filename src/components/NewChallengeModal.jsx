import { useState } from 'react';
import { MAP_THEMES } from '../utils/presets';
import { generateRandomNoRepeatPath, solveNavigationPath, solvePathWithWaypoints, simulatePath, COMMAND_TYPES, SHAPE_PRESETS } from '../utils/talebotEngine';
import { X, Wand2, PenTool, Minus, Plus } from 'lucide-react';

// `family` decide cómo se resuelve y cuántas soluciones lleva cada obstáculo:
// SIMPLE = bloqueante con una única solución (rodeo). DUAL = bloqueante pero
// con herramienta alternativa (dos soluciones). WAYPOINT = no bloquea, obliga
// a pasar por la casilla y ejecutar una acción.
const OBSTACLE_POOL = [
  { type: 'ARBOL', name: 'Árbol 🌳', story: '¡Cuidado con el árbol! Rodea el obstáculo y lleva a TaleBot a la meta.', family: 'SIMPLE' },
  { type: 'MURO', name: 'Muro 🧱', story: '¡Atención al muro! Opción A: Rodea el muro. Opción B: Recoge brazos 🦾 para atravesarlo.', family: 'DUAL' },
  { type: 'FUEGO', name: 'Fuego 🔥', story: '¡Peligro de fuego! Esquiva las llamas y alcanza la meta dorada.', family: 'SIMPLE' },
  { type: 'LAGO', name: 'Lago 🌊', story: '¡Un gran lago en el camino! Opción A: Bordea la orilla. Opción B: Recoge alas 🪽 para volar.', family: 'DUAL' },
  { type: 'ALTO', name: 'Señal de Alto 🛑', story: '¡Señal de alto! Desvíate por el camino seguro hacia la meta.', family: 'SIMPLE' },
  { type: 'TESORO', name: 'Tesoro 🪙', story: '¡Pasa por la casilla de tesoro y recoge la moneda de oro!', family: 'WAYPOINT' },
  { type: 'FIESTA', name: 'Fiesta 💃', story: '¡Pisa la casilla de fiesta, baila y continúa tu camino!', family: 'WAYPOINT' },
  { type: 'VOZ', name: 'Mensaje de Voz 🎙️', story: '¡Pisa la casilla y reproduce un mensaje de voz!', family: 'WAYPOINT' },
  { type: 'ROTONDA', name: 'Rotonda 🔄', story: '¡Atraviesa la rotonda y mantén el rumbo hacia la meta!', family: 'WAYPOINT' },
  { type: 'TESORO', name: 'Recolecta Monedas 🪙', story: '', family: 'COIN_MULTI' }
];

const WAYPOINT_OBS = OBSTACLE_POOL.filter(o => o.family === 'WAYPOINT');

// Rango de distancia Manhattan permitido entre salida y meta por dificultad:
// a más estrellas, recorrido más largo y con más elementos que resolver.
const DIST_RANGE = { 1: [2, 3], 2: [3, 5], 3: [4, 7] };

const SHAPE_CATEGORIES = ['Geometría', 'Letras', 'Números', 'Símbolos', 'Dibujos'];
const PEN_HINTS = ['el rotulador izquierdo 🖍️', 'el rotulador derecho 🖍️', 'ambos rotuladores 🖍️🖍️', 'el rotulador que prefieras'];

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pairKey(start, target) {
  return `${start.r},${start.c}>${target.r},${target.c}`;
}

// La meta nunca puede coincidir con la salida: busca en el pool (barajado)
// una forma cuyo trazo termine en una casilla distinta de donde empieza
function pickShapeWithDistinctEnd(pool, numRows, numCols) {
  for (const candidate of shuffled(pool)) {
    const start = candidate.start || { r: numRows - 1, c: 0, dir: 0 };
    const end = simulatePath(start, candidate.commands, numRows, numCols).endPosition;
    if (end.r !== start.r || end.c !== start.c) {
      return { shape: candidate, start, end };
    }
  }
  return null;
}

// Busca una pareja salida/meta a distancia acorde a la dificultad que no se
// haya usado ya en este lote, para que ningún reto repita el mismo recorrido
function pickUniqueStartTarget(numRows, numCols, minDist, maxDist, usedPairs) {
  for (let attempt = 0; attempt < 80; attempt++) {
    const sR = Math.floor(Math.random() * numRows);
    const sC = Math.floor(Math.random() * numCols);
    const tR = Math.floor(Math.random() * numRows);
    const tC = Math.floor(Math.random() * numCols);
    if (sR === tR && sC === tC) continue;

    const dist = Math.abs(sR - tR) + Math.abs(sC - tC);
    if (dist < minDist || dist > maxDist) continue;

    const start = { r: sR, c: sC, dir: Math.floor(Math.random() * 4) };
    const target = { r: tR, c: tC };
    const key = pairKey(start, target);
    if (usedPairs.has(key)) continue;

    return { start, target, key };
  }
  return null;
}

// Genera un reto de obstáculo único: tipo sacado de una cola barajada (no se
// repite hasta agotar el pool) y en dificultad 3 añade una segunda parada
// obligada distinta del obstáculo principal para alargar la solución.
function buildObstacleChallenge({ index, difficulty, numRows, numCols, selectedTheme, usedPairs, typeQueueRef }) {
  const [minDist, maxDist] = DIST_RANGE[difficulty] || DIST_RANGE[2];
  const useSecondWaypoint = difficulty === 3;

  for (let attempt = 0; attempt < 12; attempt++) {
    if (typeQueueRef.current.length === 0) {
      typeQueueRef.current = shuffled(OBSTACLE_POOL);
    }
    const obsConfig = typeQueueRef.current.shift();

    const picked = pickUniqueStartTarget(numRows, numCols, minDist, maxDist, usedPairs);
    if (!picked) continue;
    const { start, target, key } = picked;

    const directPath = solveNavigationPath(start, target, [], numRows, numCols);
    if (!directPath || directPath.length < 2) continue;

    const simDirect = simulatePath(start, directPath, numRows, numCols);
    const pathCells = simDirect.trajectory
      .slice(1, -1)
      .filter(t => (t.r !== start.r || t.c !== start.c) && (t.r !== target.r || t.c !== target.c));
    if (pathCells.length === 0) continue;

    // Recolecta monedas: varias casillas de tesoro repartidas por el camino,
    // no bloquea, solo obliga a pasar por todas antes de llegar a la meta
    if (obsConfig.family === 'COIN_MULTI') {
      const coinCount = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
      const sortedCells = [...pathCells].sort((a, b) => a.step - b.step);
      const coinCells = [];
      for (let k = 0; k < coinCount; k++) {
        const cellIdx = Math.min(sortedCells.length - 1, Math.floor((k + 1) * sortedCells.length / (coinCount + 1)));
        coinCells.push(sortedCells[cellIdx]);
      }
      const uniqueCoinCells = Array.from(new Map(coinCells.map(c => [`${c.r},${c.c}`, c])).values());
      if (uniqueCoinCells.length < 2) continue;

      const coinObstacles = uniqueCoinCells.map(c => ({ r: c.r, c: c.c, type: 'TESORO' }));
      const solA = solvePathWithWaypoints(start, target, coinObstacles, [], numRows, numCols);
      if (!solA) continue;

      usedPairs.add(key);
      return {
        id: `gen_obs_${Date.now()}_${index}`,
        title: `Reto #${index + 1}: Recolecta ${uniqueCoinCells.length} Monedas 🪙`,
        story: `¡Recoge las ${uniqueCoinCells.length} monedas del camino antes de llegar a la meta!`,
        difficulty, numRows, numCols, theme: selectedTheme, start, target,
        obstacles: coinObstacles, commands: solA,
        solutionATitle: 'Solución Principal'
      };
    }

    const midCell = pathCells[Math.floor(pathCells.length / 2)];
    const mainObs = { r: midCell.r, c: midCell.c, type: obsConfig.type };
    if ((mainObs.r === start.r && mainObs.c === start.c) || (mainObs.r === target.r && mainObs.c === target.c)) continue;

    const baseId = `gen_obs_${Date.now()}_${index}`;
    const title = `Reto #${index + 1}: ${obsConfig.name}`;

    if (obsConfig.family === 'DUAL') {
      const toolCmd = obsConfig.type === 'MURO' ? COMMAND_TYPES.BRAZOS : COMMAND_TYPES.ALAS;
      const solA = solveNavigationPath(start, target, [mainObs], numRows, numCols);
      if (!solA) continue;
      const solB = [];
      directPath.forEach((cmd, idx) => {
        if (idx === midCell.step - 1) solB.push(toolCmd);
        solB.push(cmd);
      });

      usedPairs.add(key);
      return {
        id: baseId, title, story: obsConfig.story, difficulty,
        numRows, numCols, theme: selectedTheme, start, target,
        obstacles: [mainObs], commands: solA,
        solutionATitle: 'Solución A: Rodeo / Esquivar',
        solutionB: solB,
        solutionBTitle: obsConfig.type === 'MURO' ? 'Solución B: Con Herramienta Brazos 🦾' : 'Solución B: Volar con Alas 🪽'
      };
    }

    if (obsConfig.family === 'WAYPOINT') {
      const solA = solvePathWithWaypoints(start, target, [mainObs], [], numRows, numCols);
      if (!solA) continue;
      usedPairs.add(key);
      return {
        id: baseId, title, story: obsConfig.story, difficulty,
        numRows, numCols, theme: selectedTheme, start, target,
        obstacles: [mainObs], commands: solA,
        solutionATitle: 'Solución Principal'
      };
    }

    // SIMPLE: bloqueante con una única ruta de rodeo. En dificultad 3 se
    // combina con una parada obligada extra para alargar la solución.
    if (useSecondWaypoint) {
      const wpCandidates = pathCells.filter(c => c.r !== midCell.r || c.c !== midCell.c);
      if (wpCandidates.length > 0) {
        const wpCell = wpCandidates[Math.floor(Math.random() * wpCandidates.length)];
        const wpType = WAYPOINT_OBS[Math.floor(Math.random() * WAYPOINT_OBS.length)];
        const secondWaypoint = { r: wpCell.r, c: wpCell.c, type: wpType.type };
        const solA = solvePathWithWaypoints(start, target, [secondWaypoint], [mainObs], numRows, numCols);
        if (solA) {
          usedPairs.add(key);
          return {
            id: baseId, title: `${title} + ${wpType.name}`,
            story: `${obsConfig.story} Además, pasa por la casilla de ${wpType.name.toLowerCase()} antes de llegar.`,
            difficulty, numRows, numCols, theme: selectedTheme, start, target,
            obstacles: [mainObs, secondWaypoint], commands: solA,
            solutionATitle: 'Solución Principal'
          };
        }
      }
    }

    const solA = solveNavigationPath(start, target, [mainObs], numRows, numCols);
    if (!solA) continue;
    usedPairs.add(key);
    return {
      id: baseId, title, story: obsConfig.story, difficulty,
      numRows, numCols, theme: selectedTheme, start, target,
      obstacles: [mainObs], commands: solA,
      solutionATitle: 'Solución Principal'
    };
  }

  // Sin obstáculo fantasma: si no se encontró combinación válida, un
  // recorrido libre real es mejor que un obstáculo pintado que no se resuelve
  const fallbackPath = generateRandomNoRepeatPath(numRows, numCols, 5 + difficulty);
  return {
    id: `gen_fallback_${Date.now()}_${index}`,
    title: `Reto #${index + 1}: Exploración`,
    story: 'Programa a TaleBot para completar el recorrido sin repetir ninguna casilla.',
    difficulty, numRows, numCols, theme: selectedTheme,
    start: fallbackPath.start, target: fallbackPath.target,
    obstacles: [], commands: fallbackPath.commands
  };
}

export default function NewChallengeModal({
  numRows = 4,
  numCols = 5,
  onGenerateA4Pages,
  onOpenShapesMode,
  onClose
}) {
  const [pageCount, setPageCount] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState('CLASICO');

  const handleGeneratePages = () => {
    try {
      const totalChallengesNeeded = pageCount * 2;
      const generatedList = [];

      // Distribución proporcional exacta: 20% 1 estrella, 30% 2 estrellas, 50% 3 estrellas
      // Para 20 retos (10 folios): 4 de 1★, 6 de 2★, 10 de 3★
      const count1 = Math.round(totalChallengesNeeded * 0.20);
      const count2 = Math.round(totalChallengesNeeded * 0.30);
      const count3 = totalChallengesNeeded - count1 - count2;

      const diffList = [
        ...Array(count1).fill(1),
        ...Array(count2).fill(2),
        ...Array(count3).fill(3)
      ];

      // 1 reto de rotulador cada 5 (4 de 20), repartidos a lo largo del folio
      // y cada uno de una categoría distinta para que no se repita la forma
      const shapeCount = Math.max(1, Math.round(totalChallengesNeeded / 5));
      const shapeSlots = new Set();
      for (let s = 0; s < shapeCount; s++) {
        const pos = Math.round((s + 1) * totalChallengesNeeded / (shapeCount + 1)) - 1;
        shapeSlots.add(Math.min(totalChallengesNeeded - 1, Math.max(0, pos)));
      }
      const shapeCategories = shuffled(SHAPE_CATEGORIES).slice(0, shapeSlots.size);

      const usedPairs = new Set();
      const typeQueueRef = { current: shuffled(OBSTACLE_POOL) };
      let shapeCursor = 0;

      for (let i = 0; i < totalChallengesNeeded; i++) {
        const targetDiff = diffList[i] || 2;
        try {
          if (shapeSlots.has(i)) {
            const category = shapeCategories[shapeCursor % shapeCategories.length];
            const penHint = PEN_HINTS[shapeCursor % PEN_HINTS.length];
            shapeCursor++;
            const pool = SHAPE_PRESETS.filter(sp => sp.category === category);
            const picked = pickShapeWithDistinctEnd(pool, numRows, numCols)
              || pickShapeWithDistinctEnd(SHAPE_PRESETS, numRows, numCols);
            const { shape, start: shapeStart, end: shapeEnd } = picked;
            generatedList.push({
              id: `gen_shape_${Date.now()}_${i}`,
              title: `Reto #${i + 1}: Trazo ${shape.name}`,
              story: `Activa ${penHint} y guía a TaleBot: al completar el recorrido debe quedar dibujado un ${shape.name}.`,
              difficulty: targetDiff,
              numRows,
              numCols,
              theme: selectedTheme,
              start: shapeStart,
              target: shapeEnd,
              obstacles: [],
              commands: shape.commands,
              penMarkerMode: true
            });
          } else {
            generatedList.push(buildObstacleChallenge({
              index: i, difficulty: targetDiff, numRows, numCols, selectedTheme, usedPairs, typeQueueRef
            }));
          }
        } catch (err) {
          console.error(`Error al generar reto ${i}:`, err);
          const fallbackPath = generateRandomNoRepeatPath(numRows, numCols, 6);
          generatedList.push({
            id: `gen_fallback_${Date.now()}_${i}`,
            title: `Reto #${i + 1}: Exploración (${fallbackPath.commands.length - 1} Pasos)`,
            story: 'Programa a TaleBot para completar el recorrido sin repetir ninguna casilla.',
            difficulty: targetDiff,
            numRows,
            numCols,
            theme: selectedTheme,
            start: fallbackPath.start,
            target: fallbackPath.target,
            obstacles: [],
            commands: fallbackPath.commands
          });
        }
      }

      onGenerateA4Pages(generatedList);
      onClose();
    } catch (e) {
      console.error('Error general al generar folios:', e);
    }
  };

  return (
    <div className="scrim no-print" onClick={onClose}>
      <div className="sheet" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
        <div className="sheet__head">
          <div>
            <h2 className="sheet__title">Generar retos autogenerados</h2>
            <p className="sheet__sub">Cada folio lleva 2 retos por delante y sus soluciones por detrás.</p>
          </div>
          <button className="btn btn--quiet btn--icon" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="sheet__body" style={{ gap: '1.2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="t-label" style={{ margin: 0 }}>Número de folios (1 a 10)</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ember-deep)' }}>
                {pageCount} {pageCount === 1 ? 'folio' : 'folios'} = {pageCount * 2} retos
              </span>
            </div>

            {/* Stepper numérico */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '10px' }}>
              <button
                type="button"
                className="btn btn--outline"
                style={{ width: '42px', height: '42px', padding: 0, fontSize: '1.2rem' }}
                onClick={() => setPageCount(p => Math.max(1, p - 1))}
                disabled={pageCount <= 1}
              >
                <Minus size={18} />
              </button>

              <div style={{
                flex: 1,
                textAlign: 'center',
                background: '#F6F2EB',
                padding: '0.5rem',
                borderRadius: '10px',
                fontFamily: "'Fredoka', sans-serif",
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#1A1410'
              }}>
                {pageCount} {pageCount === 1 ? 'Folio A4' : 'Folios A4'}
              </div>

              <button
                type="button"
                className="btn btn--outline"
                style={{ width: '42px', height: '42px', padding: 0, fontSize: '1.2rem' }}
                onClick={() => setPageCount(p => Math.min(10, p + 1))}
                disabled={pageCount >= 10}
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Botones del 1 al 10 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '.4rem' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  className="opt"
                  style={{ padding: '0.4rem 0.2rem', textAlign: 'center' }}
                  data-on={pageCount === num}
                  onClick={() => setPageCount(num)}
                >
                  <span className="opt__k" style={{ fontSize: '0.85rem' }}>{num}</span>
                  <span className="opt__v" style={{ fontSize: '0.65rem' }}>{num * 2} retos</span>
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
            <Wand2 size={18} /> Generar {pageCount * 2} retos ({pageCount} folios)
          </button>

          <button
            className="btn btn--outline btn--block"
            onClick={() => { onOpenShapesMode(); onClose(); }}
          >
            <PenTool size={15} /> Abrir catálogo de formas para rotulador (50 formas)
          </button>
        </div>
      </div>
    </div>
  );
}
