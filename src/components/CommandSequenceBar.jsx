import { useState } from 'react';
import { COMMAND_TYPES } from '../utils/talebotEngine';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CommandSequenceBar({
  commands = [],
  isPlaying = false,
  currentStep = 0
}) {
  const [showSteps, setShowSteps] = useState(false);

  return (
    <div className="panel tape no-print">
      <div className="tape__head">
        <div className="tape__title">
          <h3 className="panel__title">Secuencia</h3>
          <span className="t-mono" style={{ fontSize: '.72rem', color: 'var(--tx-3)' }}>
            {commands.length} {commands.length === 1 ? 'paso' : 'pasos'}
          </span>
        </div>

        {/* La barra de LEDs va en la misma línea del título y se ve siempre */}
        <div className="leds" aria-hidden="true">
          {commands.length === 0 ? (
            <span className="led led--idle">en espera</span>
          ) : (
            commands.map((cmd, idx) => {
              const info = COMMAND_TYPES[cmd.id] || COMMAND_TYPES.FORWARD;
              return (
                <span
                  key={idx}
                  className="led"
                  data-lit={isPlaying && currentStep === idx + 1}
                  style={{ '--led-c': info.ledColor }}
                  title={`${idx + 1}. ${info.name}`}
                />
              );
            })
          )}
        </div>

        <button className="btn btn--quiet btn--sm" onClick={() => setShowSteps(!showSteps)}>
          {showSteps ? 'Ocultar pasos' : 'Ver pasos'}
          {showSteps ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {showSteps && (
        <div className="strip">
          {commands.length === 0 ? (
            <span className="strip__empty">Pulsa el mando para programar el recorrido.</span>
          ) : (
            commands.map((cmd, idx) => {
              const info = COMMAND_TYPES[cmd.id] || COMMAND_TYPES.FORWARD;
              return (
                <span
                  key={idx}
                  className="step"
                  data-lit={isPlaying && currentStep === idx + 1}
                  style={{ '--step-c': info.color }}
                >
                  <span className="step__n">{idx + 1}</span>
                  <span className="step__glyph">{info.icon}</span>
                  {info.name}
                </span>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
