import { useEffect, useRef, useState } from 'react';
import { COMMAND_TYPES } from '../utils/talebotEngine';
import {
  ArrowUp, ArrowDown, CornerUpLeft, CornerUpRight,
  Play, Pause, Mic, Repeat, Bird, X, Undo2, Wand2
} from 'lucide-react';

/**
 * Roseta igual a la cubierta del Tale-Bot Pro: los cuatro movimientos en cruz
 * alrededor del arranque, y las cuatro funciones en cápsulas blancas pequeñas
 * ocupando las diagonales.
 */
const CLUSTER = [
  { cmd: 'SOUND', size: 'sm', Icon: Mic, hint: 'M' },
  { cmd: 'FORWARD', size: 'big', Icon: ArrowUp, hint: '↑' },
  { cmd: 'LOOP', size: 'sm', Icon: Repeat, hint: 'L' },
  { cmd: 'TURN_LEFT', size: 'big', Icon: CornerUpLeft, hint: '←' },
  { cmd: 'RUN', size: 'play' },
  { cmd: 'TURN_RIGHT', size: 'big', Icon: CornerUpRight, hint: '→' },
  { cmd: 'DANCE', size: 'sm', Icon: Bird, hint: 'B' },
  { cmd: 'BACKWARD', size: 'big', Icon: ArrowDown, hint: '↓' },
  { cmd: 'CLEAR', size: 'sm', Icon: X }
];

const KEY_MAP = {
  ArrowUp: 'FORWARD',
  ArrowDown: 'BACKWARD',
  ArrowLeft: 'TURN_LEFT',
  ArrowRight: 'TURN_RIGHT',
  b: 'DANCE', B: 'DANCE',
  m: 'SOUND', M: 'SOUND',
  l: 'LOOP', L: 'LOOP'
};

export default function TaleBotController({
  commands = [],
  onAddCommand,
  onRemoveLastCommand,
  onClearCommands,
  onRunSimulation,
  onAutoSolvePath,
  isPlaying = false
}) {
  // Hunde también la tecla disparada por teclado, no solo la del ratón
  const [pressed, setPressed] = useState(null);
  const pressTimer = useRef(null);

  const flash = (key) => {
    setPressed(key);
    clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => setPressed(null), 170);
  };

  useEffect(() => () => clearTimeout(pressTimer.current), []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      const cmdKey = KEY_MAP[e.key];
      if (cmdKey) {
        e.preventDefault();
        flash(cmdKey);
        onAddCommand(COMMAND_TYPES[cmdKey]);
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        flash('RUN');
        onRunSimulation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAddCommand, onRunSimulation]);

  return (
    <div className="deck">
      <div className="deck__head">
        <h3 className="deck__title">Mando</h3>
        <span className="t-mono" style={{ fontSize: '.7rem', color: 'var(--tx-3)' }}>
          {commands.length} {commands.length === 1 ? 'paso' : 'pasos'}
        </span>
      </div>

      <div className="cluster">
        {CLUSTER.map((slot) => {
          if (slot.cmd === 'RUN') {
            return (
              <button
                key="RUN"
                className="hw hw--big hw--play"
                data-pressed={pressed === 'RUN'}
                onClick={onRunSimulation}
                style={{ '--hw-c': '#FF7A1B' }}
                title={isPlaying ? 'Parar (Intro)' : 'Ejecutar (Intro)'}
                aria-label={isPlaying ? 'Parar' : 'Ejecutar'}
              >
                {isPlaying ? <Pause size={26} fill="currentColor" /> : <Play size={26} fill="currentColor" />}
              </button>
            );
          }

          if (slot.cmd === 'CLEAR') {
            return (
              <button
                key="CLEAR"
                className="hw hw--sm"
                onClick={onClearCommands}
                disabled={commands.length === 0}
                style={{ '--hw-c': '#EF4444' }}
                title="Borrar toda la secuencia"
                aria-label="Borrar toda la secuencia"
              >
                <X size={20} strokeWidth={3} />
              </button>
            );
          }

          const info = COMMAND_TYPES[slot.cmd];
          const { Icon } = slot;
          const isBig = slot.size === 'big';

          return (
            <button
              key={slot.cmd}
              className={`hw ${isBig ? 'hw--big' : 'hw--sm'}`}
              data-pressed={pressed === slot.cmd}
              onClick={() => { flash(slot.cmd); onAddCommand(info); }}
              style={{ '--hw-c': info.color }}
              title={`${info.name} (${slot.hint})`}
              aria-label={info.name}
            >
              {isBig && <span className="hw__hint">{slot.hint}</span>}
              <Icon size={isBig ? 30 : 20} strokeWidth={isBig ? 2.6 : 2.4} />
            </button>
          );
        })}
      </div>

      <div className="deck__row">
        <button className="deck__btn" onClick={onRemoveLastCommand} disabled={commands.length === 0}>
          <Undo2 size={15} /> Deshacer paso
        </button>

        <button className="deck__btn deck__btn--solve" onClick={onAutoSolvePath}>
          <Wand2 size={15} /> Resolver solo
        </button>
      </div>
    </div>
  );
}
