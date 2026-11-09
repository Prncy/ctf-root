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
    { label: 'Bookmarks', icon: FolderKanban },
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
  const [detail, setDetail] = useState(null);
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
          {active === 'Overview' ? <Dashboard onNavigate={selectPage}/> : <PageView page={active} onNavigate={selectPage} filteredChallenges={filteredChallenges} detail={detail} onOpenDetail={(type, item) => setDetail({ type, item })} onCloseDetail={() => setDetail(null)}/>} 
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

function PageView({ page, onNavigate, filteredChallenges, detail, onOpenDetail, onCloseDetail }) {
  const [tab, setTab] = useState('All');
  const [showModal, setShowModal] = useState(false);
  if (detail) return <DetailView detail={detail} onBack={onCloseDetail}/>;
  const titleMap = { 'My Progress':'Your progress', Challenges:'Explore challenges', 'Learning Paths':'Learning paths', Events:'Events & competitions', Creators:'Meet the creators', Leaderboard:'Community leaderboard', Vaults:'Your vaults', 'My Profile':'Your profile', Bookmarks:'Your bookmarks', Subscriptions:'Subscriptions', Settings:'Settings' };
  const descriptionMap = { 'My Progress':'A look at how far you have come.', Challenges:'Find your next challenge. Learn, experiment, and level up.', 'Learning Paths':'Structured journeys to help you grow your skills.', Events:'Compete solo or team up with other players.', Creators:'Meet the people building hands-on cybersecurity experiences.', Leaderboard:'See how you stack up against the community.', Vaults:'Your practical challenge environments.', 'My Profile':'Your public identity in the CTF Root community.', Bookmarks:'Challenges and learning resources you have saved for later.', Subscriptions:'Unlock more ways to learn. Coming soon.', Settings:'Manage your account preferences.' };
  return <div className="page-enter">
    <div className="page-title-row"><div><div className="eyebrow">CTF ROOT / {page.toUpperCase()}</div><h1>{titleMap[page] || page}</h1><p className="subheading">{descriptionMap[page] || 'Explore your CTF Root workspace.'}</p></div>{['Challenges','Learning Paths','Events'].includes(page) && <button className="primary-button" onClick={() => setShowModal(true)}><Plus size={16}/> {page === 'Events' ? 'Browse events' : 'Explore now'}</button>}</div>
    {page === 'Subscriptions' ? <div className="empty-state"><div className="empty-icon"><Sparkles size={26}/></div><span className="coming-label">COMING SOON</span><h2>Something good is on the way.</h2><p>We’re working on new ways to support your learning journey. Check back soon.</p></div> :
    page === 'Challenges' ? <><div className="filter-bar"><div className="tabs">{['All','Web','Cryptography','Forensics'].map(t => <button className={tab===t?'selected':''} onClick={() => setTab(t)} key={t}>{t}</button>)}</div><span className="muted"><ListFilter size={14}/> {filteredChallenges.length} challenges</span></div><div className="challenge-catalog">{filteredChallenges.filter(c => tab==='All'||c.category===tab).map(c => <article className="catalog-card" key={c.title}><div className={`challenge-icon large ${c.color}`}>{c.icon}</div><div className="catalog-main"><div className="catalog-meta"><span>{c.category}</span><span>·</span><span>{c.difficulty}</span></div><h3>{c.title}</h3><p>Put your skills to the test in this hands-on challenge.</p><div className="catalog-bottom"><span>{c.solves} solves</span><strong>+{c.points} CP</strong></div></div><button className="secondary-button" onClick={() => onOpenDetail('challenge', c)}>View challenge <ArrowRight size={14}/></button></article>)}</div></> :
    page === 'Leaderboard' ? <div className="panel table-panel"><div className="table-head"><span>RANK</span><span>PLAYER</span><span>CHALLENGE POINTS</span><span>THIS WEEK</span></div>{leaderboard.map(p=><div className={`table-row ${p.you?'you':''}`} key={p.rank}><strong>#{p.rank}</strong><div className="table-player"><div className="avatar small">{p.avatar}</div><strong>{p.name}{p.you&&<span className="you-tag">YOU</span>}</strong></div><strong>{p.points}</strong><span className="trend">{p.change}</span></div>)}</div> :
    page === 'Learning Paths' ? <div className="learning-grid page-learning">{paths.map((p,i)=><article className="learning-card" key={p.title}><div className="learning-card-top"><span className={`path-icon ${p.color}`}><BookOpen size={19}/></span><span className="tag">{p.tag}</span></div><h3>{p.title}</h3><p>By {p.creator}</p><div className="progress-meta"><span>{p.lessons}</span><strong>{p.progress}%</strong></div><div className="progress-track"><div className={`progress-fill ${p.color}`} style={{width:`${p.progress}%`}}/></div><button className="card-link" onClick={() => onOpenDetail('path', p)}>Open learning path <ArrowRight size={14}/></button></article>)}</div> :
    page === 'Events' ? <div className="event-catalog">{events.map((e,i)=><article className="event-card" key={e.title}><div className="event-card-art"><span>{i===0?<Swords size={32}/>:<Code2 size={32}/>}</span><small>{e.type}</small></div><div className="event-card-body"><span className="event-status">{e.status}</span><h3>{e.title}</h3><p>{e.date} · {e.participants}</p><button className="card-link" onClick={() => onOpenDetail('event', e)}>View event <ArrowRight size={14}/></button></div></article>)}</div> :
    page === 'Creators' ? <div className="creator-grid">{['Root Academy','NullByte','CipherLab'].map((n,i)=><article className="creator-card" key={n}><div className="creator-avatar">{n.split(' ').map(x=>x[0]).join('')}</div><h3>{n}</h3><p>{['Web security & fundamentals','Offensive security labs','Cryptography & forensics'][i]}</p><div className="creator-active"><span className="live-dot"/> Active vaults</div><div className="social-links"><a href="#github"><Github size={15}/> GitHub</a><a href="#profile"><ExternalLink size={14}/> Profile</a></div></article>)}</div> :
    page === 'My Progress' ? <div className="panel progress-panel"><div className="progress-summary"><div><span className="eyebrow">YOUR LEARNING JOURNEY</span><h2>You're building momentum.</h2><p>Keep showing up. Every solved challenge is progress.</p></div><div className="progress-ring"><strong>68%</strong><span>overall</span></div></div>{paths.map(p=><div className="path-progress-row" key={p.title}><div><strong>{p.title}</strong><span>{p.lessons}</span></div><strong>{p.progress}%</strong><div className="progress-track"><div className={`progress-fill ${p.color}`} style={{width:`${p.progress}%`}}/></div></div>)}</div> :
    page === 'My Profile' ? <div className="panel profile-panel"><div className="profile-cover"/><div className="profile-main"><div className="avatar profile-avatar">CS</div><div><h2>CyberScythe</h2><p>Curious mind. Learning by breaking things and putting them back together.</p><span className="muted">Joined August 2026 · Zambia</span></div><button className="secondary-button">Edit profile</button></div><div className="profile-stats"><div><strong>4,909</strong><span>Challenge points</span></div><div><strong>1,240</strong><span>Learning points</span></div><div><strong>860</strong><span>Event points</span></div></div><div className="tabs profile-tabs">{['Overview','Activity','Challenges','Badges'].map(t=><button className={tab===t?'selected':''} onClick={()=>setTab(t)} key={t}>{t}</button>)}</div><div className="profile-tab-content">{tab==='Badges'?'Badges are coming soon.':tab==='Challenges'?'Your solved challenges will appear here.':tab==='Activity'?'Your recent activity will appear here.':'Welcome to your CTF Root profile.'}</div></div> :
    page === 'Bookmarks' ? <div className="panel"><div className="panel-heading"><div><div className="eyebrow">SAVED FOR LATER</div><h2>Bookmarked challenges</h2></div><span className="tag">2 saved</span></div>{challenges.slice(0,2).map(c=><div className="challenge-row" key={c.title}><div className={'challenge-icon '+c.color}>{c.icon}</div><div className="challenge-info"><strong>{c.title}</strong><span>{c.category} · {c.difficulty}</span></div><button className="text-button" onClick={()=>onOpenDetail('challenge',c)}>Open <ArrowRight size={14}/></button></div>)}<div className="panel-heading bookmark-subhead"><div><div className="eyebrow">LEARNING RESOURCES</div><h2>Saved learning paths</h2></div><span className="tag">1 saved</span></div>{paths.slice(0,1).map(p=><div className="challenge-row" key={p.title}><div className={'path-icon '+p.color}><BookOpen size={18}/></div><div className="challenge-info"><strong>{p.title}</strong><span>{p.creator} · {p.tag}</span></div><button className="text-button" onClick={()=>onOpenDetail('path',p)}>Open <ArrowRight size={14}/></button></div>)}</div> :
    page === 'Vaults' ? <div className="empty-state"><div className="empty-icon"><Boxes size={26}/></div><h2>No active vaults</h2><p>When you launch a practical challenge, your running vaults will show up here.</p><button className="primary-button" onClick={() => onNavigate('Challenges')}>Find a challenge <ArrowRight size={14}/></button></div> :
    <div className="empty-state"><div className="empty-icon"><Settings size={26}/></div><h2>{page} is taking shape</h2><p>This section will be connected as we build out CTF Root.</p></div>}
    {showModal && <div className="modal-backdrop" onClick={()=>setShowModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="icon-button modal-close" onClick={()=>setShowModal(false)}><X size={17}/></button><div className="empty-icon"><Sparkles size={24}/></div><h2>Demo experience</h2><p>This screen is using sample data for now. We’ll connect the real workflows as development progresses.</p><button className="primary-button" onClick={()=>setShowModal(false)}>Got it</button></div></div>}
  </div>;
}


const lessonTitles=['Getting started','Core concepts','Hands-on practice','Knowledge check','Putting it together'];
const lessonBodies=[
  'Cybersecurity is the practice of protecting systems, networks, and information from unauthorised access or damage. Ethical security work is performed with permission and a clearly defined scope.',
  'A vulnerability is a weakness that could be abused. A threat is something that may exploit a weakness, while risk describes the likelihood and impact of that event.',
  'A good first step in a practical investigation is to observe the target carefully, record what you notice, and change one variable at a time. Stay within the authorised lab environment.',
  'Security knowledge becomes useful when you can explain why a weakness exists, how it could be abused, and what would reduce the risk.',
  'Bring the process together: define scope, gather information, identify weaknesses, validate them safely, document evidence, and recommend a fix.'
];
const lessonTips=['Only test systems when you have clear permission.','Do not confuse a threat with a vulnerability: one may exploit the other.','Keep notes so you can explain and reproduce your observations.','A strong explanation includes both the weakness and its impact.','Responsible reporting includes clear evidence and practical remediation.'];
const lessonQuestions=['Which statement best describes ethical security testing?','What is a vulnerability?','What should you do first when beginning an authorised lab task?','What should a useful security finding explain?','Which sequence best describes a responsible assessment?'];
const lessonOptions=[['Testing any system you can reach','Testing within permission and agreed scope','Hiding activity from the system owner'],['A weakness that could be exploited','A person using a computer','A security policy document'],['Run random tools immediately','Define the scope and observe the target','Attack unrelated systems'],['Only the tool used','The weakness, its impact, and evidence','Only the final score'],['Exploit, publish, leave','Define scope, investigate, validate safely, report','Scan everything without permission']];
const lessonAnswers=[lessonOptions[0][1],lessonOptions[1][0],lessonOptions[2][1],lessonOptions[3][1],lessonOptions[4][1]];

function DetailView({ detail, onBack }) {
  const [tab, setTab] = useState('Overview');
  const [answer, setAnswer] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [submissionNotice, setSubmissionNotice] = useState(null);
  const [solved, setSolved] = useState(false);
  const [chatText, setChatText] = useState('');
  const [messages, setMessages] = useState([{name:'bytebandit',text:'Anyone found the first clue?'},{name:'rootkitten',text:'Checking the request headers now.'}]);
  const [lessonIndex, setLessonIndex] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [quizChoice, setQuizChoice] = useState('');
  const [quizFeedback, setQuizFeedback] = useState('');
  const {type,item} = detail;
  const challenge = type === 'challenge';
  const path = type === 'path';
  const event = type === 'event';
  const pathProgress = completedLessons.length >= lessonTitles.length ? 100 : Math.round((completedLessons.length / lessonTitles.length) * 100);
  const maxAttempts = item.banOnExhaustion && Number.isInteger(item.maxAttempts) && item.maxAttempts > 0 ? item.maxAttempts : null;
  const attemptsLeft = maxAttempts === null ? null : Math.max(0, maxAttempts - attemptCount);
  const submissionsBlocked = !!(maxAttempts !== null && attemptsLeft === 0 && item.banOnExhaustion);
  const subtitle = challenge ? item.category + ' · ' + item.difficulty + ' difficulty' : path ? item.tag + ' learning path · By ' + item.creator : item.type + ' · ' + item.date;
  const tabs = challenge ? ['Overview','Hints','Submissions'] : path ? ['Overview','Curriculum','Discussion'] : ['Overview','Leaderboard',...(item.type.toLowerCase().includes('team')?['Team chat']:[])];
  const sendMessage = () => { if (!chatText.trim()) return; setMessages([...messages,{name:'CyberScythe',text:chatText.trim()}]); setChatText(''); };
  return <div className="page-enter detail-page">
    <button className="back-link" onClick={onBack}><ArrowRight size={14}/> Back to {challenge?'challenges':path?'learning paths':'events'}</button>
    <section className="detail-hero"><div className="eyebrow">CTF ROOT / {type.toUpperCase()} DETAILS</div><div className="detail-title-row"><div><h1>{item.title}</h1><p className="subheading">{subtitle}</p></div><span className="tag">{challenge?'+'+item.points+' CP':path?pathProgress+'% complete':item.status}</span></div><p className="detail-intro">{challenge?'A hands-on challenge designed to test your curiosity and problem-solving skills. Examine the materials, identify the weakness, and submit the correct flag.':path?'Build your skills step by step with guided lessons, practical activities, and knowledge checks.':'Compete, learn from other players, and put your cybersecurity skills to the test.'}</p><div className="detail-meta">{challenge?item.solves+' solves · '+item.category+' · '+item.difficulty:path?item.lessons+' · '+item.creator:item.participants+' · '+item.type+' · '+item.date}</div></section>
    <div className="detail-tabs">{tabs.map(t=><button className={tab===t?'selected':''} key={t} onClick={()=>setTab(t)}>{t}</button>)}</div>
    <div className="detail-columns"><section className="panel detail-main-panel">
      {challenge && tab==='Overview' && <><div className="eyebrow">CHALLENGE BRIEF</div><h2>Click and investigate</h2><p>Start by exploring the challenge carefully. Look for unusual behaviour, inspect the information available, and connect the clues. Find the flag in the expected format.</p><div className="challenge-instructions"><strong>What to do</strong><ol><li>Read the description and inspect the provided resources.</li><li>Identify the vulnerability or hidden information.</li><li>Submit the flag using the form below.</li></ol></div><label className="field-label">Flag submission</label><div className="submit-row"><input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="CTFROOT{...}" disabled={solved||submissionsBlocked}/><button className="primary-button" disabled={!answer.trim()||solved||submissionsBlocked} onClick={()=>{const correct=answer.trim()===item.demoFlag; if(correct){setSolved(true);setSubmissionNotice({kind:'success',title:'Correct!',message:'That is the correct flag. You have solved this challenge and earned '+item.points+' challenge points.'});}else{const next=attemptCount+1;setAttemptCount(next);const remaining=maxAttempts===null?null:Math.max(0,maxAttempts-next);setSubmissionNotice({kind:'error',title:'Wrong flag',message:remaining===null?'That flag is incorrect. Try again.':remaining>0?'That flag is incorrect. You have '+remaining+' attempt'+(remaining===1?'':'s')+' left.':item.banOnExhaustion?'You have used all your attempts. You can no longer submit flags for this challenge.':'You have used all your attempts. No more submissions are available.'});}setAnswer('');}}><Flag size={14}/> Submit flag</button></div>{maxAttempts!==null&&<p className="attempt-counter">{submissionsBlocked?'Submissions locked':attemptsLeft+' of '+maxAttempts+' attempts remaining'}{item.banOnExhaustion?' · attempts are limited':''}</p>}{submissionNotice&&<div className={'submission-notice '+submissionNotice.kind} role="status"><div className="notice-icon">{submissionNotice.kind==='success'?'✓':'!'}</div><div><strong>{submissionNotice.title}</strong><p>{submissionNotice.message}</p></div><button aria-label="Dismiss message" onClick={()=>setSubmissionNotice(null)}>×</button></div>}<p className="muted">Demo only: this uses sample flags and browser state. Server-side validation and persistent attempt tracking will be added with the backend.</p></>}
      {challenge && tab==='Hints' && <><h2>Hints</h2><div className="hint-card"><strong>Hint 01 · Gentle nudge</strong><p>Pay attention to what the browser sends, not just what the page displays.</p></div><div className="hint-card locked"><strong>Hint 02 · More specific</strong><p>This hint can be unlocked in the full challenge experience.</p></div></>}
      {challenge && tab==='Submissions' && <><h2>Your submissions</h2><div className="empty-inline">No submissions yet. Your attempts will appear here.</div></>}
      {path && tab==='Overview' && <><h2>About this learning path</h2><p>This guided path combines short lessons with practical activities. Work through the modules in order, revisit material when needed, and track your progress as you go.</p><div className="path-overview-stats"><div><strong>{item.lessons.split(' ')[0]}</strong><span>Lessons completed</span></div><div><strong>{pathProgress}%</strong><span>Progress</span></div><div><strong>{item.tag}</strong><span>Difficulty</span></div></div><button className="primary-button" onClick={()=>setTab('Curriculum')}>Continue learning <ArrowRight size={14}/></button></>}
      {path && tab==='Curriculum' && <><h2>{lessonIndex===null?'Course curriculum':'Lesson '+(lessonIndex+1)}</h2>{lessonIndex===null ? <><p>Complete each lesson activity to unlock the next one. Your progress is saved in this demo while the page remains open.</p><div className="curriculum-list">{lessonTitles.map((x,i)=>{const done=completedLessons.includes(i);const unlocked=i===0||completedLessons.includes(i-1);return <article className={`curriculum-item lesson-card ${!unlocked?'is-locked':''}`} key={x}><div className="lesson-card-top"><span className="lesson-number">{String(i+1).padStart(2,'0')}</span><div><strong>{x}</strong><small>{done?'Completed':unlocked?'Ready to learn':'Complete the previous lesson to unlock'}</small></div><span className="lesson-state">{done?'✓':unlocked?'○':'🔒'}</span></div><button className="secondary-button" disabled={!unlocked} onClick={()=>{setLessonIndex(i);setQuizChoice('');setQuizFeedback('');}}>{done?'Review lesson':unlocked?'Open lesson':'Locked'} <ArrowRight size={13}/></button></article>})}</div></> : <><button className="back-link" onClick={()=>setLessonIndex(null)}><ArrowRight size={13}/> Back to curriculum</button><div className="lesson-reading"><span className="eyebrow">LESSON {String(lessonIndex+1).padStart(2,'0')} · 5 MIN READ</span><h3>{lessonTitles[lessonIndex]}</h3><p>{lessonBodies[lessonIndex]}</p><div className="challenge-instructions"><strong>Remember</strong><p>{lessonTips[lessonIndex]}</p></div><h3>Quick knowledge check</h3><p>{lessonQuestions[lessonIndex]}</p><div className="quiz-options">{lessonOptions[lessonIndex].map(option=><button key={option} className={quizChoice===option?'selected':''} onClick={()=>{setQuizChoice(option);setQuizFeedback('');}}>{option}</button>)}</div>{quizFeedback&&<p className={quizFeedback.startsWith('Correct')?'quiz-feedback success':'quiz-feedback'}>{quizFeedback}</p>}<div className="lesson-actions"><button className="secondary-button" onClick={()=>setLessonIndex(null)}>Save and exit</button><button className="primary-button" disabled={!quizChoice||completedLessons.includes(lessonIndex)} onClick={()=>{if(quizChoice===lessonAnswers[lessonIndex]){setCompletedLessons([...completedLessons,lessonIndex]);setQuizFeedback('Correct! Lesson completed. The next lesson is now unlocked.');}else setQuizFeedback('Not quite. Review the lesson and try again.');}}>{completedLessons.includes(lessonIndex)?'Completed':'Check answer'} <ArrowRight size={13}/></button></div></div></>}</>}
      {path && tab==='Discussion' && <><h2>Path discussion</h2><div className="empty-inline">Questions and discussions will appear here.</div></>}
      {event && tab==='Overview' && <><h2>Event overview</h2><p>Take part in this CTF event, solve challenges, and earn event points. Check the rules before the event begins and coordinate with your teammates if you are competing as a team.</p><div className="event-summary-grid"><div><strong>{item.participants}</strong><span>Registered</span></div><div><strong>{item.type}</strong><span>Format</span></div><div><strong>{item.status}</strong><span>Registration</span></div></div><h3>Event rules</h3><ul><li>Only submit flags you found yourself or with your registered team.</li><li>Do not attack the platform or other participants.</li><li>Respect the event window and challenge instructions.</li></ul><button className="primary-button">Register interest <ArrowRight size={14}/></button></>}
      {event && tab==='Leaderboard' && <><h2>Event leaderboard</h2><div className="table-row"><strong>#1</strong><div className="table-player"><div className="avatar small">BB</div><strong>bytebandit</strong></div><strong>1,250 EP</strong></div><div className="table-row"><strong>#2</strong><div className="table-player"><div className="avatar small">CR</div><strong>cr1sis</strong></div><strong>980 EP</strong></div><div className="table-row you"><strong>#3</strong><div className="table-player"><div className="avatar small">CS</div><strong>CyberScythe</strong></div><strong>860 EP</strong></div></>}
      {event && tab==='Team chat' && <><h2>Team chat</h2><p className="muted">Coordinate with your registered team during the event.</p><div className="chat-window">{messages.map((m,i)=><div className="chat-message" key={i}><div className="avatar small">{m.name.slice(0,2).toUpperCase()}</div><div><strong>{m.name}</strong><p>{m.text}</p></div></div>)}</div><div className="chat-compose"><input value={chatText} onChange={e=>setChatText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()} placeholder="Message your team..."/><button className="primary-button" onClick={sendMessage}>Send</button></div></>}
    </section><aside className="detail-side"><section className="panel"><div className="eyebrow">{challenge?'CHALLENGE INFO':path?'YOUR PROGRESS':'EVENT INFO'}</div><h3>{challenge?'Ready to give it a try?':path?'Keep your momentum':'Join the competition'}</h3><p>{challenge?'Submit a correct flag to earn challenge points.':path?'Pick up where you left off and complete the next lesson.':'Review the event details and get ready to compete.'}</p>{path&&<><div className="progress-meta"><span>{item.lessons}</span><strong>{item.progress}%</strong></div><div className="progress-track"><div className={'progress-fill '+item.color} style={{width:pathProgress+'%'}}/></div></>}{challenge&&<div className="side-stat"><strong>+{item.points}</strong><span>Challenge points</span></div>}{event&&<div className="side-stat"><strong>{item.participants}</strong><span>Participants</span></div>}</section><section className="panel"><div className="eyebrow">NEED A HAND?</div><p>Use hints, review the instructions, and ask the community when you get stuck.</p><button className="text-button">View guidelines <ArrowRight size={14}/></button></section></aside></div>
  </div>;
}

export default App;