import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const PALETTE = [
  '#00d2ff', '#ff007f', '#8a2be2', '#ffb700', 
  '#00ff88', '#ff3333', '#3366ff', '#ff00ff'
];

const CategoryModal = ({ initialCategory, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PALETTE[0]);

  useEffect(() => {
    if (initialCategory) {
      setName(initialCategory.label);
      setColor(initialCategory.color);
    } else {
      setName('');
      setColor(PALETTE[0]);
    }
  }, [initialCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: initialCategory ? initialCategory.id : 'cat_' + Date.now(),
      label: name.trim(),
      color: color
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} dir="rtl">
      <div className="modal-content glass" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialCategory ? 'עריכת קטגוריה' : 'קטגוריה חדשה'}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>שם הקטגוריה (לדוגמה: אלי, טיול 2023)</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem' }}
              placeholder="שם הקטגוריה..."
              autoFocus
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>בחר צבע</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {PALETTE.map(c => (
                <div 
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', backgroundColor: c, 
                    cursor: 'pointer', border: color === c ? '2px solid white' : '2px solid transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {color === c && <Check size={16} color="#000" />}
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>צבע מותאם אישית:</span>
              <input 
                type="color" 
                value={color} 
                onChange={e => setColor(e.target.value)} 
                style={{ cursor: 'pointer', background: 'none', border: 'none', width: '32px', height: '32px' }}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={!name.trim()}
            style={{ 
              marginTop: '12px', padding: '14px', borderRadius: '8px', border: 'none', 
              background: name.trim() ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.02)', 
              color: name.trim() ? 'white' : 'var(--text-muted)', 
              fontWeight: 'bold', cursor: name.trim() ? 'pointer' : 'not-allowed', transition: 'background 0.2s'
            }}
          >
            {initialCategory ? 'שמור שינויים' : 'הוסף קטגוריה'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
