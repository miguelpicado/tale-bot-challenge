import React, { useState } from 'react';
import { getCellLabel, COMMAND_TYPES, DIRECTIONS, OBSTACLE_TYPES, simulatePath } from '../utils/talebotEngine';
import { MAP_THEMES } from '../utils/presets';
import { Printer, X, Scissors, Check } from 'lucide-react';

export default function PrintSheetPreview({
  challenge1,
  challenge2,
  onClose
}) {
  // Option to include Page 3 (Cut-out obstacles sheet) - defaults to false as requested!
  const [includeCutoutSheet, setIncludeCutoutSheet] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const renderSingleChallengeFront = (ch, index) => {
    if (!ch) return null;
    const theme = MAP_THEMES[ch.theme] || MAP_THEMES.CLASICO;
    const numRows = ch.numRows || 3;
    const numCols = ch.numCols || 4;
    const obstacleMap = new Map((ch.obstacles || []).map(o => [`${o.r},${o.c}`, o.type || 'ALTO']));

    // Pre-calculate trajectory for path stroke rendering
    const { penLines, trajectory } = simulatePath(
      ch.start || { r: 2, c: 0, dir: 0 },
      ch.commands || [],
      numRows,
      numCols
    );

    return (
      <div style={{
        border: '3px solid #FF6900',
        borderRadius: '18px',
        padding: '1rem',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        boxSizing: 'border-box',
        height: '48%'
      }}>
        {/* Challenge Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #E2E8F0',
          paddingBottom: '0.4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              background: '#FF6900',
              color: 'white',
              fontFamily: 'Fredoka',
              fontWeight: 700,
              padding: '2px 10px',
              borderRadius: '10px',
              fontSize: '0.9rem'
            }}>
              RETO #{index}
            </span>
            <h3 style={{ fontFamily: 'Fredoka', fontSize: '1.2rem', color: '#0F172A' }}>
              {ch.title || `Reto de programación ${index}`}
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '2px', fontSize: '1rem' }}>
            {Array.from({ length: ch.difficulty || 1 }).map((_, i) => (
              <span key={i}>⭐️</span>
            ))}
          </div>
        </div>

        {/* Story prompt */}
        {ch.story && (
          <p style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, fontStyle: 'italic' }}>
            💡 {ch.story}
          </p>
        )}

        {/* Prominent Clean Map Grid with Path Line Overlay */}
        <div style={{
          background: theme.bgGradient,
          padding: '0.6rem',
          borderRadius: '16px',
          border: '2.5px solid #94A3B8',
          width: '100%',
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateRows: `repeat(${numRows}, 1fr)`,
            gridTemplateColumns: `repeat(${numCols}, 1fr)`,
            gap: '6px',
            width: '100%',
            height: '100%',
            position: 'relative'
          }}>
            {/* SVG Path Stroke Layer */}
            {penLines && penLines.length > 0 && (
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 15 }}>
                {penLines.map((line, idx) => {
                  const cellW = 100 / numCols;
                  const cellH = 100 / numRows;
                  const x1 = (line.from.c + 0.5) * cellW;
                  const y1 = (line.from.r + 0.5) * cellH;
                  const x2 = (line.to.c + 0.5) * cellW;
                  const y2 = (line.to.r + 0.5) * cellH;
                  return (
                    <line key={idx} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} stroke="#FF0055" strokeWidth="6" strokeLinecap="round" />
                  );
                })}
              </svg>
            )}

            {Array.from({ length: numRows }).map((_, r) =>
              Array.from({ length: numCols }).map((_, c) => {
                const cellKey = `${r},${c}`;
                const isStart = ch.start.r === r && ch.start.c === c;
                const isTarget = ch.target && ch.target.r === r && ch.target.c === c;
                const obsTypeId = obstacleMap.get(cellKey);
                const obsObj = OBSTACLE_TYPES.find(o => o.id === obsTypeId);

                return (
                  <div
                    key={cellKey}
                    style={{
                      background: obsObj ? '#FFE4E6' : '#FFFFFF',
                      border: '1.5px dashed #CBD5E1',
                      borderRadius: '10px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.6rem'
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      top: '3px',
                      left: '5px',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      color: '#64748B'
                    }}>
                      {getCellLabel(r, c)}
                    </span>

                    {isStart && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                        <span>🤖</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#00A3FF' }}>
                          {DIRECTIONS[ch.start.dir || 0].arrow}
                        </span>
                      </div>
                    )}

                    {isTarget && <span>{theme.icons.target}</span>}
                    {obsObj && <span>{obsObj.icon}</span>}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSingleChallengeBack = (ch, index) => {
    if (!ch) return null;

    return (
      <div style={{
        border: '3px dashed #10B981',
        borderRadius: '18px',
        padding: '1rem',
        background: '#F0FDF4',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        boxSizing: 'border-box',
        height: '48%'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #BBF7D0',
          paddingBottom: '0.4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              background: '#10B981',
              color: 'white',
              fontFamily: 'Fredoka',
              fontWeight: 700,
              padding: '2px 10px',
              borderRadius: '10px',
              fontSize: '0.9rem'
            }}>
              SOLUCIÓN #{index}
            </span>
            <h3 style={{ fontFamily: 'Fredoka', fontSize: '1.2rem', color: '#065F46' }}>
              {ch.title || `Solución Reto ${index}`}
            </h3>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#065F46', display: 'block', marginBottom: '6px' }}>
            ✅ Secuencia correcta de botones TaleBot Pro:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {(ch.commands || []).map((cmd, i) => {
              const cmdInfo = COMMAND_TYPES[cmd.id] || COMMAND_TYPES.FORWARD;
              return (
                <div
                  key={i}
                  style={{
                    background: cmdInfo.color,
                    color: cmdInfo.textColor,
                    padding: '0.35rem 0.6rem',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <span style={{ opacity: 0.8 }}>{i + 1}.</span>
                  <span>{cmdInfo.icon}</span>
                  <span>{cmdInfo.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
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
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.5rem',
      overflowY: 'auto'
    }}>
      {/* Floating Header Control Bar */}
      <div className="no-print" style={{
        background: '#FFFFFF',
        padding: '0.8rem 1.6rem',
        borderRadius: '20px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '880px',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '0.8rem'
      }}>
        <div>
          <h3 style={{ fontFamily: 'Fredoka', color: '#0F172A', fontSize: '1.2rem' }}>
            🖨️ Fichas de Recorrido A4
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
            Página 1: Mapa pintado | Página 2: Solución al reverso
          </p>
        </div>

        {/* Option Checkbox to include Cut-out Obstacles Sheet */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#FFF7ED',
          border: '1.5px solid #FFEDD5',
          padding: '0.4rem 0.8rem',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#C2410C'
        }}>
          <input
            type="checkbox"
            checked={includeCutoutSheet}
            onChange={(e) => setIncludeCutoutSheet(e.target.checked)}
            style={{ accentColor: '#FF6900', width: '16px', height: '16px' }}
          />
          <span>Imprimir Hoja de 12 Obstáculos Recortables (Pág 3)</span>
        </label>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button onClick={handlePrint} className="tb-btn tb-btn-yellow">
            <Printer size={20} /> Imprimir A4
          </button>

          <button onClick={onClose} className="tb-btn tb-btn-secondary">
            <X size={20} /> Cerrar
          </button>
        </div>
      </div>

      {/* Printable Sheet Pages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
        {/* PAGE 1 (Worksheet Front - Map with painted path) */}
        <div className="print-page" style={{
          width: '210mm',
          height: '297mm',
          background: 'white',
          borderRadius: '16px',
          padding: '15mm',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '3px solid #FF6900',
            paddingBottom: '0.5rem'
          }}>
            <h2 style={{ fontFamily: 'Fredoka', color: '#0F172A', fontSize: '1.4rem' }}>
              🤖 TaleBot Pro - Fichas de Recorrido
            </h2>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Página 1 / {includeCutoutSheet ? '3' : '2'}</span>
          </div>

          {renderSingleChallengeFront(challenge1, 1)}
          {renderSingleChallengeFront(challenge2, 2)}
        </div>

        {/* PAGE 2 (Back Side - Solutions) */}
        <div className="print-page" style={{
          width: '210mm',
          height: '297mm',
          background: 'white',
          borderRadius: '16px',
          padding: '15mm',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '3px solid #10B981',
            paddingBottom: '0.5rem'
          }}>
            <h2 style={{ fontFamily: 'Fredoka', color: '#065F46', fontSize: '1.4rem' }}>
              🔑 Soluciones de las Fichas (Reverso)
            </h2>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Página 2 / {includeCutoutSheet ? '3' : '2'}</span>
          </div>

          {renderSingleChallengeBack(challenge1, 1)}
          {renderSingleChallengeBack(challenge2, 2)}
        </div>

        {/* PAGE 3 (Optional Printable 12 Cut-out Obstacles Sheet) */}
        {includeCutoutSheet && (
          <div className="print-page" style={{
            width: '210mm',
            height: '297mm',
            background: 'white',
            borderRadius: '16px',
            padding: '15mm',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '3px solid #8B5CF6',
              paddingBottom: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Scissors size={24} color="#8B5CF6" />
                <h2 style={{ fontFamily: 'Fredoka', color: '#0F172A', fontSize: '1.4rem' }}>
                  ✂️ Obstáculos Recortables para el Mapa Físico
                </h2>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Página 3 / 3</span>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
              Imprime esta hoja en papel o cartulina y recorta las fichas por la línea de puntos para colocarlas sobre el tablero 3x4 del robot TaleBot Pro.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateRows: 'repeat(4, 1fr)',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              flex: 1,
              margin: '0.5rem 0'
            }}>
              {OBSTACLE_TYPES.map((obs) => (
                <div
                  key={obs.id}
                  style={{
                    border: '2px dashed #94A3B8',
                    borderRadius: '16px',
                    padding: '0.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    background: '#F8FAFC',
                    position: 'relative'
                  }}
                >
                  <span style={{ position: 'absolute', top: '4px', right: '6px', fontSize: '0.65rem', color: '#94A3B8' }}>
                    ✂️
                  </span>
                  <div style={{ fontSize: '2.8rem' }}>{obs.icon}</div>
                  <div style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', marginTop: '4px' }}>
                    {obs.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '2px', lineHeight: 1.2 }}>
                    {obs.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
