import { Sparkles, FolderOpen, Printer } from 'lucide-react';
import TaleBotAvatar from './TaleBotAvatar';
import { MAP_THEMES } from '../utils/presets';

export default function Header({
  orientation = 'landscape',
  onToggleOrientation,
  themeKey = 'CLASICO',
  onChangeTheme,
  onOpenNewChallengeModal,
  onOpenSavePrintModal,
  onOpenLibrary,
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
        {/* Estilo del tablero */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span className="t-eyebrow" style={{ fontSize: '0.65rem' }}>Estilo</span>
          <select
            className="select select--sm"
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
            value={themeKey}
            onChange={(e) => onChangeTheme && onChangeTheme(e.target.value)}
            aria-label="Estilo del tablero"
          >
            {Object.values(MAP_THEMES).map((thm) => (
              <option key={thm.id} value={thm.id}>{thm.emoji} {thm.name}</option>
            ))}
          </select>
        </div>

        {/* Orientación del mapa */}
        <div className="seg seg--sm" role="group" aria-label="Orientación del tablero">
          <button
            type="button"
            className="seg__opt"
            data-on={isLandscape}
            onClick={() => { if (!isLandscape && onToggleOrientation) onToggleOrientation(); }}
            title="Formato Horizontal (5×4)"
          >
            <span className="t-mono" style={{ fontSize: '.68rem' }}>5×4</span> Horiz
          </button>
          <button
            type="button"
            className="seg__opt"
            data-on={!isLandscape}
            onClick={() => { if (isLandscape && onToggleOrientation) onToggleOrientation(); }}
            title="Formato Vertical (4×5)"
          >
            <span className="t-mono" style={{ fontSize: '.68rem' }}>4×5</span> Vert
          </button>
        </div>

        <span className="topbar__sep" />

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
