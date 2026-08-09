import React from 'react';
import { FolderOpen, Cloud, Printer, X, Sparkles } from 'lucide-react';

export default function SavePrintModal({
  onSaveLocal,
  onOpenDrive,
  onOpenPrint,
  onClose
}) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="tb-card" style={{
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        padding: '1.8rem'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={24} color="#FF6900" />
            <h2 style={{ fontFamily: 'Fredoka', color: '#0F172A', fontSize: '1.4rem' }}>
              Guardar e Imprimir Fichas
            </h2>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="#64748B" />
          </button>
        </div>

        {/* 3 Main Action Choices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {/* Choice 1: Save Local */}
          <button
            onClick={() => {
              onSaveLocal();
              onClose();
            }}
            className="tb-btn tb-btn-purple"
            style={{ padding: '0.8rem 1.2rem', justifyContent: 'flex-start', fontSize: '0.95rem' }}
          >
            <FolderOpen size={22} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700 }}>Guardar en Biblioteca Local</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Almacena el reto en tu navegador</div>
            </div>
          </button>

          {/* Choice 2: Google Drive */}
          <button
            onClick={() => {
              onOpenDrive();
              onClose();
            }}
            className="tb-btn tb-btn-primary"
            style={{ padding: '0.8rem 1.2rem', justifyContent: 'flex-start', fontSize: '0.95rem' }}
          >
            <Cloud size={22} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700 }}>Guardar en Google Drive</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Sincroniza tus colecciones en tu nube</div>
            </div>
          </button>

          {/* Choice 3: Print A4 */}
          <button
            onClick={() => {
              onOpenPrint();
              onClose();
            }}
            className="tb-btn tb-btn-yellow"
            style={{ padding: '0.8rem 1.2rem', justifyContent: 'flex-start', fontSize: '0.95rem' }}
          >
            <Printer size={22} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700 }}>Imprimir Fichas + Recortables A4</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Fichas de ejercicios, soluciones y 12 obstáculos</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
