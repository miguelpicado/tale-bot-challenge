import React, { useState } from 'react';
import { getCellLabel, DIRECTIONS, OBSTACLE_TYPES, simulatePath } from '../utils/talebotEngine';
import { MAP_THEMES } from '../utils/presets';
import ObstacleIcon from './ObstacleIcon';
import TaleBotAvatar from './TaleBotAvatar';
import { GoalMarker } from './GridCanvas';
import {
  ArrowUp, ArrowDown, CornerUpLeft, CornerUpRight,
  Bird, Mic, Repeat, PenTool, Printer, X, Scissors,
  ChevronLeft, ChevronRight, HelpCircle
} from 'lucide-react';

const INK = '#1A1410';
const AMBER = '#FFB020';
const LEAF = '#2FBF71';

// Mapeo de botones físicos para soluciones impresas
const COMMAND_PHYSICAL = {
  FORWARD: { Icon: ArrowUp, color: '#10B981', textColor: '#FFFFFF' },
  BACKWARD: { Icon: ArrowDown, color: '#EF4444', textColor: '#FFFFFF' },
  TURN_LEFT: { Icon: CornerUpLeft, color: '#FFB020', textColor: '#1A1410' },
  TURN_RIGHT: { Icon: CornerUpRight, color: '#00A3FF', textColor: '#FFFFFF' },
  DANCE: { Icon: Bird, color: '#8B5CF6', textColor: '#FFFFFF' },
  SOUND: { Icon: Mic, color: '#06B6D4', textColor: '#FFFFFF' },
  LOOP: { Icon: Repeat, color: '#84CC16', textColor: '#FFFFFF' },
  PEN_DOWN: { Icon: PenTool, color: '#14B8A6', textColor: '#FFFFFF' },
  PEN_UP: { Icon: PenTool, color: '#64748B', textColor: '#FFFFFF' },
};

// Filtrar obstáculos para recortables (excluyendo ALAS y BRAZOS)
const CUTOUT_OBSTACLES = OBSTACLE_TYPES.filter(o => o.id !== 'ALAS' && o.id !== 'BRAZOS');

export default function PrintSheetPreview({
  challengesList = [],
  challenge1,
  challenge2,
  onClose
}) {
  const allChallenges = (challengesList && challengesList.length > 0)
    ? challengesList
    : [challenge1, challenge2].filter(Boolean);

  const totalA4Sheets = Math.max(1, Math.ceil(allChallenges.length / 2));
  const [currentA4Index, setCurrentA4Index] = useState(0);
  const [includeCutoutSheet, setIncludeCutoutSheet] = useState(false);

  const maxNavSheets = includeCutoutSheet ? totalA4Sheets + 1 : totalA4Sheets;

  const handlePrint = () => window.print();

  const isCutoutPageActive = currentA4Index === totalA4Sheets;
  const activeCh1 = allChallenges[currentA4Index * 2] || allChallenges[0];
  const activeCh2 = allChallenges[currentA4Index * 2 + 1] || allChallenges[1] || allChallenges[0];

  // Render de reto individual (frente)
  const renderSingleChallengeFront = (ch, index) => {
    if (!ch) return null;
    const theme = MAP_THEMES[ch.theme] || MAP_THEMES.CLASICO;
    const numRows = ch.numRows || 4;
    const numCols = ch.numCols || 5;
    const obstacleMap = new Map((ch.obstacles || []).map(o => [`${o.r},${o.c}`, o.type || 'ALTO']));

    const { penLines } = simulatePath(
      ch.start || { r: numRows - 1, c: 0, dir: 0 },
      ch.commands || [],
      numRows,
      numCols
    );

    return (
      <div style={{
        border: `2px solid ${INK}`,
        borderRadius: '16px',
        padding: '0.8rem 1rem',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.45rem',
        boxSizing: 'border-box',
        height: '46%',
        minHeight: 0,
        margin: '0.35rem 0',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '.5rem',
          borderBottom: '1px solid #E7DFD3',
          paddingBottom: '0.35rem',
          flex: 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
            <span style={{
              background: INK,
              color: '#FFF',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '.06em',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              {String(index).padStart(2, '0')}
            </span>
            <h4 style={{
              fontFamily: "'Fredoka', sans-serif",
              fontSize: '0.98rem',
              color: INK,
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {ch.title || `Reto ${index}`}
            </h4>
          </div>

          <div style={{ display: 'flex', gap: '2px', fontSize: '0.85rem', flex: 'none' }}>
            {Array.from({ length: ch.difficulty || 1 }).map((_, i) => <span key={i}>⭐️</span>)}
          </div>
        </div>

        {ch.story && (
          <p style={{ fontSize: '0.74rem', color: '#6B5F54', lineHeight: 1.3, margin: 0, flex: 'none' }}>
            {ch.story}
          </p>
        )}

        <div style={{
          background: theme.bgGradient,
          padding: '0.4rem',
          borderRadius: '12px',
          width: '100%',
          flex: 1,
          minHeight: 0,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateRows: `repeat(${numRows}, 1fr)`,
            gridTemplateColumns: `repeat(${numCols}, 1fr)`,
            gap: 0,
            width: '100%',
            height: '100%',
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            border: `1px solid ${theme.borderColor || '#E7DFD3'}`
          }}>
            {penLines && penLines.length > 0 && (
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 15 }}>
                {penLines.map((line, idx) => (
                  <line
                    key={idx}
                    x1={`${((line.from.c + 0.5) / numCols) * 100}%`}
                    y1={`${((line.from.r + 0.5) / numRows) * 100}%`}
                    x2={`${((line.to.c + 0.5) / numCols) * 100}%`}
                    y2={`${((line.to.r + 0.5) / numRows) * 100}%`}
                    stroke="#E5326B"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                ))}
              </svg>
            )}

            {Array.from({ length: numRows }).map((_, r) =>
              Array.from({ length: numCols }).map((_, c) => {
                const cellKey = `${r},${c}`;
                const isStart = ch.start && ch.start.r === r && ch.start.c === c;
                const isTarget = ch.target && ch.target.r === r && ch.target.c === c;
                const obsObj = OBSTACLE_TYPES.find(o => o.id === obstacleMap.get(cellKey));

                return (
                  <div
                    key={cellKey}
                    style={{
                      background: obsObj ? (theme.blockedBg || '#FDEAE0') : (theme.cellColors[(r + c) % theme.cellColors.length] || '#FFF'),
                      border: `1px solid ${theme.borderColor || '#E7DFD3'}`,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box'
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      left: '4px',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.52rem',
                      fontWeight: 600,
                      color: theme.coordColor || '#9A8D80',
                      zIndex: 2
                    }}>
                      {getCellLabel(r, c, numRows)}
                    </span>

                    {isStart && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, width: '100%', height: '100%' }}>
                        <TaleBotAvatar size={54} angle={DIRECTIONS[ch.start.dir || 0].angle} />
                      </div>
                    )}

                    {isTarget && !isStart && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, width: '100%', height: '100%' }}>
                        <GoalMarker size={46} />
                      </div>
                    )}

                    {obsObj && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '85%',
                        height: '85%',
                        background: 'rgba(255,255,255,0.85)',
                        borderRadius: '10px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                      }}>
                        <ObstacleIcon type={obsObj.id} size={42} title={obsObj.name} />
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
  };

  // Render de solución individual (reverso)
  const renderSingleChallengeBack = (ch, index) => {
    if (!ch) return null;

    return (
      <div style={{
        border: `2px dashed ${LEAF}`,
        borderRadius: '16px',
        padding: '0.8rem 1rem',
        background: '#F6FCF8',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.45rem',
        boxSizing: 'border-box',
        height: '46%',
        minHeight: 0,
        margin: '0.35rem 0',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          borderBottom: '1.5px solid #C4EBD6',
          paddingBottom: '0.35rem',
          flex: 'none'
        }}>
          <span style={{
            background: LEAF,
            color: '#FFF',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '.06em',
            padding: '2px 8px',
            borderRadius: '6px'
          }}>
            {String(index).padStart(2, '0')}
          </span>
          <h4 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '0.98rem', color: '#14603A', margin: 0 }}>
            Solución · {ch.title || `Reto ${index}`}
          </h4>
        </div>

        <div style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          padding: '0.5rem'
        }}>
          {(ch.commands || []).map((cmd, i) => {
            const cmdId = typeof cmd === 'string' ? cmd : (cmd?.id || cmd?.name || 'FORWARD');
            const btnInfo = COMMAND_PHYSICAL[cmdId] || COMMAND_PHYSICAL.FORWARD;
            const IconComp = btnInfo.Icon || ArrowUp;
            return (
              <div
                key={i}
                style={{
                  position: 'relative',
                  width: '48px',
                  height: '48px',
                  borderRadius: '13px',
                  background: btnInfo.color,
                  backgroundColor: btnInfo.color,
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact',
                  color: btnInfo.textColor || '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 0 rgba(0,0,0,0.18), inset 0 1px 1px rgba(255,255,255,0.3)',
                  flex: 'none'
                }}
                title={`Paso ${i + 1}`}
              >
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  left: '-6px',
                  background: '#1A1410',
                  backgroundColor: '#1A1410',
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact',
                  color: '#FFFFFF',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.58rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                  border: '1.5px solid #FFFFFF'
                }}>
                  {i + 1}
                </span>
                <IconComp size={26} strokeWidth={2.8} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render de Hoja de recortables (Página 1: Frente - Solo icono grande y nombre)
  const renderCutoutSheetFront = () => (
    <div style={{
      display: 'grid',
      gridTemplateRows: 'repeat(4, 1fr)',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      flex: 1,
      minHeight: 0,
      margin: '0.4rem 0'
    }}>
      {CUTOUT_OBSTACLES.map((obs) => (
        <div
          key={obs.id}
          style={{
            border: '2px dashed #9A8D80',
            borderRadius: '16px',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            background: '#FFFFFF',
            position: 'relative',
            boxSizing: 'border-box'
          }}
        >
          <ObstacleIcon type={obs.id} size={76} />
          <div style={{
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 700,
            fontSize: '1.02rem',
            color: '#1A1410',
            marginTop: '6px',
            lineHeight: 1.15
          }}>
            {obs.name}
          </div>
        </div>
      ))}
    </div>
  );

  // Render de Hoja de recortables (Página 2: Reverso - Explicación detallada del obstáculo)
  const renderCutoutSheetBack = () => {
    // Espejado horizontal por filas (3 columnas por fila) para coincidencia exacta en doble cara
    const mirroredObstacles = [];
    for (let r = 0; r < 4; r++) {
      const rowItems = CUTOUT_OBSTACLES.slice(r * 3, r * 3 + 3);
      mirroredObstacles.push(...[...rowItems].reverse());
    }

    return (
      <div style={{
        display: 'grid',
        gridTemplateRows: 'repeat(4, 1fr)',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        flex: 1,
        minHeight: 0,
        margin: '0.4rem 0'
      }}>
        {mirroredObstacles.map((obs) => (
          <div
            key={obs.id}
            style={{
              border: '2px dashed #7A9E88',
              borderRadius: '16px',
              padding: '0.6rem 0.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              background: '#F6FCF8',
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 700,
              fontSize: '0.94rem',
              color: '#14603A',
              marginBottom: '4px'
            }}>
              <ObstacleIcon type={obs.id} size={20} />
              <span>{obs.name}</span>
            </div>

            <p style={{
              fontSize: '0.72rem',
              color: '#3A4A40',
              lineHeight: 1.3,
              margin: '3px 0 6px 0',
              padding: '0 4px'
            }}>
              {obs.description}
            </p>

            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.55rem',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '4px',
              background: obs.blocking ? '#FEE2E2' : '#E0F2FE',
              color: obs.blocking ? '#991B1B' : '#075985'
            }}>
              {obs.blocking ? '🛑 Obstáculo bloqueante' : '💫 Pasada obligada'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Vista en pantalla */}
      <div className="scrim no-print" style={{ flexDirection: 'column', gap: '.9rem', alignItems: 'stretch' }}>
        <div className="panel" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '.8rem',
          flexWrap: 'wrap',
          padding: '.7rem 1rem',
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto',
          flex: 'none'
        }}>
          <div>
            <h3 className="panel__title">Vista previa de impresión</h3>
            <p className="sheet__sub">
              {isCutoutPageActive ? (
                'Folio Recortables · Frente y Reverso (12 obstáculos)'
              ) : (
                `Folio ${currentA4Index + 1} de ${totalA4Sheets} · retos ${currentA4Index * 2 + 1} y ${currentA4Index * 2 + 2}`
              )}
            </p>
          </div>

          {maxNavSheets > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
              <button
                className="btn btn--outline btn--icon"
                onClick={() => setCurrentA4Index(prev => Math.max(0, prev - 1))}
                disabled={currentA4Index === 0}
                aria-label="Folio anterior"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="t-mono" style={{ fontSize: '.78rem', minWidth: '70px', textAlign: 'center' }}>
                {isCutoutPageActive ? 'Recortables' : `${currentA4Index + 1} / ${totalA4Sheets}`}
              </span>
              <button
                className="btn btn--outline btn--icon"
                onClick={() => setCurrentA4Index(prev => Math.min(maxNavSheets - 1, prev + 1))}
                disabled={currentA4Index === maxNavSheets - 1}
                aria-label="Folio siguiente"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          <label className="chip" style={{ cursor: 'pointer', padding: '.35rem .7rem' }}>
            <input
              type="checkbox"
              checked={includeCutoutSheet}
              onChange={(e) => {
                setIncludeCutoutSheet(e.target.checked);
                if (!e.target.checked && currentA4Index >= totalA4Sheets) {
                  setCurrentA4Index(totalA4Sheets - 1);
                }
              }}
              style={{ accentColor: 'var(--ember)', width: '14px', height: '14px' }}
            />
            Añadir recortables (2 págs)
          </label>

          <div style={{ display: 'flex', gap: '.45rem' }}>
            <button className="btn btn--outline" onClick={onClose}>
              <X size={16} /> Cerrar
            </button>
            <button className="btn btn--primary" onClick={handlePrint}>
              <Printer size={16} /> Imprimir
            </button>
          </div>
        </div>

        <div className="preview">
          {isCutoutPageActive ? (
            <>
              <div className="a4">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2px solid ${INK}`, paddingBottom: '.3rem' }}>
                  <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '.95rem' }}>Recortables · Página 1</h3>
                  <span className="t-eyebrow">Frente (Iconos)</span>
                </div>
                {renderCutoutSheetFront()}
              </div>

              <div className="a4">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2px solid ${LEAF}`, paddingBottom: '.3rem' }}>
                  <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '.95rem', color: '#14603A' }}>Recortables · Página 2</h3>
                  <span className="t-eyebrow">Reverso (Explicación)</span>
                </div>
                {renderCutoutSheetBack()}
              </div>
            </>
          ) : (
            <>
              <div className="a4">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2px solid ${AMBER}`, paddingBottom: '.3rem' }}>
                  <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '.95rem' }}>Retos · folio {currentA4Index + 1}</h3>
                  <span className="t-eyebrow">Frente</span>
                </div>
                {renderSingleChallengeFront(activeCh1, currentA4Index * 2 + 1)}
                {renderSingleChallengeFront(activeCh2, currentA4Index * 2 + 2)}
              </div>

              <div className="a4">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2px solid ${LEAF}`, paddingBottom: '.3rem' }}>
                  <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '.95rem', color: '#14603A' }}>Soluciones</h3>
                  <span className="t-eyebrow">Reverso</span>
                </div>
                {renderSingleChallengeBack(activeCh1, currentA4Index * 2 + 1)}
                {renderSingleChallengeBack(activeCh2, currentA4Index * 2 + 2)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Árbol de impresión completo */}
      <div className="only-print print-page-container">
        {Array.from({ length: totalA4Sheets }).map((_, sheetIdx) => {
          const chA = allChallenges[sheetIdx * 2];
          const chB = allChallenges[sheetIdx * 2 + 1];

          return (
            <React.Fragment key={sheetIdx}>
              <div className="print-page">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2.5px solid ${AMBER}`, paddingBottom: '0.5rem', marginBottom: '0.6rem' }}>
                  <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.35rem' }}>
                    TaleBot · Retos {sheetIdx + 1}
                  </h2>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#6B5F54' }}>
                    FRENTE · PÁG {sheetIdx * 2 + 1}
                  </span>
                </div>
                {renderSingleChallengeFront(chA, sheetIdx * 2 + 1)}
                {renderSingleChallengeFront(chB, sheetIdx * 2 + 2)}
              </div>

              <div className="print-page">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2.5px solid ${LEAF}`, paddingBottom: '0.5rem', marginBottom: '0.6rem' }}>
                  <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.35rem', color: '#14603A' }}>
                    Soluciones {sheetIdx + 1}
                  </h2>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#6B5F54' }}>
                    REVERSO · PÁG {sheetIdx * 2 + 2}
                  </span>
                </div>
                {renderSingleChallengeBack(chA, sheetIdx * 2 + 1)}
                {renderSingleChallengeBack(chB, sheetIdx * 2 + 2)}
              </div>
            </React.Fragment>
          );
        })}

        {includeCutoutSheet && (
          <>
            {/* Página 1 de recortables: Frente (Fichas con icono grande y nombre) */}
            <div className="print-page">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2.5px solid ${INK}`, paddingBottom: '0.5rem', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Scissors size={22} />
                  <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.35rem' }}>
                    Obstáculos para recortar
                  </h2>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#6B5F54' }}>
                  PÁGINA 1 · FRENTE (FICHAS)
                </span>
              </div>
              {renderCutoutSheetFront()}
            </div>

            {/* Página 2 de recortables: Reverso (Explicación detallada del obstáculo) */}
            <div className="print-page">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2.5px solid ${LEAF}`, paddingBottom: '0.5rem', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={22} color="#14603A" />
                  <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.35rem', color: '#14603A' }}>
                    Instrucciones de obstáculos
                  </h2>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#6B5F54' }}>
                  PÁGINA 2 · REVERSO (EXPLICACIÓN)
                </span>
              </div>
              {renderCutoutSheetBack()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
