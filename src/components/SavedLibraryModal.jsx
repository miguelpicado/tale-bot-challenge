import { useRef } from 'react';
import { PRESET_CHALLENGES } from '../utils/presets';
import { exportChallengesToJSON, importChallengesFromJSON } from '../utils/storage';
import { Download, Upload, Trash2, X } from 'lucide-react';

export default function SavedLibraryModal({
  savedChallenges = [],
  onLoadChallenge,
  onDeleteChallenge,
  onImportChallenges,
  onNotify = () => {},
  onClose
}) {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    exportChallengesToJSON([...PRESET_CHALLENGES, ...savedChallenges]);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const imported = await importChallengesFromJSON(file);
      if (Array.isArray(imported)) {
        onImportChallenges(imported);
        onNotify(`${imported.length} retos importados.`);
      }
    } catch (err) {
      onNotify(`No se pudo leer el archivo: ${err.message}`, 'warn');
    }
  };

  return (
    <div className="scrim no-print" onClick={onClose}>
      <div className="sheet" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        <div className="sheet__head">
          <div>
            <h2 className="sheet__title">Biblioteca</h2>
            <p className="sheet__sub">
              {PRESET_CHALLENGES.length} retos de ejemplo · {savedChallenges.length} guardados por ti
            </p>
          </div>

          <div style={{ display: 'flex', gap: '.4rem', alignItems: 'center' }}>
            <button className="btn btn--outline btn--sm" onClick={handleExport}>
              <Download size={14} /> Exportar
            </button>
            <button className="btn btn--outline btn--sm" onClick={() => fileInputRef.current?.click()}>
              <Upload size={14} /> Importar
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />
            <button className="btn btn--quiet btn--icon" onClick={onClose} aria-label="Cerrar">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="sheet__body">
          <section>
            <span className="t-eyebrow">Retos de ejemplo</span>
            <div className="grid-cards" style={{ marginTop: '.6rem' }}>
              {PRESET_CHALLENGES.map((ch) => (
                <div key={ch.id} className="card">
                  <div>
                    <div className="card__t">{ch.title}</div>
                    <div className="card__d">{ch.story}</div>
                  </div>
                  <div className="card__actions">
                    <button className="btn btn--outline btn--sm btn--block" onClick={() => onLoadChallenge(ch)}>
                      Abrir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {savedChallenges.length > 0 ? (
            <section>
              <span className="t-eyebrow">Mis retos</span>
              <div className="grid-cards" style={{ marginTop: '.6rem' }}>
                {savedChallenges.map((ch) => (
                  <div key={ch.id} className="card">
                    <div>
                      <div className="card__t">{ch.title}</div>
                      <div className="card__d">{ch.story}</div>
                    </div>
                    <div className="card__actions">
                      <button className="btn btn--outline btn--sm" style={{ flex: 1 }} onClick={() => onLoadChallenge(ch)}>
                        Abrir
                      </button>
                      <button
                        className="btn btn--danger btn--sm btn--icon"
                        onClick={() => onDeleteChallenge(ch.id)}
                        aria-label={`Borrar ${ch.title}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="panel" style={{ padding: '1.1rem', textAlign: 'center', boxShadow: 'none', background: 'var(--paper-2)' }}>
              <div className="card__t">Aún no has guardado ningún reto</div>
              <p className="t-help" style={{ marginTop: '.25rem' }}>
                Monta un reto en el tablero y púlsalo en «Guardar o imprimir» para tenerlo aquí.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
