import React from 'react';
import { 
  Printer, 
  FolderOpen, 
  Cloud, 
  PlusCircle, 
  RotateCw, 
  Sparkles,
  Bot
} from 'lucide-react';

export default function Header({ 
  orientation, 
  onToggleOrientation, 
  onOpenPrintPreview, 
  onOpenLibrary, 
  onOpenDriveModal,
  onResetChallenge,
  hasGoogleDriveConfigured
}) {
  return (
    <header className="no-print" style={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '3px solid #E2E8F0',
      padding: '0.85rem 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #FFC700 0%, #FF9500 100%)',
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(255, 199, 0, 0.4)',
            fontSize: '1.6rem'
          }} className="animated-robot">
            🤖
          </div>
          <div>
            <h1 className="brand-title" style={{ 
              fontSize: '1.5rem', 
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              lineHeight: 1.1
            }}>
              TaleBot Pro <span style={{ 
                fontSize: '0.75rem', 
                background: '#00A3FF', 
                color: 'white', 
                padding: '2px 8px', 
                borderRadius: '12px',
                fontFamily: 'Nunito',
                fontWeight: 700
              }}>CHALLENGE STUDIO</span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
              Generador de recorridos e impresión A4 para pequeños programadores
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Orientation Toggle */}
          <button 
            className="tb-btn tb-btn-secondary"
            onClick={onToggleOrientation}
            title="Cambiar orientación de la cuadrícula"
            style={{ fontSize: '0.9rem', padding: '0.5rem 0.9rem' }}
          >
            <RotateCw size={18} color="#00A3FF" />
            <span>
              {orientation === 'landscape' ? '3x4 Horizontal' : '4x3 Vertical'}
            </span>
          </button>

          {/* New Challenge */}
          <button 
            className="tb-btn tb-btn-secondary"
            onClick={onResetChallenge}
            style={{ fontSize: '0.9rem', padding: '0.5rem 0.9rem' }}
          >
            <PlusCircle size={18} color="#10B981" />
            <span>Nuevo Reto</span>
          </button>

          {/* Library */}
          <button 
            className="tb-btn tb-btn-purple"
            onClick={onOpenLibrary}
            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
          >
            <FolderOpen size={18} />
            <span>Biblioteca</span>
          </button>

          {/* Google Drive */}
          <button 
            className="tb-btn tb-btn-secondary"
            onClick={onOpenDriveModal}
            style={{ 
              fontSize: '0.9rem', 
              padding: '0.5rem 0.9rem',
              borderColor: hasGoogleDriveConfigured ? '#10B981' : '#E2E8F0'
            }}
          >
            <Cloud size={18} color={hasGoogleDriveConfigured ? '#10B981' : '#64748B'} />
            <span>Drive</span>
          </button>

          {/* A4 Print Sheet Preview */}
          <button 
            className="tb-btn tb-btn-yellow"
            onClick={onOpenPrintPreview}
            style={{ fontSize: '0.95rem', padding: '0.55rem 1.2rem' }}
          >
            <Printer size={20} />
            <span>Imprimir en A4</span>
          </button>
        </div>
      </div>
    </header>
  );
}
