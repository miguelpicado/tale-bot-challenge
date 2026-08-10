import { useState, useEffect, useRef } from 'react';
import { getCellLabel, DIRECTIONS, OBSTACLE_TYPES } from '../utils/talebotEngine';
import { MAP_THEMES } from '../utils/presets';
import TaleBotAvatar from './TaleBotAvatar';
import ObstacleIcon from './ObstacleIcon';
import { X, Eraser } from 'lucide-react';

// px — debe coincidir con el gap y el padding de .mat: robot y trazo comparten
// esta geometría, así ambos caen exactamente en el centro de la casilla
const GAP = 7;

/** Meta: plataforma de aterrizaje con estrella, con un pulso que la señala. */
export function GoalMarker({ size }) {
  return (
    <svg
      className="goal"
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      style={size ? { width: size, height: size, maxWidth: size } : undefined}
    >
      <circle className="goal__halo" cx="50" cy="50" r="38" />
      <circle cx="50" cy="50" r="35" fill="#FFF6E2" />
      <circle
        className="goal__pad"
        cx="50" cy="50" r="35"
        fill="none" stroke="#FFB020" strokeWidth="3.5"
        strokeDasharray="7 7" strokeLinecap="round"
      />
      <circle cx="50" cy="50" r="27" fill="none" stroke="#FFE0A6" strokeWidth="2" />
      <path
        d="M50 29 L55.3 42.7 L70 43.5 L58.6 52.8 L62.3 67 L50 59 L37.7 67 L41.4 52.8 L30 43.5 L44.7 42.7 Z"
        fill="#FFB020"
        stroke="#D98A00"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function GridCanvas({
  numRows = 4,
  numCols = 5,
  themeKey = 'CLASICO',
  startPos = { r: 3, c: 0, dir: 0 },
  targetPos = { r: 0, c: 4 },
  obstacles = [],
  currentRobotState = null,
  penLines = [],
  hasWings = false,
  hasArms = false,
  leftPenEnabled = true,
  leftPenColor = '#6D4C41',
  rightPenEnabled = true,
  rightPenColor = '#2E7D32',
  onSetStartPos,
  onSetTargetPos,
  onToggleObstacle,
  onClearCell,
  onBoardWidth
}) {
  const theme = MAP_THEMES[themeKey] || MAP_THEMES.CLASICO;

  const [activePopoverCell, setActivePopoverCell] = useState(null);
  const containerRef = useRef(null);
  const matRef = useRef(null);

  // El ancho del tablero sale de su alto y de la proporción, así que solo se
  // conoce ya medido. Lo publicamos para que la columna se ajuste a él y la
  // sidebar quede pegada al mapa.
  const stageRef = useRef(null);
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !onBoardWidth) return;
    const ro = new ResizeObserver(([entry]) => {
      onBoardWidth(Math.round(entry.contentRect.width) + 28); // + padding del chasis
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [onBoardWidth]);



  const activeRobotR = currentRobotState ? currentRobotState.r : startPos.r;
  const activeRobotC = currentRobotState ? currentRobotState.c : startPos.c;
  const activeRobotDir = currentRobotState ? currentRobotState.dir : (startPos.dir || 0);
  const stepMs = currentRobotState?.stepMs || 460;

  // Ángulo acumulado: girar a la derecha desde el oeste debe seguir sumando 90°,
  // no retroceder 270°. Guardamos el rumbo anterior para saber hacia dónde gira.
  const headingRef = useRef({ dir: startPos.dir || 0, angle: DIRECTIONS[startPos.dir || 0].angle });
  if (headingRef.current.dir !== activeRobotDir) {
    const diff = (activeRobotDir - headingRef.current.dir + 4) % 4;
    const turn = diff === 3 ? -90 : diff * 90;
    headingRef.current = { dir: activeRobotDir, angle: headingRef.current.angle + turn };
  }
  const robotAngle = headingRef.current.angle;

  const obstacleMap = new Map((obstacles || []).map(o => [`${o.r},${o.c}`, o.type || 'ALTO']));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target) && !e.target.closest('.tb-popover-modal')) {
        setActivePopoverCell(null);
      }
    };
    const handleScroll = () => setActivePopoverCell(null);
    const handleKey = (e) => { if (e.key === 'Escape') setActivePopoverCell(null); };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const handleCellClick = (r, c, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setActivePopoverCell({
      r,
      c,
      rect: {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height
      }
    });
  };

  // Posición fija anclada al viewport: el popover nunca se recorta
  let popoverFixedStyle = null;
  if (activePopoverCell && activePopoverCell.rect) {
    const { rect, r } = activePopoverCell;
    const modalWidth = 392;
    const modalEstimatedHeight = 486;

    const isBottomHalf = r >= Math.floor(numRows / 2);
    let topPos = isBottomHalf ? rect.top - modalEstimatedHeight - 8 : rect.bottom + 8;
    topPos = Math.max(10, Math.min(window.innerHeight - modalEstimatedHeight - 10, topPos));

    let leftPos = rect.left + (rect.width / 2) - (modalWidth / 2);
    leftPos = Math.max(10, Math.min(window.innerWidth - modalWidth - 10, leftPos));

    popoverFixedStyle = {
      position: 'fixed',
      top: `${topPos}px`,
      left: `${leftPos}px`,
      width: `${modalWidth}px`,
      zIndex: 999999
    };
  }

  const activeLabel = activePopoverCell ? getCellLabel(activePopoverCell.r, activePopoverCell.c, numRows) : '';
  const activeObstacle = activePopoverCell ? obstacleMap.get(`${activePopoverCell.r},${activePopoverCell.c}`) : null;

  // Reparto en píxeles: ancho de casilla = (100% − huecos) / n
  const slot = (index, count) => `calc((100% - ${(count - 1) * GAP}px) / ${count} * ${index} + ${index * GAP}px)`;
  const slotSize = (count) => `calc((100% - ${(count - 1) * GAP}px) / ${count})`;

  return (
    <div
      ref={containerRef}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', minHeight: 0 }}
    >
      <div
        ref={stageRef}
        className="stage"
        style={{
          aspectRatio: `${numCols} / ${numRows}`,
          height: '100%',
          width: 'auto',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        <div
          ref={matRef}
          className="mat"
          style={{
            background: theme.bgGradient,
            gridTemplateRows: `repeat(${numRows}, 1fr)`,
            gridTemplateColumns: `repeat(${numCols}, 1fr)`
          }}
        >
          {/* Trazo del rotulador o Recorrido de navegación */}
          {penLines && penLines.length > 0 && (
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="trace" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 15 }}>
              {/* Si ambos rotuladores están desactivados: Recorrido central en negro continuo (sin arcos de giro) */}
              {!leftPenEnabled && !rightPenEnabled && penLines.map((line, idx) => {
                if (line.type === 'ARC') return null; // El recorrido no lleva radio de giro
                return (
                  <line
                    key={`black_line_${idx}`}
                    x1={((line.from.c + 0.5) / numCols) * 100}
                    y1={((line.from.r + 0.5) / numRows) * 100}
                    x2={((line.to.c + 0.5) / numCols) * 100}
                    y2={((line.to.r + 0.5) / numRows) * 100}
                    stroke="#1A1410"
                    strokeWidth="0.7"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Si hay rotuladores activos: Recorrido central tenue de guía (sin arcos de giro) */}
              {(leftPenEnabled || rightPenEnabled) && penLines.map((line, idx) => {
                if (line.type === 'ARC') return null; // El recorrido no lleva radio de giro
                return (
                  <line
                    key={`center_line_${idx}`}
                    x1={((line.from.c + 0.5) / numCols) * 100}
                    y1={((line.from.r + 0.5) / numRows) * 100}
                    x2={((line.to.c + 0.5) / numCols) * 100}
                    y2={((line.to.r + 0.5) / numRows) * 100}
                    stroke="#B0BEC5"
                    strokeWidth="0.4"
                    strokeDasharray="1,1"
                    opacity="0.6"
                  />
                );
              })}

              {/* Capa 2: Rueda Izquierda (Rotulador Izquierdo - CON arcos de giro) */}
              {leftPenEnabled && penLines.map((line, idx) => {
                const distPctX = (0.22 / numCols) * 100;
                const distPctY = (0.22 / numRows) * 100;
                if (line.type === 'ARC') {
                  const cxPct = ((line.cell.c + 0.5) / numCols) * 100;
                  const cyPct = ((line.cell.r + 0.5) / numRows) * 100;
                  const dFrom = DIRECTIONS[line.fromDir] || DIRECTIONS[0];
                  const dTo = DIRECTIONS[line.toDir] || DIRECTIONS[0];
                  const normFromX = dFrom.dy * distPctX;
                  const normFromY = -dFrom.dx * distPctY;
                  const normToX = dTo.dy * distPctX;
                  const normToY = -dTo.dx * distPctY;
                  const x1 = cxPct + normFromX;
                  const y1 = cyPct + normFromY;
                  const x2 = cxPct + normToX;
                  const y2 = cyPct + normToY;
                  const ctrlX = cxPct + normFromX + normToX;
                  const ctrlY = cyPct + normFromY + normToY;
                  return (
                    <path
                      key={`left_arc_${idx}`}
                      d={`M ${x1} ${y1} Q ${ctrlX} ${ctrlY} ${x2} ${y2}`}
                      fill="none"
                      stroke={leftPenColor || '#6D4C41'}
                      strokeWidth="0.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  );
                }
                const p1x = ((line.from.c + 0.5) / numCols) * 100;
                const p1y = ((line.from.r + 0.5) / numRows) * 100;
                const p2x = ((line.to.c + 0.5) / numCols) * 100;
                const p2y = ((line.to.r + 0.5) / numRows) * 100;
                const dx = p2x - p1x;
                const dy = p2y - p1y;
                const len = Math.hypot(dx, dy) || 1;
                const normX = (dy / len) * distPctX;
                const normY = (-dx / len) * distPctY;
                return (
                  <line
                    key={`left_line_${idx}`}
                    x1={p1x + normX}
                    y1={p1y + normY}
                    x2={p2x + normX}
                    y2={p2y + normY}
                    stroke={leftPenColor || '#6D4C41'}
                    strokeWidth="0.9"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Capa 3: Rueda Derecha (Rotulador Derecho - CON arcos de giro) */}
              {rightPenEnabled && penLines.map((line, idx) => {
                const distPctX = (0.22 / numCols) * 100;
                const distPctY = (0.22 / numRows) * 100;
                if (line.type === 'ARC') {
                  const cxPct = ((line.cell.c + 0.5) / numCols) * 100;
                  const cyPct = ((line.cell.r + 0.5) / numRows) * 100;
                  const dFrom = DIRECTIONS[line.fromDir] || DIRECTIONS[0];
                  const dTo = DIRECTIONS[line.toDir] || DIRECTIONS[0];
                  const normFromX = -dFrom.dy * distPctX;
                  const normFromY = dFrom.dx * distPctY;
                  const normToX = -dTo.dy * distPctX;
                  const normToY = dTo.dx * distPctY;
                  const x1 = cxPct + normFromX;
                  const y1 = cyPct + normFromY;
                  const x2 = cxPct + normToX;
                  const y2 = cyPct + normToY;
                  const ctrlX = cxPct + normFromX + normToX;
                  const ctrlY = cyPct + normFromY + normToY;
                  return (
                    <path
                      key={`right_arc_${idx}`}
                      d={`M ${x1} ${y1} Q ${ctrlX} ${ctrlY} ${x2} ${y2}`}
                      fill="none"
                      stroke={rightPenColor || '#2E7D32'}
                      strokeWidth="0.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  );
                }
                const p1x = ((line.from.c + 0.5) / numCols) * 100;
                const p1y = ((line.from.r + 0.5) / numRows) * 100;
                const p2x = ((line.to.c + 0.5) / numCols) * 100;
                const p2y = ((line.to.r + 0.5) / numRows) * 100;
                const dx = p2x - p1x;
                const dy = p2y - p1y;
                const len = Math.hypot(dx, dy) || 1;
                const normX = (-dy / len) * distPctX;
                const normY = (dx / len) * distPctY;
                return (
                  <line
                    key={`right_line_${idx}`}
                    x1={p1x + normX}
                    y1={p1y + normY}
                    x2={p2x + normX}
                    y2={p2y + normY}
                    stroke={rightPenColor || '#2E7D32'}
                    strokeWidth="0.9"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
          )}

          {Array.from({ length: numRows }).map((_, r) =>
            Array.from({ length: numCols }).map((_, c) => {
              const cellKey = `${r},${c}`;
              const obstacleTypeId = obstacleMap.get(cellKey);
              const obstacleObj = OBSTACLE_TYPES.find(o => o.id === obstacleTypeId);
              const isTarget = targetPos.r === r && targetPos.c === c;
              const isPopoverActive = activePopoverCell?.r === r && activePopoverCell?.c === c;

              return (
                <button
                  key={cellKey}
                  className="cell"
                  data-active={isPopoverActive}
                  data-blocked={!!obstacleObj}
                  onClick={(e) => handleCellClick(r, c, e)}
                  aria-label={`Casilla ${getCellLabel(r, c, numRows)}`}
                  style={{
                    '--cell-bg': theme.cellColors[(r + c) % theme.cellColors.length],
                    '--cell-line': theme.borderColor,
                    '--cell-coord': theme.coordColor,
                    '--cell-blocked': theme.blockedBg
                  }}
                >
                  <span className="cell__coord">{getCellLabel(r, c, numRows)}</span>

                  {isTarget && <GoalMarker />}

                  {obstacleObj && (
                    <span
                      className="token"
                      data-block={!!obstacleObj.blocking}
                      data-tilt={(r * 3 + c) % 2}
                      title={`${obstacleObj.name} — ${obstacleObj.description}`}
                    >
                      <ObstacleIcon type={obstacleObj.id} size="72%" />
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* El robot vive sobre el tapete y se desliza entre casillas */}
        <div
          style={{
            position: 'absolute',
            inset: '21px',
            pointerEvents: 'none',
            zIndex: 6
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: slot(activeRobotC, numCols),
              top: slot(activeRobotR, numRows),
              width: slotSize(numCols),
              height: slotSize(numRows),
              display: 'grid',
              placeItems: 'center',
              // Arranca despacio, cruza la casilla y frena: el perfil del robot real
              transition: `left ${stepMs}ms var(--ease-drive), top ${stepMs}ms var(--ease-drive)`,
              ['--bot-turn-ms']: `${stepMs}ms`
            }}
          >
            <TaleBotAvatar
              size="65%"
              angle={robotAngle}
              ledColor={currentRobotState?.ledColor || '#00BFC4'}
              hasWings={hasWings}
              hasArms={hasArms}
              isDancing={currentRobotState?.commandId === 'DANCE'}
            />
          </div>
        </div>
      </div>

      {/* Opciones de casilla */}
      {activePopoverCell && popoverFixedStyle && (
        <div className="pop tb-popover-modal" onClick={(e) => e.stopPropagation()} style={popoverFixedStyle}>
          <div className="pop__head">
            <span className="pop__coord">{activeLabel}</span>
            <button className="btn btn--quiet btn--icon" onClick={() => setActivePopoverCell(null)} aria-label="Cerrar">
              <X size={18} />
            </button>
          </div>

          <div className="pop__group">
            <span className="t-eyebrow">Salida y rumbo</span>
            <div className="tiles" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {DIRECTIONS.map((dirObj, idx) => {
                const isOn = startPos.r === activePopoverCell.r && startPos.c === activePopoverCell.c && (startPos.dir || 0) === idx;
                return (
                  <button
                    key={dirObj.id}
                    className="tile tile--dir"
                    data-on={isOn}
                    title={`Salir mirando al ${dirObj.name}`}
                    onClick={() => {
                      onSetStartPos({ r: activePopoverCell.r, c: activePopoverCell.c, dir: idx });
                      setActivePopoverCell(null);
                    }}
                  >
                    <span>{dirObj.arrow}</span>
                    <span className="tile__cap">{dirObj.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            className="tile tile--wide tile--goal"
            onClick={() => {
              onSetTargetPos({ r: activePopoverCell.r, c: activePopoverCell.c });
              setActivePopoverCell(null);
            }}
          >
            <GoalMarker size={26} /> Poner la meta aquí
          </button>

          <div className="pop__group">
            <span className="t-eyebrow">Obstáculo o parada</span>
            <div className="tiles" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {OBSTACLE_TYPES.map((obs) => (
                <button
                  key={obs.id}
                  className="tile tile--obs"
                  data-on={activeObstacle === obs.id}
                  title={obs.description}
                  onClick={() => {
                    onToggleObstacle({ r: activePopoverCell.r, c: activePopoverCell.c, type: obs.id });
                    setActivePopoverCell(null);
                  }}
                >
                  <ObstacleIcon type={obs.id} size={30} />
                  <span className="tile__cap">{obs.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            className="tile tile--wide tile--clear"
            onClick={() => {
              onClearCell(activePopoverCell.r, activePopoverCell.c);
              setActivePopoverCell(null);
            }}
          >
            <Eraser size={16} /> Vaciar casilla
          </button>
        </div>
      )}
    </div>
  );
}
