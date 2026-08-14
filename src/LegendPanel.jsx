import React, { useState } from 'react';
import { Globe, Plus, Pencil, Trash2, Menu, X, Settings, LogOut, Share2 } from 'lucide-react';

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
  onOpenShare,
  user,
  onLogout,
  isPublicView
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
            {!isPublicView && (
              <>
                <button className="icon-button" onClick={onOpenShare} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <Share2 size={24} />
                </button>
                <button className="icon-button" onClick={onOpenSettings} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <Settings size={24} />
                </button>
              </>
            )}
            <button className="mobile-legend-close icon-button" onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <h3>קטגוריות מפה</h3>
          {!isPublicView && (
            <button onClick={onAddCategory} className="icon-button" style={{ background: 'none', border: 'none', color: 'var(--color-me)', cursor: 'pointer' }}>
              <Plus size={24} />
            </button>
          )}
        </div>

        {filterCategories.length > 0 && (
          <button 
            onClick={clearFilters}
            style={{ 
              width: '100%', padding: '6px', marginBottom: '12px', background: 'rgba(255,50,50,0.1)', 
              color: '#ff6b6b', border: '1px solid rgba(255,50,50,0.2)', borderRadius: '6px', cursor: 'pointer' 
            }}
          >
            נקה סינון קטגוריות
          </button>
        )}

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
                {!isPublicView && (
                  <div className="category-actions">
                    <button onClick={() => onEditCategory(cat)} className="icon-button" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Pencil size={14}/></button>
                    <button onClick={() => onDeleteCategory(cat.id)} className="icon-button" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Trash2 size={14}/></button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && !isPublicView && (
          <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            אין עדיין קטגוריות מטיילים.<br/> לחץ על ה- <Plus size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> כדי להתחיל.
          </div>
        )}
        
        {user && (
          <div className="profile-section" style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user.photoURL && <img src={user.photoURL} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />}
              <div style={{ fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 'bold' }}>{user.displayName}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>מחובר</div>
              </div>
            </div>
            <button onClick={onLogout} title="התנתק" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default LegendPanel;
