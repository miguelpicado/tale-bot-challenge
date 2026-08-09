import React from 'react';
import { COMMAND_TYPES } from '../utils/talebotEngine';
import { Sparkles, Terminal } from 'lucide-react';

export default function CommandSequenceBar({
  commands = [],
  isPlaying = false,
  currentStep = 0
}) {
  return (
    <div className="tb-card" style={{
      width: '100%',
      maxWidth: '720px',
      padding: '1rem 1.2rem',
      background: '#FFFFFF',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px dashed #E2E8F0',
        paddingBottom: '0.4rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={18} color="#FF6900" />
          <span style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>
            Secuencia de Comandos Programada ({commands.length} pasos)
          </span>
        </div>

        {/* LED Lights Sequence Ring Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: '#0F172A',
          padding: '4px 10px',
          borderRadius: '20px'
        }}>
          {commands.length === 0 ? (
            <span style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: 800 }}>LEDS LISTOS</span>
          ) : (
            commands.slice(Math.max(0, commands.length - 12)).map((cmd, idx) => {
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

      {/* Programmed Sequence Full Width Horizontal Bar */}
      <div style={{
        background: '#F8FAFC',
        borderRadius: '16px',
        padding: '0.8rem',
        minHeight: '64px',
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
                  padding: '0.45rem 0.85rem',
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
    </div>
  );
}
