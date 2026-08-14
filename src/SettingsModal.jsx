import React from 'react';
import { X } from 'lucide-react';

const SettingsModal = ({ settings, onSave, onClose }) => {
  const [localSettings, setLocalSettings] = React.useState(settings);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(localSettings);
  };

  return (
    <div className="modal-overlay" onClick={onClose} dir="rtl">
      <div className="modal-content glass" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>הגדרות מפה</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <div>
              <div style={{ fontWeight: '600' }}>מילוי מדינות מתוייגות</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>הצג או הסתר את הצבע שממלא את שטחי המדינות בהן ביקרת.</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px' }}>
              <input 
                type="checkbox" 
                checked={localSettings.showCountryFills}
                onChange={e => setLocalSettings({...localSettings, showCountryFills: e.target.checked})}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{ 
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                backgroundColor: localSettings.showCountryFills ? 'var(--color-me)' : '#444', 
                transition: '.4s', borderRadius: '34px'
              }}>
                <span style={{
                  position: 'absolute', content: '""', height: '18px', width: '18px', 
                  left: localSettings.showCountryFills ? '4px' : '26px', bottom: '4px', 
                  backgroundColor: 'white', transition: '.4s', borderRadius: '50%'
                }} />
              </span>
            </label>
          </div>

          <div style={{ opacity: localSettings.showCountryFills ? 1 : 0.4, pointerEvents: localSettings.showCountryFills ? 'auto' : 'none', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontWeight: '600' }}>רמת שקיפות למילוי</span>
              <span style={{ fontWeight: 'bold', color: 'var(--color-me)' }}>{Math.round(localSettings.countryFillOpacity * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="1" 
              step="0.05"
              value={localSettings.countryFillOpacity}
              onChange={e => setLocalSettings({...localSettings, countryFillOpacity: parseFloat(e.target.value)})}
              style={{ width: '100%', accentColor: 'var(--color-me)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              <span>שקוף מאוד</span>
              <span>אטום לחלוטין</span>
            </div>
          </div>
          
          <button 
            type="submit" 
            style={{ 
              marginTop: '12px', padding: '14px', borderRadius: '8px', border: 'none', 
              background: 'rgba(255,255,255,0.1)', color: 'white', 
              fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            שמור הגדרות
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
