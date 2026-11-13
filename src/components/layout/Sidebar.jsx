import { ArrowRight, ChevronDown, LifeBuoy, Settings, Shield, X } from 'lucide-react';
import { currentUser } from '../../data/index.js';

export default function Sidebar({
  visibleNavGroups,
  active,
  role,
  sidebarOpen,
  setSidebarOpen,
  switchRole,
  selectPage,
  setNotice,
  signOut,
}) {
  return (
    <>
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
          <div className="sidebar-user"><div className="avatar">CS</div><div className="user-meta"><strong>{currentUser.name}</strong><span>Level 08 · {currentUser.level}</span></div><button className="icon-button" aria-label="Settings" onClick={() => selectPage('Settings')}><Settings size={17}/></button></div>
          <button className="auth-signout" onClick={signOut}>Sign out</button>
        </div>
      </aside>
      {sidebarOpen && <button className="scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}/>}
    </>
  );
}
