import React from 'react';
import { MAP_THEMES } from '../utils/presets';
import { Layers, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ChallengeSidebarPanel({
  currentSlot = 1,
  onAssignToSlot,
  pageIndex = 0,
  totalPages = 1,
  onPageChange,
  challenge = {},
  onChangeChallenge,
  orientation = 'landscape',
  onToggleOrientation
}) {
  const isLandscape = orientation === 'landscape';

  return (
    <div className="panel deck no-print" style={{ padding: '0.85rem' }}>
      {/* Cabecera del Panel */}
      <div className="deck__head" style={{ marginBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Layers size={17} color="var(--ember)" />
          <h3 className="deck__title">Ficha del Folio</h3>
        </div>

        {/* Ficha 1 vs Ficha 2 */}
        <div className="seg" role="group" aria-label="Selección de ficha">
          <button
            type="button"
            className="seg__opt"
            data-on={currentSlot === 1}
            onClick={() => onAssignToSlot(1)}
          >
            Ficha 1
          </button>
          <button
            type="button"
            className="seg__opt"
            data-on={currentSlot === 2}
            onClick={() => onAssignToSlot(2)}
          >
            Ficha 2
          </button>
        </div>
      </div>

      {/* Control de Páginas (Folios) cuando hay más de una */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.4rem',
          marginBottom: '0.65rem',
          background: '#F3EDE4',
          padding: '0.35rem 0.6rem',
          borderRadius: '8px'
        }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: '#1A1410' }}>
            Folio {pageIndex + 1} de {totalPages}
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              type="button"
              className="btn btn--outline btn--icon"
              style={{ width: '26px', height: '26px', padding: 0 }}
              onClick={() => onPageChange && onPageChange(Math.max(0, pageIndex - 1))}
              disabled={pageIndex === 0}
              aria-label="Folio anterior"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              className="btn btn--outline btn--icon"
              style={{ width: '26px', height: '26px', padding: 0 }}
              onClick={() => onPageChange && onPageChange(Math.min(totalPages - 1, pageIndex + 1))}
              disabled={pageIndex === totalPages - 1}
              aria-label="Folio siguiente"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {/* Título del reto */}
        <div>
          <label className="t-label" htmlFor="side-ch-title" style={{ fontSize: '0.72rem', marginBottom: '3px' }}>
            Título del reto
          </label>
          <input
            id="side-ch-title"
            className="input input--sm"
            type="text"
            value={challenge.title || ''}
            onChange={(e) => onChangeChallenge({ ...challenge, title: e.target.value })}
            placeholder="Ej: Misión Espacial"
          />
        </div>

        {/* Instrucciones multilínea para el niño (Mínimo 4 líneas) */}
        <div>
          <label className="t-label" htmlFor="side-ch-story" style={{ fontSize: '0.72rem', marginBottom: '3px' }}>
            Instrucciones para el niño
          </label>
          <textarea
            id="side-ch-story"
            className="textarea"
            rows={4}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.6rem', resize: 'vertical', lineHeight: 1.35, minHeight: '82px' }}
            value={challenge.story || ''}
            onChange={(e) => onChangeChallenge({ ...challenge, story: e.target.value })}
            placeholder="Lleva el robot hasta la estrella sin pisar la señal de alto..."
          />
        </div>

        {/* Dificultad en su propia línea, con estrellas grandes */}
        <div>
          <span className="t-label" style={{ fontSize: '0.72rem', display: 'block', marginBottom: '4px' }}>
            Dificultad
          </span>
          <div style={{ display: 'flex', gap: '10px', background: '#F8F4EE', padding: '0.4rem 0.6rem', borderRadius: '8px', justifyContent: 'center' }}>
            {[1, 2, 3].map((star) => (
              <button
                key={star}
                type="button"
                style={{
                  background: (challenge.difficulty || 1) >= star ? '#FFFFFF' : 'transparent',
                  border: (challenge.difficulty || 1) >= star ? '1.5px solid #FFB020' : '1.5px solid transparent',
                  borderRadius: '8px',
                  fontSize: '1.4rem',
                  padding: '4px 14px',
                  cursor: 'pointer',
                  boxShadow: (challenge.difficulty || 1) >= star ? '0 2px 6px rgba(255, 176, 32, 0.28)' : 'none',
                  transition: 'transform 0.15s ease'
                }}
                onClick={() => onChangeChallenge({ ...challenge, difficulty: star })}
                title={`Dificultad ${star}`}
                aria-label={`Dificultad ${star}`}
              >
                ⭐️
              </button>
            ))}
          </div>
        </div>

        {/* Estilo del tablero en su propia línea */}
        <div>
          <label className="t-label" htmlFor="side-ch-theme" style={{ fontSize: '0.72rem', display: 'block', marginBottom: '4px' }}>
            Estilo del tablero
          </label>
          <select
            id="side-ch-theme"
            className="select"
            style={{ width: '100%', padding: '0.45rem 0.7rem', fontSize: '0.82rem' }}
            value={challenge.theme || 'CLASICO'}
            onChange={(e) => onChangeChallenge({ ...challenge, theme: e.target.value })}
          >
            {Object.values(MAP_THEMES).map((thm) => (
              <option key={thm.id} value={thm.id}>{thm.emoji} {thm.name}</option>
            ))}
          </select>
        </div>

        {/* Orientación con botones principales grandes */}
        <div>
          <span className="t-label" style={{ fontSize: '0.72rem', display: 'block', marginBottom: '4px' }}>
            Orientación del mapa
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn--outline"
              style={{
                padding: '0.5rem 0.4rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: isLandscape ? 'var(--ember-soft)' : '#FFFFFF',
                borderColor: isLandscape ? 'var(--ember)' : 'var(--line-2)',
                color: isLandscape ? 'var(--ember-deep)' : 'var(--tx-1)'
              }}
              onClick={() => { if (!isLandscape) onToggleOrientation(); }}
            >
              📐 5×4 Horizontal
            </button>

            <button
              type="button"
              className="btn btn--outline"
              style={{
                padding: '0.5rem 0.4rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: !isLandscape ? 'var(--ember-soft)' : '#FFFFFF',
                borderColor: !isLandscape ? 'var(--ember)' : 'var(--line-2)',
                color: !isLandscape ? 'var(--ember-deep)' : 'var(--tx-1)'
              }}
              onClick={() => { if (isLandscape) onToggleOrientation(); }}
            >
              📱 4×5 Vertical
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
