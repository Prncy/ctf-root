import { useMemo, useState } from 'react';
import { ArrowLeft, Bell, CalendarClock, Check, ChevronRight, CirclePlay, Plus, Send, Shield, Trash2, Trophy, Users, X, Eye, RefreshCw, ClipboardCheck } from 'lucide-react';
import { creators } from '../../data/index.js';
import './admin-events.css';

export default function AdminEvents({
  events = [],
  onEventsChange = () => {},
  eventChallenges = [],
  onReviewEventChallenge = () => {},
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [tab, setTab] = useState('Overview');
  const [notice, setNotice] = useState('');
  const [reviewNotes, setReviewNotes] = useState({});
  const [form, setForm] = useState({ name: '', format: 'Individual', date: '', time: '09:00', teamLimit: '', tournament: false, rounds: ['Qualifiers', 'Final'] });
  const selected = events.find(event => event.id === selectedId);
  const selectedSubmissions = eventChallenges.filter(item => String(item.eventId) === String(selectedId));
  const pendingCount = selectedSubmissions.filter(item => item.status === 'Pending review').length;
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const patchSelected = patch => onEventsChange(prev => prev.map(event => event.id === selectedId ? { ...event, ...patch } : event));
  const creatorByUsername = username => creators.find(creator => creator.username === username);
  const creatorName = username => creatorByUsername(username)?.name || username;

  const createEvent = event => {
    event.preventDefault();
    if (!form.name.trim() || !form.date) return;
    const next = {
      id: Date.now(),
      name: form.name.trim(),
      format: form.format,
      status: 'Draft',
      publicationStatus: 'Draft',
      date: form.date + ' · ' + form.time,
      limit: form.format === 'Team' && form.teamLimit ? Number(form.teamLimit) : null,
      assignedCreators: [],
      rounds: form.tournament ? form.rounds.filter(value => value.trim()).map(name => ({ name })) : [],
      teams: [],
    };
    onEventsChange(prev => [next, ...prev]);
    setSelectedId(next.id);
    setShowCreate(false);
    setTab('Overview');
    setNotice('Event created as a draft. Publish it when its details are ready.');
    setForm({ name: '', format: 'Individual', date: '', time: '09:00', teamLimit: '', tournament: false, rounds: ['Qualifiers', 'Final'] });
  };

  const assignCreator = username => {
    if (!selected || selected.assignedCreators?.includes(username)) return;
    patchSelected({ assignedCreators: [...(selected.assignedCreators || []), username] });
    setNotice(creatorName(username) + ' assigned to ' + selected.name + '. They can now select this event in Creator Studio.');
  };
  const removeCreator = username => {
    patchSelected({ assignedCreators: (selected.assignedCreators || []).filter(value => value !== username) });
    setNotice(creatorName(username) + ' removed from this event. Previously submitted challenges remain linked to the event.');
  };
  const removeTeam = name => {
    patchSelected({ teams: selected.teams.filter(team => team.name !== name) });
    setNotice(name + ' removed from the event.');
  };
  const sendAnnouncement = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = data.get('message');
    if (message) setNotice('Announcement prepared for registered participants: ' + message + '. Delivery requires the notification backend.');
    event.currentTarget.reset();
  };
  const reviewSubmission = (submission, status) => {
    const feedback = status === 'Approved'
      ? 'Approved for this event.'
      : (reviewNotes[submission.id] || '').trim() || 'Please review the challenge content and resubmit it.';
    onReviewEventChallenge(submission.id, status, feedback);
    setNotice(status === 'Approved'
      ? submission.title + ' approved. It is now cleared for the event.'
      : 'Changes requested for ' + submission.title + '. The creator can update and resubmit it.');
    setReviewNotes(prev => ({ ...prev, [submission.id]: '' }));
  };
  const sortedTeams = useMemo(() => selected ? [...selected.teams].sort((a, b) => b.score - a.score) : [], [selected]);

  if (!selected) return <section className="admin-events">
    <div className="admin-events-head"><div><div className="eyebrow">ADMINISTRATION / EVENTS</div><h1>Event management</h1><p>Create events, assign creators, review event challenges and manage participants.</p></div><button className="primary-button" onClick={() => setShowCreate(true)}><Plus size={16}/> Create event</button></div>
    {notice && <div className="ae-notice">{notice}<button onClick={() => setNotice('')}><X size={14}/></button></div>}
    <div className="ae-stats"><div><span>Total events</span><strong>{events.length}</strong></div><div><span>Published events</span><strong>{events.filter(event => event.publicationStatus === 'Published').length}</strong></div><div><span>Pending challenge reviews</span><strong>{eventChallenges.filter(item => item.status === 'Pending review').length}</strong></div></div>
    <div className="ae-list">{events.map(event => <button className="ae-event-row" key={event.id} onClick={() => { setSelectedId(event.id); setTab('Overview'); }}><span className="ae-event-icon"><Trophy size={19}/></span><span className="ae-event-info"><strong>{event.name}</strong><small>{event.format} · {event.date} · {event.teams?.length || 0} registered teams/entries · {event.assignedCreators?.length || 0} creators</small></span><span className={'ae-publication-status ' + (event.publicationStatus || 'Published').toLowerCase()}>{event.publicationStatus || 'Published'}</span><span className="ae-status">{event.status}</span><ChevronRight size={17}/></button>)}</div>
    {showCreate && <div className="ae-modal-backdrop"><form className="ae-modal" onSubmit={createEvent}><button type="button" className="ae-close" onClick={() => setShowCreate(false)}><X size={18}/></button><div className="eyebrow">NEW EVENT</div><h2>Create an event</h2><label>Event name<input required value={form.name} onChange={event => update('name', event.target.value)} placeholder="e.g. CTF Root Championship"/></label><label>Competition format<select value={form.format} onChange={event => update('format', event.target.value)}><option>Individual</option><option>Team</option></select></label>{form.format === 'Team' && <label>Team registration limit <small>(optional · maximum teams)</small><input type="number" min="1" value={form.teamLimit} onChange={event => update('teamLimit', event.target.value)} placeholder="Leave blank for no limit"/></label>}<div className="ae-form-grid"><label>Event date<input required type="date" value={form.date} onChange={event => update('date', event.target.value)}/></label><label>Start time<input type="time" value={form.time} onChange={event => update('time', event.target.value)}/></label></div><label className="ae-check"><input type="checkbox" checked={form.tournament} onChange={event => update('tournament', event.target.checked)}/> Set up tournament rounds</label>{form.tournament && <div className="ae-round-editor"><p>Round names (you can rename these later)</p>{form.rounds.map((round, index) => <div className="ae-round-input" key={index}><input value={round} onChange={event => update('rounds', form.rounds.map((value, i) => index === i ? event.target.value : value))}/><button type="button" onClick={() => update('rounds', form.rounds.filter((_, i) => i !== index))}><Trash2 size={14}/></button></div>)}<button type="button" className="ae-text-action" onClick={() => update('rounds', [...form.rounds, 'New round'])}><Plus size={14}/> Add round</button></div>}<div className="ae-modal-actions"><button type="button" className="secondary-button" onClick={() => setShowCreate(false)}>Cancel</button><button className="primary-button" type="submit">Create draft event</button></div></form></div>}
  </section>;

  const publicationStatus = selected.publicationStatus || 'Published';
  const assignedCreators = selected.assignedCreators || [];
  return <section className="admin-events">
    <button className="ae-back" onClick={() => setSelectedId(null)}><ArrowLeft size={15}/> All events</button>
    <div className="admin-events-head"><div><div className="eyebrow">EVENT CONTROL ROOM</div><h1>{selected.name}</h1><p>{selected.format} competition · {selected.date} · {selected.status} · {publicationStatus}</p></div><div className="ae-head-actions">
      {publicationStatus === 'Published'
        ? <button className="secondary-button" onClick={() => { patchSelected({ publicationStatus: 'Unpublished' }); setNotice('Event unpublished. Registrations, submissions, scores, creator assignments and rounds have been preserved.'); }}><Eye size={15}/> Unpublish event</button>
        : <button className="primary-button" onClick={() => { patchSelected({ publicationStatus: 'Published', status: selected.status === 'Draft' ? 'Scheduled' : selected.status }); setNotice('Event published. Existing registrations, submissions and scores have been retained.'); }}><RefreshCw size={15}/> {publicationStatus === 'Draft' ? 'Publish event' : 'Republish event'}</button>}
      <button className="secondary-button" disabled={publicationStatus !== 'Published'} onClick={() => { patchSelected({ status: 'Scheduled' }); setNotice('Event scheduled.'); }}><CalendarClock size={15}/> Schedule</button>
      <button className="primary-button" disabled={publicationStatus !== 'Published'} onClick={() => { patchSelected({ status: 'Live' }); setNotice('Event started. Participants can now see it as live.'); }}><CirclePlay size={15}/> Start event</button>
    </div></div>
    {notice && <div className="ae-notice">{notice}<button onClick={() => setNotice('')}><X size={14}/></button></div>}
    {publicationStatus === 'Unpublished' && <div className="ae-warning"><Shield size={15}/> This event is temporarily unpublished. Its existing data is preserved while you make corrections.</div>}
    <div className="ae-detail-meta"><span><Users size={15}/>{selected.teams.length} registered {selected.format === 'Team' ? 'teams' : 'entries'}</span><span><Shield size={15}/>{selected.format} format</span><span><ClipboardCheck size={15}/>{pendingCount} pending challenge reviews</span>{selected.limit && <span>Team limit: {selected.limit}</span>}</div>
    <div className="ae-tabs">{['Overview', 'Event Challenges', 'Leaderboard', 'Creators', 'Rounds', 'Announcements', 'Participants'].map(value => <button key={value} className={tab === value ? 'active' : ''} onClick={() => setTab(value)}>{value}{value === 'Event Challenges' && pendingCount > 0 ? <span className="ae-tab-count">{pendingCount}</span> : null}</button>)}</div>
    {tab === 'Overview' && <div className="ae-grid"><article className="ae-panel"><h3>Event operations</h3><p>Manage the competition lifecycle and publication state independently.</p><div className="ae-operation"><span>Operational status</span><strong>{selected.status}</strong></div><div className="ae-operation"><span>Publication status</span><strong>{publicationStatus}</strong></div><div className="ae-operation"><span>Competition format</span><strong>{selected.format}</strong></div><div className="ae-operation"><span>Tournament rounds</span><strong>{selected.rounds.length || 'Not configured'}</strong></div><button className="secondary-button" disabled={publicationStatus !== 'Published'} onClick={() => { patchSelected({ status: 'Registration open' }); setNotice('Registration opened for this event.'); }}>Open registration</button></article><article className="ae-panel"><h3>Assigned creators</h3><p>Creators who can prepare event challenges.</p>{assignedCreators.length ? assignedCreators.map(username => <div className="ae-person" key={username}><span className="ae-person-avatar">{creatorName(username).slice(0, 2).toUpperCase()}</span><strong>{creatorName(username)}</strong></div>) : <p className="ae-empty">No creators assigned yet.</p>}<button className="ae-text-action" onClick={() => setTab('Creators')}><Plus size={14}/> Manage assignments</button></article></div>}
    {tab === 'Event Challenges' && <div className="ae-panel"><div className="ae-panel-heading"><div><h3>Event challenge submissions</h3><p>Creators submit event challenges here for review. Approved challenges are cleared for this event.</p></div><span className="tag">{selectedSubmissions.length} total</span></div>
      {selectedSubmissions.length ? selectedSubmissions.map(submission => <article className="ae-review-card" key={submission.id}>
        <div className="ae-review-top"><div><strong>{submission.title}</strong><small>Submitted by @{submission.creatorUsername} · {submission.difficulty || 'Unspecified'} · {submission.points || 0} CP</small></div><span className={'ae-review-status ' + submission.status.toLowerCase().replace(/\s+/g, '-')}>{submission.status}</span></div>
        <p>{submission.description || 'No description provided.'}</p>
        <div className="ae-review-meta"><span>{submission.questionCount || 0} questions</span><span>{submission.isPremium ? 'Premium' : 'Free'}</span>{submission.tags?.map(tag => <span key={tag}>#{tag}</span>)}</div>
        <details className="ae-review-details"><summary>Inspect modules, questions and expected answers</summary>
          {(submission.modules || []).map((module, moduleIndex) => <div className="ae-review-module" key={moduleIndex}><strong>Module {moduleIndex + 1}: {module.title}</strong><p>{module.description}</p>
            {(module.questions || []).map((question, questionIndex) => <div className="ae-review-question" key={questionIndex}><b>Q{questionIndex + 1}. {question.title || 'Untitled question'} · {question.points} CP</b><p>{question.description}</p><small>Expected answer: <code>{question.answer || 'Not provided'}</code></small></div>)}
          </div>)}
        </details>
        {submission.status === 'Pending review' && <><label className="ae-review-feedback">Feedback for creator<textarea value={reviewNotes[submission.id] || ''} onChange={event => setReviewNotes(prev => ({ ...prev, [submission.id]: event.target.value }))} placeholder="Explain what should be corrected if you request changes..."/></label><div className="ae-review-actions"><button className="secondary-button" onClick={() => reviewSubmission(submission, 'Changes requested')}>Request changes</button><button className="primary-button" onClick={() => reviewSubmission(submission, 'Approved')}><Check size={15}/> Approve challenge</button></div></>}
        {submission.status === 'Changes requested' && submission.reviewFeedback && <div className="ae-review-note">Last feedback: {submission.reviewFeedback}</div>}
        {submission.status === 'Approved' && <div className="ae-approved-note"><Check size={14}/> Approved for this event. The creator submission record is retained.</div>}
      </article>) : <p className="ae-empty">No event challenges have been submitted yet. Assign creators, then ask them to submit challenges from Creator Studio.</p>}
    </div>}
    {tab === 'Leaderboard' && <div className="ae-panel"><h3>Event leaderboard</h3>{sortedTeams.length ? sortedTeams.map((team, index) => <div className="ae-leader-row" key={team.name}><strong>#{index + 1}</strong><span>{team.name}</span><b>{team.score} EP</b></div>) : <p className="ae-empty">The leaderboard will appear when participants register and earn points.</p>}</div>}
    {tab === 'Creators' && <div className="ae-panel"><h3>Creator assignments</h3><p>Assign creators to this event. Only assigned creators can select it in their Creator Studio event selector.</p>{creators.map(creator => <div className="ae-assign-row" key={creator.username}><span><strong>{creator.name}</strong><small>@{creator.username} · {creator.focus}</small></span>{assignedCreators.includes(creator.username) ? <button className="ae-remove" onClick={() => removeCreator(creator.username)}><X size={14}/> Remove</button> : <button className="secondary-button" onClick={() => assignCreator(creator.username)}>Assign</button>}</div>)}</div>}
    {tab === 'Rounds' && <div className="ae-panel"><div className="ae-panel-heading"><div><h3>Tournament rounds</h3><p>Use custom names for each stage of your tournament.</p></div><button className="ae-text-action" onClick={() => patchSelected({ rounds: [...selected.rounds, { name: 'New round' }] })}><Plus size={14}/> Add round</button></div>{selected.rounds.length ? selected.rounds.map((round, index) => <div className="ae-round-manage" key={index}><span>{index + 1}</span><input value={round.name} onChange={event => patchSelected({ rounds: selected.rounds.map((value, i) => i === index ? { ...value, name: event.target.value } : value) })}/><button onClick={() => patchSelected({ rounds: selected.rounds.filter((_, i) => i !== index) })}><Trash2 size={15}/></button></div>) : <p className="ae-empty">This event has no tournament rounds. Add rounds if the event uses a multi-stage format.</p>}</div>}
    {tab === 'Announcements' && <form className="ae-panel ae-announcement" onSubmit={sendAnnouncement}><h3>Send event announcement</h3><p>Compose a message for participants registered to this event.</p><textarea name="message" required placeholder="Write an announcement for registered participants..."/><button className="primary-button"><Send size={15}/> Prepare announcement</button><small>Demo only: messages are not delivered until notifications are connected to the backend.</small></form>}
    {tab === 'Participants' && <div className="ae-panel"><h3>Registered participants</h3>{selected.teams.length ? selected.teams.map(team => <div className="ae-assign-row" key={team.name}><span><strong>{team.name}</strong><small>{team.members} members</small></span><button className="ae-remove" onClick={() => removeTeam(team.name)}><Trash2 size={14}/> Remove</button></div>) : <p className="ae-empty">No registrations yet. Participant and team registration will be connected to the backend.</p>}</div>}
    <p className="ae-demo-note">This is shared frontend demo state. Event assignments, reviews and publication changes are not persisted to a server yet. Unpublishing changes only publication status; it does not delete registrations, submissions, scores, rounds or creator assignments.</p>
  </section>;
}
