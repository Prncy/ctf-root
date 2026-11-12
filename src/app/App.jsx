import { useEffect, useMemo, useState } from 'react';
import AdminEvents from '../features/admin/AdminEvents.jsx';
import { PublicHome, AuthPage } from '../features/auth/AuthPages.jsx';
import { PageView } from '../features/player/PlayerPages.jsx';
import {
  Activity, ArrowDownRight, ArrowRight, Award, BookOpen, Bot, Boxes, ChevronDown,
  ChevronRight, CircleHelp, Code2, Compass, Flag, Flame, FolderKanban, Gamepad2,
  Github, Globe2, GraduationCap, LayoutDashboard, LifeBuoy, ListFilter, LockKeyhole, Bookmark, BookmarkCheck,
  Menu, Moon, Search, Settings, Shield, Sparkles, Sun, Swords, Trophy, Users, X,
  Zap, Bell, Plus, ExternalLink
} from 'lucide-react';
import { currentUser, stats, paths, challenges, leaderboard, events } from '../data.js';

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


function Dashboard({ onNavigate, bookmarks, onToggleBookmark }) {
  return <div className="page-enter">
    <section className="welcome-row">
      <div><div className="eyebrow"><span className="live-dot"/> YOUR CYBERSECURITY JOURNEY</div><h1>Welcome back, <span>CyberScythe</span> <span className="wave">✳</span></h1><p className="subheading">Ready to learn something new and break a few things (ethically)?</p></div>
      <button className="primary-button" onClick={() => onNavigate('Challenges')}><Compass size={16}/> Explore challenges <ArrowRight size={15}/></button>
    </section>

    <section className="hero-banner">
      <div className="hero-grid"/>
      <div className="hero-content"><div className="hero-kicker"><Sparkles size={14}/> KEEP YOUR MOMENTUM</div><h2>Every exploit starts<br/>with <em>curiosity.</em></h2><p>Pick up where you left off, or find a new challenge that pushes your skills further.</p><button className="hero-button" onClick={() => onNavigate('Learning Paths')}>Continue learning <ArrowRight size={15}/></button></div>
      <div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-shield"><Shield size={76} strokeWidth={1.2}/><span>ROOT</span></div><div className="float-tag tag-one"><Code2 size={14}/> 0x7F</div><div className="float-tag tag-two"><LockKeyhole size={14}/> ACCESS GRANTED</div><div className="float-tag tag-three"><Zap size={14}/> +250 XP</div></div>
      <div className="hero-bottom"><span><span className="live-dot"/> PLATFORM ACTIVITY</span><span>New challenges added weekly <ArrowRight size={13}/></span></div>
    </section>

    <section className="stats-grid">
      {stats.map((s, i) => <article className="stat-card" key={s.label}><div className="stat-top"><span>{s.label}</span><span className={`stat-icon ${s.tone}`}>{i === 0 ? <Trophy size={17}/> : i === 1 ? <Flag size={17}/> : i === 2 ? <GraduationCap size={17}/> : <Flame size={17}/>}</span></div><div className="stat-value">{s.value}</div><div className="stat-foot"><span className="trend"><ArrowDownRight size={13}/>{s.change}</span></div></article>)}
    </section>

    <div className="section-heading"><div><div className="eyebrow">PICK UP WHERE YOU LEFT OFF</div><h2>Continue learning</h2></div><button className="text-button" onClick={() => onNavigate('Learning Paths')}>View all paths <ArrowRight size={15}/></button></div>
    <section className="learning-grid">
      {paths.map((p, i) => <article className="learning-card" key={p.title}><div className="learning-card-top"><span className={`path-icon ${p.color}`}>{i === 0 ? <Shield size={19}/> : i === 1 ? <Globe2 size={19}/> : <LockKeyhole size={19}/>}</span><span className="tag">{p.tag}</span><button className="bookmark-button" aria-label={bookmarks.paths.includes(p.title)?'Remove bookmark':'Add bookmark'} title={bookmarks.paths.includes(p.title)?'Remove bookmark':'Add bookmark'} onClick={()=>onToggleBookmark('path',p)}>{bookmarks.paths.includes(p.title)?<BookmarkCheck size={16}/>:<Bookmark size={16}/>}</button></div><h3>{p.title}</h3><p>By {p.creator}</p><div className="progress-meta"><span>{p.lessons}</span><strong>{p.progress}%</strong></div><div className="progress-track"><div className={`progress-fill ${p.color}`} style={{width:`${p.progress}%`}}/></div><button className="card-link" onClick={() => onNavigate('Learning Paths')}>Continue path <ArrowRight size={14}/></button></article>)}
    </section>

    <div className="two-column">
      <section className="panel"><div className="panel-heading"><div><div className="eyebrow">FRESH FROM THE ROOT</div><h2>Featured challenges</h2></div><button className="icon-button" onClick={() => onNavigate('Challenges')} aria-label="View challenges"><ArrowRight size={17}/></button></div>
        <div className="challenge-list">{challenges.map(c => <div className="challenge-row" key={c.title}><div className={`challenge-icon ${c.color}`}>{c.icon}</div><div className="challenge-info"><strong>{c.title}</strong><span>{c.category} <b>·</b> {c.solves} solves</span></div><span className={`difficulty ${c.difficulty.toLowerCase()}`}>{c.difficulty}</span><strong className="points">+{c.points}</strong></div>)}</div>
        <button className="panel-footer-link" onClick={() => onNavigate('Challenges')}>Browse all challenges <ArrowRight size={14}/></button>
      </section>
      <section className="panel"><div className="panel-heading"><div><div className="eyebrow">MAKE YOUR MARK</div><h2>Upcoming events</h2></div><button className="icon-button" onClick={() => onNavigate('Events')} aria-label="View events"><ArrowRight size={17}/></button></div>
        <div className="event-list">{events.map((e,i) => <div className="event-row" key={e.title}><div className={`event-date ${i ? 'blue' : 'green'}`}><strong>{i ? '08' : '14'}</strong><span>NOV</span></div><div className="event-info"><strong>{e.title}</strong><span>{e.type} · {e.participants}</span><small>{e.status}</small></div><ChevronRight size={16}/></div>)}</div>
        <button className="panel-footer-link" onClick={() => onNavigate('Events')}>Explore events <ArrowRight size={14}/></button>
      </section>
    </div>
    <section className="leaderboard-strip"><div className="leaderboard-title"><div className="eyebrow">THE COMMUNITY</div><h2>Top players this week</h2><p>A little friendly competition never hurt.</p><button className="text-button" onClick={() => onNavigate('Leaderboard')}>Full leaderboard <ArrowRight size={14}/></button></div><div className="leaderboard-mini">{leaderboard.slice(0,3).map(p => <div className="leader-mini-row" key={p.rank}><span className="rank">0{p.rank}</span><div className="avatar small">{p.avatar}</div><strong>{p.name}</strong><span className="mini-points">{p.points} <small>pts</small></span></div>)}</div></section>
  </div>;
}

export default App;
