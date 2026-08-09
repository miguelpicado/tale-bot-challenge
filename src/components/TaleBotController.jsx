import React, { useEffect } from 'react';
import { COMMAND_TYPES } from '../utils/talebotEngine';
import { Play, RotateCcw, Trash2, Wand2, Pause } from 'lucide-react';

export default function TaleBotController({
  commands = [],
  onAddCommand,
  onRemoveLastCommand,
  onClearCommands,
  onRunSimulation,
  onAutoSolvePath,
  isPlaying = false
}) {
  // Silent Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          onAddCommand(COMMAND_TYPES.FORWARD);
          break;
        case 'ArrowDown':
          e.preventDefault();
          onAddCommand(COMMAND_TYPES.BACKWARD);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onAddCommand(COMMAND_TYPES.TURN_LEFT);
          break;
        case 'ArrowRight':
          e.preventDefault();
          onAddCommand(COMMAND_TYPES.TURN_RIGHT);
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          onAddCommand(COMMAND_TYPES.DANCE);
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          onAddCommand(COMMAND_TYPES.SOUND);
          break;
        case 'l':
        case 'L':
          e.preventDefault();
          onAddCommand(COMMAND_TYPES.LOOP);
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          onRunSimulation();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAddCommand, onRunSimulation]);

  return (
    <div className="tb-card" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.2rem',
      width: '100%',
      padding: '1.5rem',
      background: '#FFFFFF',
      boxShadow: '0 15px 35px rgba(0,0,0,0.06)'
    }}>
      {/* Console Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px dashed #E2E8F0',
        paddingBottom: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🕹️</span>
          <h3 style={{ fontFamily: 'Fredoka', fontSize: '1.25rem', color: '#0F172A' }}>
            Mando TaleBot Pro
          </h3>
        </div>
      </div>

      {/* Hardware Buttons Deck (3 Columns Wide Layout) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)', // 3 Columns wide as requested!
        gap: '0.8rem'
      }}>
        {/* Forward */}
        <button
          onClick={() => onAddCommand(COMMAND_TYPES.FORWARD)}
          className="tb-btn"
          style={{
            background: COMMAND_TYPES.FORWARD.color,
            color: COMMAND_TYPES.FORWARD.textColor,
            flexDirection: 'column',
            padding: '1.1rem 0.5rem',
            fontSize: '0.9rem'
          }}
        >
          <span style={{ fontSize: '1.8rem' }}>⬆️</span>
          <span>Avanzar</span>
        </button>

        {/* Backward */}
        <button
          onClick={() => onAddCommand(COMMAND_TYPES.BACKWARD)}
          className="tb-btn"
          style={{
            background: COMMAND_TYPES.BACKWARD.color,
            color: COMMAND_TYPES.BACKWARD.textColor,
            flexDirection: 'column',
            padding: '1.1rem 0.5rem',
            fontSize: '0.9rem'
          }}
        >
          <span style={{ fontSize: '1.8rem' }}>⬇️</span>
          <span>Atrás</span>
        </button>

        {/* Turn Left */}
        <button
          onClick={() => onAddCommand(COMMAND_TYPES.TURN_LEFT)}
          className="tb-btn"
          style={{
            background: COMMAND_TYPES.TURN_LEFT.color,
            color: COMMAND_TYPES.TURN_LEFT.textColor,
            flexDirection: 'column',
            padding: '1.1rem 0.5rem',
            fontSize: '0.9rem'
          }}
        >
          <span style={{ fontSize: '1.8rem' }}>↩️</span>
          <span>Girar Izq.</span>
        </button>

        {/* Turn Right */}
        <button
          onClick={() => onAddCommand(COMMAND_TYPES.TURN_RIGHT)}
          className="tb-btn"
          style={{
            background: COMMAND_TYPES.TURN_RIGHT.color,
            color: COMMAND_TYPES.TURN_RIGHT.textColor,
            flexDirection: 'column',
            padding: '1.1rem 0.5rem',
            fontSize: '0.9rem'
          }}
        >
          <span style={{ fontSize: '1.8rem' }}>↪️</span>
          <span>Girar Der.</span>
        </button>

        {/* Dance */}
        <button
          onClick={() => onAddCommand(COMMAND_TYPES.DANCE)}
          className="tb-btn"
          style={{
            background: COMMAND_TYPES.DANCE.color,
            color: COMMAND_TYPES.DANCE.textColor,
            flexDirection: 'column',
            padding: '1.1rem 0.5rem',
            fontSize: '0.85rem'
          }}
        >
          <span style={{ fontSize: '1.7rem' }}>💃</span>
          <span>Bailar</span>
        </button>

        {/* Sound */}
        <button
          onClick={() => onAddCommand(COMMAND_TYPES.SOUND)}
          className="tb-btn"
          style={{
            background: COMMAND_TYPES.SOUND.color,
            color: COMMAND_TYPES.SOUND.textColor,
            flexDirection: 'column',
            padding: '1.1rem 0.5rem',
            fontSize: '0.85rem'
          }}
        >
          <span style={{ fontSize: '1.7rem' }}>🔊</span>
          <span>Sonido</span>
        </button>

        {/* Loop */}
        <button
          onClick={() => onAddCommand(COMMAND_TYPES.LOOP)}
          className="tb-btn"
          style={{
            background: COMMAND_TYPES.LOOP.color,
            color: COMMAND_TYPES.LOOP.textColor,
            flexDirection: 'column',
            padding: '1.1rem 0.5rem',
            fontSize: '0.85rem'
          }}
        >
          <span style={{ fontSize: '1.7rem' }}>🔁</span>
          <span>Bucle</span>
        </button>

        {/* Physical Orange EJECUTAR (RUN) Button */}
        <button
          onClick={onRunSimulation}
          className="tb-btn"
          style={{
            background: 'linear-gradient(135deg, #FF6900 0%, #FF9500 100%)',
            color: 'white',
            flexDirection: 'column',
            padding: '1.1rem 0.5rem',
            fontSize: '0.9rem',
            boxShadow: '0 4px 16px rgba(255, 105, 0, 0.45)'
          }}
        >
          {isPlaying ? <Pause size={26} /> : <Play size={26} />}
          <span>{isPlaying ? 'Pausar' : 'Ejecutar'}</span>
        </button>

        {/* Clear All / Borrar Button */}
        <button
          onClick={onClearCommands}
          className="tb-btn"
          disabled={commands.length === 0}
          style={{
            background: '#F8FAFC',
            color: '#EF4444',
            border: '2px solid #E2E8F0',
            flexDirection: 'column',
            padding: '1.1rem 0.5rem',
            fontSize: '0.85rem'
          }}
        >
          <Trash2 size={24} />
          <span>Borrar</span>
        </button>
      </div>

      {/* Controller Secondary Actions Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.8rem'
      }}>
        <button
          onClick={onRemoveLastCommand}
          className="tb-btn tb-btn-secondary"
          disabled={commands.length === 0}
          style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', flex: 1, justifyContent: 'center' }}
        >
          <RotateCcw size={16} /> Borrar Último Paso
        </button>

        <button
          onClick={onAutoSolvePath}
          className="tb-btn"
          style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            color: 'white',
            padding: '0.6rem 1rem',
            fontSize: '0.85rem',
            flex: 1,
            justifyContent: 'center'
          }}
        >
          <Wand2 size={16} /> Auto Resolver
        </button>
      </div>
    </div>
  );
}
