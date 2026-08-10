import { Sparkles, FolderOpen, Printer } from 'lucide-react';
import TaleBotAvatar from './TaleBotAvatar';

export default function Header({
  onOpenNewChallengeModal,
  onOpenSavePrintModal,
  onOpenLibrary,
  activeModeName = 'Reto personalizado'
}) {
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
        <button className="btn btn--quiet" onClick={onOpenNewChallengeModal}>
          <Sparkles size={15} /> Generar retos
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
