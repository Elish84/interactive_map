import React, { useState, useEffect } from 'react';
import WorldMap from './WorldMap';
import LegendPanel from './LegendPanel';
import CountryModal from './CountryModal';
import CategoryModal from './CategoryModal';
import './index.css';

import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [visitedCountries, setVisitedCountries] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filterCategories, setFilterCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setCategories(data.categories || []);
            setVisitedCountries(data.visitedCountries || {});
          } else {
            // First time login - try to migrate local storage
            let localCategories = [];
            let localVisits = {};
            const savedCats = localStorage.getItem('tripMapCategories');
            if (savedCats) localCategories = JSON.parse(savedCats);
            
            const savedMap = localStorage.getItem('tripMapData');
            if (savedMap) {
              const parsed = JSON.parse(savedMap);
              // Run the same migration from v2 to v3 if needed
              for (const geoId in parsed) {
                if (typeof parsed[geoId] === 'string') {
                  localVisits[geoId] = [{
                    id: 'v_' + Math.random().toString(36).substr(2, 9),
                    categoryId: parsed[geoId],
                    date: '', region: '', purpose: '', markers: []
                  }];
                } else {
                  localVisits[geoId] = parsed[geoId];
                }
              }
            }

            setCategories(localCategories);
            setVisitedCountries(localVisits);
            
            // Save to Firestore
            await setDoc(doc(db, 'users', currentUser.uid), {
              categories: localCategories,
              visitedCountries: localVisits
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          alert('שגיאה בטעינת הנתונים מהענן.');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveToCloud = async (newCats, newVisits) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), {
        categories: newCats,
        visitedCountries: newVisits
      });
    } catch (e) {
      console.error("Error saving to cloud", e);
      alert("שגיאה בשמירת נתונים בענן - ודא שיש הרשאות כתיבה ב-Firestore.");
    }
  };

  const handleUpdateVisits = (geoId, visits) => {
    const updated = { ...visitedCountries };
    if (visits.length === 0) {
      delete updated[geoId];
    } else {
      updated[geoId] = visits;
    }
    setVisitedCountries(updated);
    saveToCloud(categories, updated);
  };

  const handleSaveCategory = (catData) => {
    let updatedCats;
    if (categories.find(c => c.id === catData.id)) {
      updatedCats = categories.map(c => c.id === catData.id ? catData : c);
    } else {
      updatedCats = [...categories, catData];
    }
    setCategories(updatedCats);
    saveToCloud(updatedCats, visitedCountries);
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (catId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק קטגוריה זו? כל הביקורים הקשורים לקטגוריה זו יימחקו מכל המדינות!')) return;
    
    const updatedCats = categories.filter(c => c.id !== catId);
    
    const updatedMap = { ...visitedCountries };
    Object.keys(updatedMap).forEach(key => {
      const filteredVisits = updatedMap[key].filter(v => v.categoryId !== catId);
      if (filteredVisits.length === 0) {
        delete updatedMap[key];
      } else {
        updatedMap[key] = filteredVisits;
      }
    });
    
    setCategories(updatedCats);
    setVisitedCountries(updatedMap);
    saveToCloud(updatedCats, updatedMap);
    
    if (filterCategories.includes(catId)) {
      setFilterCategories(filterCategories.filter(id => id !== catId));
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
      alert('ההתחברות נכשלה: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCategories([]);
      setVisitedCountries([]);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const toggleFilterCategory = (catId) => {
    setFilterCategories(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const clearFilters = () => setFilterCategories([]);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-gradient)' }}>
        <h2 style={{ color: 'white' }}>טוען נתונים מהענן...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-gradient)', color: 'white' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>מפת הטיולים שלנו</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '40px', opacity: 0.9 }}>יומן מסעות חכם, צבעוני ומגובה בענן.</p>
        <button 
          onClick={handleLogin}
          style={{ padding: '14px 28px', fontSize: '1.1rem', borderRadius: '30px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', background: 'white', color: '#333', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" style={{ width: '24px' }} />
          התחבר עם חשבון Google
        </button>
      </div>
    );
  }

  return (
    <div className="map-container" dir="rtl">
      <WorldMap 
        visitedCountries={visitedCountries}
        onCountryClick={setSelectedCountry}
        filterCategories={filterCategories}
        categories={categories}
      />
      <LegendPanel 
        visitedCountries={visitedCountries}
        filterCategories={filterCategories}
        toggleFilterCategory={toggleFilterCategory}
        clearFilters={clearFilters}
        categories={categories}
        onAddCategory={() => {
          setEditingCategory(null);
          setIsCategoryModalOpen(true);
        }}
        onEditCategory={(cat) => {
          setEditingCategory(cat);
          setIsCategoryModalOpen(true);
        }}
        onDeleteCategory={handleDeleteCategory}
        user={user}
        onLogout={handleLogout}
      />
      
      {selectedCountry && (
        <CountryModal 
          country={selectedCountry}
          visits={visitedCountries[selectedCountry.id] || []}
          onSave={(visits) => handleUpdateVisits(selectedCountry.id, visits)}
          onClose={() => setSelectedCountry(null)}
          categories={categories}
        />
      )}
      
      {isCategoryModalOpen && (
        <CategoryModal 
          initialCategory={editingCategory}
          onSave={handleSaveCategory}
          onClose={() => {
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
};

export default App;
