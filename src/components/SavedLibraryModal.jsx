import React, { useRef } from 'react';
import { PRESET_CHALLENGES } from '../utils/presets';
import { exportChallengesToJSON, importChallengesFromJSON } from '../utils/storage';
import { FolderOpen, Download, Upload, Trash2, CheckCircle2, X } from 'lucide-react';

export default function SavedLibraryModal({
  savedChallenges = [],
  onLoadChallenge,
  onDeleteChallenge,
  onImportChallenges,
  onClose
}) {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    exportChallengesToJSON([...PRESET_CHALLENGES, ...savedChallenges]);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imported = await importChallengesFromJSON(file);
        if (Array.isArray(imported)) {
          onImportChallenges(imported);
          alert('¡Colección de retos importada con éxito!');
        }
      } catch (err) {
        alert('Error importando archivo: ' + err.message);
      }
    }
  };

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
        maxWidth: '750px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        padding: '1.8rem'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FolderOpen size={24} color="#8B5CF6" />
            <h2 style={{ fontFamily: 'Fredoka', color: '#0F172A', fontSize: '1.4rem' }}>
              Biblioteca de Retos TaleBot
            </h2>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="#64748B" />
          </button>
        </div>

        {/* Action Toolbar (Export/Import) */}
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button onClick={handleExport} className="tb-btn tb-btn-purple" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
            <Download size={16} /> Exportar Fichero JSON
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="tb-btn tb-btn-secondary" 
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <Upload size={16} /> Importar Retos (.json)
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            style={{ display: 'none' }} 
          />
        </div>

        {/* Challenges List Container */}
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '4px' }}>
          {/* Section 1: Presets */}
          <div>
            <h3 style={{ fontFamily: 'Fredoka', fontSize: '1.1rem', color: '#334155', marginBottom: '0.6rem' }}>
              ⭐ Retos Predefinidos de la Aplicación
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.8rem' }}>
              {PRESET_CHALLENGES.map((ch) => (
                <div
                  key={ch.id}
                  style={{
                    background: '#F8FAFC',
                    border: '2px solid #E2E8F0',
                    borderRadius: '14px',
                    padding: '0.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <div>
                    <h4 style={{ fontFamily: 'Fredoka', fontSize: '0.95rem', color: '#0F172A' }}>
                      {ch.title}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                      {ch.story}
                    </p>
                  </div>

                  <button
                    onClick={() => onLoadChallenge(ch)}
                    className="tb-btn tb-btn-primary"
                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', justifyContent: 'center' }}
                  >
                    Cargar Reto
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Custom Saved */}
          {savedChallenges.length > 0 && (
            <div>
              <h3 style={{ fontFamily: 'Fredoka', fontSize: '1.1rem', color: '#334155', marginBottom: '0.6rem' }}>
                ✏️ Mis Retos Guardados
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.8rem' }}>
                {savedChallenges.map((ch) => (
                  <div
                    key={ch.id}
                    style={{
                      background: '#F0F9FF',
                      border: '2px solid #BAE6FD',
                      borderRadius: '14px',
                      padding: '0.8rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.5rem'
                    }}
                  >
                    <div>
                      <h4 style={{ fontFamily: 'Fredoka', fontSize: '0.95rem', color: '#0369A1' }}>
                        {ch.title}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#0284C7', marginTop: '2px' }}>
                        {ch.story}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => onLoadChallenge(ch)}
                        className="tb-btn tb-btn-primary"
                        style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem', justifyContent: 'center' }}
                      >
                        Cargar
                      </button>

                      <button
                        onClick={() => onDeleteChallenge(ch.id)}
                        className="tb-btn tb-btn-secondary"
                        style={{ padding: '0.4rem', color: '#EF4444' }}
                        title="Eliminar reto"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
