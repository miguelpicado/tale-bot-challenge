import { Sparkles, FolderOpen, Pencil, Printer } from 'lucide-react';
import TaleBotAvatar from './TaleBotAvatar';

export default function Header({
  orientation,
  onToggleOrientation,
  onOpenNewChallengeModal,
  onOpenSavePrintModal,
  onOpenLibrary,
  onOpenChallengeEditorModal,
  activeModeName = 'Reto personalizado'
}) {
  const isLandscape = orientation === 'landscape';

  return (
    <header className="topbar no-print">
      <div className="brand">
        <span className="brand__mark">
          <TaleBotAvatar size={30} ledColor="#4DE8EC" idle />
        </span>

        <div>
          <div className="brand__name">
            TaleBot <em>Studio</em>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginTop: '.1rem' }}>
            <span className="t-eyebrow">Modo</span>
            <span style={{ fontSize: '.78rem', fontWeight: 600, color: 'var(--tx-2)' }}>{activeModeName}</span>
          </div>
        </div>
      </div>

      <div className="topbar__actions">
        {/* La orientación es una elección entre dos estados: control segmentado, no un botón que alterna a ciegas */}
        <div className="seg" role="group" aria-label="Orientación del tablero">
          <button
            className="seg__opt"
            data-on={isLandscape}
            onClick={() => { if (!isLandscape) onToggleOrientation(); }}
          >
            <span className="t-mono" style={{ fontSize: '.7rem' }}>5×4</span> Horizontal
          </button>
          <button
            className="seg__opt"
            data-on={!isLandscape}
            onClick={() => { if (isLandscape) onToggleOrientation(); }}
          >
            <span className="t-mono" style={{ fontSize: '.7rem' }}>4×5</span> Vertical
          </button>
        </div>

        <span className="topbar__sep" />

        <button className="btn btn--quiet" onClick={onOpenNewChallengeModal}>
          <Sparkles size={15} /> Generar retos
        </button>

        <button className="btn btn--quiet" onClick={onOpenChallengeEditorModal}>
          <Pencil size={15} /> Editar ficha
        </button>

        <button className="btn btn--quiet" onClick={onOpenLibrary}>
          <FolderOpen size={15} /> Biblioteca
        </button>

        <button className="btn btn--primary" onClick={onOpenSavePrintModal}>
          <Printer size={16} /> Guardar o imprimir
        </button>
      </div>
    </header>
  );
}
