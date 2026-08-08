import React, { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import { Plus, Minus, MapPin } from 'lucide-react';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-50m.json";
const usUrl = "https://unpkg.com/us-atlas@3/states-10m.json";

const WorldMap = ({ visitedCountries, onCountryClick, filterCategories, categories }) => {
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  const handleZoomIn = () => {
    setPosition(pos => ({ ...pos, zoom: Math.min(pos.zoom * 1.5, 16) }));
  };

  const handleZoomOut = () => {
    setPosition(pos => ({ ...pos, zoom: Math.max(pos.zoom / 1.5, 1) }));
  };

  const handleMoveEnd = (newPosition) => {
    setPosition(newPosition);
  };

  // Generate SVG patterns for multiple categories
  const patterns = useMemo(() => {
    const combs = new Set();
    Object.values(visitedCountries).forEach(visits => {
      let catIds = Array.from(new Set(visits.map(v => v.categoryId)));
      if (filterCategories.length > 0) {
        catIds = catIds.filter(id => filterCategories.includes(id));
      }
      if (catIds.length > 1) {
        catIds.sort();
        combs.add(catIds.join(','));
      }
    });

    const defs = [];
    combs.forEach(comb => {
      const ids = comb.split(',');
      const combColors = ids.map(id => categories.find(c => c.id === id)?.color || '#fff');
      const width = 3; // Thinner lines
      defs.push(
        <pattern key={comb} id={`pattern-${comb.replace(/,/g, '-')}`} width={width * combColors.length} height={width * combColors.length} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          {combColors.map((color, i) => (
            <rect key={i} x={i * width} y="0" width={width} height={width * combColors.length} fill={color} />
          ))}
        </pattern>
      );
    });
    return defs;
  }, [visitedCountries, filterCategories, categories]);

  // Extract markers
  const markersToRender = useMemo(() => {
    const result = [];
    Object.keys(visitedCountries).forEach(geoId => {
      const visits = visitedCountries[geoId];
      visits.forEach(v => {
        if (filterCategories.length === 0 || filterCategories.includes(v.categoryId)) {
          if (v.markers) {
            v.markers.forEach((m, idx) => {
              const cat = categories.find(c => c.id === v.categoryId);
              result.push({ ...m, color: cat ? cat.color : '#fff', visitId: v.id, idx });
            });
          }
        }
      });
    });
    return result;
  }, [visitedCountries, filterCategories, categories]);

  const renderGeography = (geo, isUsState = false) => {
    const geoId = isUsState ? `us-${geo.id}` : geo.id;
    const visits = visitedCountries[geoId] || [];
    
    let activeCats = Array.from(new Set(visits.map(v => v.categoryId)));
    if (filterCategories.length > 0) {
      activeCats = activeCats.filter(id => filterCategories.includes(id));
    }

    let fill = 'var(--map-default)';
    if (activeCats.length === 1) {
      fill = categories.find(c => c.id === activeCats[0])?.color || 'var(--map-default)';
    } else if (activeCats.length > 1) {
      activeCats.sort();
      fill = `url(#pattern-${activeCats.join('-')})`;
    }

    const displayName = isUsState ? `${geo.properties.name} (ארה"ב)` : geo.properties.name;
    const isFilteredOut = visits.length > 0 && activeCats.length === 0; // has visits but none match filter
    if (isFilteredOut) {
      fill = 'var(--map-default)';
    }

    return (
      <Geography
        key={geo.rsmKey || geoId}
        geography={geo}
        fill={fill}
        stroke="var(--map-stroke)"
        strokeWidth={0.5 / position.zoom}
        onClick={() => onCountryClick({ id: geoId, name: displayName })}
        onMouseEnter={(e) => {
          setTooltipContent({ name: displayName, visits: visits });
          setTooltipPos({ x: e.clientX, y: e.clientY });
        }}
        onMouseMove={(e) => {
          setTooltipPos({ x: e.clientX, y: e.clientY });
        }}
        onMouseLeave={() => {
          setTooltipContent(null);
        }}
        style={{
          default: { outline: 'none', transition: 'fill 250ms' },
          hover: { fill: (activeCats.length > 0 && !isFilteredOut) ? fill : 'var(--map-hover)', outline: 'none', filter: 'brightness(1.2)', cursor: 'pointer' },
          pressed: { outline: 'none' },
        }}
      />
    );
  };

  return (
    <>
      <ComposableMap projectionConfig={{ scale: 140 }} style={{ width: '100%', height: '100%', outline: 'none' }}>
        <defs>
          {patterns}
        </defs>
        <ZoomableGroup 
          zoom={position.zoom} 
          center={position.coordinates} 
          onMoveEnd={handleMoveEnd} 
          minZoom={1} 
          maxZoom={16}
        >
          {/* World Map */}
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies
                .filter(geo => geo.id !== '840')
                .map(geo => renderGeography(geo, false))
            }
          </Geographies>

          {/* US States Map */}
          <Geographies geography={usUrl}>
            {({ geographies }) =>
              geographies.map(geo => renderGeography(geo, true))
            }
          </Geographies>
          
          {/* Markers */}
          {markersToRender.map((m) => (
            <Marker key={`${m.visitId}-${m.idx}`} coordinates={m.coordinates}>
              <circle 
                r={3 / position.zoom} 
                fill={m.color} 
                stroke="#111" 
                strokeWidth={1 / position.zoom} 
              />
              {position.zoom > 2.5 && (
                <text 
                  textAnchor="middle" 
                  y={-(6 / position.zoom)} 
                  style={{ 
                    fill: '#fff', 
                    fontSize: `${10 / position.zoom}px`, 
                    fontWeight: 'bold',
                  }}
                  stroke="#000"
                  strokeWidth={2 / position.zoom}
                  strokeLinejoin="round"
                  paintOrder="stroke fill"
                >
                  {m.name}
                </text>
              )}
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
      
      {/* Zoom Controls */}
      <div className="zoom-controls glass" style={{ position: 'absolute', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px', zIndex: 10 }}>
        <button onClick={handleZoomIn} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
          <Plus size={20} />
        </button>
        <button onClick={handleZoomOut} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
          <Minus size={20} />
        </button>
      </div>

      {tooltipContent && (
        <div 
          className="map-tooltip glass"
          style={{ 
            left: tooltipPos.x, top: tooltipPos.y, 
            transform: 'translate(-50%, -100%)', 
            marginTop: '-15px', pointerEvents: 'none',
            maxWidth: '300px', whiteSpace: 'normal',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.15)'
          }}
        >
          <div style={{ fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '8px' }}>
            {tooltipContent.name}
          </div>
          {tooltipContent.visits.length === 0 ? (
            <div style={{ color: 'var(--text-muted)' }}>לא סומן</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tooltipContent.visits.map(v => {
                const cat = categories.find(c => c.id === v.categoryId);
                if (!cat) return null;
                // apply filter in tooltip? optionally, but good to see all visits for context
                return (
                  <div key={v.id} style={{ fontSize: '0.85rem', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px', borderLeft: `3px solid ${cat.color}` }}>
                    <div style={{ color: cat.color, fontWeight: 'bold', fontSize: '0.8rem' }}>{cat.label}</div>
                    {v.date && <div>מתי: {v.date}</div>}
                    {v.region && <div>אזור: {v.region}</div>}
                    {v.purpose && <div>מהות: {v.purpose}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default WorldMap;
