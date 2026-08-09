import React, { useState } from 'react';
import { getSavedGoogleClientId, saveGoogleClientId, uploadToGoogleDrive } from '../utils/storage';
import { Cloud, Check, Key, X, AlertCircle } from 'lucide-react';

export default function GoogleDriveModal({ challenges, onClose }) {
  const [clientId, setClientId] = useState(getSavedGoogleClientId());
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveConfig = () => {
    saveGoogleClientId(clientId);
    setStatusMsg('Configuración guardada en LocalStorage.');
  };

  const handleSyncDrive = async () => {
    if (!clientId.trim()) {
      setStatusMsg('Por favor introduce tu Client ID de Google Drive API primero.');
      return;
    }

    setLoading(true);
    setStatusMsg('Conectando con Google Identity Services...');

    try {
      await uploadToGoogleDrive(clientId, challenges);
      setStatusMsg('¡Colección guardada con éxito en tu Google Drive!');
    } catch (err) {
      setStatusMsg('Error de sincronización: ' + err.message);
    } finally {
      setLoading(false);
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
        maxWidth: '520px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        padding: '1.8rem'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Cloud size={24} color="#00A3FF" />
            <h2 style={{ fontFamily: 'Fredoka', color: '#0F172A', fontSize: '1.4rem' }}>
              Sincronización con Google Drive
            </h2>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="#64748B" />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.4 }}>
          Puedes guardar copias de tus fichas en tu propia cuenta de Google Drive de forma gratuita utilizando tu Google OAuth Client ID.
        </p>

        {/* Input Client ID */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
            Google OAuth Client ID:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="xxxxxxx-xxxx.apps.googleusercontent.com"
              style={{
                flex: 1,
                padding: '0.6rem 0.8rem',
                borderRadius: '12px',
                border: '2px solid #CBD5E1',
                fontFamily: 'Nunito',
                fontSize: '0.85rem'
              }}
            />
            <button onClick={handleSaveConfig} className="tb-btn tb-btn-secondary" style={{ padding: '0.6rem' }} title="Guardar Key">
              <Key size={18} />
            </button>
          </div>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div style={{
            background: statusMsg.includes('éxito') ? '#F0FDF4' : '#FEF2F2',
            color: statusMsg.includes('éxito') ? '#166534' : '#991B1B',
            border: `1px solid ${statusMsg.includes('éxito') ? '#BBF7D0' : '#FECACA'}`,
            padding: '0.6rem 0.9rem',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {statusMsg.includes('éxito') ? <Check size={16} /> : <AlertCircle size={16} />}
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleSyncDrive}
          disabled={loading}
          className="tb-btn tb-btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }}
        >
          <Cloud size={18} /> {loading ? 'Sincronizando...' : 'Subir Retos a mi Google Drive'}
        </button>
      </div>
    </div>
  );
}
