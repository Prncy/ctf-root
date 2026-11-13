import { useState } from 'react';
import { Plus, Shield, Flag, BookOpen, ChevronDown, ChevronRight, FolderKanban } from 'lucide-react';

export default function CreatorStudio() {
  const blankQuestion = () => ({ title: '', description: '', answer: '', points: '50', attemptPolicy: 'unlimited', maxAttempts: '3', deduction: '20', hints: [''] });
  const blankModule = (number) => ({ title: 'Module ' + number, description: '', questions: [blankQuestion()] });
  const blank = { title: '', description: '', category: 'Web', difficulty: 'Easy', isPremium: false, tags: '', event: 'Independent', modules: [blankModule(1)], files: [] };
  const [kind, setKind] = useState('Challenge');
  const [items, setItems] = useState([
    { id: 1, kind: 'Challenge', title: 'Cookie Crumble', status: 'Published', points: 150, modules: 2, event: 'Community practice' },
    { id: 2, kind: 'Learning Path', title: 'Web Security Foundations', status: 'Draft', points: 250, modules: 5, event: 'Independent' }
  ]);
  const [editing, setEditing] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [message, setMessage] = useState('');
  const [expandedModules, setExpandedModules] = useState([true]);
  const [expandedQuestions, setExpandedQuestions] = useState([[true]]);
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const updateModule = (mi, key, value) => setForm(prev => ({ ...prev, modules: prev.modules.map((m,i) => i === mi ? { ...m, [key]: value } : m) }));
  const updateQuestion = (mi, qi, key, value) => setForm(prev => ({ ...prev, modules: prev.modules.map((m,i) => i !== mi ? m : { ...m, questions: m.questions.map((q,j) => j === qi ? { ...q, [key]: value } : q) }) }));
  const updateHint = (mi, qi, hi, value) => setForm(prev => ({ ...prev, modules: prev.modules.map((m,i) => i !== mi ? m : { ...m, questions: m.questions.map((q,j) => j !== qi ? q : { ...q, hints: q.hints.map((h,k) => k === hi ? value : h) }) }) }));
  const totalPoints = form.modules.reduce((sum,m) => sum + m.questions.reduce((qsum,q) => qsum + (Number(q.points) || 0), 0), 0);
  const startNew = (type) => { setKind(type); setEditing(null); setEditorOpen(true); setForm({ ...blank, modules: [blankModule(1)] }); setExpandedModules([true]); setExpandedQuestions([[true]]); setMessage(''); };
  const editItem = (item) => {
    setKind(item.kind); setEditing(item.id); setEditorOpen(true);
    const moduleCount = Math.max(1,item.modules);
    setForm({ ...blank, title: item.title, description: 'Edit the introduction and learning content here.', difficulty: item.difficulty || 'Easy', isPremium: !!item.isPremium, tags: (item.tags || []).join(', '), modules: Array.from({length:moduleCount},(_,mi) => ({ ...blankModule(mi+1), questions: [blankQuestion()] })) });
    setExpandedModules(Array(moduleCount).fill(true));
    setExpandedQuestions(Array.from({length:moduleCount}, () => [true]));
    setMessage('Sample content loaded. You can edit its modules and questions.');
  };
  const save = (publish) => {
    if (!form.title.trim() || !form.description.trim()) { setMessage('Add a title and description before saving.'); return; }
    const next = { id: editing || Date.now(), kind, title: form.title.trim(), status: publish ? 'Published' : 'Draft', points: totalPoints, modules: form.modules.length, event: form.event, difficulty: form.difficulty, isPremium: kind === 'Challenge' ? form.isPremium : false, creatorUsername: 'cyberscythe', tags: kind === 'Challenge' ? form.tags.split(',').map(tag => tag.trim().replace(/^#/, '')).filter(Boolean) : [] };
    setItems(prev => editing ? prev.map(x => x.id === editing ? next : x) : [next,...prev]);
    setMessage(publish ? 'Published in this prototype.' : 'Draft saved in this prototype.');
    setEditing(null); setEditorOpen(false); setForm({ ...blank, modules:[blankModule(1)] });
  };
  const owned = items.filter(x => x.kind === kind);
  return <div className="page-enter creator-studio">
    <div className="creator-studio-head"><div><div className="eyebrow">CREATOR STUDIO / YOUR CONTENT</div><h2>Your workspace</h2><p className="subheading">Create and manage only the content you own or have been assigned to an event.</p></div><div className="creator-studio-actions"><button className="primary-button" onClick={() => startNew('Challenge')}><Plus size={15}/> New challenge</button><button className="secondary-button" onClick={() => startNew('Learning Path')}><Plus size={15}/> New learning path</button></div></div>
    <div className="creator-permission-note"><Shield size={16}/><span><strong>Creator access</strong> — You can create, edit, publish and manage your own challenges and learning paths. Each question has its own answer, points, hints and attempt policy.</span></div>
    <div className="creator-studio-tabs"><button className={kind === 'Challenge' ? 'selected' : ''} onClick={() => {setKind('Challenge');setEditing(null);setEditorOpen(false);}}>My challenges</button><button className={kind === 'Learning Path' ? 'selected' : ''} onClick={() => {setKind('Learning Path');setEditing(null);setEditorOpen(false);}}>My learning paths</button></div>
    {!editorOpen && <div className="panel creator-owned-list"><div className="panel-heading"><div><div className="eyebrow">YOUR CONTENT</div><h3>{kind === 'Challenge' ? 'Challenges' : 'Learning paths'} ({owned.length})</h3></div><span className="tag">Demo data</span></div>{owned.map(item => <div className="creator-owned-row" key={item.id}><div className="creator-owned-icon">{kind === 'Challenge' ? <Flag size={17}/> : <BookOpen size={17}/>}</div><div className="creator-owned-copy"><strong>{item.title}</strong><small>{item.modules} modules · {item.event} · {item.difficulty || 'Easy'}{item.kind === 'Challenge' ? (item.isPremium ? ' · Premium' : ' · Free') : ''}{item.tags?.length ? ' · ' + item.tags.map(tag => '#' + tag).join(' ') : ''}</small></div><span className={'creator-status ' + item.status.toLowerCase()}>{item.status}</span><strong className="points">{item.points} CP</strong><button className="secondary-button" onClick={() => editItem(item)}>Edit</button></div>)}{owned.length === 0 && <div className="empty-inline">You have not created any {kind.toLowerCase()} yet.</div>}</div>}
    {editorOpen && <div className="panel creator-editor">
      <div className="panel-heading"><div><div className="eyebrow">{editing ? 'EDIT YOUR CONTENT' : 'NEW ' + kind.toUpperCase()}</div><h3>{editing ? 'Edit ' + kind.toLowerCase() : 'Build a ' + kind.toLowerCase()}</h3></div><button className="text-button" onClick={() => {setEditing(null);setEditorOpen(false);setForm({ ...blank, modules:[blankModule(1)] });setMessage('');}}>Cancel</button></div>
      <label className="creator-field"><span>Title</span><input value={form.title} onChange={e => update('title',e.target.value)} placeholder="Give it a clear name"/></label>
      <label className="creator-field"><span>{kind === 'Learning Path' ? 'Introduction and learning objectives' : 'Challenge description'}</span><textarea value={form.description} onChange={e => update('description',e.target.value)} placeholder="Explain what players will learn or need to do."/></label>
      <div className="creator-form-grid"><label className="creator-field"><span>Category</span><select value={form.category} onChange={e => update('category',e.target.value)}><option>Web</option><option>Cryptography</option><option>Forensics</option><option>Reverse Engineering</option><option>Miscellaneous</option></select></label><label className="creator-field"><span>Difficulty</span><select value={form.difficulty} onChange={e=>update('difficulty',e.target.value)}><option>Easy</option><option>Medium</option><option>Hard</option></select></label>{kind === 'Challenge' && <label className="creator-field creator-checkbox-field"><span>Premium challenge</span><input type="checkbox" checked={form.isPremium} onChange={e=>update('isPremium',e.target.checked)}/><small>Premium challenges will be marked in Explore. Payment and access control will be connected later.</small></label>}<label className="creator-field"><span>Tags <small>(optional, comma-separated)</small></span><input value={form.tags} onChange={e => update('tags',e.target.value)} placeholder="e.g. XOR, Cryptography, Steganography"/><small>Use tags to hint at secondary knowledge areas. The main category remains {form.category}.</small></label><label className="creator-field"><span>Event assignment</span><select value={form.event} onChange={e => update('event',e.target.value)}><option>Independent</option><option>Assigned event — admin approval required</option></select></label></div>
      <div className="creator-section-title"><div><strong>Modules</strong><small>{kind === 'Learning Path' ? 'Build guided modules. Each module can contain multiple learning questions.' : 'Group related questions. Each module can contain multiple questions.'}</small></div><button className="secondary-button" onClick={() => { update('modules',[...form.modules,blankModule(form.modules.length+1)]); setExpandedModules(prev => [...prev,true]); setExpandedQuestions(prev => [...prev,[true]]); }}><Plus size={13}/> Add module</button></div>
      {form.modules.map((module,mi) => <div className="creator-module-editor" key={mi}>
        <div className="creator-module-head"><button type="button" className="creator-collapse-trigger" aria-expanded={!!expandedModules[mi]} onClick={() => setExpandedModules(prev => prev.map((open,i) => i === mi ? !open : open))}>{expandedModules[mi] ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}<strong>Module {mi+1} · {module.title || 'Untitled module'}</strong><span>{module.questions.length} question{module.questions.length === 1 ? '' : 's'}</span></button>{form.modules.length > 1 && <button className="text-button" onClick={() => { update('modules',form.modules.filter((_,i) => i !== mi)); setExpandedModules(prev => prev.filter((_,i) => i !== mi)); setExpandedQuestions(prev => prev.filter((_,i) => i !== mi)); }}>Remove module</button>}</div>
        {expandedModules[mi] && <div className="creator-collapsible-content">
        <label className="creator-field"><span>Module title</span><input value={module.title} onChange={e => updateModule(mi,'title',e.target.value)} placeholder="Module title"/></label>
        <label className="creator-field"><span>Module introduction / instructions</span><textarea value={module.description} onChange={e => updateModule(mi,'description',e.target.value)} placeholder="Explain this module."/></label>
        <div className="creator-section-title"><div><strong>Questions ({module.questions.length})</strong><small>Set scoring and attempt rules separately for every question.</small></div><button className="secondary-button" onClick={() => { updateModule(mi,'questions',[...module.questions,blankQuestion()]); setExpandedQuestions(prev => prev.map((list,i) => i === mi ? [...list,true] : list)); }}><Plus size={13}/> Add question</button></div>
        {module.questions.map((q,qi) => <div className="creator-question-editor" key={qi}>
          <div className="creator-module-head"><button type="button" className="creator-collapse-trigger" aria-expanded={!!expandedQuestions[mi]?.[qi]} onClick={() => setExpandedQuestions(prev => prev.map((list,i) => i === mi ? list.map((open,j) => j === qi ? !open : open) : list))}>{expandedQuestions[mi]?.[qi] ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}<strong>Question {qi+1} · {q.title || 'Untitled question'}</strong><span>{Number(q.points) || 0} CP</span></button>{module.questions.length > 1 && <button className="text-button" onClick={() => { updateModule(mi,'questions',module.questions.filter((_,i) => i !== qi)); setExpandedQuestions(prev => prev.map((list,i) => i === mi ? list.filter((_,j) => j !== qi) : list)); }}>Remove question</button>}</div>
          {expandedQuestions[mi]?.[qi] && <div className="creator-collapsible-content">
          <label className="creator-field"><span>Question title</span><input value={q.title} onChange={e => updateQuestion(mi,qi,'title',e.target.value)} placeholder="e.g. Identify the vulnerable cookie"/></label>
          <label className="creator-field"><span>Question / task description</span><textarea value={q.description} onChange={e => updateQuestion(mi,qi,'description',e.target.value)} placeholder="Describe the task. For learning paths, include the explanation and guidance."/></label>
          <div className="creator-form-grid"><label className="creator-field"><span>Correct answer / flag</span><input value={q.answer} onChange={e => updateQuestion(mi,qi,'answer',e.target.value)} placeholder="Expected answer or flag"/></label><label className="creator-field"><span>Question points</span><input type="number" min="0" value={q.points} onChange={e => updateQuestion(mi,qi,'points',e.target.value)}/></label></div>
          <div className="creator-form-grid"><label className="creator-field"><span>Attempt policy</span><select value={q.attemptPolicy} onChange={e => updateQuestion(mi,qi,'attemptPolicy',e.target.value)}><option value="unlimited">Unlimited attempts</option><option value="ban">Limited attempts — lock this question</option><option value="deduction">Limited attempts — deduct points</option></select></label>{q.attemptPolicy !== 'unlimited' && <label className="creator-field"><span>Allowed attempts</span><input type="number" min="1" value={q.maxAttempts} onChange={e => updateQuestion(mi,qi,'maxAttempts',e.target.value)}/></label>}</div>
          {q.attemptPolicy === 'deduction' && <label className="creator-field narrow"><span>Deduction after attempts are exhausted (%)</span><input type="number" min="1" max="100" value={q.deduction} onChange={e => updateQuestion(mi,qi,'deduction',e.target.value)}/><small>Applies only to points earned for this question.</small></label>}
          <div className="creator-section-title"><div><strong>Hints</strong><small>Optional clues for this question.</small></div><button className="secondary-button" onClick={() => updateQuestion(mi,qi,'hints',[...q.hints,''])}><Plus size={13}/> Add hint</button></div>
          {q.hints.map((hint,hi) => <label className="creator-field" key={hi}><span>Hint {hi+1}</span><input value={hint} onChange={e => updateHint(mi,qi,hi,e.target.value)} placeholder="Write a helpful clue"/></label>)}
          </div>}
        </div>)}
        </div>}
      </div>)}
      <div className="creator-total-points">Total {kind === 'Challenge' ? 'challenge' : 'learning path'} points <strong>{totalPoints} CP</strong><small>Automatically calculated from every question across all modules.</small></div>
      <div className="creator-section-title"><div><strong>Files</strong><small>File uploads will be connected when persistent storage is implemented.</small></div><span className="tag">Coming later</span></div>
      <div className="creator-upload-placeholder"><FolderKanban size={18}/><span>Upload content files</span><small>File uploads are not active in this prototype.</small></div>
      {message && <div className="notice creator-form-notice">{message}</div>}
      <div className="creator-editor-footer"><span className="muted">Changes are local demo data and reset on refresh.</span><div><button className="secondary-button" onClick={() => save(false)}>Save draft</button><button className="primary-button" onClick={() => save(true)}>Publish</button></div></div>
    </div>}
  </div>;
}
