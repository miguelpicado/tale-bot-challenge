import React, { useState } from 'react';
import { COMMAND_TYPES } from '../utils/talebotEngine';
import { Terminal, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

export default function CommandSequenceBar({
  commands = [],
  isPlaying = false,
  currentStep = 0
}) {
  // Toggle to show/hide text badges on command buttons (only LEDs / compact icons shown by default or on toggle)
  const [showTextDetails, setShowTextDetails] = useState(false);

  return (
    <div className="tb-card" style={{
      width: '100%', // Full width under map and main toolbar
      padding: '1rem 1.4rem',
      background: '#FFFFFF',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem'
    }}>
      {/* Header Bar with LEDs Ring & Toggle Dropdown for Text */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px dashed #E2E8F0',
        paddingBottom: '0.5rem',
        flexWrap: 'wrap',
        gap: '0.6rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Terminal size={20} color="#FF6900" />
          <span style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>
            Secuencia de Comandos Programada ({commands.length} pasos)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {/* LED Ring replica */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#0F172A',
            padding: '5px 12px',
            borderRadius: '20px'
          }}>
            {commands.length === 0 ? (
              <span style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 800 }}>LEDS LISTOS</span>
            ) : (
              commands.map((cmd, idx) => {
                const cmdInfo = COMMAND_TYPES[cmd.id] || COMMAND_TYPES.FORWARD;
                const isStepActive = isPlaying && currentStep === idx + 1;
                return (
                  <div 
                    key={idx}
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: cmdInfo.ledColor,
                      boxShadow: isStepActive 
                        ? `0 0 14px ${cmdInfo.ledColor}, 0 0 20px #FFFFFF` 
                        : `0 0 6px ${cmdInfo.ledColor}`,
                      transform: isStepActive ? 'scale(1.4)' : 'scale(1)',
                      transition: 'all 0.2s ease'
                    }}
                    title={`${idx + 1}. ${cmdInfo.name}`}
                  />
                );
              })
            )}
          </div>

          {/* Toggle Text Badges Button */}
          <button
            onClick={() => setShowTextDetails(!showTextDetails)}
            className="tb-btn tb-btn-secondary"
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.78rem',
              gap: '4px',
              borderColor: '#CBD5E1'
            }}
          >
            {showTextDetails ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{showTextDetails ? 'Ocultar Nombres' : 'Ver Nombres'}</span>
            {showTextDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Programmed Sequence Strip */}
      <div style={{
        background: '#F8FAFC',
        borderRadius: '16px',
        padding: '0.8rem',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        border: '2px inset #E2E8F0',
        width: '100%'
      }}>
        {commands.length === 0 ? (
          <div style={{
            width: '100%',
            textAlign: 'center',
            color: '#94A3B8',
            fontSize: '0.88rem',
            fontWeight: 700
          }}>
            Pulsa los botones del mando para programar la secuencia de movimientos...
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
                  padding: showTextDetails ? '0.45rem 0.8rem' : '0.4rem 0.6rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  whiteSpace: 'nowrap',
                  boxShadow: isStepActive ? `0 0 16px ${cmdInfo.color}` : '0 2px 5px rgba(0,0,0,0.1)',
                  transform: isStepActive ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
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

                <span style={{ fontSize: '1.1rem' }}>{cmdInfo.icon}</span>

                {/* Text name shown ONLY when text details toggle is active! */}
                {showTextDetails && (
                  <span>{cmdInfo.name}</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
