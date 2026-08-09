import React, { useEffect } from 'react';
import { COMMAND_TYPES } from '../utils/talebotEngine';
import { Play, RotateCcw, Trash2, Wand2, PenTool, Pause, Repeat, Mic } from 'lucide-react';

export default function TaleBotController({
  commands = [],
  onAddCommand,
  onRemoveLastCommand,
  onClearCommands,
  onRunSimulation,
  onAutoSolvePath,
  isPlaying = false,
  currentStep = 0,
  penMarkerActive = false,
  onTogglePenMarker
}) {
  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
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
      gap: '1rem',
      width: '100%',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 15px 35px rgba(0,0,0,0.08), 0 5px 15px rgba(255,105,0,0.05)'
    }}>
      {/* Console Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px dashed #E2E8F0',
        paddingBottom: '0.6rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🕹️</span>
          <div>
            <h3 style={{ fontFamily: 'Fredoka', fontSize: '1.15rem', color: '#0F172A' }}>
              Mando de Programación TaleBot Pro
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
              Usa los botones o tu teclado: <code style={{ background: '#F1F5F9', padding: '1px 5px', borderRadius: '4px' }}>[↑] [↓] [←] [→] [B] [M] [L]</code>
            </span>
          </div>
        </div>

        {/* LED Lights sequence bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: '#0F172A',
          padding: '6px 12px',
          borderRadius: '20px'
        }}>
          {commands.length === 0 ? (
            <span style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 700 }}>LEDS LISTOS</span>
          ) : (
            commands.slice(Math.max(0, commands.length - 8)).map((cmd, idx) => {
              const cmdInfo = COMMAND_TYPES[cmd.id] || COMMAND_TYPES.FORWARD;
              return (
                <div 
                  key={idx}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: cmdInfo.ledColor,
                    boxShadow: `0 0 8px ${cmdInfo.ledColor}`
                  }}
                  title={cmdInfo.name}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Hardware Buttons Deck */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.6rem'
      }}>
        {/* Forward */}
        <button
          onClick={() => onAddCommand(COMMAND_TYPES.FORWARD)}
          className="tb-btn"
          style={{
            background: COMMAND_TYPES.FORWARD.color,
            color: COMMAND_TYPES.FORWARD.textColor,
            flexDirection: 'column',
            padding: '0.75rem 0.4rem',
            position: 'relative'
          }}
        >
          <span style={{ position: 'absolute', top: '4px', right: '6px', fontSize: '0.65rem', opacity: 0.7 }}>[↑]</span>
          <span style={{ fontSize: '1.4rem' }}>⬆️</span>
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
            padding: '0.75rem 0.4rem',
            position: 'relative'
          }}
        >
          <span style={{ position: 'absolute', top: '4px', right: '6px', fontSize: '0.65rem', opacity: 0.7 }}>[↓]</span>
          <span style={{ fontSize: '1.4rem' }}>⬇️</span>
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
            padding: '0.75rem 0.4rem',
            position: 'relative'
          }}
        >
          <span style={{ position: 'absolute', top: '4px', right: '6px', fontSize: '0.65rem', opacity: 0.7 }}>[←]</span>
          <span style={{ fontSize: '1.4rem' }}>↩️</span>
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
            padding: '0.75rem 0.4rem',
            position: 'relative'
          }}
        >
          <span style={{ position: 'absolute', top: '4px', right: '6px', fontSize: '0.65rem', opacity: 0.7 }}>[→]</span>
          <span style={{ fontSize: '1.4rem' }}>↪️</span>
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
            padding: '0.7rem 0.4rem',
            position: 'relative'
          }}
        >
          <span style={{ position: 'absolute', top: '4px', right: '6px', fontSize: '0.65rem', opacity: 0.7 }}>[B]</span>
          <span style={{ fontSize: '1.3rem' }}>💃</span>
          <span>Bailar</span>
        </button>

        {/* Sound / Mic */}
        <button
          onClick={() => onAddCommand(COMMAND_TYPES.SOUND)}
          className="tb-btn"
          style={{
            background: COMMAND_TYPES.SOUND.color,
            color: COMMAND_TYPES.SOUND.textColor,
            flexDirection: 'column',
            padding: '0.7rem 0.4rem',
            position: 'relative'
          }}
        >
          <span style={{ position: 'absolute', top: '4px', right: '6px', fontSize: '0.65rem', opacity: 0.7 }}>[M]</span>
          <span style={{ fontSize: '1.3rem' }}>🔊</span>
          <span>Sonido</span>
        </button>

        {/* Loop / Repeat */}
        <button
          onClick={() => onAddCommand(COMMAND_TYPES.LOOP)}
          className="tb-btn"
          style={{
            background: COMMAND_TYPES.LOOP.color,
            color: COMMAND_TYPES.LOOP.textColor,
            flexDirection: 'column',
            padding: '0.7rem 0.4rem',
            position: 'relative'
          }}
        >
          <span style={{ position: 'absolute', top: '4px', right: '6px', fontSize: '0.65rem', opacity: 0.7 }}>[L]</span>
          <span style={{ fontSize: '1.3rem' }}>🔁</span>
          <span>Bucle</span>
        </button>

        {/* Pen Toggle */}
        <button
          onClick={onTogglePenMarker}
          className="tb-btn"
          style={{
            background: penMarkerActive ? '#14B8A6' : '#94A3B8',
            color: 'white',
            flexDirection: 'column',
            padding: '0.7rem 0.4rem',
            position: 'relative'
          }}
        >
          <PenTool size={20} />
          <span>{penMarkerActive ? 'Bajar Pen' : 'Subir Pen'}</span>
        </button>
      </div>

      {/* Programmed Sequence Queue Strip */}
      <div style={{
        background: '#F8FAFC',
        borderRadius: '16px',
        padding: '0.8rem',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        border: '2px inset #E2E8F0'
      }}>
        {commands.length === 0 ? (
          <div style={{
            width: '100%',
            textAlign: 'center',
            color: '#94A3B8',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            Pulsa los botones o las teclas de tu teclado para añadir comandos...
          </div>
        ) : (
          commands.map((cmd, idx) => {
            const cmdInfo = COMMAND_TYPES[cmd.id] || COMMAND_TYPES.FORWARD;
            const isStepActive = isPlaying && currentStep === idx + 1;

            return (
              <div
                key={idx}
                style={{
                  background: cmdInfo.color,
                  color: cmdInfo.textColor,
                  padding: '0.4rem 0.7rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  whiteSpace: 'nowrap',
                  boxShadow: isStepActive ? `0 0 12px ${cmdInfo.color}` : '0 2px 4px rgba(0,0,0,0.1)',
                  transform: isStepActive ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem'
                }}>
                  {idx + 1}
                </span>
                <span>{cmdInfo.icon}</span>
                <span>{cmdInfo.name}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Control Actions Bottom Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.6rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={onRemoveLastCommand}
            className="tb-btn tb-btn-secondary"
            disabled={commands.length === 0}
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
          >
            <RotateCcw size={16} /> Borrar Último
          </button>

          <button
            onClick={onClearCommands}
            className="tb-btn tb-btn-secondary"
            disabled={commands.length === 0}
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem', color: '#EF4444' }}
          >
            <Trash2 size={16} /> Borrar Todo
          </button>

          <button
            onClick={onAutoSolvePath}
            className="tb-btn"
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              color: 'white',
              padding: '0.5rem 0.9rem',
              fontSize: '0.85rem'
            }}
          >
            <Wand2 size={16} /> Auto Resolver
          </button>
        </div>

        {/* Run Execution Button */}
        <button
          onClick={onRunSimulation}
          className="tb-btn tb-btn-green"
          disabled={commands.length === 0}
          style={{
            padding: '0.6rem 1.6rem',
            fontSize: '1rem',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
          }}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          <span>{isPlaying ? 'Pausar' : 'Probar Recorrido (Espacio)'}</span>
        </button>
      </div>
    </div>
  );
}
