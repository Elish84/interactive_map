import React, { useState } from 'react';
import { Globe, Plus, Pencil, Trash2, Menu, X, Settings, LogOut } from 'lucide-react';

const LegendPanel = ({ 
  visitedCountries, 
  filterCategories, 
  toggleFilterCategory, 
  clearFilters, 
  categories, 
  onAddCategory, 
  onEditCategory, 
  onDeleteCategory, 
  onOpenSettings,
  user,
  onLogout
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const counts = { total: 0 };
  categories.forEach(c => counts[c.id] = 0);

  Object.values(visitedCountries).forEach(visits => {
    const uniqueCats = new Set(visits.map(v => v.categoryId));
    uniqueCats.forEach(catId => {
      if (counts[catId] !== undefined) {
        counts[catId]++;
        counts.total++;
      }
    });
  });

  return (
    <>
      <button 
        className="mobile-legend-toggle glass" 
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} />
      </button>

      <div className={`legend-panel glass ${isOpen ? 'open' : ''}`}>
        <div className="legend-header-wrapper">
          <div>
            <h1>TripMap <Globe size={24} style={{ display: 'inline', verticalAlign: 'middle', color: '#b8c1ec' }}/></h1>
            <p>סה"כ מדינות מתוייגות: {Object.keys(visitedCountries).length}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="icon-button" onClick={onOpenSettings} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <Settings size={24} />
            </button>
            <button className="mobile-legend-close icon-button" onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#e0e0e0' }}>קטגוריות</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {filterCategories.length > 0 && (
              <button 
                onClick={clearFilters}
                style={{ background: 'none', border: 'none', color: '#ffb700', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                נקה סינון
              </button>
            )}
            <button 
              onClick={onAddCategory}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              title="הוסף קטגוריה חדשה"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="category-list">
          {categories.map(cat => (
            <div 
              key={cat.id} 
              className={`category-item ${filterCategories.includes(cat.id) ? 'active' : ''}`}
            >
              <div 
                className="category-label" 
                onClick={() => toggleFilterCategory(cat.id)} 
                style={{ flex: 1 }}
              >
                <div className="color-dot" style={{ backgroundColor: cat.color }}></div>
                <span>{cat.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="category-count">{counts[cat.id]}</span>
                <button onClick={() => onEditCategory(cat)} className="icon-button" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Pencil size={14}/></button>
                <button onClick={() => onDeleteCategory(cat.id)} className="icon-button" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
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
              <span style={{ fontSize: '0.9rem', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.displayName}</span>
            </div>
            <button onClick={onLogout} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>התנתק</button>
          </div>
        )}
      </div>
    </>
  );
};

export default LegendPanel;
