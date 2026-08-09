import React, { useState } from 'react';
import { getCellLabel, COMMAND_TYPES, DIRECTIONS, OBSTACLE_TYPES, simulatePath } from '../utils/talebotEngine';
import { MAP_THEMES } from '../utils/presets';
import { Printer, X, Scissors } from 'lucide-react';

export default function PrintSheetPreview({
  challenge1,
  challenge2,
  onClose
}) {
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

    const { penLines } = simulatePath(
      ch.start || { r: 2, c: 0, dir: 0 },
      ch.commands || [],
      numRows,
      numCols
    );

    return (
      <div style={{
        border: '2.5px solid #FF6900',
        borderRadius: '14px',
        padding: '0.75rem',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        boxSizing: 'border-box',
        height: '48%'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1.5px solid #E2E8F0',
          paddingBottom: '0.3rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              background: '#FF6900',
              color: 'white',
              fontFamily: 'Fredoka',
              fontWeight: 700,
              padding: '1px 8px',
              borderRadius: '8px',
              fontSize: '0.78rem'
            }}>
              RETO #{index}
            </span>
            <h4 style={{ fontFamily: 'Fredoka', fontSize: '0.95rem', color: '#0F172A' }}>
              {ch.title || `Reto ${index}`}
            </h4>
          </div>

          <div style={{ display: 'flex', gap: '1px', fontSize: '0.85rem' }}>
            {Array.from({ length: ch.difficulty || 1 }).map((_, i) => (
              <span key={i}>⭐️</span>
            ))}
          </div>
        </div>

        {/* Story */}
        {ch.story && (
          <p style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600, fontStyle: 'italic', lineHeight: 1.2 }}>
            💡 {ch.story}
          </p>
        )}

        {/* Grid Map with Path Stroke */}
        <div style={{
          background: theme.bgGradient,
          padding: '0.4rem',
          borderRadius: '12px',
          border: '2px solid #94A3B8',
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
            gap: '4px',
            width: '100%',
            height: '100%',
            position: 'relative'
          }}>
            {/* SVG Path Layer */}
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
                    <line key={idx} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} stroke="#FF0055" strokeWidth="5" strokeLinecap="round" />
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
                      border: '1px dashed #CBD5E1',
                      borderRadius: '8px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      left: '4px',
                      fontSize: '0.5rem',
                      fontWeight: 800,
                      color: '#64748B'
                    }}>
                      {getCellLabel(r, c)}
                    </span>

                    {isStart && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                        <span>🤖</span>
                        <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#00A3FF' }}>
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
        border: '2.5px dashed #10B981',
        borderRadius: '14px',
        padding: '0.75rem',
        background: '#F0FDF4',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        boxSizing: 'border-box',
        height: '48%'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1.5px solid #BBF7D0',
          paddingBottom: '0.3rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              background: '#10B981',
              color: 'white',
              fontFamily: 'Fredoka',
              fontWeight: 700,
              padding: '1px 8px',
              borderRadius: '8px',
              fontSize: '0.78rem'
            }}>
              SOLUCIÓN #{index}
            </span>
            <h4 style={{ fontFamily: 'Fredoka', fontSize: '0.95rem', color: '#065F46' }}>
              {ch.title || `Solución Reto ${index}`}
            </h4>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#065F46', display: 'block', marginBottom: '4px' }}>
            ✅ Secuencia correcta de botones TaleBot Pro:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {(ch.commands || []).map((cmd, i) => {
              const cmdInfo = COMMAND_TYPES[cmd.id] || COMMAND_TYPES.FORWARD;
              return (
                <div
                  key={i}
                  style={{
                    background: cmdInfo.color,
                    color: cmdInfo.textColor,
                    padding: '0.25rem 0.45rem',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.68rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
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
      padding: '1rem',
      overflow: 'hidden' // NO VERTICAL SCROLLBAR ON SCREEN
    }}>
      {/* Floating Header Control Bar */}
      <div className="no-print" style={{
        background: '#FFFFFF',
        padding: '0.6rem 1.4rem',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '960px',
        marginBottom: '0.8rem',
        gap: '0.8rem'
      }}>
        <div>
          <h3 style={{ fontFamily: 'Fredoka', color: '#0F172A', fontSize: '1.1rem' }}>
            🖨️ Fichas de Recorrido A4 (Vista Compacta Lado a Lado)
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
            Página 1: Frente (Ejercicios) | Página 2: Reverso (Soluciones)
          </p>
        </div>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: '#FFF7ED',
          border: '1.5px solid #FFEDD5',
          padding: '0.35rem 0.7rem',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#C2410C'
        }}>
          <input
            type="checkbox"
            checked={includeCutoutSheet}
            onChange={(e) => setIncludeCutoutSheet(e.target.checked)}
            style={{ accentColor: '#FF6900', width: '14px', height: '14px' }}
          />
          <span>Imprimir 12 Obstáculos Recortables (Pág 3)</span>
        </label>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button onClick={handlePrint} className="tb-btn tb-btn-yellow" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <Printer size={18} /> Imprimir A4
          </button>

          <button onClick={onClose} className="tb-btn tb-btn-secondary" style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}>
            <X size={18} /> Cerrar
          </button>
        </div>
      </div>

      {/* Printable Sheet Pages - Scaled Compact Side-by-Side Viewport */}
      <div 
        className="print-page-container"
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1.5rem',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '100%',
          flex: 1,
          maxHeight: 'calc(100vh - 100px)'
        }}
      >
        {/* PAGE 1 (Front Side - Worksheets) */}
        <div className="print-page" style={{
          width: '320px',
          height: '450px',
          background: 'white',
          borderRadius: '14px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
          padding: '12px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2.5px solid #FF6900',
            paddingBottom: '0.3rem'
          }}>
            <h3 style={{ fontFamily: 'Fredoka', color: '#0F172A', fontSize: '1rem' }}>
              🤖 TaleBot Pro - Fichas A4
            </h3>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B' }}>Pág 1 / {includeCutoutSheet ? '3' : '2'}</span>
          </div>

          {renderSingleChallengeFront(challenge1, 1)}
          {renderSingleChallengeFront(challenge2, 2)}
        </div>

        {/* PAGE 2 (Back Side - Solutions) */}
        <div className="print-page" style={{
          width: '320px',
          height: '450px',
          background: 'white',
          borderRadius: '14px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
          padding: '12px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2.5px solid #10B981',
            paddingBottom: '0.3rem'
          }}>
            <h3 style={{ fontFamily: 'Fredoka', color: '#065F46', fontSize: '1rem' }}>
              🔑 Soluciones (Reverso)
            </h3>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B' }}>Pág 2 / {includeCutoutSheet ? '3' : '2'}</span>
          </div>

          {renderSingleChallengeBack(challenge1, 1)}
          {renderSingleChallengeBack(challenge2, 2)}
        </div>

        {/* PAGE 3 (Optional Cut-out Obstacles Sheet) */}
        {includeCutoutSheet && (
          <div className="print-page" style={{
            width: '320px',
            height: '450px',
            background: 'white',
            borderRadius: '14px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
            padding: '12px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '2.5px solid #8B5CF6',
              paddingBottom: '0.3rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Scissors size={18} color="#8B5CF6" />
                <h3 style={{ fontFamily: 'Fredoka', color: '#0F172A', fontSize: '1rem' }}>
                  ✂️ Obstáculos Recortables
                </h3>
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B' }}>Pág 3 / 3</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateRows: 'repeat(4, 1fr)',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
              flex: 1,
              margin: '0.4rem 0'
            }}>
              {OBSTACLE_TYPES.map((obs) => (
                <div
                  key={obs.id}
                  style={{
                    border: '1.5px dashed #94A3B8',
                    borderRadius: '10px',
                    padding: '0.3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    background: '#F8FAFC'
                  }}
                >
                  <div style={{ fontSize: '1.4rem' }}>{obs.icon}</div>
                  <div style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: '0.68rem', color: '#0F172A' }}>
                    {obs.name}
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
