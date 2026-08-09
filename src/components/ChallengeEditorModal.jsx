import React from 'react';
import { MAP_THEMES } from '../utils/presets';
import { Edit3, Star, Palette, X } from 'lucide-react';

export default function ChallengeEditorModal({
  challenge,
  onChangeChallenge,
  onAssignToSlot,
  currentSlot = 1,
  onClose
}) {
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
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="tb-card" style={{
        width: '100%',
        maxWidth: '540px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        padding: '1.8rem'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Edit3 size={24} color="#FF6900" />
            <h2 style={{ fontFamily: 'Fredoka', color: '#0F172A', fontSize: '1.4rem' }}>
              Editar Detalle de la Ficha A4
            </h2>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="#64748B" />
          </button>
        </div>

        {/* Slot Selector Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: '#F1F5F9', padding: '4px', borderRadius: '12px' }}>
          <button
            onClick={() => onAssignToSlot(1)}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '8px',
              border: 'none',
              fontFamily: 'Fredoka',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: currentSlot === 1 ? '#FF6900' : 'transparent',
              color: currentSlot === 1 ? 'white' : '#64748B'
            }}
          >
            Ficha #1 Folio A4
          </button>

          <button
            onClick={() => onAssignToSlot(2)}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '8px',
              border: 'none',
              fontFamily: 'Fredoka',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: currentSlot === 2 ? '#FF6900' : 'transparent',
              color: currentSlot === 2 ? 'white' : '#64748B'
            }}
          >
            Ficha #2 Folio A4
          </button>
        </div>

        {/* Title Input */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
            Título del Reto:
          </label>
          <input
            type="text"
            value={challenge.title || ''}
            onChange={(e) => onChangeChallenge({ ...challenge, title: e.target.value })}
            placeholder="Ej: ¡El gran viaje de TaleBot!"
            style={{
              width: '100%',
              padding: '0.65rem 0.8rem',
              borderRadius: '12px',
              border: '2px solid #CBD5E1',
              fontFamily: 'Nunito',
              fontSize: '0.9rem',
              fontWeight: 700
            }}
          />
        </div>

        {/* Story Prompt */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
            Historia / Instrucciones para el niño:
          </label>
          <textarea
            rows={3}
            value={challenge.story || ''}
            onChange={(e) => onChangeChallenge({ ...challenge, story: e.target.value })}
            placeholder="Instrucción corta (ej: Ayuda al robot a llegar a la estrella...)"
            style={{
              width: '100%',
              padding: '0.65rem 0.8rem',
              borderRadius: '12px',
              border: '2px solid #CBD5E1',
              fontFamily: 'Nunito',
              fontSize: '0.85rem',
              resize: 'none'
            }}
          />
        </div>

        {/* Difficulty Stars & Theme Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Dificultad:
            </label>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => onChangeChallenge({ ...challenge, difficulty: star })}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.4rem',
                    opacity: (challenge.difficulty || 1) >= star ? 1 : 0.3
                  }}
                >
                  ⭐️
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Estilo Visual Ilustrado:
            </label>
            <select
              value={challenge.theme || 'CLASICO'}
              onChange={(e) => onChangeChallenge({ ...challenge, theme: e.target.value })}
              style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: '12px',
                border: '2px solid #CBD5E1',
                fontFamily: 'Fredoka',
                fontSize: '0.85rem',
                background: '#FFFFFF'
              }}
            >
              {Object.values(MAP_THEMES).map((thm) => (
                <option key={thm.id} value={thm.id}>
                  {thm.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ready Action Button */}
        <button
          onClick={onClose}
          className="tb-btn tb-btn-yellow"
          style={{ width: '100%', justifyContent: 'center', padding: '0.7rem', fontSize: '0.95rem' }}
        >
          Guardar y Aplicar Detalle
        </button>
      </div>
    </div>
  );
}
