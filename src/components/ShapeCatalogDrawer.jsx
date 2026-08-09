import React, { useState } from 'react';
import { SHAPE_PRESETS } from '../utils/talebotEngine';
import { PenTool, Search, Sparkles } from 'lucide-react';

export default function ShapeCatalogDrawer({ onSelectShape }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', 'Figuras', 'Letras', 'Números', 'Dibujos'];

  const filteredShapes = SHAPE_PRESETS.filter((shape) => {
    const matchesCategory = selectedCategory === 'Todos' || shape.category === selectedCategory;
    const matchesSearch = shape.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          shape.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="tb-card" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.8rem',
      width: '100%',
      maxHeight: '480px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '2px dashed #E2E8F0', paddingBottom: '0.5rem' }}>
        <PenTool size={20} color="#FF6900" />
        <h3 style={{ fontFamily: 'Fredoka', fontSize: '1.1rem', color: '#0F172A' }}>
          Catálogo de Formas y Trazados ({filteredShapes.length})
        </h3>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar formas, letras o números..."
          style={{
            width: '100%',
            padding: '0.5rem 0.6rem 0.5rem 2.2rem',
            borderRadius: '12px',
            border: '1.5px solid #CBD5E1',
            fontFamily: 'Nunito',
            fontSize: '0.85rem'
          }}
        />
      </div>

      {/* Category Pill Tabs */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.3rem 0.7rem',
              borderRadius: '20px',
              border: 'none',
              fontFamily: 'Fredoka',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: selectedCategory === cat ? '#FF6900' : '#F1F5F9',
              color: selectedCategory === cat ? 'white' : '#64748B'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scrollable Shapes Cards Library */}
      <div style={{
        overflowY: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.5rem',
        paddingRight: '4px'
      }}>
        {filteredShapes.map((shape) => (
          <button
            key={shape.id}
            onClick={() => onSelectShape(shape)}
            style={{
              background: '#FFF7ED',
              border: '1.5px solid #FFEDD5',
              borderRadius: '12px',
              padding: '0.6rem',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#FF6900'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#FFEDD5'}
          >
            <div style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: '0.85rem', color: '#C2410C' }}>
              {shape.name}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#9A3412', marginTop: '2px', lineHeight: 1.2 }}>
              {shape.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
