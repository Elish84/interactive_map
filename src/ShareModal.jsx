import React, { useState } from 'react';
import { X, Copy, Check, Download, Share2 } from 'lucide-react';
import { toPng } from 'html-to-image';

const ShareModal = ({ userId, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const shareUrl = `${window.location.origin}/?map=${userId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = async () => {
    try {
      setDownloading(true);
      // We will capture the whole map container
      const mapElement = document.querySelector('.map-container');
      
      // Temporarily hide UI elements we don't want in the screenshot
      const legend = document.querySelector('.legend-panel');
      const zoomControls = document.querySelector('.zoom-controls');
      const shareBtn = document.querySelector('.share-button'); // if we add a dedicated one
      
      if (legend) legend.style.display = 'none';
      if (zoomControls) zoomControls.style.display = 'none';
      if (shareBtn) shareBtn.style.display = 'none';

      // Small delay to ensure DOM updates
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toPng(mapElement, {
        quality: 0.95,
        backgroundColor: '#0a0a0a', // same as map default
        pixelRatio: 2 // high res
      });

      // Restore UI elements
      if (legend) legend.style.display = '';
      if (zoomControls) zoomControls.style.display = 'flex';
      if (shareBtn) shareBtn.style.display = '';

      // Trigger download
      const link = document.createElement('a');
      link.download = 'my-trip-map.png';
      link.href = dataUrl;
      link.click();
      
    } catch (err) {
      console.error('Error generating image', err);
      alert('שגיאה ביצירת התמונה, אנא נסה שוב.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} dir="rtl">
      <div className="modal-content glass" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2><Share2 size={24} style={{ verticalAlign: 'middle', marginLeft: '8px' }}/> שתף מפה</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
          
          <div className="glass" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>שתף קישור ציבורי</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
              קישור לקריאה בלבד. חברים יוכלו לראות את המפה ולהיכנס לפרטי הטיולים, אך לא יוכלו לערוך אותה.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                readOnly 
                value={shareUrl} 
                style={{ 
                  flex: 1, padding: '10px', borderRadius: '6px', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  background: 'rgba(0,0,0,0.3)', color: '#fff',
                  direction: 'ltr', textAlign: 'left'
                }}
              />
              <button 
                onClick={handleCopy}
                style={{ 
                  padding: '10px 14px', borderRadius: '6px', border: 'none', 
                  background: copied ? 'var(--color-me)' : 'rgba(255,255,255,0.2)', 
                  color: copied ? '#000' : '#fff', cursor: 'pointer', transition: '0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            — או —
          </div>

          <div className="glass" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>הורד כתמונה</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
              קבל תמונה איכותית של המפה בדיוק כפי שהיא מוצגת כרגע, מושלם לשליחה מהירה בוואטסאפ או אינסטגרם.
            </p>
            <button 
              onClick={handleDownloadImage}
              disabled={downloading}
              style={{ 
                width: '100%', padding: '12px', borderRadius: '8px', border: 'none', 
                background: 'rgba(0, 210, 255, 0.2)', color: '#00d2ff', 
                fontWeight: 'bold', cursor: downloading ? 'wait' : 'pointer', transition: '0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              {downloading ? 'מייצר תמונה...' : <><Download size={18} /> שמוֹר כתמונה</>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShareModal;
