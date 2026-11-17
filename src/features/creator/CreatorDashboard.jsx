import { ArrowRight, BookOpen, Clock3, Flag, Plus, ShieldCheck, Trophy, Zap } from 'lucide-react';

export default function CreatorDashboard({ items = [], assignedEvents = [], eventChallenges = [], onNavigate }) {
  const challenges = items.filter(item => item.kind === 'Challenge');
  const paths = items.filter(item => item.kind === 'Learning Path');
  const published = items.filter(item => item.status === 'Published' || item.status === 'Approved').length;
  const drafts = items.filter(item => item.status === 'Draft').length;
  const pending = eventChallenges.filter(item => item.status === 'Pending review').length;
  const reviewed = eventChallenges.filter(item => item.status === 'Approved' || item.status === 'Changes requested').length;
  const recent = [...items].slice(0, 4);

  return <div className="page-enter creator-dashboard">
    <div className="creator-dashboard-hero">
      <div className="creator-dashboard-hero-copy">
        <div className="eyebrow"><span className="live-dot"/> CREATOR WORKSPACE</div>
        <h1>Build something worth <span>solving.</span></h1>
        <p>Design challenges, guide learners, and contribute to events across CTF Root.</p>
        <div className="creator-dashboard-actions">
          <button className="primary-button" onClick={() => onNavigate('Creator Studio')}><Plus size={15}/> Open Creator Studio</button>
          <button className="creator-hero-link" onClick={() => onNavigate('My Profile')}>View public profile <ArrowRight size={14}/></button>
        </div>
      </div>
      <div className="creator-dashboard-emblem"><ShieldCheck size={54}/><span>CREATE · TEST · TEACH</span></div>
    </div>

    <div className="creator-dashboard-section-head">
      <div><div className="eyebrow">YOUR IMPACT</div><h2>Creator overview</h2></div>
      <span className="creator-dashboard-updated">Workspace snapshot · Demo data</span>
    </div>
    <div className="creator-metric-grid">
      <article className="creator-metric"><div className="creator-metric-icon"><Flag size={17}/></div><span>Challenges</span><strong>{challenges.length}</strong><small>{challenges.filter(item => item.status === 'Published' || item.status === 'Approved').length} published</small></article>
      <article className="creator-metric"><div className="creator-metric-icon"><BookOpen size={17}/></div><span>Learning paths</span><strong>{paths.length}</strong><small>{paths.filter(item => item.status === 'Published' || item.status === 'Approved').length} published</small></article>
      <article className="creator-metric"><div className="creator-metric-icon"><Clock3 size={17}/></div><span>Awaiting review</span><strong>{pending}</strong><small>{reviewed} reviewed submissions</small></article>
      <article className="creator-metric"><div className="creator-metric-icon"><Trophy size={17}/></div><span>Published content</span><strong>{published}</strong><small>{drafts} drafts in progress</small></article>
    </div>

    <div className="creator-dashboard-main-grid">
      <section className="panel creator-dashboard-panel">
        <div className="panel-heading"><div><div className="eyebrow">CONTENT PIPELINE</div><h3>Keep your work moving</h3></div><button className="text-button" onClick={() => onNavigate('Creator Studio')}>View all <ArrowRight size={13}/></button></div>
        <div className="creator-pipeline">
          <button onClick={() => onNavigate('Creator Studio')}><span className="pipeline-icon"><Plus size={17}/></span><span><strong>Create a challenge</strong><small>Build a hands-on security task</small></span><ArrowRight size={15}/></button>
          <button onClick={() => onNavigate('Creator Studio')}><span className="pipeline-icon"><BookOpen size={17}/></span><span><strong>Build a learning path</strong><small>Turn a topic into guided lessons</small></span><ArrowRight size={15}/></button>
          <button onClick={() => onNavigate('Creator Studio')}><span className="pipeline-icon"><Zap size={17}/></span><span><strong>Review your submissions</strong><small>{pending ? pending + ' event submission(s) awaiting review' : 'Check feedback and submission status'}</small></span><ArrowRight size={15}/></button>
        </div>
      </section>

      <section className="panel creator-dashboard-panel creator-event-panel">
        <div className="panel-heading"><div><div className="eyebrow">EVENT ACCESS</div><h3>Assigned events</h3></div><span className="tag">{assignedEvents.length} assigned</span></div>
        {assignedEvents.length ? assignedEvents.slice(0,3).map(event => <div className="creator-dashboard-event" key={event.id}><div><strong>{event.name}</strong><small>{event.format} · {event.date}</small></div><span>{event.publicationStatus || 'Draft'}</span></div>) : <div className="creator-dashboard-empty">No event assignments yet. When an admin assigns you to an event, it will appear here.</div>}
        <button className="text-button creator-event-link" onClick={() => onNavigate('Creator Studio')}>Open event workspace <ArrowRight size={13}/></button>
      </section>
    </div>

    <section className="panel creator-recent-panel">
      <div className="panel-heading"><div><div className="eyebrow">RECENT WORK</div><h3>Your latest content</h3></div><button className="text-button" onClick={() => onNavigate('Creator Studio')}>Manage content <ArrowRight size={13}/></button></div>
      {recent.length ? <div className="creator-recent-list">{recent.map(item => <div className="creator-recent-row" key={item.id}><div className="creator-recent-icon">{item.kind === 'Challenge' ? <Flag size={16}/> : <BookOpen size={16}/>}</div><div className="creator-recent-copy"><strong>{item.title}</strong><small>{item.kind} · {item.points || 0} CP · {item.moduleCount || 0} modules</small></div><span className={'creator-status ' + String(item.status || 'Draft').toLowerCase().replace(/\\s+/g,'-')}>{item.status || 'Draft'}</span></div>)}</div> : <div className="creator-dashboard-empty">Your first challenge or learning path will show up here.</div>}
    </section>
  </div>;
}
