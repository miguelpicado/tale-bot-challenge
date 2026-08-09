import React from 'react';
import { RotateCw, PlusCircle, Bookmark, FolderOpen, Edit3 } from 'lucide-react';
import TaleBotAvatar from './TaleBotAvatar';

export default function Header({ 
  orientation, 
  onToggleOrientation, 
  onOpenNewChallengeModal,
  onOpenSavePrintModal,
  onOpenLibrary,
  onOpenChallengeEditorModal,
  activeModeName = 'Reto Personalizado'
}) {
  return (
    <header className="no-print" style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '2px solid #E2E8F0',
      padding: '0.8rem 1.8rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Title & Active Mode Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <TaleBotAvatar size={48} angle={0} ledColor="#10B981" />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 className="brand-title" style={{ 
                fontSize: '1.45rem', 
                color: '#0F172A',
                lineHeight: 1.1
              }}>
                TaleBot Pro <span style={{ 
                  fontSize: '0.75rem', 
                  background: 'linear-gradient(135deg, #FF6900 0%, #FF9500 100%)', 
                  color: 'white', 
                  padding: '2px 8px', 
                  borderRadius: '12px',
                  fontFamily: 'Nunito',
                  fontWeight: 800
                }}>STUDIO</span>
              </h1>
            </div>

            {/* Active Mode Banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Modo Activo:</span>
              <span style={{ 
                fontSize: '0.78rem', 
                fontWeight: 800, 
                color: '#FF6900',
                background: '#FFF7ED',
                padding: '1px 8px',
                borderRadius: '8px',
                border: '1px solid #FFEDD5'
              }}>
                {activeModeName}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flexWrap: 'wrap' }}>
          {/* Orientation Toggle */}
          <button 
            className="tb-btn tb-btn-secondary"
            onClick={onToggleOrientation}
            title="Cambiar orientación de la cuadrícula"
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
          >
            <RotateCw size={16} color="#00A3FF" />
            <span>{orientation === 'landscape' ? '5x4 Horizontal' : '4x5 Vertical'}</span>
          </button>

          {/* New Challenge Modal Trigger */}
          <button 
            className="tb-btn tb-btn-secondary"
            onClick={onOpenNewChallengeModal}
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem', borderColor: '#FF6900', color: '#FF6900' }}
          >
            <PlusCircle size={16} color="#FF6900" />
            <span>Nuevo Reto</span>
          </button>

          {/* Edit Challenge Details Modal Trigger */}
          <button 
            className="tb-btn tb-btn-secondary"
            onClick={onOpenChallengeEditorModal}
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
          >
            <Edit3 size={16} color="#64748B" />
            <span>Editar Ficha</span>
          </button>

          {/* Saved Library */}
          <button 
            className="tb-btn tb-btn-purple"
            onClick={onOpenLibrary}
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
          >
            <FolderOpen size={16} />
            <span>Biblioteca</span>
          </button>

          {/* Save & Print Consolidated Modal Trigger */}
          <button 
            className="tb-btn tb-btn-yellow"
            onClick={onOpenSavePrintModal}
            style={{ fontSize: '0.9rem', padding: '0.55rem 1.2rem' }}
          >
            <Bookmark size={18} />
            <span>Guardar / Imprimir A4</span>
          </button>
        </div>
      </div>
    </header>
  );
}
