import { useMemo, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowRight, Award, BookOpen, Bot, Boxes, ChevronDown,
  ChevronRight, CircleHelp, Code2, Compass, Flag, Flame, FolderKanban, Gamepad2,
  Github, Globe2, GraduationCap, LayoutDashboard, LifeBuoy, ListFilter, LockKeyhole,
  Menu, Moon, Search, Settings, Shield, Sparkles, Sun, Swords, Trophy, Users, X,
  Zap, Bell, Plus, ExternalLink
} from 'lucide-react';
import { currentUser, stats, paths, challenges, leaderboard, events } from './data.js';

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
  ]},
  { title: 'YOUR SPACE', items: [
    { label: 'My Profile', icon: Compass },
    { label: 'Subscriptions', icon: Sparkles, soon: true },
  ]},
];

function App() {
  const [active, setActive] = useState('Overview');
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const filteredChallenges = useMemo(() => challenges.filter(c => c.title.toLowerCase().includes(query.toLowerCase())), [query]);

  const selectPage = (label) => {
    setActive(label);
    setSidebarOpen(false);
    if (label === 'Subscriptions') setNotice('Subscriptions are coming soon. We’re working on something good.');
    else setNotice('');
  };

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark"><Shield size={19} strokeWidth={2.5}/></div>
          <span className="brand-name">ctf<span>root</span></span>
          <button className="icon-button mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <button className="workspace-switch">
          <div className="workspace-avatar">CS</div>
          <div className="workspace-copy"><strong>{currentUser.name}</strong><span>Player workspace</span></div>
          <ChevronDown size={15}/>
        </button>
        <div className="sidebar-scroll">
          {navGroups.map(group => <div className="nav-group" key={group.title}>
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
          <div className="sidebar-user"><div className="avatar">CS</div><div className="user-meta"><strong>{currentUser.name}</strong><span>Level 08 · {currentUser.level}</span></div><button className="icon-button" aria-label="Settings" onClick={() => selectPage('Settings')}><Settings size={17}/></button></div>
        </div>
      </aside>

      {sidebarOpen && <button className="scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}/>} 
      <main className="main">
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
          {active === 'Overview' ? <Dashboard onNavigate={selectPage}/> : <PageView page={active} onNavigate={selectPage} filteredChallenges={filteredChallenges}/>} 
          <footer className="footer"><span>© 2026 CTF Root</span><span><a href="#about">About</a><a href="#guidelines">Guidelines</a><a href="#status">System status <i className="status-dot"/></a></span><span>Built for curious minds <span className="footer-heart">♥</span></span></footer>
        </div>
      </main>
    </div>
  );
}

function Dashboard({ onNavigate }) {
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
      {paths.map((p, i) => <article className="learning-card" key={p.title}><div className="learning-card-top"><span className={`path-icon ${p.color}`}>{i === 0 ? <Shield size={19}/> : i === 1 ? <Globe2 size={19}/> : <LockKeyhole size={19}/>}</span><span className="tag">{p.tag}</span></div><h3>{p.title}</h3><p>By {p.creator}</p><div className="progress-meta"><span>{p.lessons}</span><strong>{p.progress}%</strong></div><div className="progress-track"><div className={`progress-fill ${p.color}`} style={{width:`${p.progress}%`}}/></div><button className="card-link" onClick={() => onNavigate('Learning Paths')}>Continue path <ArrowRight size={14}/></button></article>)}
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

function PageView({ page, onNavigate, filteredChallenges }) {
  const [tab, setTab] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const titleMap = { 'My Progress':'Your progress', Challenges:'Explore challenges', 'Learning Paths':'Learning paths', Events:'Events & competitions', Creators:'Meet the creators', Leaderboard:'Community leaderboard', Vaults:'Your vaults', 'My Profile':'Your profile', Subscriptions:'Subscriptions', Settings:'Settings' };
  const descriptionMap = { 'My Progress':'A look at how far you have come.', Challenges:'Find your next challenge. Learn, experiment, and level up.', 'Learning Paths':'Structured journeys to help you grow your skills.', Events:'Compete solo or team up with other players.', Creators:'Meet the people building hands-on cybersecurity experiences.', Leaderboard:'See how you stack up against the community.', Vaults:'Your practical challenge environments.', 'My Profile':'Your public identity in the CTF Root community.', Subscriptions:'Unlock more ways to learn. Coming soon.', Settings:'Manage your account preferences.' };
  return <div className="page-enter">
    <div className="page-title-row"><div><div className="eyebrow">CTF ROOT / {page.toUpperCase()}</div><h1>{titleMap[page] || page}</h1><p className="subheading">{descriptionMap[page] || 'Explore your CTF Root workspace.'}</p></div>{['Challenges','Learning Paths','Events'].includes(page) && <button className="primary-button" onClick={() => setShowModal(true)}><Plus size={16}/> {page === 'Events' ? 'Browse events' : 'Explore now'}</button>}</div>
    {page === 'Subscriptions' ? <div className="empty-state"><div className="empty-icon"><Sparkles size={26}/></div><span className="coming-label">COMING SOON</span><h2>Something good is on the way.</h2><p>We’re working on new ways to support your learning journey. Check back soon.</p></div> :
    page === 'Challenges' ? <><div className="filter-bar"><div className="tabs">{['All','Web','Cryptography','Forensics'].map(t => <button className={tab===t?'selected':''} onClick={() => setTab(t)} key={t}>{t}</button>)}</div><span className="muted"><ListFilter size={14}/> {filteredChallenges.length} challenges</span></div><div className="challenge-catalog">{filteredChallenges.filter(c => tab==='All'||c.category===tab).map(c => <article className="catalog-card" key={c.title}><div className={`challenge-icon large ${c.color}`}>{c.icon}</div><div className="catalog-main"><div className="catalog-meta"><span>{c.category}</span><span>·</span><span>{c.difficulty}</span></div><h3>{c.title}</h3><p>Put your skills to the test in this hands-on challenge.</p><div className="catalog-bottom"><span>{c.solves} solves</span><strong>+{c.points} CP</strong></div></div><button className="secondary-button" onClick={() => setShowModal(true)}>View challenge <ArrowRight size={14}/></button></article>)}</div></> :
    page === 'Leaderboard' ? <div className="panel table-panel"><div className="table-head"><span>RANK</span><span>PLAYER</span><span>CHALLENGE POINTS</span><span>THIS WEEK</span></div>{leaderboard.map(p=><div className={`table-row ${p.you?'you':''}`} key={p.rank}><strong>#{p.rank}</strong><div className="table-player"><div className="avatar small">{p.avatar}</div><strong>{p.name}{p.you&&<span className="you-tag">YOU</span>}</strong></div><strong>{p.points}</strong><span className="trend">{p.change}</span></div>)}</div> :
    page === 'Learning Paths' ? <div className="learning-grid page-learning">{paths.map((p,i)=><article className="learning-card" key={p.title}><div className="learning-card-top"><span className={`path-icon ${p.color}`}><BookOpen size={19}/></span><span className="tag">{p.tag}</span></div><h3>{p.title}</h3><p>By {p.creator}</p><div className="progress-meta"><span>{p.lessons}</span><strong>{p.progress}%</strong></div><div className="progress-track"><div className={`progress-fill ${p.color}`} style={{width:`${p.progress}%`}}/></div><button className="card-link" onClick={() => setShowModal(true)}>Open learning path <ArrowRight size={14}/></button></article>)}</div> :
    page === 'Events' ? <div className="event-catalog">{events.map((e,i)=><article className="event-card" key={e.title}><div className="event-card-art"><span>{i===0?<Swords size={32}/>:<Code2 size={32}/>}</span><small>{e.type}</small></div><div className="event-card-body"><span className="event-status">{e.status}</span><h3>{e.title}</h3><p>{e.date} · {e.participants}</p><button className="card-link" onClick={() => setShowModal(true)}>View event <ArrowRight size={14}/></button></div></article>)}</div> :
    page === 'Creators' ? <div className="creator-grid">{['Root Academy','NullByte','CipherLab'].map((n,i)=><article className="creator-card" key={n}><div className="creator-avatar">{n.split(' ').map(x=>x[0]).join('')}</div><h3>{n}</h3><p>{['Web security & fundamentals','Offensive security labs','Cryptography & forensics'][i]}</p><div className="creator-active"><span className="live-dot"/> Active vaults</div><div className="social-links"><a href="#github"><Github size={15}/> GitHub</a><a href="#profile"><ExternalLink size={14}/> Profile</a></div></article>)}</div> :
    page === 'My Progress' ? <div className="panel progress-panel"><div className="progress-summary"><div><span className="eyebrow">YOUR LEARNING JOURNEY</span><h2>You're building momentum.</h2><p>Keep showing up. Every solved challenge is progress.</p></div><div className="progress-ring"><strong>68%</strong><span>overall</span></div></div>{paths.map(p=><div className="path-progress-row" key={p.title}><div><strong>{p.title}</strong><span>{p.lessons}</span></div><strong>{p.progress}%</strong><div className="progress-track"><div className={`progress-fill ${p.color}`} style={{width:`${p.progress}%`}}/></div></div>)}</div> :
    page === 'My Profile' ? <div className="panel profile-panel"><div className="profile-cover"/><div className="profile-main"><div className="avatar profile-avatar">CS</div><div><h2>CyberScythe</h2><p>Curious mind. Learning by breaking things and putting them back together.</p><span className="muted">Joined August 2026 · Zambia</span></div><button className="secondary-button">Edit profile</button></div><div className="profile-stats"><div><strong>4,909</strong><span>Challenge points</span></div><div><strong>1,240</strong><span>Learning points</span></div><div><strong>860</strong><span>Event points</span></div></div><div className="tabs profile-tabs">{['Overview','Activity','Challenges','Badges'].map(t=><button className={tab===t?'selected':''} onClick={()=>setTab(t)} key={t}>{t}</button>)}</div><div className="profile-tab-content">{tab==='Badges'?'Badges are coming soon.':tab==='Challenges'?'Your solved challenges will appear here.':tab==='Activity'?'Your recent activity will appear here.':'Welcome to your CTF Root profile.'}</div></div> :
    page === 'Vaults' ? <div className="empty-state"><div className="empty-icon"><Boxes size={26}/></div><h2>No active vaults</h2><p>When you launch a practical challenge, your running vaults will show up here.</p><button className="primary-button" onClick={() => onNavigate('Challenges')}>Find a challenge <ArrowRight size={14}/></button></div> :
    <div className="empty-state"><div className="empty-icon"><Settings size={26}/></div><h2>{page} is taking shape</h2><p>This section will be connected as we build out CTF Root.</p></div>}
    {showModal && <div className="modal-backdrop" onClick={()=>setShowModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="icon-button modal-close" onClick={()=>setShowModal(false)}><X size={17}/></button><div className="empty-icon"><Sparkles size={24}/></div><h2>Demo experience</h2><p>This screen is using sample data for now. We’ll connect the real workflows as development progresses.</p><button className="primary-button" onClick={()=>setShowModal(false)}>Got it</button></div></div>}
  </div>;
}

export default App;