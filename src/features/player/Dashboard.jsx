import { ArrowDownRight, ArrowRight, ChevronRight, Code2, Compass, Flag, Flame, Globe2, GraduationCap, LockKeyhole, Bookmark, BookmarkCheck, Shield, Sparkles, Trophy, Zap } from 'lucide-react';
import { stats, paths, challenges, leaderboard, events } from '../../data/index.js';

export default function Dashboard({ onNavigate, bookmarks, onToggleBookmark }) {
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
