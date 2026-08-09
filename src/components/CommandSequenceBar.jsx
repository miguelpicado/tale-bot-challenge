import React, { useState } from 'react';
import { COMMAND_TYPES } from '../utils/talebotEngine';
import { Terminal, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

export default function CommandSequenceBar({
  commands = [],
  isPlaying = false,
  currentStep = 0
}) {
  // Toggle to show/hide the entire row of command buttons/cards
  const [showButtonsRow, setShowButtonsRow] = useState(true);

  return (
    <div className="tb-card" style={{
      width: '100%',
      padding: '1rem 1.6rem',
      background: '#FFFFFF',
      boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.8rem',
      borderRadius: '20px'
    }}>
      {/* Header Bar with LEDs Ring & Toggle Button for Command Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: showButtonsRow ? '2px dashed #E2E8F0' : 'none',
        paddingBottom: showButtonsRow ? '0.6rem' : '0rem',
        flexWrap: 'wrap',
        gap: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Terminal size={22} color="#FF6900" />
          <h3 style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}>
            Secuencia de Comandos ({commands.length} pasos)
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
          {/* LED Ring replica bar (ALWAYS VISIBLE!) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#0F172A',
            padding: '6px 16px',
            borderRadius: '24px'
          }}>
            {commands.length === 0 ? (
              <span style={{ color: '#64748B', fontSize: '0.78rem', fontWeight: 800 }}>LEDS LISTOS</span>
            ) : (
              commands.map((cmd, idx) => {
                const cmdInfo = COMMAND_TYPES[cmd.id] || COMMAND_TYPES.FORWARD;
                const isStepActive = isPlaying && currentStep === idx + 1;
                return (
                  <div 
                    key={idx}
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: cmdInfo.ledColor,
                      boxShadow: isStepActive 
                        ? `0 0 16px ${cmdInfo.ledColor}, 0 0 24px #FFFFFF` 
                        : `0 0 8px ${cmdInfo.ledColor}`,
                      transform: isStepActive ? 'scale(1.45)' : 'scale(1)',
                      transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                    title={`${idx + 1}. ${cmdInfo.name}`}
                  />
                );
              })
            )}
          </div>

          {/* Toggle Button to show/hide the row of command buttons */}
          <button
            onClick={() => setShowButtonsRow(!showButtonsRow)}
            className="tb-btn tb-btn-secondary"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.82rem',
              gap: '6px',
              borderColor: '#FF6900',
              color: '#FF6900'
            }}
          >
            {showButtonsRow ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{showButtonsRow ? 'Ocultar Fichas' : 'Ver Fichas de Comandos'}</span>
            {showButtonsRow ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Collapsible Row of Command Buttons */}
      {showButtonsRow && (
        <div style={{
          background: '#F8FAFC',
          borderRadius: '16px',
          padding: '0.9rem',
          minHeight: '66px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          overflowX: 'auto',
          border: '2px inset #E2E8F0',
          width: '100%'
        }}>
          {commands.length === 0 ? (
            <div style={{
              width: '100%',
              textAlign: 'center',
              color: '#94A3B8',
              fontSize: '0.9rem',
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
                    padding: '0.45rem 0.85rem',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    whiteSpace: 'nowrap',
                    boxShadow: isStepActive ? `0 0 18px ${cmdInfo.color}` : '0 2px 5px rgba(0,0,0,0.1)',
                    transform: isStepActive ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  <span style={{
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem'
                  }}>
                    {idx + 1}
                  </span>

                  <span style={{ fontSize: '1.1rem' }}>{cmdInfo.icon}</span>
                  <span>{cmdInfo.name}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
