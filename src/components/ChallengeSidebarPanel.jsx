import React from 'react';
import { SHAPE_PRESETS } from '../utils/talebotEngine';
import { Layers, ChevronLeft, ChevronRight, PenTool, Grid } from 'lucide-react';

const PEN_COLORS = [
  { id: 'marron', name: 'Marrón', hex: '#6D4C41' },
  { id: 'verde', name: 'Verde', hex: '#2E7D32' },
  { id: 'azul', name: 'Azul', hex: '#1E88E5' },
  { id: 'rojo', name: 'Rojo', hex: '#E53935' },
  { id: 'morado', name: 'Morado', hex: '#8E24AA' },
  { id: 'naranja', name: 'Naranja', hex: '#FB8C00' },
  { id: 'negro', name: 'Negro', hex: '#212121' }
];

export default function ChallengeSidebarPanel({
  currentSlot = 1,
  onAssignToSlot,
  pageIndex = 0,
  totalPages = 1,
  onPageChange,
  challenge = {},
  onChangeChallenge,
  onOpenShapesModal,
  leftPenEnabled = true,
  onToggleLeftPen,
  leftPenColor = '#6D4C41',
  onChangeLeftPenColor,
  rightPenEnabled = true,
  onToggleRightPen,
  rightPenColor = '#2E7D32',
  onChangeRightPenColor
}) {
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

        {/* Dificultad en su propia línea con estrellas grandes */}
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

        {/* Sección bajo la ficha: Formas para Rotulador y Selección de Rotuladores */}
        <div style={{
          marginTop: '0.3rem',
          paddingTop: '0.65rem',
          borderTop: '1px solid var(--line-2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.55rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="t-label" style={{ fontSize: '0.74rem', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <PenTool size={13} color="var(--ember)" /> Formas y Rotuladores
            </span>
            <span className="badge" style={{ fontSize: '0.6rem', background: '#F2EBE1', color: '#1A1410' }}>
              50 formas
            </span>
          </div>

          {/* Selectores de Rotulador Izquierdo y Derecho con Colores */}
          <div style={{
            background: '#F8F4EE',
            padding: '0.5rem 0.6rem',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem'
          }}>
            {/* Rotulador Izquierdo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 600, color: '#1A1410', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={leftPenEnabled}
                  onChange={(e) => onToggleLeftPen && onToggleLeftPen(e.target.checked)}
                  style={{ accentColor: leftPenColor || '#6D4C41', cursor: 'pointer' }}
                />
                Rot. Izquierdo
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                {PEN_COLORS.map(c => (
                  <button
                    key={`l_${c.id}`}
                    type="button"
                    disabled={!leftPenEnabled}
                    style={{
                      width: '13px',
                      height: '13px',
                      borderRadius: '50%',
                      background: c.hex,
                      border: leftPenColor === c.hex ? '2px solid #1A1410' : '1px solid rgba(0,0,0,0.15)',
                      cursor: leftPenEnabled ? 'pointer' : 'default',
                      opacity: leftPenEnabled ? 1 : 0.3,
                      transform: leftPenColor === c.hex ? 'scale(1.25)' : 'scale(1)',
                      padding: 0
                    }}
                    onClick={() => onChangeLeftPenColor && onChangeLeftPenColor(c.hex)}
                    title={`Color ${c.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Rotulador Derecho */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 600, color: '#1A1410', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rightPenEnabled}
                  onChange={(e) => onToggleRightPen && onToggleRightPen(e.target.checked)}
                  style={{ accentColor: rightPenColor || '#2E7D32', cursor: 'pointer' }}
                />
                Rot. Derecho
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                {PEN_COLORS.map(c => (
                  <button
                    key={`r_${c.id}`}
                    type="button"
                    disabled={!rightPenEnabled}
                    style={{
                      width: '13px',
                      height: '13px',
                      borderRadius: '50%',
                      background: c.hex,
                      border: rightPenColor === c.hex ? '2px solid #1A1410' : '1px solid rgba(0,0,0,0.15)',
                      cursor: rightPenEnabled ? 'pointer' : 'default',
                      opacity: rightPenEnabled ? 1 : 0.3,
                      transform: rightPenColor === c.hex ? 'scale(1.25)' : 'scale(1)',
                      padding: 0
                    }}
                    onClick={() => onChangeRightPenColor && onChangeRightPenColor(c.hex)}
                    title={`Color ${c.name}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Chips de formas rápidas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
            {SHAPE_PRESETS.slice(0, 4).map((shape) => (
              <button
                key={shape.id}
                type="button"
                className="btn btn--outline btn--sm"
                style={{
                  padding: '0.35rem 0.4rem',
                  fontSize: '0.72rem',
                  justifyContent: 'flex-start',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => {
                  onChangeChallenge({
                    ...challenge,
                    title: `Forma: ${shape.name}`,
                    story: shape.description,
                    start: shape.start,
                    target: shape.start,
                    obstacles: [],
                    commands: shape.commands,
                    penMarkerMode: true
                  });
                }}
                title={shape.name}
              >
                {shape.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn btn--accent btn--block"
            style={{ fontSize: '0.78rem', padding: '0.5rem 0.6rem' }}
            onClick={onOpenShapesModal}
          >
            <Grid size={15} /> Ver catálogo completo (50 formas)
          </button>
        </div>
      </div>
    </div>
  );
}
