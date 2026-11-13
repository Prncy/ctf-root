import { useEffect, useMemo, useState } from 'react';
import AdminEvents from '../features/admin/AdminEvents.jsx';
import { PublicHome, AuthPage } from '../features/auth/AuthPages.jsx';
import { PageView } from '../features/player/PlayerPages.jsx';
import { getVisibleNavGroups } from './navigation.js';
import Sidebar from '../components/layout/Sidebar.jsx';
import Topbar from '../components/layout/Topbar.jsx';
import Dashboard from '../features/player/Dashboard.jsx';
import { Sparkles, X } from 'lucide-react';
import { challenges } from '../data/index.js';

function App() {
  const [active, setActive] = useState('Overview');
  const [authScreen, setAuthScreen] = useState(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [bookmarks, setBookmarks] = useState({ challenges: ['Cookie Crumble', 'A Very Strange Letter'], paths: ['Introduction to Cybersecurity'] });
  const toggleBookmark = (type, item) => setBookmarks(prev => { const key = type === 'challenge' ? 'challenges' : 'paths'; const saved = prev[key].includes(item.title); return { ...prev, [key]: saved ? prev[key].filter(x => x !== item.title) : [...prev[key], item.title] }; });
  const [role, setRole] = useState('player');
  const visibleNavGroups = getVisibleNavGroups(role);
  const switchRole = () => { const next = role === 'player' ? 'creator' : role === 'creator' ? 'admin' : 'player'; setRole(next); setActive(next === 'player' ? 'Overview' : next === 'creator' ? 'Creator Dashboard' : 'Admin Dashboard'); setNotice('Demo workspace: ' + next + '. Real permissions will be enforced by the backend.'); setDetail(null); };
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [detail, setDetail] = useState(null);
  const filteredChallenges = useMemo(() => challenges.filter(c => c.title.toLowerCase().includes(query.toLowerCase())), [query]);

  useEffect(() => {
    window.history.replaceState({ ctfRoot: true, page: active }, '', window.location.pathname + window.location.search);
    const handlePopState = (event) => {
      if (event.state?.ctfRoot) { setActive(event.state.page || 'Overview'); setDetail(null); }
      else { setDetail(null); setActive('Overview'); }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const selectPage = (label) => {
    if (label !== active || detail) window.history.pushState({ ctfRoot: true, page: label }, '', window.location.pathname + window.location.search);
    setActive(label);
    setSidebarOpen(false);
    if (label === 'Subscriptions') setNotice('Subscriptions are coming soon. We’re working on something good.');
    else setNotice('');
  };

  if (!hasEntered) return authScreen ? <AuthPage initialMode={authScreen} onSuccess={() => { setHasEntered(true); setAuthScreen(null); setNotice('Demo sign-in successful. Connect the backend for real accounts.'); }} onSwitch={setAuthScreen}/> : <PublicHome onLogin={() => setAuthScreen('login')} onRegister={() => setAuthScreen('register')}/>;

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <Sidebar
        visibleNavGroups={visibleNavGroups}
        active={active}
        role={role}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        switchRole={switchRole}
        selectPage={selectPage}
        setNotice={setNotice}
        signOut={() => { setHasEntered(false); setAuthScreen(null); }}
      />
      {authScreen ? <AuthPage initialMode={authScreen} onSuccess={() => { setAuthScreen(null); setNotice('Demo sign-in successful. Connect the backend for real accounts.'); }} onSwitch={setAuthScreen}/> : <main className="main">
        <Topbar active={active} query={query} setQuery={setQuery} dark={dark} setDark={setDark} setSidebarOpen={setSidebarOpen} setNotice={setNotice}/>

        <div className="content">
          {notice && <div className="notice"><Sparkles size={16}/><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15}/></button></div>}
          {role === 'admin' && active === 'Events' ? <AdminEvents /> : active === 'Overview' ? <Dashboard onNavigate={selectPage} bookmarks={bookmarks} onToggleBookmark={toggleBookmark}/> : active === 'Creator Dashboard' ? <div className="panel"><h1>Creator dashboard</h1><p>Manage your own challenges and learning paths.</p><button className="primary-button" onClick={() => selectPage('Creator Studio')}>Open Creator Studio</button></div> : active === 'Admin Dashboard' ? <div className="panel"><h1>Admin dashboard</h1><p>Manage events, assign creators, moderate content and send notifications. Admin tools are prototype placeholders.</p></div> : <PageView page={active} onNavigate={selectPage} filteredChallenges={filteredChallenges} detail={detail} onOpenDetail={(type, item) => { window.history.pushState({ ctfRoot: true, page: active, detail: true }, '', window.location.pathname + window.location.search); setDetail({ type, item }); }} onCloseDetail={() => setDetail(null)} bookmarks={bookmarks} onToggleBookmark={toggleBookmark}/>} 
          <footer className="footer"><span>© 2026 CTF Root</span><span><a href="#about">About</a><a href="#guidelines">Guidelines</a><a href="#status">System status <i className="status-dot"/></a></span><span>Built for curious minds <span className="footer-heart">♥</span></span></footer>
        </div>
      </main>}
    </div>
  );
}


export default App;
