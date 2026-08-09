import { MAP_THEMES } from '../utils/presets';
import { X } from 'lucide-react';

export default function ChallengeEditorModal({
  challenge,
  onChangeChallenge,
  onAssignToSlot,
  currentSlot = 1,
  onClose
}) {
  return (
    <div className="scrim no-print" onClick={onClose}>
      <div className="sheet" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div className="sheet__head">
          <div>
            <h2 className="sheet__title">Editar ficha</h2>
            <p className="sheet__sub">Lo que escribas aquí es lo que se imprime en el folio.</p>
          </div>
          <button className="btn btn--quiet btn--icon" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="sheet__body">
          <div className="seg" style={{ alignSelf: 'flex-start' }} role="group" aria-label="Ficha del folio">
            <button className="seg__opt" data-on={currentSlot === 1} onClick={() => onAssignToSlot(1)}>Ficha 1</button>
            <button className="seg__opt" data-on={currentSlot === 2} onClick={() => onAssignToSlot(2)}>Ficha 2</button>
          </div>

          <div>
            <label className="t-label" htmlFor="ch-title">Título</label>
            <input
              id="ch-title"
              className="input"
              type="text"
              value={challenge.title || ''}
              onChange={(e) => onChangeChallenge({ ...challenge, title: e.target.value })}
              placeholder="El gran viaje de TaleBot"
            />
          </div>

          <div>
            <label className="t-label" htmlFor="ch-story">Instrucción para el niño</label>
            <textarea
              id="ch-story"
              className="textarea"
              rows={3}
              value={challenge.story || ''}
              onChange={(e) => onChangeChallenge({ ...challenge, story: e.target.value })}
              placeholder="Lleva al robot hasta la estrella sin pisar la señal de alto."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.9rem' }}>
            <div>
              <span className="t-label">Dificultad</span>
              <div className="stars">
                {[1, 2, 3].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="star"
                    data-on={(challenge.difficulty || 1) >= star}
                    onClick={() => onChangeChallenge({ ...challenge, difficulty: star })}
                    aria-label={`Dificultad ${star}`}
                  >
                    ⭐️
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="t-label" htmlFor="ch-theme">Estilo del tablero</label>
              <select
                id="ch-theme"
                className="select"
                value={challenge.theme || 'CLASICO'}
                onChange={(e) => onChangeChallenge({ ...challenge, theme: e.target.value })}
              >
                {Object.values(MAP_THEMES).map((thm) => (
                  <option key={thm.id} value={thm.id}>{thm.emoji} {thm.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="sheet__foot">
          <button className="btn btn--primary btn--block" onClick={onClose}>Aplicar</button>
        </div>
      </div>
    </div>
  );
}
