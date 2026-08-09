import React, { useState } from 'react';
import { getCellLabel, COMMAND_TYPES, DIRECTIONS, OBSTACLE_TYPES, simulatePath } from '../utils/talebotEngine';
import { MAP_THEMES } from '../utils/presets';
import ObstacleIcon from './ObstacleIcon';
import { Printer, X, Scissors, ChevronLeft, ChevronRight } from 'lucide-react';

const INK = '#1A1410';
const AMBER = '#FFB020';
const LEAF = '#2FBF71';

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

  const handlePrint = () => window.print();

  const activeCh1 = allChallenges[currentA4Index * 2] || allChallenges[0];
  const activeCh2 = allChallenges[currentA4Index * 2 + 1] || allChallenges[1] || allChallenges[0];

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
        border: `1.5px solid ${INK}`,
        borderRadius: '12px',
        padding: '0.7rem',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.45rem',
        boxSizing: 'border-box',
        height: '48%'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '.5rem',
          borderBottom: '1px solid #E7DFD3',
          paddingBottom: '0.3rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
            <span style={{
              background: INK,
              color: '#FFF',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.62rem',
              letterSpacing: '.06em',
              padding: '2px 7px',
              borderRadius: '6px'
            }}>
              {String(index).padStart(2, '0')}
            </span>
            <h4 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '0.9rem', color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {ch.title || `Reto ${index}`}
            </h4>
          </div>

          <div style={{ display: 'flex', gap: '1px', fontSize: '0.75rem', flex: 'none' }}>
            {Array.from({ length: ch.difficulty || 1 }).map((_, i) => <span key={i}>⭐️</span>)}
          </div>
        </div>

        {ch.story && (
          <p style={{ fontSize: '0.7rem', color: '#6B5F54', lineHeight: 1.3 }}>{ch.story}</p>
        )}

        <div style={{
          background: theme.bgGradient,
          padding: '0.35rem',
          borderRadius: '10px',
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
            {penLines && penLines.length > 0 && (
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 15 }}>
                {penLines.map((line, idx) => {
                  const cellW = 100 / numCols;
                  const cellH = 100 / numRows;
                  return (
                    <line
                      key={idx}
                      x1={`${(line.from.c + 0.5) * cellW}%`}
                      y1={`${(line.from.r + 0.5) * cellH}%`}
                      x2={`${(line.to.c + 0.5) * cellW}%`}
                      y2={`${(line.to.r + 0.5) * cellH}%`}
                      stroke="#E5326B"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
            )}

            {Array.from({ length: numRows }).map((_, r) =>
              Array.from({ length: numCols }).map((_, c) => {
                const cellKey = `${r},${c}`;
                const isStart = ch.start.r === r && ch.start.c === c;
                const isTarget = ch.target && ch.target.r === r && ch.target.c === c;
                const obsObj = OBSTACLE_TYPES.find(o => o.id === obstacleMap.get(cellKey));

                return (
                  <div
                    key={cellKey}
                    style={{
                      background: obsObj ? (theme.blockedBg || '#FDEAE0') : (theme.cellColors[(r + c) % theme.cellColors.length] || '#FFF'),
                      border: `1px solid ${theme.borderColor || '#E7DFD3'}`,
                      borderRadius: '7px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.15rem'
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      left: '4px',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.48rem',
                      color: theme.coordColor || '#9A8D80'
                    }}>
                      {getCellLabel(r, c, numRows)}
                    </span>

                    {isStart && (
                      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                        <span>🤖</span>
                        <span style={{ fontSize: '0.5rem', color: '#00BFC4' }}>
                          {DIRECTIONS[ch.start.dir || 0].arrow}
                        </span>
                      </span>
                    )}

                    {isTarget && <span>{theme.icons.target}</span>}
                    {obsObj && <ObstacleIcon type={obsObj.id} size={22} title={obsObj.name} />}
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
        border: `1.5px dashed ${LEAF}`,
        borderRadius: '12px',
        padding: '0.7rem',
        background: '#F6FCF8',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        boxSizing: 'border-box',
        height: '48%'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          borderBottom: '1px solid #C4EBD6',
          paddingBottom: '0.3rem'
        }}>
          <span style={{
            background: LEAF,
            color: '#FFF',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.62rem',
            letterSpacing: '.06em',
            padding: '2px 7px',
            borderRadius: '6px'
          }}>
            {String(index).padStart(2, '0')}
          </span>
          <h4 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '0.9rem', color: '#14603A' }}>
            Solución · {ch.title || `Reto ${index}`}
          </h4>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignContent: 'flex-start' }}>
          {(ch.commands || []).map((cmd, i) => {
            const cmdInfo = COMMAND_TYPES[cmd.id] || COMMAND_TYPES.FORWARD;
            return (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${cmdInfo.color}`,
                  color: '#1A1410',
                  padding: '0.2rem 0.4rem',
                  borderRadius: '6px',
                  fontSize: '0.64rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '.58rem',
                  color: '#FFF',
                  background: cmdInfo.color,
                  borderRadius: '3px',
                  padding: '0 3px'
                }}>
                  {i + 1}
                </span>
                <span>{cmdInfo.icon}</span>
                <span>{cmdInfo.name}</span>
              </div>
            );
          })}
        </div>
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
              Folio {currentA4Index + 1} de {totalA4Sheets} · retos {currentA4Index * 2 + 1} y {currentA4Index * 2 + 2}
            </p>
          </div>

          {totalA4Sheets > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
              <button
                className="btn btn--outline btn--icon"
                onClick={() => setCurrentA4Index(prev => Math.max(0, prev - 1))}
                disabled={currentA4Index === 0}
                aria-label="Folio anterior"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="t-mono" style={{ fontSize: '.78rem', minWidth: '52px', textAlign: 'center' }}>
                {currentA4Index + 1} / {totalA4Sheets}
              </span>
              <button
                className="btn btn--outline btn--icon"
                onClick={() => setCurrentA4Index(prev => Math.min(totalA4Sheets - 1, prev + 1))}
                disabled={currentA4Index === totalA4Sheets - 1}
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
              onChange={(e) => setIncludeCutoutSheet(e.target.checked)}
              style={{ accentColor: 'var(--ember)', width: '14px', height: '14px' }}
            />
            Añadir hoja de recortables
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2.5px solid ${AMBER}`, paddingBottom: '0.5rem' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2.5px solid ${LEAF}`, paddingBottom: '0.5rem' }}>
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
          <div className="print-page">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: `2.5px solid ${INK}`, paddingBottom: '0.5rem' }}>
              <Scissors size={22} />
              <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.35rem' }}>
                Obstáculos para recortar
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateRows: 'repeat(4, 1fr)',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              flex: 1,
              margin: '0.5rem 0'
            }}>
              {OBSTACLE_TYPES.map((obs) => (
                <div
                  key={obs.id}
                  style={{
                    border: '1.5px dashed #9A8D80',
                    borderRadius: '14px',
                    padding: '0.7rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    background: '#FFFFFF'
                  }}
                >
                  <ObstacleIcon type={obs.id} size={54} />
                  <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: '0.9rem', marginTop: '4px' }}>
                    {obs.name}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#6B5F54', marginTop: '2px', lineHeight: 1.25 }}>
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
