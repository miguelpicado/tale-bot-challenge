import { FolderOpen, Cloud, Printer, X, ChevronRight } from 'lucide-react';

const ACTIONS = [
  {
    id: 'local',
    icon: FolderOpen,
    title: 'Guardar en la biblioteca',
    desc: 'Se queda en este navegador, sin cuenta ni conexión.',
    bg: 'var(--violet-soft)',
    fg: 'var(--violet)'
  },
  {
    id: 'drive',
    icon: Cloud,
    title: 'Guardar en Google Drive',
    desc: 'Sube la colección a tu propia cuenta.',
    bg: 'var(--lagoon-soft)',
    fg: '#007A7D'
  },
  {
    id: 'print',
    icon: Printer,
    title: 'Imprimir folios A4',
    desc: 'Retos, soluciones al dorso y obstáculos recortables.',
    bg: 'var(--ember-soft)',
    fg: 'var(--ember-deep)'
  }
];

export default function SavePrintModal({ onSaveLocal, onOpenDrive, onOpenPrint, onClose }) {
  const run = {
    local: onSaveLocal,
    drive: onOpenDrive,
    print: onOpenPrint
  };

  return (
    <div className="scrim no-print" onClick={onClose}>
      <div className="sheet" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
        <div className="sheet__head">
          <div>
            <h2 className="sheet__title">Guardar o imprimir</h2>
            <p className="sheet__sub">Elige qué hacer con los retos que tienes montados.</p>
          </div>
          <button className="btn btn--quiet btn--icon" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="sheet__body" style={{ gap: '.6rem' }}>
          {ACTIONS.map(({ id, icon: Icon, title, desc, bg, fg }) => (
            <button
              key={id}
              className="act"
              onClick={() => { run[id](); onClose(); }}
            >
              <span className="act__ico" style={{ '--act-bg': bg, '--act-fg': fg }}>
                <Icon size={19} />
              </span>
              <span>
                <span className="act__t" style={{ display: 'block' }}>{title}</span>
                <span className="act__d" style={{ display: 'block' }}>{desc}</span>
              </span>
              <ChevronRight className="act__go" size={17} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
