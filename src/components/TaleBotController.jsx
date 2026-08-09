import React from 'react';
import { COMMAND_TYPES } from '../utils/talebotEngine';
import { Play, RotateCcw, Trash2, Wand2, PenTool, Sparkles, Volume2, Pause } from 'lucide-react';

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
  return (
    <div className="tb-card" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.2rem',
      width: '100%'
    }}>
      {/* Console Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px dashed #E2E8F0',
        paddingBottom: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🕹️</span>
          <h3 style={{ fontSize: '1.2rem', color: '#0F172A' }}>Controlador TaleBot Pro</h3>
        </div>

        {/* LED Lights sequence bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: '#0F172A',
          padding: '4px 10px',
          borderRadius: '20px'
        }}>
          {commands.length === 0 ? (
            <span style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 700 }}>SIN COMANDOS</span>
          ) : (
            commands.slice(Math.max(0, commands.length - 8)).map((cmd, idx) => {
              const cmdInfo = COMMAND_TYPES[cmd.id] || COMMAND_TYPES.FORWARD;
              return (
                <div 
                  key={idx}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: cmdInfo.ledColor,
                    boxShadow: `0 0 6px ${cmdInfo.ledColor}`
                  }}
                  title={cmdInfo.name}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Main Movement Buttons (Grid layout matching robot buttons) */}
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
            padding: '0.8rem 0.4rem',
            fontSize: '0.85rem'
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>⬆️</span>
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
            padding: '0.8rem 0.4rem',
            fontSize: '0.85rem'
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>⬇️</span>
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
            padding: '0.8rem 0.4rem',
            fontSize: '0.85rem'
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>↩️</span>
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
            padding: '0.8rem 0.4rem',
            fontSize: '0.85rem'
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>↪️</span>
          <span>Girar Der.</span>
        </button>

        {/* Dance Action */}
        <button
          onClick={() => onAddCommand(COMMAND_TYPES.DANCE)}
          className="tb-btn"
          style={{
            background: COMMAND_TYPES.DANCE.color,
            color: COMMAND_TYPES.DANCE.textColor,
            flexDirection: 'column',
            padding: '0.7rem 0.4rem',
            fontSize: '0.85rem'
          }}
        >
          <span style={{ fontSize: '1.4rem' }}>💃</span>
          <span>Bailar</span>
        </button>

        {/* Sound Action */}
        <button
          onClick={() => onAddCommand(COMMAND_TYPES.SOUND)}
          className="tb-btn"
          style={{
            background: COMMAND_TYPES.SOUND.color,
            color: COMMAND_TYPES.SOUND.textColor,
            flexDirection: 'column',
            padding: '0.7rem 0.4rem',
            fontSize: '0.85rem'
          }}
        >
          <span style={{ fontSize: '1.4rem' }}>🔊</span>
          <span>Sonido</span>
        </button>

        {/* Pen Toggle Marker */}
        <button
          onClick={onTogglePenMarker}
          className="tb-btn"
          style={{
            background: penMarkerActive ? '#F97316' : '#94A3B8',
            color: 'white',
            flexDirection: 'column',
            padding: '0.7rem 0.4rem',
            fontSize: '0.85rem',
            boxShadow: penMarkerActive ? '0 0 10px rgba(249, 115, 22, 0.6)' : 'none'
          }}
        >
          <PenTool size={22} />
          <span>{penMarkerActive ? 'Bajar Rotulador' : 'Subir Rotulador'}</span>
        </button>

        {/* Auto Solve AI / BFS */}
        <button
          onClick={onAutoSolvePath}
          className="tb-btn"
          title="Generar ruta óptima automáticamente"
          style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            color: 'white',
            flexDirection: 'column',
            padding: '0.7rem 0.4rem',
            fontSize: '0.85rem'
          }}
        >
          <Wand2 size={22} />
          <span>Auto Resolver</span>
        </button>
      </div>

      {/* Program Sequence Queue Strip */}
      <div style={{
        background: '#F1F5F9',
        borderRadius: '16px',
        padding: '0.8rem',
        minHeight: '64px',
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
            Pulsa los botones de colores para añadir comandos de movimiento...
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
                  transition: 'all 0.2s ease',
                  border: isStepActive ? '2px solid #FFFFFF' : 'none'
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

      {/* Controller Bottom Actions (Run, Delete Last, Clear All) */}
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
        </div>

        {/* Play Execution Button */}
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
          <span>{isPlaying ? 'Pausar' : 'Probar Recorrido'}</span>
        </button>
      </div>
    </div>
  );
}
