import React, { useState, useEffect, useRef } from 'react';

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
  :root { 
    --bg: #030305; --cyan: #00f3ff; --pink: #ff00ff; --red: #ff4757; 
    --green: #32ff7e; --gold: #ffd700; --blue: #0077ff;
    --neon-flow: linear-gradient(90deg, #ff00ff, #00f3ff, #ff00ff, #00f3ff, #ff00ff);
  }
  * { box-sizing: border-box; transition: background 0.3s ease, border 0.3s ease; outline: none; -webkit-tap-highlight-color: transparent; }
  body { 
    margin: 0; 
    background: var(--bg); 
    font-family: 'Share Tech Mono', monospace; 
    color: #fff; 
    overflow-x: hidden;
    width: 100vw;
  }

  /* --- Mobile Responsive Fixes --- */
  .fixed-top-zone { position: sticky; top: 0; z-index: 10000; background: var(--bg); padding-bottom: 5px; width: 100%; }
  .header-info-container { position: relative; width: 95%; max-width: 400px; margin: 0 auto; height: 25px; display: flex; align-items: center; justify-content: space-between; overflow: hidden; }
  
  .header-box { width: 90%; max-width: 320px; background: #0a0a0f; border: 1.5px solid #252535; border-radius: 15px; padding: 15px; text-align: center; position: relative; margin: 5px auto 10px auto; }
  .header-box::after { content: ''; position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px; background: var(--neon-flow); background-size: 300%; border-radius: 16px; z-index: -1; animation: flow 3s linear infinite; }
  
  .nv-bar { width: 95%; max-width: 450px; background: #000; border-radius: 50px; border: 1.5px solid #222; padding: 5px; display: flex; gap: 5px; margin: 0 auto 10px auto; }
  .nv-btn { flex: 1; height: 38px; border-radius: 25px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900; cursor: pointer; color: #555; position: relative; text-align: center; }
  
  /* --- Card Width Fix --- */
  .deal-card { width: 95%; max-width: 350px; background: #0d0d12; border-radius: 35px; padding: 65px 20px 15px 20px; margin: 20px auto; position: relative; }
  .neon-wrap { position: relative; padding: 2px; border-radius: 25px; margin: 15px auto; width: 95%; max-width: 350px; }
  .at-card { width: 100%; background: #0a0a0f; border-radius: 25px; padding: 18px; border: 1.5px solid #252535; }

  /* Animations */
  @keyframes card-breathe-hot { 0%, 100% { border-color: rgba(255, 71, 87, 0.3); box-shadow: 0 0 10px rgba(255, 71, 87, 0.2); } 50% { border-color: var(--red); box-shadow: 0 0 25px var(--red), inset 0 0 10px rgba(255, 71, 87, 0.3); } }
  @keyframes card-breathe-reg { 0%, 100% { border-color: rgba(0, 243, 255, 0.3); box-shadow: 0 0 10px rgba(0, 243, 255, 0.2); } 50% { border-color: var(--cyan); box-shadow: 0 0 25px var(--cyan), inset 0 0 10px rgba(0, 243, 255, 0.3); } }
  @keyframes flow { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
  
  .deal-card.card-glow-hot { animation: card-breathe-hot 4s infinite ease-in-out; border: 2px solid var(--red); }
  .deal-card.card-glow-reg { animation: card-breathe-reg 4s infinite ease-in-out; border: 2px solid var(--cyan); }
  
  .brand-name { font-size: 22px; font-weight: 900; color: #fff; letter-spacing: 2px; text-transform: uppercase; text-shadow: 0 0 10px var(--cyan); }
  .nv-btn.active { border: 1px solid var(--cyan); color: var(--cyan); box-shadow: 0 0 15px var(--cyan); }
  .nv-btn.active-hot { border: 1px solid var(--red) !important; color: var(--red) !important; box-shadow: 0 0 15px var(--red) !important; }
  .nv-btn.active-fav { border: 1px solid var(--pink) !important; color: var(--pink) !important; box-shadow: 0 0 15px var(--pink) !important; }
  
  .title-plate { background: #000; padding: 10px; border-radius: 12px; font-size: 10px; text-align: center; color: #fff; font-weight: 900; }
  .ring { width: 38px; height: 38px; border: 1.5px solid #222; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: absolute; top: 15px; background: #000; cursor: pointer; z-index: 10; }
  .price-row { display: flex; justify-content: center; align-items: center; gap: 12px; margin: 15px 0; }
  .mrp-cross { color: #666; text-decoration: line-through; text-decoration-color: var(--red); font-size: 16px; }
  .deal-price { font-size: 22px; font-weight: 900; color: #fff; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
  .info-cell { padding: 8px; border-radius: 8px; font-size: 9px; text-align: center; font-weight: 900; color: #fff; border: 1.5px solid #fff; }
  .click-btn { width: 100%; padding: 12px; border-radius: 25px; border: none; background: linear-gradient(135deg, #fff 0%, #bbb 50%, #888 100%); color: #000; font-weight: 900; font-size: 16px; cursor: pointer; text-transform: uppercase; }
  .at-input, .at-select { width: 100%; background: #000; border: 1.5px solid #222; padding: 10px; color: #fff; border-radius: 10px; text-align: center; font-size: 12px; margin-bottom: 8px; }
  .action-btn { border-radius: 12px; font-weight: 900; text-transform: uppercase; border: 1.5px solid; background: transparent; cursor: pointer; padding: 8px; font-size: 9px; }
  .btn-cyan { border-color: var(--cyan); color: var(--cyan); }
  .btn-red { border-color: var(--red); color: var(--red); }
  .tgl-bg { width: 44px; height: 20px; background: #111; border-radius: 20px; border: 1.5px solid #333; position: relative; cursor: pointer; }
  .tgl-ball { position: absolute; top: 2px; width: 12px; height: 12px; border-radius: 50%; transition: 0.3s; }
  .badge { position: absolute; top: -5px; right: 5px; background: var(--red); color: #fff; font-size: 8px; padding: 2px 6px; border-radius: 10px; font-weight: 900; }
`;

export default function App() {
  // Mobile Viewport Fix
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    document.getElementsByTagName('head')[0].appendChild(meta);
  }, []);

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

  const triggerToast = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };
  const resetAuth = () => { setMobile(''); setPassword(''); setName(''); setEmail(''); setStatus('SYSTEM ONLINE'); setForgotStep(0); };
  const handleLogout = () => { setView('AUTH'); setCurr(null); };

  const handleAuth = () => {
    const now = new Date().toLocaleString('en-GB', { hour12:true });
    if (authMode === 'Signup') {
        if (mobile.length !== 10) { setStatus('INVALID MOBILE'); return; }
        setUsers([...users, { name, email, mobile, password, role, isBlocked: false, isApproved: true, id: Date.now() }]);
        setAuthMode('Login'); setStatus('SUCCESS: PLEASE LOGIN');
    } else {
        if (mobile === '7376167737' && password === '@Admin00') { 
            setLastLogin(now); setCurr({name:'OVERLORD', role:'SUPERADMIN'}); setView('SA'); return; 
        }
        const u = users.find(x => x.mobile === mobile && x.password === password);
        if (u) { setLastLogin(now); setView(u.role); setCurr(u); triggerToast(`WELCOME ${u.name || 'USER'}`); }
        else setStatus('INVALID CREDENTIALS');
    }
  };

  const DealCard = ({ deal, isAdmin, isSA }) => {
    const off = Math.round(((deal.mrp - deal.price) / deal.mrp) * 100);
    return (
      <div className={`deal-card ${deal.isHot ? 'card-glow-hot' : 'card-glow-reg'}`}>
        <div className="title-plate">{deal.isHot && '🔥 '}{deal.title.toUpperCase()}</div>
        <div className="price-row">
            <span className="mrp-cross">₹{deal.mrp}</span>
            <span className="deal-price">₹{deal.price}</span>
        </div>
        <div className="info-grid">
            <div className="info-cell">SAVE ₹{deal.mrp - deal.price}</div>
            <div className="info-cell">{off}% OFF</div>
            <div className="info-cell">{deal.brand}</div>
            <div className="info-cell">{deal.store.toUpperCase()}</div>
        </div>
        <button className="click-btn" onClick={() => window.open(deal.url, '_blank')}>{btnToggle ? 'CLICK HERE' : 'GRAB ME'}</button>
      </div>
    );
  };

  return (
    <div>
      <style>{globalStyles}</style>
      <div className="fixed-top-zone">
          <div className="header-info-container">
              <div style={{fontSize:'8px', color:'var(--cyan)'}}>{curr ? curr.name : ''}</div>
              {toast && <div style={{fontSize:'10px', color:'var(--cyan)', fontWeight:'bold'}}>{toast}</div>}
              <div style={{fontSize:'8px', color:'var(--gold)'}}>{curr ? lastLogin : ''}</div>
          </div>
          <div className="header-box"><div className="brand-name">Deal Cards</div></div>
          {curr && (
            <div className="nv-bar">
                <div className={`nv-btn ${uTab==='Home'?'active':''}`} onClick={()=>setUTab('Home')}>HOME</div>
                <div className={`nv-btn ${uTab==='Hot'?'active active-hot':''}`} onClick={()=>setUTab('Hot')}>HOT</div>
                <div className="nv-btn" style={{color:'var(--red)'}} onClick={handleLogout}>EXIT</div>
            </div>
          )}
      </div>

      {view === 'AUTH' && (
        <div className="neon-wrap"><div className="at-card">
            <input className="at-input" placeholder="MOBILE" value={mobile} onChange={e => setMobile(e.target.value)} />
            <input className="at-input" type="password" placeholder="PASSWORD" value={password} onChange={e => setPassword(e.target.value)} />
            <div style={{color: 'var(--gold)', fontSize: '9px', textAlign: 'center', marginBottom: '10px'}}>{status}</div>
            <button className="action-btn btn-cyan" style={{width:'100%', height:'42px', borderRadius:'22px'}} onClick={handleAuth}>{authMode.toUpperCase()}</button>
            <div style={{textAlign:'center', marginTop:'15px', fontSize:'10px', color:'var(--pink)'}} onClick={()=>setAuthMode(authMode==='Login'?'Signup':'Login')}>
                {authMode === 'Login' ? 'NEED AN ACCOUNT? SIGNUP' : 'HAVE AN ACCOUNT? LOGIN'}
            </div>
        </div></div>
      )}

      {view !== 'AUTH' && (
        <div style={{paddingBottom: '50px'}}>
            {deals.map(d => <DealCard key={d.id} deal={d} />)}
        </div>
      )}
    </div>
  );
}
