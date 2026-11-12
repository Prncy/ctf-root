import { useEffect, useMemo, useState } from 'react';
import AdminEvents from '../features/admin/AdminEvents.jsx';
import { PublicHome, AuthPage } from '../features/auth/AuthPages.jsx';
import { PageView } from '../features/player/PlayerPages.jsx';
import Dashboard from '../features/player/Dashboard.jsx';
import {
  Activity, ArrowDownRight, ArrowRight, Award, BookOpen, Bot, Boxes, ChevronDown,
  ChevronRight, CircleHelp, Code2, Compass, Flag, Flame, FolderKanban, Gamepad2,
  Github, Globe2, GraduationCap, LayoutDashboard, LifeBuoy, ListFilter, LockKeyhole, Bookmark, BookmarkCheck,
  Menu, Moon, Search, Settings, Shield, Sparkles, Sun, Swords, Trophy, Users, X,
  Zap, Bell, Plus, ExternalLink
} from 'lucide-react';
import { currentUser, stats, paths, challenges, leaderboard, events } from '../data/index.js';

const navGroups = [
  { title: 'WORKSPACE', items: [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'My Progress', icon: Activity },
    { label: 'Challenges', icon: Flag, count: 'New' },
    { label: 'Learning Paths', icon: BookOpen },
    { label: 'Events', icon: Trophy },
  ]},
  { title: 'DISCOVER', items: [
    { label: 'Creators', icon: Users },
    { label: 'Leaderboard', icon: Award },
    { label: 'Vaults', icon: Boxes },
    { label: 'Bookmarks', icon: FolderKanban },
  ]},
  { title: 'YOUR SPACE', items: [
    { label: 'My Profile', icon: Compass },
    { label: 'Creator Studio', icon: Code2 },
    { label: 'Subscriptions', icon: Sparkles, soon: true },
  ]},
];

function App() {
  const [active, setActive] = useState('Overview');
  const [authScreen, setAuthScreen] = useState(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [bookmarks, setBookmarks] = useState({ challenges: ['Cookie Crumble', 'A Very Strange Letter'], paths: ['Introduction to Cybersecurity'] });
  const toggleBookmark = (type, item) => setBookmarks(prev => { const key = type === 'challenge' ? 'challenges' : 'paths'; const saved = prev[key].includes(item.title); return { ...prev, [key]: saved ? prev[key].filter(x => x !== item.title) : [...prev[key], item.title] }; });
  const [role, setRole] = useState('player');
  const visibleNavGroups = role === 'creator' ? [{ title: 'CREATOR WORKSPACE', items: [{ label: 'Creator Dashboard', icon: LayoutDashboard }, { label: 'Creator Studio', icon: Code2 }, { label: 'My Profile', icon: Compass }, { label: 'Settings', icon: Settings }] }] : role === 'admin' ? [{ title: 'ADMINISTRATION', items: [{ label: 'Admin Dashboard', icon: Shield }, { label: 'Events', icon: Trophy }, { label: 'Creators', icon: Users }, { label: 'Notifications', icon: Bell }, { label: 'Settings', icon: Settings }] }] : navGroups.map(g => ({ ...g, items: g.items.filter(i => i.label !== 'Creator Studio') }));
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
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark"><Shield size={19} strokeWidth={2.5}/></div>
          <span className="brand-name">ctf<span>root</span></span>
          <button className="icon-button mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <button className="workspace-switch" onClick={switchRole} title="Switch demo workspace">
          <div className="workspace-avatar">CS</div>
          <div className="workspace-copy"><strong>{currentUser.name}</strong><span>{role === 'player' ? 'Player workspace' : role === 'creator' ? 'Creator workspace' : 'Admin workspace'}</span></div>
          <ChevronDown size={15}/>
        </button>
        <div className="sidebar-scroll">
          {visibleNavGroups.map(group => <div className="nav-group" key={group.title}>
            <div className="nav-heading">{group.title}</div>
            {group.items.map(item => {
              const Icon = item.icon;
              return <button key={item.label} className={`nav-item ${active === item.label ? 'active' : ''}`} onClick={() => selectPage(item.label)}>
                <Icon size={17}/><span>{item.label}</span>
                {item.count && <span className="nav-pill">{item.count}</span>}
                {item.soon && <span className="soon-dot">Soon</span>}
              </button>;
            })}
          </div>)}
        </div>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><LifeBuoy size={17}/></div><strong>Need a hand?</strong><p>Explore the guide and get started with CTF Root.</p><button onClick={() => setNotice('The CTF Root guide is coming soon.')}>Open guide <ArrowRight size={13}/></button></div>
          <div className="sidebar-user"><div className="avatar">CS</div><div className="user-meta"><strong>{currentUser.name}</strong><span>Level 08 · {currentUser.level}</span></div><button className="icon-button" aria-label="Settings" onClick={() => selectPage('Settings')}><Settings size={17}/></button></div><button className="auth-signout" onClick={() => { setHasEntered(false); setAuthScreen(null); }}>Sign out</button>
        </div>
      </aside>

      {sidebarOpen && <button className="scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}/>} 
      {authScreen ? <AuthPage initialMode={authScreen} onSuccess={() => { setAuthScreen(null); setNotice('Demo sign-in successful. Connect the backend for real accounts.'); }} onSwitch={setAuthScreen}/> : <main className="main">
        <header className="topbar">
          <div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={20}/></button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14}/><strong>{active}</strong></div></div>
          <div className="topbar-actions">
            <label className="global-search"><Search size={16}/><input placeholder="Search CTF Root..." value={query} onChange={e => setQuery(e.target.value)}/><kbd>⌘ K</kbd></label>
            <button className="icon-button notification" aria-label="Notifications" onClick={() => setNotice('You’re all caught up!')}><Bell size={18}/><i/></button>
            <button className="icon-button" aria-label="Toggle theme" onClick={() => setDark(!dark)}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
            <div className="avatar top-avatar">CS</div>
          </div>
        </header>

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
