import React from 'react';
import { getCellLabel, DIRECTIONS } from '../utils/talebotEngine';
import { MAP_THEMES } from '../utils/presets';
import { RotateCw, Flag, Star, OctagonAlert, PenTool } from 'lucide-react';

export default function GridCanvas({
  numRows = 3,
  numCols = 4,
  themeKey = 'CLASICO',
  startPos = { r: 2, c: 0, dir: 0 },
  targetPos = { r: 0, c: 3 },
  obstacles = [],
  checkpoints = [],
  currentRobotState = null, // Used during live animation playback
  penLines = [], // Drawn pen lines [{ from, to }]
  activeTool = 'SELECT', // SELECT, START, TARGET, OBSTACLE, CHECKPOINT
  onCellClick,
  onRotateRobotStart
}) {
  const theme = MAP_THEMES[themeKey] || MAP_THEMES.CLASICO;

  // Active position of TaleBot (during animation or default start)
  const activeRobotR = currentRobotState ? currentRobotState.r : startPos.r;
  const activeRobotC = currentRobotState ? currentRobotState.c : startPos.c;
  const activeRobotDir = currentRobotState ? currentRobotState.dir : (startPos.dir || 0);

  const obstacleSet = new Set(obstacles.map(o => `${o.r},${o.c}`));
  const checkpointMap = new Map(checkpoints.map((cp, idx) => [`${cp.r},${cp.c}`, idx + 1]));

  // Grid dimensions
  const gridTemplate = {
    gridTemplateRows: `repeat(${numRows}, 1fr)`,
    gridTemplateColumns: `repeat(${numCols}, 1fr)`
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.8rem',
      width: '100%'
    }}>
      {/* Grid Container */}
      <div 
        style={{
          background: theme.bgGradient,
          padding: '1.2rem',
          borderRadius: '24px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
          border: '4px solid #FFFFFF',
          position: 'relative',
          width: '100%',
          maxWidth: numCols === 4 ? '560px' : '440px',
          aspectRatio: `${numCols} / ${numRows}`
        }}
      >
        <div 
          style={{
            display: 'grid',
            ...gridTemplate,
            gap: '8px',
            width: '100%',
            height: '100%',
            position: 'relative'
          }}
        >
          {/* Render SVG overlay for Pen Drawing Strokes */}
          {penLines && penLines.length > 0 && (
            <svg 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 15
              }}
            >
              {penLines.map((line, idx) => {
                const cellW = 100 / numCols;
                const cellH = 100 / numRows;
                const x1 = (line.from.c + 0.5) * cellW;
                const y1 = (line.from.r + 0.5) * cellH;
                const x2 = (line.to.c + 0.5) * cellW;
                const y2 = (line.to.r + 0.5) * cellH;

                return (
                  <line 
                    key={idx}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke="#FF0055"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="0"
                    style={{
                      filter: 'drop-shadow(0px 2px 4px rgba(255, 0, 85, 0.4))'
                    }}
                  />
                );
              })}
            </svg>
          )}

          {/* Render Map Cells */}
          {Array.from({ length: numRows }).map((_, r) =>
            Array.from({ length: numCols }).map((_, c) => {
              const cellKey = `${r},${c}`;
              const label = getCellLabel(r, c);
              const isStart = startPos.r === r && startPos.c === c;
              const isTarget = targetPos.r === r && targetPos.c === c;
              const isObstacle = obstacleSet.has(cellKey);
              const checkpointNum = checkpointMap.get(cellKey);
              const isRobotHere = activeRobotR === r && activeRobotC === c;

              const cellBg = theme.cellColors[(r * numCols + c) % theme.cellColors.length] || theme.gridBg;

              return (
                <div
                  key={cellKey}
                  onClick={() => onCellClick(r, c)}
                  style={{
                    background: isObstacle ? '#FFE4E6' : cellBg,
                    border: `2px dashed ${theme.borderColor}`,
                    borderRadius: '16px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.8)'
                  }}
                >
                  {/* Coordinate Badge (A1, A2...) */}
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    left: '6px',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: theme.textColor || '#64748B',
                    background: 'rgba(255, 255, 255, 0.75)',
                    padding: '1px 6px',
                    borderRadius: '8px',
                    backdropFilter: 'blur(4px)'
                  }}>
                    {label}
                  </span>

                  {/* Cell Content Elements */}
                  {!isRobotHere && isStart && (
                    <div style={{ fontSize: '1.8rem' }} title="Punto de Inicio">
                      {theme.icons.start}
                    </div>
                  )}

                  {isTarget && (
                    <div style={{ 
                      fontSize: '2rem', 
                      filter: 'drop-shadow(0 4px 6px rgba(255,199,0,0.5))',
                      animation: 'pulseGlow 2s infinite ease-in-out'
                    }} title="Meta / Objetivo">
                      {theme.icons.target}
                    </div>
                  )}

                  {isObstacle && (
                    <div style={{ fontSize: '2rem' }} title="Obstáculo / Alto">
                      {theme.icons.obstacle}
                    </div>
                  )}

                  {checkpointNum && !isStart && !isTarget && !isObstacle && (
                    <div style={{
                      background: '#8B5CF6',
                      color: 'white',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      boxShadow: '0 2px 5px rgba(139, 92, 246, 0.4)'
                    }}>
                      {checkpointNum}
                    </div>
                  )}

                  {/* TaleBot Robot Avatar on active cell */}
                  {isRobotHere && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRotateRobotStart();
                      }}
                      title="Haz clic para girar la dirección inicial del robot"
                      style={{
                        position: 'relative',
                        width: '70%',
                        height: '70%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        transform: `rotate(${DIRECTIONS[activeRobotDir].angle}deg)`,
                        zIndex: 20
                      }}
                    >
                      {/* TaleBot Pro Body Container */}
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #FFC700 0%, #FF9500 100%)',
                        borderRadius: '50%',
                        border: '3px solid #FFFFFF',
                        boxShadow: '0 6px 15px rgba(255, 195, 0, 0.6)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        {/* Front Facing Nose Pointer */}
                        <div style={{
                          position: 'absolute',
                          top: '-6px',
                          width: '0',
                          height: '0',
                          borderLeft: '7px solid transparent',
                          borderRight: '7px solid transparent',
                          borderBottom: '10px solid #00A3FF'
                        }} />

                        {/* Top Hardware LED Light Bar */}
                        <div style={{
                          width: '60%',
                          height: '8px',
                          background: currentRobotState?.ledColor || '#10B981',
                          borderRadius: '4px',
                          marginBottom: '2px',
                          boxShadow: `0 0 8px ${currentRobotState?.ledColor || '#10B981'}`,
                          transition: 'background 0.2s ease'
                        }} />

                        {/* Cute Eyes */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <div style={{ width: '8px', height: '8px', background: '#0F172A', borderRadius: '50%' }} />
                          <div style={{ width: '8px', height: '8px', background: '#0F172A', borderRadius: '50%' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Grid Canvas Helper Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        background: '#FFFFFF',
        padding: '0.4rem 1.2rem',
        borderRadius: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#475569'
      }}>
        <span>Dirección inicial: <strong>{DIRECTIONS[startPos.dir || 0].name} ({DIRECTIONS[startPos.dir || 0].arrow})</strong></span>
        <button 
          onClick={onRotateRobotStart}
          className="tb-btn tb-btn-secondary"
          style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
        >
          <RotateCw size={14} /> Girar Robot
        </button>
      </div>
    </div>
  );
}
