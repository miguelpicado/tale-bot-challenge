import React, { useState, useEffect, useRef } from 'react';
import { getCellLabel, DIRECTIONS, OBSTACLE_TYPES } from '../utils/talebotEngine';
import { MAP_THEMES } from '../utils/presets';
import TaleBotAvatar from './TaleBotAvatar';
import { X, Trash2 } from 'lucide-react';

export default function GridCanvas({
  numRows = 3,
  numCols = 4,
  themeKey = 'CLASICO',
  startPos = { r: 2, c: 0, dir: 0 },
  targetPos = { r: 0, c: 3 },
  obstacles = [],
  currentRobotState = null,
  penLines = [],
  hasWings = false,
  hasArms = false,
  onSetStartPos,
  onSetTargetPos,
  onToggleObstacle,
  onClearCell
}) {
  const theme = MAP_THEMES[themeKey] || MAP_THEMES.CLASICO;

  // Popover target cell: { r, c } or null
  const [activePopoverCell, setActivePopoverCell] = useState(null);
  const containerRef = useRef(null);

  // Active robot state
  const activeRobotR = currentRobotState ? currentRobotState.r : startPos.r;
  const activeRobotC = currentRobotState ? currentRobotState.c : startPos.c;
  const activeRobotDir = currentRobotState ? currentRobotState.dir : (startPos.dir || 0);

  const obstacleMap = new Map((obstacles || []).map(o => [`${o.r},${o.c}`, o.type || 'ALTO']));

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActivePopoverCell(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCellClick = (r, c) => {
    setActivePopoverCell({ r, c });
  };

  return (
    <div 
      ref={containerRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 0
      }}
    >
      {/* Hero Canvas Container (Expands to maximum available space) */}
      <div 
        style={{
          background: theme.bgGradient,
          padding: '1.2rem',
          borderRadius: '28px',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.08), 0 8px 20px rgba(255, 105, 0, 0.08)',
          border: '5px solid #FFFFFF',
          position: 'relative',
          maxHeight: '100%',
          maxWidth: '100%',
          aspectRatio: `${numCols} / ${numRows}`,
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <div 
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(${numRows}, 1fr)`,
            gridTemplateColumns: `repeat(${numCols}, 1fr)`,
            gap: '12px',
            width: '100%',
            height: '100%',
            position: 'relative'
          }}
        >
          {/* SVG Pen Lines Layer */}
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
                    strokeWidth="8"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0px 3px 6px rgba(255, 0, 85, 0.5))' }}
                  />
                );
              })}
            </svg>
          )}

          {/* Render Cells */}
          {Array.from({ length: numRows }).map((_, r) =>
            Array.from({ length: numCols }).map((_, c) => {
              const cellKey = `${r},${c}`;
              const label = getCellLabel(r, c);
              const isStart = startPos.r === r && startPos.c === c;
              const isTarget = targetPos.r === r && targetPos.c === c;
              const obstacleTypeId = obstacleMap.get(cellKey);
              const obstacleObj = OBSTACLE_TYPES.find(o => o.id === obstacleTypeId);
              const isRobotHere = activeRobotR === r && activeRobotC === c;
              const isPopoverActive = activePopoverCell?.r === r && activePopoverCell?.c === c;

              const cellBg = theme.cellColors[(r * numCols + c) % theme.cellColors.length] || theme.gridBg;

              return (
                <div
                  key={cellKey}
                  onClick={() => handleCellClick(r, c)}
                  style={{
                    background: obstacleObj ? '#FFE4E6' : cellBg,
                    border: isPopoverActive ? '3.5px solid #FF6900' : `2.5px dashed ${theme.borderColor}`,
                    borderRadius: '20px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: isPopoverActive 
                      ? '0 0 24px rgba(255, 105, 0, 0.45)' 
                      : 'inset 0 2px 5px rgba(255,255,255,0.9), 0 4px 10px rgba(0,0,0,0.03)',
                    zIndex: isPopoverActive ? 100 : 10
                  }}
                  onMouseEnter={(e) => {
                    if (!isPopoverActive) e.currentTarget.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isPopoverActive) e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {/* Coordinate Badge */}
                  <span style={{
                    position: 'absolute',
                    top: '6px',
                    left: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    color: '#64748B',
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    backdropFilter: 'blur(4px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    {label}
                  </span>

                  {/* Items */}
                  {!isRobotHere && isStart && (
                    <div style={{ fontSize: '2.4rem' }} title="Punto de Inicio">
                      🤖
                    </div>
                  )}

                  {isTarget && (
                    <div style={{ 
                      fontSize: '2.6rem', 
                      filter: 'drop-shadow(0 4px 12px rgba(255,199,0,0.6))',
                      animation: 'pulseGlow 2s infinite ease-in-out'
                    }} title="Meta / Objetivo">
                      ⭐️
                    </div>
                  )}

                  {obstacleObj && !isRobotHere && (
                    <div style={{ fontSize: '2.4rem' }} title={obstacleObj.name}>
                      {obstacleObj.icon}
                    </div>
                  )}

                  {/* TaleBot Avatar */}
                  {isRobotHere && (
                    <TaleBotAvatar
                      size={numCols === 4 ? 74 : 64}
                      angle={DIRECTIONS[activeRobotDir].angle}
                      ledColor={currentRobotState?.ledColor || '#10B981'}
                      hasWings={hasWings}
                      hasArms={hasArms}
                      isDancing={currentRobotState?.isDancing || currentRobotState?.commandId === 'DANCE'}
                    />
                  )}

                  {/* Smart Popover Action Modal (Intelligent placement: opens UPWARDS on bottom rows, DOWNWARDS on top rows) */}
                  {isPopoverActive && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: 'absolute',
                        // Smart Vertical Placement: Open UPWARDS if on bottom half of grid, DOWNWARDS if on top half
                        top: r >= Math.floor(numRows / 2) ? 'auto' : '105%',
                        bottom: r >= Math.floor(numRows / 2) ? '105%' : 'auto',
                        // Smart Horizontal Placement: Align LEFT on col 0, RIGHT on last col, CENTER on middle cols
                        left: c === 0 ? '0%' : c === numCols - 1 ? 'auto' : '50%',
                        right: c === numCols - 1 ? '0%' : 'auto',
                        transform: c !== 0 && c !== numCols - 1 ? 'translateX(-50%)' : 'none',
                        zIndex: 99999,
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        padding: '0.85rem',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.35), 0 10px 25px rgba(255,105,0,0.25)',
                        border: '3.5px solid #FF6900',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        width: '270px',
                        overflow: 'visible'
                      }}
                    >
                      {/* Popover Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '2px dashed #E2E8F0',
                        paddingBottom: '0.35rem'
                      }}>
                        <span style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: '0.95rem', color: '#FF6900' }}>
                          📍 Opciones Casilla {label}
                        </span>
                        <button 
                          onClick={() => setActivePopoverCell(null)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <X size={18} color="#64748B" />
                        </button>
                      </div>

                      {/* 1. Start + Orientations */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155' }}>
                          🤖 Inicio + Orientación del Robot:
                        </span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                          {DIRECTIONS.map((dirObj, dirIdx) => (
                            <button
                              key={dirIdx}
                              onClick={() => {
                                onSetStartPos({ r, c, dir: dirIdx });
                                setActivePopoverCell(null);
                              }}
                              style={{
                                padding: '0.35rem',
                                borderRadius: '10px',
                                border: isStart && startPos.dir === dirIdx ? '2px solid #FF6900' : '1px solid #CBD5E1',
                                background: isStart && startPos.dir === dirIdx ? '#FFF7ED' : '#F8FAFC',
                                cursor: 'pointer',
                                fontWeight: 800,
                                fontSize: '0.85rem'
                              }}
                            >
                              {dirObj.arrow}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. Set Target Star */}
                      <button
                        onClick={() => {
                          onSetTargetPos({ r, c });
                          setActivePopoverCell(null);
                        }}
                        className="tb-btn"
                        style={{
                          padding: '0.4rem',
                          fontSize: '0.78rem',
                          background: isTarget ? '#FFC700' : '#F1F5F9',
                          color: '#0F172A',
                          justifyContent: 'center'
                        }}
                      >
                        ⭐️ Poner Meta / Objetivo
                      </button>

                      {/* 3. Obstacle Selector Grid */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155' }}>
                          🛑 Seleccionar Obstáculo Recortable:
                        </span>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: '3px'
                        }}>
                          {OBSTACLE_TYPES.map((obs) => (
                            <button
                              key={obs.id}
                              onClick={() => {
                                onToggleObstacle({ r, c, type: obs.id });
                                setActivePopoverCell(null);
                              }}
                              style={{
                                padding: '0.35rem 0.1rem',
                                borderRadius: '8px',
                                border: obstacleTypeId === obs.id ? '2px solid #F43F5E' : '1px solid #E2E8F0',
                                background: obstacleTypeId === obs.id ? '#FFE4E6' : '#FFFFFF',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                fontSize: '0.65rem',
                                fontWeight: 700
                              }}
                              title={obs.name + ': ' + obs.description}
                            >
                              <span style={{ fontSize: '1.1rem' }}>{obs.icon}</span>
                              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '50px' }}>
                                {obs.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 4. Clear Cell */}
                      <button
                        onClick={() => {
                          onClearCell(r, c);
                          setActivePopoverCell(null);
                        }}
                        style={{
                          padding: '0.35rem',
                          borderRadius: '10px',
                          border: 'none',
                          background: '#F1F5F9',
                          color: '#EF4444',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Trash2 size={14} /> Limpiar Casilla
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
