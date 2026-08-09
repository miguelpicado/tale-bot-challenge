import React from 'react';
import { getCellLabel, COMMAND_TYPES, DIRECTIONS, OBSTACLE_TYPES } from '../utils/talebotEngine';
import { MAP_THEMES } from '../utils/presets';
import { Printer, X, Scissors } from 'lucide-react';

export default function PrintSheetPreview({
  challenge1,
  challenge2,
  onClose
}) {
  const handlePrint = () => {
    window.print();
  };

  const renderSingleChallengeFront = (ch, index) => {
    if (!ch) return null;
    const theme = MAP_THEMES[ch.theme] || MAP_THEMES.CLASICO;
    const numRows = ch.numRows || 3;
    const numCols = ch.numCols || 4;
    const obstacleMap = new Map((ch.obstacles || []).map(o => [`${o.r},${o.c}`, o.type || 'ALTO']));

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

        {/* Grid Map & Command Blank Box Split */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', height: '100%' }}>
          {/* Map Grid */}
          <div style={{
            background: theme.bgGradient,
            padding: '0.5rem',
            borderRadius: '14px',
            border: '2px solid #94A3B8',
            width: '240px',
            aspectRatio: `${numCols} / ${numRows}`
          }}>
            <div style={{
              display: 'grid',
              gridTemplateRows: `repeat(${numRows}, 1fr)`,
              gridTemplateColumns: `repeat(${numCols}, 1fr)`,
              gap: '4px',
              height: '100%'
            }}>
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
                        borderRadius: '8px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem'
                      }}
                    >
                      <span style={{
                        position: 'absolute',
                        top: '2px',
                        left: '4px',
                        fontSize: '0.55rem',
                        fontWeight: 800,
                        color: '#64748B'
                      }}>
                        {getCellLabel(r, c)}
                      </span>

                      {isStart && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                          <span>🤖</span>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#00A3FF' }}>
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

          {/* Blank Command Write Boxes */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155' }}>
              ✍️ Dibuja los comandos del robot en orden:
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '6px'
            }}>
              {Array.from({ length: Math.max(10, (ch.commands || []).length) }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: '1',
                    border: '2px solid #94A3B8',
                    borderRadius: '10px',
                    background: '#F8FAFC',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    left: '4px',
                    fontSize: '0.55rem',
                    fontWeight: 800,
                    color: '#94A3B8'
                  }}>
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
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
      {/* Top Floating Control Bar */}
      <div className="no-print" style={{
        background: '#FFFFFF',
        padding: '0.8rem 1.6rem',
        borderRadius: '20px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '850px',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h3 style={{ fontFamily: 'Fredoka', color: '#0F172A', fontSize: '1.2rem' }}>
            🖨️ Fichas A4 + Obstáculos Recortables para el Mapa Físico
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
            Pág 1: Ejercicios | Pág 2: Soluciones | Pág 3: 12 Obstáculos recortables
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button onClick={handlePrint} className="tb-btn tb-btn-yellow">
            <Printer size={20} /> Imprimir A4
          </button>

          <button onClick={onClose} className="tb-btn tb-btn-secondary">
            <X size={20} /> Cerrar
          </button>
        </div>
      </div>

      {/* Printable Sheet Container (3 Pages for A4) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
        {/* PAGE 1 (Front Side - Worksheets) */}
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
              🤖 TaleBot Pro - Fichas de Programación
            </h2>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Página 1 / 3 (Frente)</span>
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
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Página 2 / 3 (Reverso)</span>
          </div>

          {renderSingleChallengeBack(challenge1, 1)}
          {renderSingleChallengeBack(challenge2, 2)}
        </div>

        {/* PAGE 3 (Printable 12 Cut-out Obstacles Sheet - Vertical 4x3 Grid) */}
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
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Página 3 / 3 (Recortables)</span>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
            Imprime esta hoja en papel o cartulina y recorta las fichas por la línea de puntos para colocarlas sobre el tablero 3x4 del robot TaleBot Pro.
          </p>

          {/* 4x3 Cut-out Grid */}
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
                {/* Scissors Cut Icon Badge */}
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '6px',
                  fontSize: '0.65rem',
                  color: '#94A3B8'
                }}>
                  ✂️
                </span>

                <div style={{ fontSize: '2.8rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                  {obs.icon}
                </div>

                <div style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', marginTop: '4px' }}>
                  {obs.name}
                </div>

                <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '2px', lineHeight: 1.2 }}>
                  {obs.description}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            fontSize: '0.75rem',
            color: '#94A3B8',
            textAlign: 'center',
            borderTop: '1px solid #E2E8F0',
            paddingTop: '0.4rem'
          }}>
            💡 Consejo: Puedes colocar a TaleBot las Alas 🪽 para sobrevolar el lago o los Brazos 🦾 para derribar muros.
          </div>
        </div>
      </div>
    </div>
  );
}
