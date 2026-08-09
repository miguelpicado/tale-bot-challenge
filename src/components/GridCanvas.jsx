import React, { useState, useEffect, useRef } from 'react';
import { getCellLabel, DIRECTIONS, OBSTACLE_TYPES } from '../utils/talebotEngine';
import { MAP_THEMES } from '../utils/presets';
import TaleBotAvatar from './TaleBotAvatar';
import { X, Trash2 } from 'lucide-react';

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
  onSetStartPos,
  onSetTargetPos,
  onToggleObstacle,
  onClearCell
}) {
  const theme = MAP_THEMES[themeKey] || MAP_THEMES.CLASICO;

  // Popover target cell: { r, c, rect } or null
  const [activePopoverCell, setActivePopoverCell] = useState(null);
  const containerRef = useRef(null);

  // Active robot state
  const activeRobotR = currentRobotState ? currentRobotState.r : startPos.r;
  const activeRobotC = currentRobotState ? currentRobotState.c : startPos.c;
  const activeRobotDir = currentRobotState ? currentRobotState.dir : (startPos.dir || 0);

  const obstacleMap = new Map((obstacles || []).map(o => [`${o.r},${o.c}`, o.type || 'ALTO']));

  // Close popover on outside click or scroll
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target) && !e.target.closest('.tb-popover-modal')) {
        setActivePopoverCell(null);
      }
    };
    const handleScroll = () => {
      setActivePopoverCell(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
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

  // Calculate Fixed Clamped Viewport Coordinates for Popover Modal (GUARANTEES NO CUTOFF!)
  let popoverFixedStyle = null;
  if (activePopoverCell && activePopoverCell.rect) {
    const { rect, r } = activePopoverCell;
    const modalWidth = 270;
    const modalEstimatedHeight = 320;

    const isBottomHalf = r >= Math.floor(numRows / 2);
    let topPos = isBottomHalf
      ? rect.top - modalEstimatedHeight - 8
      : rect.bottom + 8;

    // Clamp topPos inside viewport bounds
    topPos = Math.max(10, Math.min(window.innerHeight - modalEstimatedHeight - 10, topPos));

    // Clamp leftPos inside viewport bounds
    let leftPos = rect.left + (rect.width / 2) - (modalWidth / 2);
    leftPos = Math.max(10, Math.min(window.innerWidth - modalWidth - 10, leftPos));

    popoverFixedStyle = {
      position: 'fixed',
      top: `${topPos}px`,
      left: `${leftPos}px`,
      width: `${modalWidth}px`,
      zIndex: 999999,
      background: '#FFFFFF',
      borderRadius: '24px',
      padding: '0.85rem',
      boxShadow: '0 25px 60px rgba(0,0,0,0.4), 0 10px 25px rgba(255,105,0,0.25)',
      border: '3.5px solid #FF6900',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      overflow: 'visible'
    };
  }

  const activeLabel = activePopoverCell ? getCellLabel(activePopoverCell.r, activePopoverCell.c, numRows) : '';

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
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          boxSizing: 'border-box',
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
                    style={{
                      filter: 'drop-shadow(0 2px 6px rgba(255,0,85,0.4))'
                    }}
                  />
                );
              })}
            </svg>
          )}

          {/* Render Cells */}
          {Array.from({ length: numRows }).map((_, r) =>
            Array.from({ length: numCols }).map((_, c) => {
              const cellKey = `${r},${c}`;
              const label = getCellLabel(r, c, numRows);
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
                  onClick={(e) => handleCellClick(r, c, e)}
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
                      size={numCols === 5 ? 64 : 74}
                      angle={DIRECTIONS[activeRobotDir].angle}
                      ledColor={currentRobotState?.ledColor || '#10B981'}
                      hasWings={hasWings}
                      hasArms={hasArms}
                      isDancing={currentRobotState?.isDancing || currentRobotState?.commandId === 'DANCE'}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FIXED VIEWPORT-CLAMPED POPOVER MODAL (GUARANTEED NO OVERFLOW / CLIPPING!) */}
      {activePopoverCell && popoverFixedStyle && (
        <div 
          className="tb-popover-modal"
          onClick={(e) => e.stopPropagation()}
          style={popoverFixedStyle}
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
              📍 Opciones Casilla {activeLabel}
            </span>
            <button 
              onClick={() => setActivePopoverCell(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={18} color="#64748B" />
            </button>
          </div>

          {/* 1. Start + Orientations */}
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '3px' }}>
              🤖 Definir como Punto de Inicio:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
              {DIRECTIONS.map((dirObj, idx) => (
                <button
                  key={dirObj.id}
                  onClick={() => {
                    onSetStartPos({ r: activePopoverCell.r, c: activePopoverCell.c, dir: idx });
                    setActivePopoverCell(null);
                  }}
                  style={{
                    padding: '0.3rem',
                    borderRadius: '8px',
                    border: '1.5px solid #BAE6FD',
                    background: '#F0F9FF',
                    color: '#0284C7',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  {dirObj.arrow} {dirObj.name[0]}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Target Goal */}
          <button
            onClick={() => {
              onSetTargetPos({ r: activePopoverCell.r, c: activePopoverCell.c });
              setActivePopoverCell(null);
            }}
            style={{
              padding: '0.45rem',
              borderRadius: '10px',
              border: '1.5px solid #FEF08A',
              background: '#FEF9C3',
              color: '#854D0E',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            ⭐️ Fijar como Meta / Objetivo
          </button>

          {/* 3. Obstacles Grid Picker */}
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '3px' }}>
              🛑 Poner Obstáculo / Pasada Intermedia:
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '4px',
              maxHeight: '120px',
              overflowY: 'auto'
            }}>
              {OBSTACLE_TYPES.map((obs) => {
                const isSelected = obstacleMap.get(`${activePopoverCell.r},${activePopoverCell.c}`) === obs.id;
                return (
                  <button
                    key={obs.id}
                    onClick={() => {
                      onToggleObstacle({ r: activePopoverCell.r, c: activePopoverCell.c, type: obs.id });
                      setActivePopoverCell(null);
                    }}
                    style={{
                      padding: '0.3rem',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #FF6900' : '1px solid #E2E8F0',
                      background: isSelected ? '#FFF7ED' : '#F8FAFC',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title={obs.name}
                  >
                    {obs.icon}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Clear Cell */}
          <button
            onClick={() => {
              onClearCell(activePopoverCell.r, activePopoverCell.c);
              setActivePopoverCell(null);
            }}
            style={{
              padding: '0.35rem',
              borderRadius: '8px',
              border: '1.5px solid #FECDD3',
              background: '#FFF1F2',
              color: '#E11D48',
              fontWeight: 800,
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Trash2 size={14} /> Limpiar Casilla
          </button>
        </div>
      )}
    </div>
  );
}
