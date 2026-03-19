import React, { useState, useEffect, useRef } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
  :root { 
    --bg: #030305; --cyan: #00f3ff; --pink: #ff00ff; --red: #ff4757; 
    --green: #32ff7e; --gold: #ffd700; --blue: #0077ff;
    --neon-flow: linear-gradient(90deg, #ff00ff, #00f3ff, #ff00ff, #00f3ff, #ff00ff);
  }
  * { box-sizing: border-box; transition: background 0.3s ease, border 0.3s ease; outline: none; }
  body { margin: 0; background: var(--bg); font-family: 'Share Tech Mono', monospace; color: #fff; overflow-x: hidden; }

  /* --- Stable Breathing Animations (Independent of Re-renders) --- */
  @keyframes card-breathe-hot {
    0%, 100% { border-color: rgba(255, 71, 87, 0.3); box-shadow: 0 0 10px rgba(255, 71, 87, 0.2); }
    50% { border-color: var(--red); box-shadow: 0 0 25px var(--red), inset 0 0 10px rgba(255, 71, 87, 0.3); }
  }
  @keyframes card-breathe-reg {
    0%, 100% { border-color: rgba(0, 243, 255, 0.3); box-shadow: 0 0 10px rgba(0, 243, 255, 0.2); }
    50% { border-color: var(--cyan); box-shadow: 0 0 25px var(--cyan), inset 0 0 10px rgba(0, 243, 255, 0.3); }
  }

  /* --- Text Styling: Bold & White (No Glow/Blink) --- */
  .deal-card .title-plate { 
    color: #ffffff !important; 
    font-weight: 900 !important; 
    text-shadow: none !important; 
    animation: none !important;
  }

  .deal-card.card-glow-hot { animation: card-breathe-hot 4s infinite ease-in-out; border: 2px solid var(--red); }
  .deal-card.card-glow-reg { animation: card-breathe-reg 4s infinite ease-in-out; border: 2px solid var(--cyan); }

  /* Field Border Always White - No Text Glow */
  .field-hot, .field-reg { 
    border: 1.5px solid #fff !important; 
    color: #ffffff !important; 
    font-weight: 900 !important;
    text-shadow: none !important;
    box-shadow: none !important;
  }

  @keyframes btnPulse {
    0% { box-shadow: 0 0 5px currentColor; }
    50% { box-shadow: 0 0 20px currentColor; }
    100% { box-shadow: 0 0 5px currentColor; }
  }

  .fixed-top-zone { position: sticky; top: 0; z-index: 10000; background: var(--bg); padding-bottom: 5px; }
  .header-info-container { position: relative; width: 320px; margin: 0 auto; height: 20px; display: flex; align-items: center; justify-content: space-between; overflow: hidden; }
  .header-info-left { font-size: 8px; color: var(--cyan); text-transform: uppercase; width: 100px; text-align: left; white-space: nowrap; }
  .header-info-right { font-size: 8px; color: var(--gold); width: 100px; text-align: right; white-space: nowrap; }
  
  .cyber-toast { 
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    color: var(--cyan); font-size: 8px; font-weight: 900; text-transform: uppercase;
    white-space: nowrap; z-index: 10001; text-shadow: 0 0 5px var(--cyan);
  }

  .header-box { width: 280px; background: #0a0a0f; border: 1.5px solid #252535; border-radius: 15px; padding: 15px; text-align: center; position: relative; margin: 5px auto 10px auto; box-shadow: 0 0 30px rgba(0,0,0,1); }
  .header-box::after { content: ''; position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px; background: var(--neon-flow); background-size: 300%; border-radius: 16px; z-index: -1; animation: flow 3s linear infinite; }
  @keyframes flow { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
  .brand-name { font-size: 24px; font-weight: 900; color: #fff; letter-spacing: 3px; text-transform: uppercase; text-shadow: 0 0 10px var(--cyan); }
  
  .nv-bar { width: 95%; max-width: 450px; background: #000; border-radius: 50px; border: 1.5px solid #222; padding: 5px; display: flex; gap: 5px; margin: 0 auto 10px auto; }
  .nv-btn { flex: 1; height: 38px; border-radius: 25px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; cursor: pointer; color: #555; position: relative; }
  .nv-btn.active { border: 1px solid var(--cyan); color: var(--cyan); box-shadow: 0 0 15px var(--cyan); }
  .nv-btn.active-hot { border: 1px solid var(--red) !important; color: var(--red) !important; box-shadow: 0 0 15px var(--red) !important; }
  .nv-btn.active-fav { border: 1px solid var(--pink) !important; color: var(--pink) !important; box-shadow: 0 0 15px var(--pink) !important; }

  .badge { position: absolute; top: -5px; right: 5px; background: var(--red); color: #fff; font-size: 8px; padding: 2px 6px; border-radius: 10px; font-weight: 900; }

  .deal-card { width: 310px; background: #0d0d12; border-radius: 35px; padding: 65px 20px 15px 20px; margin: 20px auto; position: relative; }

  .title-plate { background: #000; padding: 10px; border-radius: 12px; font-size: 10px; text-align: center; line-height: 1.4; }

  .ring { width: 38px; height: 38px; border: 1.5px solid #222; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: absolute; top: 15px; background: #000; cursor: pointer; z-index: 10; }
  .card-timer-box { width: 100px; height: 20px; background: #000; border: 1px solid #222; border-radius: 6px; margin: 8px auto; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900; color: var(--cyan); }
  
  .price-row { display: flex; justify-content: center; align-items: center; gap: 12px; margin: 15px 0; }
  .mrp-cross { color: #666; text-decoration: line-through; text-decoration-color: var(--red); font-size: 16px; }
  .deal-price { font-size: 22px; font-weight: 900; color: #fff !important; }
  
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
  .info-cell { padding: 8px; border-radius: 8px; font-size: 9px; text-align: center; font-weight: 900; color: #fff !important; }

  .coupon-box { display: flex; background: #000; border-radius: 10px; margin-bottom: 10px; border: 1.2px dashed #444; overflow: hidden; height: 34px; align-items: center; }
  .coupon-text { flex: 1; font-size: 11px; color: var(--gold); text-align: center; letter-spacing: 1px; font-weight: 900; }
  .copy-btn { width: 50px; height: 100%; background: #222; color: var(--cyan); border: none; font-size: 9px; cursor: pointer; font-weight: 900; }

  .click-btn { 
    width: 100%; padding: 12px; border-radius: 25px; border: none; 
    background: linear-gradient(135deg, #fff 0%, #bbb 50%, #888 100%); 
    color: #000; font-weight: 900; font-size: 16px; cursor: pointer; 
    position: relative; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.5), inset 0 2px 5px #fff;
    text-transform: uppercase;
  }
  .click-btn::after {
    content: ''; position: absolute; top: -50%; left: -60%; width: 20%; height: 200%;
    background: rgba(255,255,255,0.6); transform: rotate(30deg);
    animation: shine-flow 3s infinite;
  }
  @keyframes shine-flow { 0% { left: -60%; } 100% { left: 130%; } }

  .stats-row { display: flex; justify-content: space-between; padding: 10px 5px 5px 5px; font-size: 10px; }
  .stat-item { display: flex; align-items: center; gap: 4px; font-weight: bold; }

  .timestamp-row { font-size: 8px; color: #666; text-align: center; margin-top: 8px; border-top: 1px solid #111; padding-top: 5px; }

  .neon-wrap { position: relative; padding: 2px; border-radius: 25px; margin: 15px auto; width: fit-content; }
  .at-card { width: 320px; background: #0a0a0f; border-radius: 25px; padding: 18px; border: 1.5px solid #252535; }
  
  .at-input, .at-select { 
    width: 100%; background: #000; border: 1.5px solid #222; padding: 10px; 
    color: #fff; border-radius: 10px; text-align: center; font-size: 12px; 
    margin-bottom: 8px;
  }
  .at-input:focus { border-color: var(--cyan); box-shadow: 0 0 10px var(--cyan); }

  .ctrl-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 5px 0; border-bottom: 1px solid #111; }
  .ctrl-label { font-size: 11px; color: #ccc; }

  .action-btn { 
    border-radius: 12px; font-weight: 900; text-transform: uppercase; 
    border: 1.5px solid; background: transparent; cursor: pointer; 
    padding: 8px; font-size: 9px; animation: btnPulse 3s infinite;
  }
  .btn-cyan { border-color: var(--cyan); color: var(--cyan); }
  .btn-red { border-color: var(--red); color: var(--red); }
  .btn-green { border-color: var(--green); color: var(--green); }
  .btn-gold { border-color: var(--gold); color: var(--gold); }
  .btn-white { border-color: #fff; color: #fff; }
  .btn-blue { border-color: var(--blue); color: var(--blue); }
  
  .tgl-bg { width: 44px; height: 20px; background: #111; border-radius: 20px; border: 1.5px solid #333; position: relative; cursor: pointer; }
  .tgl-ball { position: absolute; top: 2px; width: 12px; height: 12px; border-radius: 50%; transition: 0.3s; }
`;

export default function App() {
  // Persistence Logic: Load from LocalStorage
  const [view, setView] = useState(() => localStorage.getItem('DC_VIEW') || 'AUTH');
  const [curr, setCurr] = useState(() => JSON.parse(localStorage.getItem('DC_CURR') || 'null'));
  const [lastLogin, setLastLogin] = useState(() => localStorage.getItem('DC_LAST_LOGIN') || '');

  const [authMode, setAuthMode] = useState('Login');
  const [role, setRole] = useState('USER');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('SYSTEM ONLINE');
  const [toast, setToast] = useState('');
  const [countdown, setCountdown] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [forgotStep, setForgotStep] = useState(0);
  const [newPass, setNewPass] = useState({ p1: '', p2: '' });
  const [resetTargetId, setResetTargetId] = useState(null);
  const [btnToggle, setBtnToggle] = useState(true);

  const [saTab, setSaTab] = useState('HOME');
  const [adTab, setAdTab] = useState('PUBLISH');
  const [uTab, setUTab] = useState('Home');
  const [form, setForm] = useState({ title: '', mrp: '', price: '', store: 'Amazon', brand: '', coupon: '', url: '', isHot: false, id: null });

  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('DC_DB_U') || '[]'));
  const [deals, setDeals] = useState(() => JSON.parse(localStorage.getItem('DC_DB_D') || '[]'));
  const [favs, setFavs] = useState(() => JSON.parse(localStorage.getItem('DC_DB_F') || '{}'));
  const [sys, setSys] = useState(() => JSON.parse(localStorage.getItem('DC_DB_S') || JSON.stringify({ master: true, uSign: true, aSign: true })));

  const mobileRef = useRef();
  const passRef = useRef();
  const emailRef = useRef();
  const nameRef = useRef();

  // Sync with LocalStorage for Persistence
  useEffect(() => { localStorage.setItem('DC_DB_U', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('DC_DB_D', JSON.stringify(deals)); }, [deals]);
  useEffect(() => { localStorage.setItem('DC_DB_F', JSON.stringify(favs)); }, [favs]);
  useEffect(() => { localStorage.setItem('DC_DB_S', JSON.stringify(sys)); }, [sys]);
  useEffect(() => { 
    localStorage.setItem('DC_VIEW', view);
    localStorage.setItem('DC_CURR', JSON.stringify(curr));
    localStorage.setItem('DC_LAST_LOGIN', lastLogin);
  }, [view, curr, lastLogin]);

  useEffect(() => {
    const itv = setInterval(() => setBtnToggle(p => !p), 2000);
    return () => clearInterval(itv);
  }, []);

  useEffect(() => {
    const needsRefresh = (view === 'USER' && uTab === 'Home') || (view === 'ADMIN' && adTab === 'VIEW') || (view === 'SA' && saTab === 'DEALS');
    if (!needsRefresh) { setCountdown(10); return; }
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setIsRefreshing(true);
          setDeals(JSON.parse(localStorage.getItem('DC_DB_D') || '[]'));
          setUsers(JSON.parse(localStorage.getItem('DC_DB_U') || '[]'));
          setTimeout(() => setIsRefreshing(false), 1500);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [view, uTab, adTab, saTab]);

  const triggerToast = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };
  
  const resetAuth = () => { 
    setMobile(''); setPassword(''); setName(''); setEmail(''); setStatus('SYSTEM ONLINE'); 
    setForgotStep(0); setNewPass({ p1: '', p2: '' }); 
  };

  const handleLogout = () => {
    setView('AUTH');
    setCurr(null);
    setLastLogin('');
    localStorage.removeItem('DC_VIEW');
    localStorage.removeItem('DC_CURR');
    localStorage.removeItem('DC_LAST_LOGIN');
  };

  const handleAuth = () => {
    const now = new Date().toLocaleString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true });
    
    if (authMode === 'Signup') {
        const canSignup = sys.master && ((role === 'USER' && sys.uSign) || (role === 'ADMIN' && sys.aSign));
        if (!canSignup) { setStatus('CONSTRAINTS: SIGNUP DISABLED'); return; }
        
        const isMobileTaken = users.find(u => u.mobile === mobile);
        const isEmailTaken = users.find(u => u.email === email && email);
        const isSuperAdminNum = (mobile === '7376167737');

        if (isMobileTaken || isSuperAdminNum) { setStatus('CONSTRAINTS: MOBILE ALREADY EXISTS'); return; }
        if (isEmailTaken) { setStatus('CONSTRAINTS: EMAIL ALREADY EXISTS'); return; }

        if (role === 'USER') {
          if (!name || name.length < 3) { setStatus('CONSTRAINTS: NAME TOO SHORT'); return; }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus('CONSTRAINTS: INVALID EMAIL'); return; }
        }
        if (mobile.length !== 10) { setStatus('CONSTRAINTS: INVALID MOBILE'); return; }
        if (password.length < 4) { setStatus('CONSTRAINTS: PASS TOO SHORT'); return; }

        setUsers([...users, { name, email, mobile, password, role, isBlocked: false, isApproved: role==='USER', id: Date.now(), assignedTo: null, isLocked: false }]);
        setAuthMode('Login'); setStatus('SUCCESS: PLEASE LOGIN'); resetAuth();
    } else {
        if (mobile === '7376167737' && password === '@Admin00') { 
            setLastLogin(now); setCurr({name:'OVERLORD', role:'SUPERADMIN', mobile:'7376167737'});
            setView('SA'); triggerToast('WELCOME OVERLORD'); resetAuth(); return; 
        }
        const u = users.find(x => x.mobile === mobile && x.password === password);
        if (u) {
            if (u.isBlocked) setStatus('CONSTRAINTS: ACCOUNT BLOCKED');
            else if (u.role === 'ADMIN' && !u.isApproved) setStatus('CONSTRAINTS: PENDING APPROVAL');
            else { 
                setLastLogin(now); setView(u.role); setCurr(u); triggerToast(`WELCOME ${u.name || 'ADMIN'}`); resetAuth(); 
            }
        } else setStatus('CONSTRAINTS: INVALID CREDENTIALS');
    }
  };

  const getTimeAgo = (timestamp) => {
    const diff = Math.floor((Date.now() - timestamp) / 60000);
    if (diff < 60) return `${diff} MINUTES AGO`;
    const dt = new Date(timestamp);
    return `${dt.toLocaleDateString('en-GB')} : ${dt.toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit', hour12:true})}`;
  };

  const copyToClipboard = (txt) => {
    navigator.clipboard.writeText(txt).then(() => triggerToast('COPIED TO CLIPBOARD!'));
  };

  const DealCard = ({ deal, isAdmin, isSA }) => {
    const off = Math.round(((deal.mrp - deal.price) / deal.mrp) * 100);
    const isFav = (favs[curr?.id] || []).includes(deal.id);
    const clickCount = (deal.clickLog || []).length;
    const favCount = deals.find(d => d.id === deal.id)?.favLog?.length || 0;
    
    const cardGlowClass = deal.isHot ? 'card-glow-hot' : 'card-glow-reg';
    const fieldGlowClass = deal.isHot ? 'field-hot' : 'field-reg';

    return (
      <div className={`deal-card ${cardGlowClass}`} style={{ opacity: deal.isBlocked ? 0.5 : 1 }}>
        {!isAdmin && !isSA && (
          <>
            <div className="ring" style={{ left: '15px' }} onClick={() => {
                let userFavs = favs[curr.id] || [];
                if (isFav) {
                  setFavs({...favs, [curr.id]: userFavs.filter(id => id !== deal.id)});
                  setDeals(deals.map(d => d.id === deal.id ? {...d, favLog: (d.favLog || []).filter(uid => uid !== curr.id)} : d));
                } else {
                  setFavs({...favs, [curr.id]: [...userFavs, deal.id]});
                  setDeals(deals.map(d => d.id === deal.id ? {...d, favLog: [...(d.favLog || []), curr.id]} : d));
                  triggerToast('ADDED TO FAV');
                }
            }}>
              <span style={{ color: isFav ? 'var(--pink)' : '#444', fontSize:'18px' }}>❤</span>
            </div>
            <div className="ring" style={{ right: '15px' }} onClick={() => window.open(`https://wa.me/?text=Check deal: ${deal.url}`, '_blank', 'noopener,noreferrer')}>
              <span style={{ color: 'var(--cyan)', fontSize:'18px' }}>🚀</span>
            </div>
          </>
        )}
        <div className={`title-plate ${fieldGlowClass}`}>{deal.isHot && '🔥 '}{deal.title.toUpperCase()}</div>
        <div className="price-row">
            <span className="mrp-cross">₹{deal.mrp}</span>
            <span className="deal-price">₹{deal.price}</span>
        </div>
        <div className="info-grid">
            <div className={`info-cell ${fieldGlowClass}`}>SAVE ₹{deal.mrp - deal.price}</div>
            <div className={`info-cell ${fieldGlowClass}`}>{off}% OFF</div>
            <div className={`info-cell ${fieldGlowClass}`}>BRAND: {deal.brand}</div>
            <div className={`info-cell ${fieldGlowClass}`}>STORE: {deal.store.toUpperCase()}</div>
        </div>
        <div className={`card-timer-box`}>
           {isRefreshing ? 'REFRESHING...' : `SYNC: ${countdown}s`}
        </div>
        
        {deal.coupon && (
            <div className="coupon-box">
                <div className="coupon-text">{deal.coupon}</div>
                <button className="copy-btn" onClick={() => copyToClipboard(deal.coupon)}>COPY</button>
            </div>
        )}

        <button className="click-btn" onClick={() => { 
            if(!(deal.clickLog || []).includes(curr.id)) {
                setDeals(deals.map(d => d.id === deal.id ? {...d, clickLog: [...(d.clickLog || []), curr.id]} : d));
            }
            const newWindow = window.open(deal.url, '_blank', 'noopener,noreferrer');
            if (newWindow) newWindow.opener = null;
        }}>{btnToggle ? 'CLICK HERE' : 'GRAB ME'}</button>

        <div className="stats-row">
            <div className="stat-item" style={{color:'var(--pink)'}}>❤ | {favCount}</div>
            <div className="stat-item" style={{color:'var(--cyan)'}}>🔗 | {clickCount}</div>
        </div>
        <div className="timestamp-row">{deal.adminName || 'ADMIN'} | {getTimeAgo(deal.id)}</div>
        {(isAdmin || isSA) && (
            <div style={{display:'flex', gap:'5px', marginTop:'10px'}}>
                {isAdmin && <button className="action-btn btn-gold" style={{flex:1}} onClick={() => {setForm(deal); setAdTab('PUBLISH');}}>EDIT</button>}
                <button className="action-btn" style={{flex:1, borderColor: deal.isBlocked?'var(--green)':'var(--red)', color: deal.isBlocked?'var(--green)':'var(--red)'}} onClick={() => setDeals(deals.map(d=>d.id===deal.id?{...d, isBlocked:!d.isBlocked}:d))}>{deal.isBlocked?'UNB':'BLOCK'}</button>
                <button className="action-btn btn-red" onClick={() => setDeals(deals.filter(d=>d.id!==deal.id))}>DEL</button>
            </div>
        )}
      </div>
    );
  };

  const [saUaRole, setSaUaRole] = useState('USER');
  const stores = ["Amazon", "Flipkart", "Myntra", "Meesho", "Shopsy", "Snapdeal", "Blinkit", "BigBasket", "Jio mart", "Zepto", "Samsung", "Xiaomi"];
  
  const unassignedUsers = users
    .filter(u => u.role === 'USER' && !u.assignedTo)
    .sort((a, b) => a.id - b.id);

  return (
    <div>
      <style>{globalStyles}</style>
      <div className="fixed-top-zone">
          <div className="header-info-container">
              <div className="header-info-left">{curr ? `${curr.name || 'ADMIN'} (${curr.role})` : ''}</div>
              {toast && <div className="cyber-toast">{toast}</div>}
              <div className="header-info-right">{curr ? lastLogin : ''}</div>
          </div>
          <div style={{display:'flex', justifyContent:'center'}}>
              <div className="header-box"><div className="brand-name">Deal Cards</div></div>
          </div>
          {view === 'SA' && (
            <div className="nv-bar">
                {['HOME', 'UA', 'ASSIGN', 'DEALS'].map(t => <div key={t} className={`nv-btn ${saTab===t?'active':''}`} onClick={()=>setSaTab(t)}>{t}</div>)}
                <div className="nv-btn" style={{color:'var(--red)'}} onClick={handleLogout}>EXIT</div>
            </div>
          )}
          {view === 'ADMIN' && (
            <div className="nv-bar">
                {['PUBLISH', 'USER', 'VIEW'].map(t => <div key={t} className={`nv-btn ${adTab===t?'active':''}`} onClick={()=>setAdTab(t)}>{t}</div>)}
                <div className="nv-btn" style={{color:'var(--red)'}} onClick={handleLogout}>LOGOUT</div>
            </div>
          )}
          {view === 'USER' && (
            <div className="nv-bar">
                {['Home', 'Hot Deals', 'Fav'].map(t => (
                    <div key={t} className={`nv-btn ${uTab===t ? (t==='Hot Deals'?'active active-hot': t==='Fav'?'active active-fav':'active') : ''}`} onClick={()=>setUTab(t)}>
                        {t} {t==='Fav' && (favs[curr?.id]||[]).length > 0 && <span className="badge">{(favs[curr?.id]||[]).length}</span>}
                    </div>
                ))}
                <div className="nv-btn" style={{color:'var(--red)'}} onClick={handleLogout}>EXIT</div>
            </div>
          )}
      </div>

      {view === 'AUTH' && (
        <div className="neon-wrap"><div className="at-card">
            {forgotStep === 0 ? (
              <>
                <div style={{display:'flex', justifyContent:'center', gap:'10px', marginBottom:'15px', fontSize:'9px'}}>
                  <span style={{color: authMode==='Login'?'var(--cyan)':'#444'}} onClick={()=>{setAuthMode('Login'); resetAuth();}}>LOGIN</span>
                  <div className="tgl-bg" onClick={()=>{setAuthMode(authMode==='Login'?'Signup':'Login'); resetAuth();}}>
                      <div className="tgl-ball" style={{left: authMode==='Login'?'3px':'25px', background:'var(--cyan)'}}></div>
                  </div>
                  <span style={{color: authMode==='Signup'?'var(--cyan)':'#444'}} onClick={()=>{setAuthMode('Signup'); resetAuth();}}>SIGNUP</span>
                </div>
                {authMode === 'Signup' && (
                  <div style={{display:'flex', justifyContent:'center', gap:'10px', marginBottom:'15px', fontSize:'9px'}}>
                      <span style={{color: role==='USER'?'var(--pink)':'#444'}} onClick={()=>{setRole('USER'); resetAuth();}}>USER</span>
                      <div className="tgl-bg" onClick={()=>{setRole(role==='USER'?'ADMIN':'USER'); resetAuth();}}>
                          <div className="tgl-ball" style={{left: role==='USER'?'3px':'25px', background: role==='USER'?'var(--pink)':'var(--blue)'}}></div>
                      </div>
                      <span style={{color: role==='ADMIN'?'var(--blue)':'#444'}} onClick={()=>{setRole('ADMIN'); resetAuth();}}>ADMIN</span>
                  </div>
                )}
                {authMode === 'Signup' && role === 'USER' && (
                  <>
                    <input ref={nameRef} className="at-input" placeholder="NAME" value={name} onChange={e => {
                        const v = e.target.value.replace(/[^A-Za-z ]/g,'');
                        setName(v); if(v.length >= 15) emailRef.current.focus();
                    }} maxLength={15} />
                    <input ref={emailRef} className="at-input" placeholder="EMAIL ID" value={email} onChange={e => setEmail(e.target.value)} />
                  </>
                )}
                <input ref={mobileRef} className="at-input" placeholder="MOBILE" value={mobile} maxLength={10} onChange={e => {
                    const v = e.target.value.replace(/\D/g,'');
                    setMobile(v); if(v.length === 10) passRef.current.focus();
                }} />
                <input ref={passRef} className="at-input" type="password" placeholder="PASSWORD" value={password} onChange={e => setPassword(e.target.value)} />
                <div style={{color: 'var(--gold)', fontSize: '9px', textAlign: 'center', marginBottom: '10px'}}>{status}</div>
                <button className="action-btn btn-cyan" style={{width:'100%', height:'42px', borderRadius:'22px'}} onClick={handleAuth}>{authMode.toUpperCase()}</button>
                {authMode === 'Login' && <div style={{textAlign:'center', marginTop:'15px', fontSize:'10px', color:'var(--pink)', cursor:'pointer'} } onClick={()=>setForgotStep(1)}>FORGOT PASSWORD?</div>}
              </>
            ) : forgotStep === 1 ? (
                <div style={{textAlign:'center'}}>
                  <input className="at-input" placeholder="EMAIL ID" value={email} onChange={e => setEmail(e.target.value)} />
                  <input className="at-input" placeholder="MOBILE" value={mobile} maxLength={10} onChange={e => setMobile(e.target.value.replace(/\D/g,''))} />
                  <div style={{color:'var(--gold)', fontSize:'9px', margin:'5px'}}>{status}</div>
                  <button className="action-btn btn-green" style={{width:'100%', marginBottom:'5px'}} onClick={()=>{
                    const u = users.find(x => x.mobile === mobile && x.email === email);
                    if(u) { setResetTargetId(u.id); setForgotStep(2); setStatus('SET NEW PASS'); } else setStatus('CONSTRAINTS: DATA MISMATCH');
                  }}>VERIFY</button>
                  <button className="action-btn btn-red" style={{width:'100%'}} onClick={resetAuth}>CANCEL</button>
                </div>
              ) : (
                <div style={{textAlign:'center'}}>
                  <input className="at-input" type="password" placeholder="NEW PASSWORD" value={newPass.p1} onChange={e => setNewPass({...newPass, p1: e.target.value})} />
                  <input className="at-input" type="password" placeholder="CONFIRM" value={newPass.p2} onChange={e => setNewPass({...newPass, p2: e.target.value})} />
                  <button className="action-btn btn-cyan" style={{width:'100%'}} onClick={()=>{
                    if(newPass.p1 !== newPass.p2) { setStatus('CONSTRAINTS: MISMATCH'); return; }
                    setUsers(users.map(u => u.id === resetTargetId ? {...u, password: newPass.p1} : u));
                    triggerToast('PASSWORD UPDATED!'); setAuthMode('Login'); resetAuth();
                  }}>SUBMIT</button>
                </div>
              )}
        </div></div>
      )}

      {view === 'SA' && (
        <div style={{paddingTop:'5px'}}>
            {saTab === 'HOME' && (
                <div className="neon-wrap"><div className="at-card">
                    <div className="ctrl-row"><span className="ctrl-label">SYSTEM SIGNUP POWER</span><div className="tgl-bg" onClick={()=>setSys({...sys, master:!sys.master})}><div className="tgl-ball" style={{left: sys.master?'25px':'3px', background: sys.master?'var(--green)':'var(--red)'}}></div></div></div>
                    <div className="ctrl-row"><span className="ctrl-label">USER SIGNUP</span><div className="tgl-bg" onClick={() => sys.master && setSys({...sys, uSign:!sys.uSign})} style={{opacity: sys.master?1:0.5}}><div className="tgl-ball" style={{left: sys.uSign?'25px':'3px', background: sys.uSign?'var(--cyan)':'#333'}}></div></div></div>
                    <div className="ctrl-row"><span className="ctrl-label">ADMIN SIGNUP</span><div className="tgl-bg" onClick={() => sys.master && setSys({...sys, aSign:!sys.aSign})} style={{opacity: sys.master?1:0.5}}><div className="tgl-ball" style={{left: sys.aSign?'25px':'3px', background: sys.aSign?'var(--cyan)':'#333'}}></div></div></div>
                </div></div>
            )}
            {saTab === 'UA' && (
                <div>
                   <div className="neon-wrap"><div className="at-card" style={{padding:'10px'}}>
                      <div style={{display:'flex', justifyContent:'center', gap:'15px', alignItems:'center', fontSize:'10px'}}>
                        <span style={{color: saUaRole==='USER'?'var(--pink)':'#444'}}>USERS</span>
                        <div className="tgl-bg" onClick={()=>setSaUaRole(saUaRole==='USER'?'ADMIN':'USER')}><div className="tgl-ball" style={{left: saUaRole==='USER'?'4px':'25px', background: saUaRole==='USER'?'var(--pink)':'var(--blue)'}}></div></div>
                        <span style={{color: saUaRole==='ADMIN'?'var(--blue)':'#444'}}>ADMINS</span>
                      </div>
                    </div></div>
                    {users.filter(u => u.role === saUaRole).map(u => (
                        <div key={u.id} className="neon-wrap"><div className="at-card">
                            <div style={{fontSize:'10px'}}>
                                <div style={{color:'var(--cyan)', fontWeight:'bold'}}>{u.name || 'ADMIN'}</div>
                                <div>{u.mobile} | {u.email}</div>
                            </div>
                            <div style={{display:'flex', gap:'5px', marginTop:'10px'}}>
                                {u.role==='ADMIN' && <button className="action-btn btn-blue" style={{flex:1}} onClick={()=>setUsers(users.map(x=>x.id===u.id?{...x, isApproved:!x.isApproved}:x))}>{u.isApproved?'REVOKE':'APPROVE'}</button>}
                                <button className="action-btn" style={{flex:1, borderColor: u.isBlocked?'var(--green)':'var(--red)', color: u.isBlocked?'var(--green)':'var(--red)'}} onClick={()=>setUsers(users.map(x=>x.id===u.id?{...x, isBlocked:!x.isBlocked}:x))}>{u.isBlocked?'UNBLOCK':'BLOCK'}</button>
                                <button className="action-btn btn-white" onClick={()=>setUsers(users.filter(x=>x.id!==u.id))}>DEL</button>
                            </div>
                        </div></div>
                    ))}
                </div>
            )}
            {saTab === 'ASSIGN' && (
                <div style={{textAlign:'center'}}>
                    <div className="neon-wrap"><div className="at-card">
                        <div style={{fontSize:'9px', color:'var(--cyan)', textShadow:'0 0 5px var(--cyan)'}}>AVAILABLE UNASSIGNED USERS: {unassignedUsers.length}</div>
                        <select className="at-select" style={{fontSize:'8px', marginTop:'10px', color:'var(--cyan)'}}>
                            <option>-- VIEW UNASSIGNED LIST (NEON GLOW) --</option>
                            {unassignedUsers.map(u => <option key={u.id} disabled>{u.name} | {u.mobile} (WAITING...)</option>)}
                        </select>
                    </div></div>
                    {users.filter(u=>u.role==='ADMIN' && u.isApproved).map(adm => {
                        const currentAssignedCount = users.filter(u => u.assignedTo === adm.id).length;
                        return (
                          <div key={adm.id} className="neon-wrap"><div className="at-card">
                              <div style={{fontSize:'10px', marginBottom:'10px'}}>ADMIN: {adm.mobile} | CURRENTLY ALLOTTED: {currentAssignedCount}</div>
                              <div style={{display:'flex', gap:'5px'}}>
                                  <input type="number" className="at-input" style={{flex:1, marginBottom:0}} 
                                    value={adm.tempValue ?? currentAssignedCount} 
                                    onChange={e => {
                                        let val = parseInt(e.target.value) || 0;
                                        const maxPossible = unassignedUsers.length + currentAssignedCount;
                                        if(val > maxPossible) { val = maxPossible; triggerToast('MAX AVAILABLE REACHED'); }
                                        setUsers(users.map(x=>x.id===adm.id?{...x, tempValue: val}:x));
                                    }} 
                                  />
                                  <button className="action-btn btn-green" onClick={()=>{
                                      const targetCount = parseInt(adm.tempValue ?? currentAssignedCount);
                                      let updatedUsers = [...users];
                                      
                                      if(targetCount > currentAssignedCount) {
                                          const diff = targetCount - currentAssignedCount;
                                          const toAssign = unassignedUsers.slice(0, diff);
                                          toAssign.forEach(ua => {
                                              const idx = updatedUsers.findIndex(x => x.id === ua.id);
                                              updatedUsers[idx].assignedTo = adm.id;
                                          });
                                      } else if (targetCount < currentAssignedCount) {
                                          const diff = currentAssignedCount - targetCount;
                                          const currentlyHeld = updatedUsers.filter(u => u.assignedTo === adm.id).sort((a,b) => b.id - a.id);
                                          const toRelease = currentlyHeld.slice(0, diff);
                                          toRelease.forEach(tr => {
                                              const idx = updatedUsers.findIndex(x => x.id === tr.id);
                                              updatedUsers[idx].assignedTo = null;
                                          });
                                      }
                                      
                                      setUsers(updatedUsers.map(u => u.id === adm.id ? {...u, tempValue: undefined} : u));
                                      triggerToast('SYNC SUCCESSFUL!');
                                  }}>SYNC ASSIGN</button>
                              </div>
                          </div></div>
                        );
                    })}
                </div>
            )}
            {saTab === 'DEALS' && deals.map(d => <DealCard key={d.id} deal={d} isSA={true} />)}
        </div>
      )}

      {view === 'ADMIN' && (
        <div style={{paddingTop:'5px'}}>
            {adTab === 'PUBLISH' && (
                <div className="neon-wrap"><div className="at-card">
                    <input className="at-input" placeholder="TITLE" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                    <div style={{display:'flex', gap:'5px'}}>
                        <input className="at-input" placeholder="MRP" value={form.mrp} onChange={e => setForm({...form, mrp: e.target.value.replace(/\D/g,'')})} />
                        <input className="at-input" placeholder="PRICE" value={form.price} onChange={e => setForm({...form, price: e.target.value.replace(/\D/g,'')})} />
                    </div>
                    <select className="at-input" value={form.store} onChange={e => setForm({...form, store: e.target.value})}>{stores.map(s => <option key={s} value={s}>{s}</option>)}</select>
                    <input list="brand-list" className="at-input" placeholder="BRAND" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} />
                    <datalist id="brand-list">
                        {[...new Set(deals.filter(d => d.author === curr.mobile).map(d => d.brand))].map(b => <option key={b} value={b} />)}
                    </datalist>
                    <input className="at-input" placeholder="COUPON (ALPHANUMERIC ONLY)" value={form.coupon} onChange={e => setForm({...form, coupon: e.target.value.replace(/[^a-zA-Z0-9]/g, '')})} />
                    <input className="at-input" placeholder="URL" value={form.url} onChange={e => setForm({...form, url: e.target.value})} />
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', margin:'8px'}}>
                        <span style={{fontSize:'9px', color: !form.isHot?'var(--cyan)':'#444'}}>REGULAR</span>
                        <div className="tgl-bg" onClick={()=>setForm({...form, isHot: !form.isHot})}><div className="tgl-ball" style={{left: !form.isHot?'3px':'25px', background: !form.isHot?'var(--green)':'var(--red)'}}></div></div>
                        <span style={{fontSize:'9px', color: form.isHot?'var(--red)':'#444'}}>HOT 🔥</span>
                    </div>
                    <button className="action-btn btn-cyan" style={{width:'100%', height:'42px', borderRadius:'22px'}} onClick={()=>{
                        const nd = {...form, id: form.id || Date.now(), author: curr.mobile, adminName: curr.name || 'ADMIN', date: new Date().toLocaleDateString(), favLog: form.favLog || [], clickLog: form.clickLog || []};
                        setDeals(form.id ? deals.map(d=>d.id===form.id?nd:d) : [nd, ...deals]);
                        setForm({title:'', mrp:'', price:'', store:'Amazon', brand:'', coupon:'', url:'', isHot:false, id:null});
                        triggerToast('DEAL PUBLISHED!'); setAdTab('VIEW');
                    }}>{form.id ? 'UPDATE' : 'PUBLISH'}</button>
                </div></div>
            )}
            {adTab === 'USER' && users.filter(u => u.role === 'USER' && u.assignedTo === curr.id).map(u => (
                <div key={u.id} className="neon-wrap"><div className="at-card">
                    <div style={{fontSize:'10px'}}>
                        <div style={{color:'var(--cyan)', fontWeight:'bold'}}>{u.name}</div>
                        <div>{u.mobile} | {u.email}</div>
                    </div>
                    <div style={{display:'flex', gap:'5px', marginTop:'10px'}}>
                        <button className="action-btn" style={{flex:1, borderColor: u.isBlocked?'var(--green)':'var(--red)', color: u.isBlocked?'var(--green)':'var(--red)'}} onClick={()=>setUsers(users.map(x=>x.id===u.id?{...x, isBlocked:!x.isBlocked}:x))}>{u.isBlocked?'UNBLOCK':'BLOCK'}</button>
                        <button className="action-btn btn-white" style={{flex:1}} onClick={()=>setUsers(users.filter(x=>x.id!==u.id))}>DELETE</button>
                    </div>
                </div></div>
            ))}
            {adTab === 'VIEW' && deals.filter(d=>d.author===curr.mobile).map(d => <DealCard key={d.id} deal={d} isAdmin={true} />)}
        </div>
      )}

      {view === 'USER' && (
        <div style={{paddingTop:'5px'}}>
            {deals.filter(d => {
                if(d.isBlocked) return false;
                if(uTab==='Home') return true;
                if(uTab==='Hot Deals') return d.isHot;
                if(uTab==='Fav') return (favs[curr?.id]||[]).includes(d.id);
                return true;
            }).map(d => <DealCard key={d.id} deal={d} />)}
        </div>
      )}
      <SpeedInsights />
    </div>
  );
}
