import React from 'react';
import { MAP_THEMES } from '../utils/presets';
import { Edit3, Star, Palette, Layout } from 'lucide-react';

export default function ChallengeEditor({
  challenge,
  onChangeChallenge,
  onAssignToSlot,
  currentSlot = 1
}) {
  return (
    <div className="tb-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px dashed #E2E8F0', paddingBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Edit3 size={20} color="#00A3FF" />
          <h3 style={{ fontSize: '1.15rem', color: '#0F172A' }}>Detalles de la Ficha</h3>
        </div>

        {/* Slot selector button */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => onAssignToSlot(1)}
            style={{
              padding: '0.3rem 0.6rem',
              borderRadius: '8px',
              border: 'none',
              fontFamily: 'Fredoka',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: currentSlot === 1 ? '#00A3FF' : '#E2E8F0',
              color: currentSlot === 1 ? 'white' : '#64748B'
            }}
          >
            Ficha #1 A4
          </button>

          <button
            onClick={() => onAssignToSlot(2)}
            style={{
              padding: '0.3rem 0.6rem',
              borderRadius: '8px',
              border: 'none',
              fontFamily: 'Fredoka',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: currentSlot === 2 ? '#00A3FF' : '#E2E8F0',
              color: currentSlot === 2 ? 'white' : '#64748B'
            }}
          >
            Ficha #2 A4
          </button>
        </div>
      </div>

      {/* Title */}
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
          Título del Reto:
        </label>
        <input
          type="text"
          value={challenge.title || ''}
          onChange={(e) => onChangeChallenge({ ...challenge, title: e.target.value })}
          placeholder="Ej: ¡El gran viaje del robot!"
          style={{
            width: '100%',
            padding: '0.6rem 0.8rem',
            borderRadius: '12px',
            border: '2px solid #CBD5E1',
            fontFamily: 'Nunito',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        />
      </div>

      {/* Story Prompt */}
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
          Historia / Instrucciones para el niño:
        </label>
        <textarea
          rows={2}
          value={challenge.story || ''}
          onChange={(e) => onChangeChallenge({ ...challenge, story: e.target.value })}
          placeholder="Instrucción sencilla (ej: Dibuja las flechas para llegar hasta la estrella...)"
          style={{
            width: '100%',
            padding: '0.6rem 0.8rem',
            borderRadius: '12px',
            border: '2px solid #CBD5E1',
            fontFamily: 'Nunito',
            fontSize: '0.85rem',
            resize: 'none'
          }}
        />
      </div>

      {/* Row: Difficulty Stars & Theme */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
        {/* Difficulty */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
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
                  opacity: (challenge.difficulty || 1) >= star ? 1 : 0.3,
                  transition: 'transform 0.1s ease'
                }}
              >
                ⭐️
              </button>
            ))}
          </div>
        </div>

        {/* Theme Picker */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
            Estilo Visual:
          </label>
          <select
            value={challenge.theme || 'CLASICO'}
            onChange={(e) => onChangeChallenge({ ...challenge, theme: e.target.value })}
            style={{
              width: '100%',
              padding: '0.55rem',
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
    </div>
  );
}
