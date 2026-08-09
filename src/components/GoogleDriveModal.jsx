import { useState } from 'react';
import { getSavedGoogleClientId, saveGoogleClientId, uploadToGoogleDrive } from '../utils/storage';
import { Cloud, Check, Key, X, AlertTriangle } from 'lucide-react';

export default function GoogleDriveModal({ challenges, onClose }) {
  const [clientId, setClientId] = useState(getSavedGoogleClientId());
  const [status, setStatus] = useState(null); // { tone: 'ok' | 'err', text }
  const [loading, setLoading] = useState(false);

  const handleSaveConfig = () => {
    saveGoogleClientId(clientId);
    setStatus({ tone: 'ok', text: 'Client ID guardado en este navegador.' });
  };

  const handleSyncDrive = async () => {
    if (!clientId.trim()) {
      setStatus({ tone: 'err', text: 'Escribe tu Client ID de Google antes de subir.' });
      return;
    }

    setLoading(true);
    setStatus({ tone: 'ok', text: 'Conectando con Google…' });

    try {
      await uploadToGoogleDrive(clientId, challenges);
      setStatus({ tone: 'ok', text: 'Colección subida a tu Google Drive.' });
    } catch (err) {
      setStatus({ tone: 'err', text: `No se pudo subir: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scrim no-print" onClick={onClose}>
      <div className="sheet" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div className="sheet__head">
          <div>
            <h2 className="sheet__title">Google Drive</h2>
            <p className="sheet__sub">Los retos se guardan en tu cuenta, no en un servidor nuestro.</p>
          </div>
          <button className="btn btn--quiet btn--icon" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="sheet__body">
          <div>
            <label className="t-label" htmlFor="gd-client">Client ID de Google OAuth</label>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <input
                id="gd-client"
                className="input"
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="xxxxxxx-xxxx.apps.googleusercontent.com"
              />
              <button className="btn btn--outline btn--icon" onClick={handleSaveConfig} title="Guardar Client ID">
                <Key size={17} />
              </button>
            </div>
            <p className="t-help" style={{ marginTop: '.4rem' }}>
              Se guarda solo en este navegador. Lo creas en Google Cloud Console, apartado Credenciales.
            </p>
          </div>

          {status && (
            <div className={`note note--${status.tone === 'ok' ? 'ok' : 'err'}`}>
              {status.tone === 'ok' ? <Check size={16} /> : <AlertTriangle size={16} />}
              <span>{status.text}</span>
            </div>
          )}
        </div>

        <div className="sheet__foot">
          <button className="btn btn--primary btn--block" onClick={handleSyncDrive} disabled={loading}>
            <Cloud size={17} /> {loading ? 'Subiendo…' : 'Subir a Drive'}
          </button>
        </div>
      </div>
    </div>
  );
}
