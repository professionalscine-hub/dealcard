import React, { useState, useEffect, useRef } from 'react';

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
  :root { 
    --bg: #030305; --cyan: #00f3ff; --pink: #ff00ff; --red: #ff4757; 
    --green: #32ff7e; --gold: #ffd700; --blue: #0077ff;
    --neon-flow: linear-gradient(90deg, #ff00ff, #00f3ff, #ff00ff, #00f3ff, #ff00ff);
  }
  * { box-sizing: border-box; transition: all 0.3s ease; outline: none; }
  body { margin: 0; background: var(--bg); font-family: 'Share Tech Mono', monospace; color: #fff; overflow-x: hidden; }

  /* --- Fixed Breathing Animations (Independent of JS Timer) --- */
  @keyframes card-breathe-hot {
    0%, 100% { border-color: rgba(255, 71, 87, 0.3); box-shadow: 0 0 10px rgba(255, 71, 87, 0.2); }
    50% { border-color: var(--red); box-shadow: 0 0 25px var(--red), inset 0 0 10px rgba(255, 71, 87, 0.3); }
  }
  @keyframes card-breathe-reg {
    0%, 100% { border-color: rgba(0, 243, 255, 0.3); box-shadow: 0 0 10px rgba(0, 243, 255, 0.2); }
    50% { border-color: var(--cyan); box-shadow: 0 0 25px var(--cyan), inset 0 0 10px rgba(0, 243, 255, 0.3); }
  }

  /* Field Border White - Text Bold White (No Glow/Blink) */
  .field-hot { border: 1.5px solid #fff; color: #fff !important; font-weight: 900 !important; text-shadow: none !important; }
  .field-reg { border: 1.5px solid #fff; color: #fff !important; font-weight: 900 !important; text-shadow: none !important; }

  .deal-card.card-glow-hot { animation: card-breathe-hot 4s infinite ease-in-out; border: 2px solid var(--red); }
  .deal-card.card-glow-reg { animation: card-breathe-reg 4s infinite ease-in-out; border: 2px solid var(--cyan); }

  /* Static White Text for Deal Cards */
  .deal-card * { color: #fff; font-weight: 900; }

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

  .deal-card { width: 310px; background: #0d0d12; border-radius: 35px; padding: 65px 20px 15px 20px; margin: 20px auto; position: relative; transition: border-color 0.5s, box-shadow 0.5s; }

  .title-plate { background: #000; padding: 10px; border-radius: 12px; font-size: 10px; text-align: center; line-height: 1.4; font-weight: 900; }

  .ring { width: 38px; height: 38px; border: 1.5px solid #222; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: absolute; top: 15px; background: #000; cursor: pointer; z-index: 10; }
  .card-timer-box { width: 100px; height: 20px; background: #000; border: 1px solid #222; border-radius: 6px; margin: 8px auto; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900; color: var(--cyan); }
  
  .price-row { display: flex; justify-content: center; align-items: center; gap: 12px; margin: 15px 0; }
  .mrp-cross { color: #666 !important; text-decoration: line-through; text-decoration-color: var(--red); font-size: 16px; }
  .deal-price { font-size: 22px; font-weight: 900; }
  
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
  .info-cell { padding: 8px; border-radius: 8px; font-size: 9px; text-align: center; font-weight: 900; }

  .coupon-box { display: flex; background: #000; border-radius: 10px; margin-bottom: 10px; border: 1.2px dashed #444; overflow: hidden; height: 34px; align-items: center; }
  .coupon-text { flex: 1; font-size: 11px; color: var(--gold) !important; text-align: center; letter-spacing: 1px; font-weight: 900; }
  .copy-btn { width: 50px; height: 100%; background: #222; color: var(--cyan) !important; border: none; font-size: 9px; cursor: pointer; font-weight: 900; }

  .click-btn { 
    width: 100%; padding: 12px; border-radius: 25px; border: none; 
    background: linear-gradient(135deg, #fff 0%, #bbb 50%, #888 100%); 
    color: #000 !important; font-weight: 900; font-size: 16px; cursor: pointer; 
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

  .timestamp-row { font-size: 8px; color: #666 !important; text-align: center; margin-top: 8px; border-top: 1px solid #111; padding-top: 5px; }

  .neon-wrap { position: relative; padding: 2px; border-radius: 25px; margin: 15px auto; width: fit-content; }
  .at-card { width: 320px; background: #0a0a0f; border-radius: 25px; padding: 18px; border: 1.5px solid #252535; }
  
  .at-input, .at-select { 
    width: 100%; background: #000; border: 1.5px solid #222; padding: 10px; 
    color: #fff; border-radius: 10px; text-align: center; font-size: 12px; 
    margin-bottom: 8px;
  }
  .at-input:focus { border-color: var(--cyan); box-shadow: 0 0 10px var(--cyan); }

  .ctrl-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 5px 0; border-bottom: 1px solid #111; }
  .ctrl-label { font-size: 11px; color: #ccc !important; }

  .action-btn { 
    border-radius: 12px; font-weight: 900; text-transform: uppercase; 
    border: 1.5px solid; background: transparent; cursor: pointer; 
    padding: 8px; font-size: 9px; animation: btnPulse 3s infinite;
  }
  .btn-cyan { border-color: var(--cyan); color: var(--cyan) !important; }
  .btn-red { border-color: var(--red); color: var(--red) !important; }
  .btn-green { border-color: var(--green); color: var(--green) !important; }
  .btn-gold { border-color: var(--gold); color: var(--gold) !important; }
  .btn-white { border-color: #fff; color: #fff !important; }
  .btn-blue { border-color: var(--blue); color: var(--blue) !important; }
  
  .tgl-bg { width: 44px; height: 20px; background: #111; border-radius: 20px; border: 1.5px solid #333; position: relative; cursor: pointer; }
  .tgl-ball { position: absolute; top: 2px; width: 12px; height: 12px; border-radius: 50%; transition: 0.3s; }
`;

export default function App() {
  const [curr, setCurr] = useState(() => JSON.parse(localStorage.getItem('DC_LOGGED_USER') || 'null'));
  const [view, setView] = useState(() => curr ? curr.role : 'AUTH');
  
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
  const [lastLogin, setLastLogin] = useState(() => localStorage.getItem('DC_LAST_LOGIN') || '');
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

  // Sync Logic
  useEffect(() => { localStorage.setItem('DC_DB_U', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('DC_DB_D', JSON.stringify(deals)); }, [deals]);
  useEffect(() => { localStorage.setItem('DC_DB_F', JSON.stringify(favs)); }, [favs]);
  useEffect(() => { localStorage.setItem('DC_DB_S', JSON.stringify(sys)); }, [sys]);
  useEffect(() => { 
    if(curr) {
        localStorage.setItem('DC_LOGGED_USER', JSON.stringify(curr));
        localStorage.setItem('DC_LAST_LOGIN', lastLogin);
    } else {
        localStorage.removeItem('DC_LOGGED_USER');
    }
  }, [curr, lastLogin]);

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

  const handleAuth = () => {
    const now = new Date().toLocaleString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true });
    
    if (authMode === 'Signup') {
        const canSignup = sys.master && ((role === 'USER' && sys.uSign) || (role === 'ADMIN' && sys.aSign));
        if (!canSignup) { setStatus('CONSTRAINTS: SIGNUP DISABLED'); return; }
        
        const isMobileTaken = users.find(u => u.mobile === mobile);
        const isSuperAdminNum = (mobile === '7376167737');

        if (isMobileTaken || isSuperAdminNum) { setStatus('CONSTRAINTS: MOBILE ALREADY EXISTS'); return; }
        if (mobile.length !== 10) { setStatus('CONSTRAINTS: INVALID MOBILE'); return; }
        if (password.length < 4) { setStatus('CONSTRAINTS: PASS TOO SHORT'); return; }

        setUsers([...users, { name, email, mobile, password, role, isBlocked: false, isApproved: role==='USER', id: Date.now(), assignedTo: null }]);
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
            <div className="ring" style={{ right: '15px' }} onClick={() => window.open(`https://wa.me/?text=Check deal: ${deal.url}`, '_blank')}>
              <span style={{ color: 'var(--cyan)', fontSize:'18px' }}>🚀</span>
            </div>
          </>
        )}
        <div className={`title-plate ${fieldGlowClass}`}>{deal.isHot && '🔥 '}{deal.title.toUpperCase()}</div>
        <div className="price-row">
            <span className="mrp-cross">₹{deal.mrp}</span>
            <span className="deal-price" style={{color: '#fff', textShadow: deal.isHot ? '0 0 10px var(--red)' : '0 0 10px var(--cyan)'}}>₹{deal.price}</span>
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
            window.open(deal.url, '_blank');
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

  const stores = ["Amazon", "Flipkart", "Myntra", "Meesho", "Shopsy", "Snapdeal", "Blinkit", "BigBasket", "Jio mart", "Zepto", "Samsung", "Xiaomi"];
  const unassignedUsers = users.filter(u => u.role === 'USER' && !u.assignedTo);

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
                <div className="nv-btn" style={{color:'var(--red)'}} onClick={()=>{setView('AUTH'); setCurr(null);}}>EXIT</div>
            </div>
          )}
          {view === 'ADMIN' && (
            <div className="nv-bar">
                {['PUBLISH', 'USER', 'VIEW'].map(t => <div key={t} className={`nv-btn ${adTab===t?'active':''}`} onClick={()=>setAdTab(t)}>{t}</div>)}
                <div className="nv-btn" style={{color:'var(--red)'}} onClick={()=>{setView('AUTH'); setCurr(null);}}>LOGOUT</div>
            </div>
          )}
          {view === 'USER' && (
            <div className="nv-bar">
                {['Home', 'Hot Deals', 'Fav'].map(t => (
                    <div key={t} className={`nv-btn ${uTab===t ? (t==='Hot Deals'?'active active-hot': t==='Fav'?'active active-fav':'active') : ''}`} onClick={()=>setUTab(t)}>
                        {t} {t==='Fav' && (favs[curr?.id]||[]).length > 0 && <span className="badge">{(favs[curr?.id]||[]).length}</span>}
                    </div>
                ))}
                <div className="nv-btn" style={{color:'var(--red)'}} onClick={()=>{setView('AUTH'); setCurr(null);}}>EXIT</div>
            </div>
          )}
      </div>

      {view === 'AUTH' && (
        <div className="neon-wrap"><div className="at-card">
            {forgotStep === 0 ? (
              <>
                <div style={{display:'flex', justifyContent:'center', gap:'10px', marginBottom:'15px', fontSize:'9px'}}>
                  <span style={{color: authMode==='Login'?'var(--cyan)':'#444'}} onClick={()=>setAuthMode('Login')}>LOGIN</span>
                  <div className="tgl-bg" onClick={()=>setAuthMode(authMode==='Login'?'Signup':'Login')}>
                      <div className="tgl-ball" style={{left: authMode==='Login'?'3px':'25px', background:'var(--cyan)'}}></div>
                  </div>
                  <span style={{color: authMode==='Signup'?'var(--cyan)':'#444'}} onClick={()=>setAuthMode('Signup')}>SIGNUP</span>
                </div>
                {authMode === 'Signup' && (
                  <div style={{display:'flex', justifyContent:'center', gap:'10px', marginBottom:'15px', fontSize:'9px'}}>
                      <span style={{color: role==='USER'?'var(--pink)':'#444'}} onClick={()=>setRole('USER')}>USER</span>
                      <div className="tgl-bg" onClick={()=>setRole(role==='USER'?'ADMIN':'USER')}>
                          <div className="tgl-ball" style={{left: role==='USER'?'3px':'25px', background: role==='USER'?'var(--pink)':'var(--blue)'}}></div>
                      </div>
                      <span style={{color: role==='ADMIN'?'var(--blue)':'#444'}} onClick={()=>setRole('ADMIN')}>ADMIN</span>
                  </div>
                )}
                {authMode === 'Signup' && role === 'USER' && (
                  <>
                    <input ref={nameRef} className="at-input" placeholder="NAME" value={name} onChange={e => setName(e.target.value.replace(/[^A-Za-z ]/g,''))} />
                    <input ref={emailRef} className="at-input" placeholder="EMAIL ID" value={email} onChange={e => setEmail(e.target.value)} />
                  </>
                )}
                <input ref={mobileRef} className="at-input" placeholder="MOBILE" value={mobile} maxLength={10} onChange={e => setMobile(e.target.value.replace(/\D/g,''))} />
                <input ref={passRef} className="at-input" type="password" placeholder="PASSWORD" value={password} onChange={e => setPassword(e.target.value)} />
                <div style={{color: 'var(--gold)', fontSize: '9px', textAlign: 'center', marginBottom: '10px'}}>{status}</div>
                <button className="action-btn btn-cyan" style={{width:'100%', height:'42px', borderRadius:'22px'}} onClick={handleAuth}>{authMode.toUpperCase()}</button>
                {authMode === 'Login' && <div style={{textAlign:'center', marginTop:'15px', fontSize:'10px', color:'var(--pink)', cursor:'pointer'} } onClick={()=>setForgotStep(1)}>FORGOT PASSWORD?</div>}
              </>
            ) : forgotStep === 1 ? (
                <div style={{textAlign:'center'}}>
                  <input className="at-input" placeholder="EMAIL ID" value={email} onChange={e => setEmail(e.target.value)} />
                  <input className="at-input" placeholder="MOBILE" value={mobile} maxLength={10} onChange={e => setMobile(e.target.value.replace(/\D/g,''))} />
                  <button className="action-btn btn-green" style={{width:'100%', marginBottom:'5px'}} onClick={()=>{
                    const u = users.find(x => x.mobile === mobile && x.email === email);
                    if(u) { setResetTargetId(u.id); setForgotStep(2); setStatus('SET NEW PASS'); } else setStatus('DATA MISMATCH');
                  }}>VERIFY</button>
                  <button className="action-btn btn-red" style={{width:'100%'}} onClick={resetAuth}>CANCEL</button>
                </div>
              ) : (
                <div style={{textAlign:'center'}}>
                  <input className="at-input" type="password" placeholder="NEW PASSWORD" value={newPass.p1} onChange={e => setNewPass({...newPass, p1: e.target.value})} />
                  <input className="at-input" type="password" placeholder="CONFIRM" value={newPass.p2} onChange={e => setNewPass({...newPass, p2: e.target.value})} />
                  <button className="action-btn btn-cyan" style={{width:'100%'}} onClick={()=>{
                    if(newPass.p1 !== newPass.p2) { setStatus('MISMATCH'); return; }
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
                    <div className="ctrl-row"><span className="ctrl-label">SYSTEM POWER</span><div className="tgl-bg" onClick={()=>setSys({...sys, master:!sys.master})}><div className="tgl-ball" style={{left: sys.master?'25px':'3px', background: sys.master?'var(--green)':'var(--red)'}}></div></div></div>
                </div></div>
            )}
            {saTab === 'DEALS' && deals.map(d => <DealCard key={d.id} deal={d} isSA={true} />)}
            {/* baki tabs same as before logic */}
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
                    <input className="at-input" placeholder="URL" value={form.url} onChange={e => setForm({...form, url: e.target.value})} />
                    <button className="action-btn btn-cyan" style={{width:'100%', height:'42px', borderRadius:'22px'}} onClick={()=>{
                        const nd = {...form, id: form.id || Date.now(), author: curr.mobile, adminName: curr.name || 'ADMIN', date: new Date().toLocaleDateString(), favLog: [], clickLog: []};
                        setDeals(form.id ? deals.map(d=>d.id===form.id?nd:d) : [nd, ...deals]);
                        setForm({title:'', mrp:'', price:'', store:'Amazon', brand:'', coupon:'', url:'', isHot:false, id:null});
                        triggerToast('PUBLISHED!'); setAdTab('VIEW');
                    }}>{form.id ? 'UPDATE' : 'PUBLISH'}</button>
                </div></div>
            )}
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
    </div>
  );
}
