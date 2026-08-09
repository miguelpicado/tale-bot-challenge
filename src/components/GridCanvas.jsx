import React, { useState, useEffect, useRef } from 'react';
import { getCellLabel, DIRECTIONS } from '../utils/talebotEngine';
import { MAP_THEMES } from '../utils/presets';
import { RotateCw, Flag, Star, OctagonAlert, Music, Volume2, Trash2, X } from 'lucide-react';

export default function GridCanvas({
  numRows = 3,
  numCols = 4,
  themeKey = 'CLASICO',
  startPos = { r: 2, c: 0, dir: 0 },
  targetPos = { r: 0, c: 3 },
  obstacles = [],
  specialActions = [], // [{ r, c, type: 'DANCE'|'SOUND' }]
  currentRobotState = null,
  penLines = [],
  onSetStartPos,
  onSetTargetPos,
  onToggleObstacle,
  onToggleSpecialAction,
  onClearCell
}) {
  const theme = MAP_THEMES[themeKey] || MAP_THEMES.CLASICO;

  // Active popover target cell state: { r, c } or null
  const [activePopoverCell, setActivePopoverCell] = useState(null);
  const containerRef = useRef(null);

  // Active robot state (during animation or default start)
  const activeRobotR = currentRobotState ? currentRobotState.r : startPos.r;
  const activeRobotC = currentRobotState ? currentRobotState.c : startPos.c;
  const activeRobotDir = currentRobotState ? currentRobotState.dir : (startPos.dir || 0);

  const obstacleSet = new Set(obstacles.map(o => `${o.r},${o.c}`));
  const specialActionMap = new Map(specialActions.map(sa => [`${sa.r},${sa.c}`, sa.type]));

  // Close popover when clicking outside
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
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        width: '100%'
      }}
    >
      {/* Hero Canvas Container */}
      <div 
        style={{
          background: theme.bgGradient,
          padding: '1.5rem',
          borderRadius: '32px',
          boxShadow: '0 20px 45px rgba(255, 105, 0, 0.12), 0 8px 25px rgba(0, 0, 0, 0.08)',
          border: '6px solid #FFFFFF',
          position: 'relative',
          width: '100%',
          maxWidth: numCols === 4 ? '720px' : '560px',
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
          {/* SVG Pen Drawing Layer */}
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
                    style={{
                      filter: 'drop-shadow(0px 3px 6px rgba(255, 0, 85, 0.5))'
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
              const specialType = specialActionMap.get(cellKey);
              const isRobotHere = activeRobotR === r && activeRobotC === c;
              const isPopoverActive = activePopoverCell?.r === r && activePopoverCell?.c === c;

              const cellBg = theme.cellColors[(r * numCols + c) % theme.cellColors.length] || theme.gridBg;

              return (
                <div
                  key={cellKey}
                  onClick={() => handleCellClick(r, c)}
                  style={{
                    background: isObstacle ? '#FFE4E6' : cellBg,
                    border: isPopoverActive ? '3px solid #FF6900' : `2.5px dashed ${theme.borderColor}`,
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
                      ? '0 0 20px rgba(255, 105, 0, 0.4)' 
                      : 'inset 0 2px 5px rgba(255,255,255,0.9), 0 4px 10px rgba(0,0,0,0.03)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isPopoverActive) e.currentTarget.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isPopoverActive) e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {/* Coordinate Badge (A1, A2...) */}
                  <span style={{
                    position: 'absolute',
                    top: '6px',
                    left: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    color: '#64748B',
                    background: 'rgba(255, 255, 255, 0.85)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    backdropFilter: 'blur(4px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    {label}
                  </span>

                  {/* Cell Content Elements */}
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

                  {isObstacle && (
                    <div style={{ fontSize: '2.4rem' }} title="Obstáculo / Alto">
                      🛑
                    </div>
                  )}

                  {specialType === 'DANCE' && !isRobotHere && (
                    <div style={{ fontSize: '2.2rem' }} title="Acción Especial: Baile">
                      💃
                    </div>
                  )}

                  {specialType === 'SOUND' && !isRobotHere && (
                    <div style={{ fontSize: '2.2rem' }} title="Acción Especial: Sonido">
                      🔊
                    </div>
                  )}

                  {/* TaleBot Robot Avatar on active cell */}
                  {isRobotHere && (
                    <div 
                      style={{
                        position: 'relative',
                        width: '72%',
                        height: '72%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        transform: `rotate(${DIRECTIONS[activeRobotDir].angle}deg)`,
                        zIndex: 20
                      }}
                    >
                      {/* TaleBot Pro Body */}
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #FFC700 0%, #FF9500 100%)',
                        borderRadius: '50%',
                        border: '4px solid #FFFFFF',
                        boxShadow: '0 8px 20px rgba(255, 150, 0, 0.6)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        {/* Direction Arrow Indicator */}
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          width: '0',
                          height: '0',
                          borderLeft: '9px solid transparent',
                          borderRight: '9px solid transparent',
                          borderBottom: '12px solid #00A3FF'
                        }} />

                        {/* Top Hardware LED Bar */}
                        <div style={{
                          width: '65%',
                          height: '9px',
                          background: currentRobotState?.ledColor || '#10B981',
                          borderRadius: '5px',
                          marginBottom: '3px',
                          boxShadow: `0 0 10px ${currentRobotState?.ledColor || '#10B981'}`,
                          transition: 'background 0.2s ease'
                        }} />

                        {/* Eyes */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <div style={{ width: '9px', height: '9px', background: '#0F172A', borderRadius: '50%' }} />
                          <div style={{ width: '9px', height: '9px', background: '#0F172A', borderRadius: '50%' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Popover Action Menu for clicked cell */}
                  {isPopoverActive && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: 'absolute',
                        top: r === 0 ? '105%' : 'auto',
                        bottom: r > 0 ? '105%' : 'auto',
                        zIndex: 100,
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        padding: '0.8rem',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.25), 0 5px 15px rgba(255,105,0,0.15)',
                        border: '3px solid #FF6900',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        minWidth: '210px',
                        animation: 'bounceRobot 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1.5px dashed #E2E8F0',
                        paddingBottom: '0.4rem'
                      }}>
                        <span style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: '0.85rem', color: '#FF6900' }}>
                          📍 Casilla {label}
                        </span>
                        <button 
                          onClick={() => setActivePopoverCell(null)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <X size={16} color="#64748B" />
                        </button>
                      </div>

                      {/* 1. Set Start & Orientation */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155' }}>
                          🤖 Inicio + Dirección:
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
                                padding: '0.4rem',
                                borderRadius: '10px',
                                border: isStart && startPos.dir === dirIdx ? '2px solid #FF6900' : '1px solid #CBD5E1',
                                background: isStart && startPos.dir === dirIdx ? '#FFF7ED' : '#F8FAFC',
                                cursor: 'pointer',
                                fontWeight: 800,
                                fontSize: '0.85rem'
                              }}
                              title={`Inicio mirando al ${dirObj.name}`}
                            >
                              {dirObj.arrow}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quick Action Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                        {/* Set Target */}
                        <button
                          onClick={() => {
                            onSetTargetPos({ r, c });
                            setActivePopoverCell(null);
                          }}
                          className="tb-btn"
                          style={{
                            padding: '0.45rem',
                            fontSize: '0.75rem',
                            background: isTarget ? '#FFC700' : '#F1F5F9',
                            color: '#0F172A',
                            justifyContent: 'center'
                          }}
                        >
                          ⭐️ Meta
                        </button>

                        {/* Set Obstacle */}
                        <button
                          onClick={() => {
                            onToggleObstacle({ r, c });
                            setActivePopoverCell(null);
                          }}
                          className="tb-btn"
                          style={{
                            padding: '0.45rem',
                            fontSize: '0.75rem',
                            background: isObstacle ? '#F43F5E' : '#F1F5F9',
                            color: isObstacle ? 'white' : '#0F172A',
                            justifyContent: 'center'
                          }}
                        >
                          🛑 Obstáculo
                        </button>

                        {/* Dance */}
                        <button
                          onClick={() => {
                            onToggleSpecialAction({ r, c, type: 'DANCE' });
                            setActivePopoverCell(null);
                          }}
                          className="tb-btn"
                          style={{
                            padding: '0.45rem',
                            fontSize: '0.75rem',
                            background: specialType === 'DANCE' ? '#8B5CF6' : '#F1F5F9',
                            color: specialType === 'DANCE' ? 'white' : '#0F172A',
                            justifyContent: 'center'
                          }}
                        >
                          💃 Baile
                        </button>

                        {/* Sound */}
                        <button
                          onClick={() => {
                            onToggleSpecialAction({ r, c, type: 'SOUND' });
                            setActivePopoverCell(null);
                          }}
                          className="tb-btn"
                          style={{
                            padding: '0.45rem',
                            fontSize: '0.75rem',
                            background: specialType === 'SOUND' ? '#EC4899' : '#F1F5F9',
                            color: specialType === 'SOUND' ? 'white' : '#0F172A',
                            justifyContent: 'center'
                          }}
                        >
                          🔊 Sonido
                        </button>
                      </div>

                      {/* Clear Cell */}
                      <button
                        onClick={() => {
                          onClearCell(r, c);
                          setActivePopoverCell(null);
                        }}
                        style={{
                          padding: '0.35rem',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#F1F5F9',
                          color: '#EF4444',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={12} /> Limpiar Casilla
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
