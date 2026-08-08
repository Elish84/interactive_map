import React from 'react';
import { Globe, Plus, Pencil, Trash2 } from 'lucide-react';

const LegendPanel = ({ visitedCountries, filterCategories, toggleFilterCategory, clearFilters, categories, onAddCategory, onEditCategory, onDeleteCategory, user, onLogout }) => {
  const counts = { total: 0 };
  categories.forEach(c => counts[c.id] = 0);

  // A country counts towards 'total' once.
  // A category counts if it has at least one visit in any country.
  Object.values(visitedCountries).forEach(visits => {
    if (visits.length > 0) counts.total++;
    
    // Track which categories this country has been visited under
    const catsInCountry = new Set(visits.map(v => v.categoryId));
    catsInCountry.forEach(catId => {
      if (counts[catId] !== undefined) {
        counts[catId]++;
      }
    });
  });

  return (
    <div className="legend-panel glass" style={{ padding: '16px 20px', width: '340px', maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.2rem' }}>מפת הטיולים שלנו</h1>
        </div>
        <button 
          onClick={onAddCategory}
          style={{ 
            background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', 
            borderRadius: '50%', width: '36px', height: '36px', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          title="הוסף קטגוריה חדשה"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="category-list">
        <div 
          className={`category-item ${filterCategories.length === 0 ? 'active' : ''}`}
          onClick={clearFilters}
        >
          <div className="category-label">
            <Globe size={18} color="#fff" />
            הצג הכל
          </div>
          <span className="category-count">{counts.total}</span>
        </div>
        
        {categories.map(cat => {
          const isActive = filterCategories.includes(cat.id);
          return (
            <div 
              key={cat.id}
              className={`category-item ${isActive ? 'active' : ''}`}
              onClick={() => toggleFilterCategory(cat.id)}
              style={{ position: 'relative' }}
            >
              <div className="category-label">
                <div style={{ 
                  width: '16px', height: '16px', borderRadius: '4px', 
                  backgroundColor: isActive ? cat.color : 'transparent',
                  border: `2px solid ${cat.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}></div>
                {cat.label}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="category-count">{counts[cat.id]}</span>
                
                <div className="category-actions" style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => onEditCategory(cat)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }} title="ערוך">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => onDeleteCategory(cat.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '4px' }} title="מחק">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {categories.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
          אין עדיין קטגוריות מטיילים.<br/> לחץ על ה- <Plus size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> כדי להתחיל.
        </div>
      )}
      
      {user && (
        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={user.photoURL} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
            <span style={{ fontSize: '0.9rem' }}>{user.displayName}</span>
          </div>
          <button onClick={onLogout} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>התנתק</button>
        </div>
      )}
    </div>
  );
};

export default LegendPanel;
