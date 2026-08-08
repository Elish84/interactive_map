import React, { useState } from 'react';
import { X, Plus, Trash2, MapPin, Search, Pencil } from 'lucide-react';

const VisitForm = ({ initialData, categories, onSave, onCancel }) => {
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || (categories[0] ? categories[0].id : ''));
  const [date, setDate] = useState(initialData?.date || '');
  const [region, setRegion] = useState(initialData?.region || '');
  const [purpose, setPurpose] = useState(initialData?.purpose || '');
  const [markers, setMarkers] = useState(initialData?.markers || []);
  
  const [markerInput, setMarkerInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleAddMarker = async () => {
    if (!markerInput.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(markerInput)}&format=json&limit=1`, {
        headers: { 'Accept-Language': 'he,en' }
      });
      const data = await res.json();
      if (data && data.length > 0) {
        setMarkers([...markers, {
          name: data[0].name || markerInput,
          coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
        }]);
        setMarkerInput('');
      } else {
        alert('לא מצאנו מיקום כזה, נסה לשנות את החיפוש (למשל לרשום את העיר באנגלית).');
      }
    } catch (e) {
      console.error(e);
      alert('שגיאה בחיפוש המיקום.');
    }
    setIsSearching(false);
  };

  return (
    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', marginTop: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>קטגוריה:</label>
          <select 
            value={categoryId} 
            onChange={e => setCategoryId(e.target.value)}
            style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px' }}
          >
            {categories.map(c => <option key={c.id} value={c.id} style={{ color: 'black' }}>{c.label}</option>)}
          </select>
        </div>
        
        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>מתי (כתיבה חופשית):</label>
          <input type="text" value={date} onChange={e => setDate(e.target.value)} placeholder="לדוגמה: קיץ 2023" style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px' }} />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>אזור:</label>
          <input type="text" value={region} onChange={e => setRegion(e.target.value)} placeholder="לדוגמה: החוף המערבי" style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px' }} />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>מהות הטיול:</label>
          <input type="text" value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="לדוגמה: ירח דבש" style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px' }} />
        </div>

        <div style={{ marginTop: '8px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>נקודות ציון על המפה:</label>
          {markers.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '6px 8px', borderRadius: '4px', marginBottom: '4px', fontSize: '0.9rem' }}>
              <span><MapPin size={12} style={{ display: 'inline', marginLeft: '4px', verticalAlign: 'middle' }}/> {m.name}</span>
              <button onClick={() => setMarkers(markers.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '2px' }}><X size={14}/></button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input type="text" value={markerInput} onChange={e => setMarkerInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddMarker()} placeholder="הוסף עיר/אזור (לחפש)..." style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px' }} />
            <button onClick={handleAddMarker} disabled={isSearching || !markerInput.trim()} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '4px', color: 'white', cursor: (isSearching || !markerInput.trim()) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isSearching ? '...' : <Search size={16} />}
            </button>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
        <button onClick={() => onSave({ categoryId, date, region, purpose, markers })} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>שמור ביקור</button>
        <button onClick={onCancel} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>ביטול</button>
      </div>
    </div>
  );
};

const CountryModal = ({ country, visits, onSave, onClose, categories }) => {
  const [editingVisit, setEditingVisit] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSaveVisit = (visitData) => {
    let newVisits;
    if (editingVisit) {
      newVisits = visits.map(v => v.id === editingVisit.id ? { ...visitData, id: v.id } : v);
    } else {
      newVisits = [...visits, { ...visitData, id: 'v_' + Date.now() }];
    }
    onSave(newVisits);
    setEditingVisit(null);
    setIsAdding(false);
  };

  const handleDeleteVisit = (id) => {
    if (window.confirm('למחוק ביקור זה?')) {
      onSave(visits.filter(v => v.id !== id));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} dir="rtl">
      <div className="modal-content glass" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header" style={{ marginBottom: '16px' }}>
          <h2>{country.name}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        {(!isAdding && !editingVisit) ? (
          <div>
            {visits.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>
                עדיין לא נרשמו ביקורים במדינה זו.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {visits.map(visit => {
                  const cat = categories.find(c => c.id === visit.categoryId);
                  const color = cat ? cat.color : '#fff';
                  
                  return (
                    <div key={visit.id} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderRight: `4px solid ${color}`, position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: 'bold', color }}>{cat ? cat.label : 'קטגוריה נמחקה'}</div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setEditingVisit(visit)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Pencil size={14}/></button>
                          <button onClick={() => handleDeleteVisit(visit.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}><Trash2 size={14}/></button>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.9rem', marginTop: '8px', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {visit.date && <div><span style={{ color: 'var(--text-muted)' }}>מתי:</span> {visit.date}</div>}
                        {visit.region && <div><span style={{ color: 'var(--text-muted)' }}>אזור:</span> {visit.region}</div>}
                        {visit.purpose && <div><span style={{ color: 'var(--text-muted)' }}>מהות:</span> {visit.purpose}</div>}
                        {visit.markers && visit.markers.length > 0 && (
                          <div style={{ marginTop: '4px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>נקודות:</span> {visit.markers.map(m => m.name).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {categories.length > 0 ? (
              <button 
                onClick={() => setIsAdding(true)} 
                style={{ width: '100%', marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px dashed rgba(255,255,255,0.3)', borderRadius: '8px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Plus size={18} /> הוסף ביקור במדינה זו
              </button>
            ) : (
              <div style={{ textAlign: 'center', marginTop: '20px', color: '#ffaa00' }}>
                יש ליצור לפחות קטגוריה אחת במקרא כדי להוסיף ביקור.
              </div>
            )}
          </div>
        ) : (
          <VisitForm 
            initialData={editingVisit} 
            categories={categories} 
            onSave={handleSaveVisit} 
            onCancel={() => { setIsAdding(false); setEditingVisit(null); }} 
          />
        )}
      </div>
    </div>
  );
};

export default CountryModal;
