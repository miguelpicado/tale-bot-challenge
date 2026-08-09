import { useState } from 'react';
import { SHAPE_PRESETS } from '../utils/talebotEngine';
import { Search } from 'lucide-react';

const CATEGORIES = ['Todos', 'Figuras', 'Letras', 'Números', 'Dibujos'];

export default function ShapeCatalogDrawer({ onSelectShape }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredShapes = SHAPE_PRESETS.filter((shape) => {
    const matchesCategory = selectedCategory === 'Todos' || shape.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = shape.name.toLowerCase().includes(q) || shape.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div className="panel__head">
        <h3 className="panel__title">Formas</h3>
        <span className="t-mono" style={{ fontSize: '.72rem', color: 'var(--tx-3)' }}>{filteredShapes.length}</span>
      </div>

      <div style={{ padding: '.8rem', display: 'flex', flexDirection: 'column', gap: '.6rem', minHeight: 0 }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--tx-3)' }} />
          <input
            className="input"
            style={{ paddingLeft: '2.1rem' }}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar forma o letra"
          />
        </div>

        <div style={{ display: 'flex', gap: '.3rem', overflowX: 'auto', paddingBottom: '2px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="chip"
              onClick={() => setSelectedCategory(cat)}
              style={selectedCategory === cat
                ? { background: 'var(--ink)', color: 'var(--tx-inv)', borderColor: 'var(--ink)', cursor: 'pointer' }
                : { cursor: 'pointer' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredShapes.length === 0 ? (
          <p className="t-help" style={{ textAlign: 'center', padding: '.8rem 0' }}>
            Nada con ese nombre. Prueba con otra palabra.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.5rem', overflowY: 'auto', minHeight: 0 }}>
            {filteredShapes.map((shape) => (
              <button key={shape.id} className="card" onClick={() => onSelectShape(shape)}>
                <div>
                  <div className="card__t">{shape.name}</div>
                  <div className="card__d">{shape.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
