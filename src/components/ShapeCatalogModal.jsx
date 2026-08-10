import React, { useState, useMemo } from 'react';
import { SHAPE_PRESETS } from '../utils/talebotEngine';
import { X, Search, PenTool, Wand2 } from 'lucide-react';

const CATEGORIES = ['Todas', 'Geometría', 'Letras', 'Números', 'Símbolos', 'Dibujos'];

export default function ShapeCatalogModal({
  onSelectShape,
  onGenerateShapePages,
  onClose
}) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [folioCount, setFolioCount] = useState(1);

  const filteredShapes = useMemo(() => {
    return SHAPE_PRESETS.filter((shape) => {
      const matchCategory = selectedCategory === 'Todas' || shape.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' ||
        shape.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shape.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleGenerateWorksheets = () => {
    const totalNeeded = folioCount * 2;
    const availableShapes = selectedCategory === 'Todas'
      ? SHAPE_PRESETS
      : SHAPE_PRESETS.filter(s => s.category === selectedCategory);

    const pool = availableShapes.length > 0 ? availableShapes : SHAPE_PRESETS;
    const generated = [];

    for (let i = 0; i < totalNeeded; i++) {
      const shapeObj = pool[i % pool.length];
      generated.push({
        id: `shape_gen_${Date.now()}_${i}`,
        title: `Reto #${i + 1}: Trazo ${shapeObj.name}`,
        story: `Coloca el rotulador en TaleBot y dibuja ${shapeObj.name}.`,
        difficulty: Math.min(3, Math.floor(i / 4) + 1),
        numRows: 4,
        numCols: 5,
        theme: 'CLASICO',
        start: shapeObj.start,
        target: shapeObj.start,
        obstacles: [],
        commands: shapeObj.commands,
        penMarkerMode: true
      });
    }

    if (onGenerateShapePages) {
      onGenerateShapePages(generated);
    }
    onClose();
  };

  return (
    <div className="scrim no-print" onClick={onClose}>
      <div
        className="sheet"
        style={{ maxWidth: '840px', width: '92vw', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="sheet__head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              background: 'var(--ember-soft)',
              color: 'var(--ember-deep)',
              padding: '0.4rem',
              borderRadius: '10px'
            }}>
              <PenTool size={22} />
            </div>
            <div>
              <h2 className="sheet__title">Catálogo de Formas para Rotulador</h2>
              <p className="sheet__sub">
                50 formas y figuras para programar el trazo de TaleBot con el marcador
              </p>
            </div>
          </div>
          <button className="btn btn--quiet btn--icon" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div style={{
          padding: '0.75rem 1.25rem',
          borderBottom: '1px solid var(--line)',
          background: '#FAF7F2',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem'
        }}>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            {/* Buscador */}
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--tx-3)' }} />
              <input
                className="input input--sm"
                style={{ paddingLeft: '2.1rem' }}
                type="text"
                placeholder="Buscar por nombre (ej: Cuadrado, Letra L, Sol)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Generador Rápido de Cuadernillo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#FFFFFF', padding: '0.25rem 0.5rem', borderRadius: '8px', border: '1px solid var(--line-2)' }}>
              <span className="t-eyebrow" style={{ fontSize: '0.65rem' }}>Generar cuadernillo:</span>
              <select
                className="select select--sm"
                style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                value={folioCount}
                onChange={(e) => setFolioCount(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'folio (2 retos)' : 'folios (' + (n*2) + ' retos)'}</option>
                ))}
              </select>
              <button
                className="btn btn--accent btn--sm"
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                onClick={handleGenerateWorksheets}
              >
                <Wand2 size={13} /> Crear folios
              </button>
            </div>
          </div>

          {/* Filtro por Categorías */}
          <div className="seg" role="group" aria-label="Categoría de formas" style={{ alignSelf: 'flex-start' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className="seg__opt"
                data-on={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Formas (50 elementos) */}
        <div className="sheet__body" style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem' }}>
          {filteredShapes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--tx-3)' }}>
              No se encontraron formas para "{searchQuery}".
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '0.75rem'
            }}>
              {filteredShapes.map((shape) => (
                <div
                  key={shape.id}
                  className="card"
                  style={{
                    padding: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                    border: '1.5px solid var(--line)',
                    background: '#FFFFFF'
                  }}
                  onClick={() => {
                    onSelectShape(shape);
                    onClose();
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span className="badge" style={{ fontSize: '0.62rem', background: '#F2EBE1', color: '#1A1410' }}>
                        {shape.category}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontFamily: "'JetBrains Mono', monospace", color: 'var(--tx-3)' }}>
                        {shape.commands ? shape.commands.length : 0} pasos
                      </span>
                    </div>

                    <h4 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '0.95rem', fontWeight: 700, margin: '4px 0 2px', color: '#1A1410' }}>
                      {shape.name}
                    </h4>

                    <p style={{ fontSize: '0.75rem', color: 'var(--tx-2)', lineHeight: 1.25, margin: 0 }}>
                      {shape.description}
                    </p>
                  </div>

                  <button
                    className="btn btn--quiet btn--sm"
                    style={{ marginTop: '0.6rem', width: '100%', justifyContent: 'center' }}
                  >
                    <PenTool size={13} /> Cargar en lienzo
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
