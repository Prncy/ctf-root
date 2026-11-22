import { ArrowRight, LifeBuoy, Settings, Shield, X } from 'lucide-react';

export default function Sidebar({
  visibleNavGroups,
  active,
  role,
  sidebarOpen,
  setSidebarOpen,
  user,
  selectPage,
  setNotice,
  signOut,
}) {
  const displayName = user?.displayName || user?.email || 'CTF Root member';
  const initials = displayName.slice(0, 2).toUpperCase();
  const roleLabel = role === 'admin' ? 'Admin workspace' : role === 'creator' ? 'Creator workspace' : 'Player workspace';
  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark"><Shield size={19} strokeWidth={2.5}/></div>
          <span className="brand-name">ctf<span>root</span></span>
          <button className="icon-button mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <div className="workspace-switch" aria-label={roleLabel}>
          <div className="workspace-avatar">{initials}</div>
          <div className="workspace-copy"><strong>{displayName}</strong><span>{roleLabel}</span></div>
          <Shield size={15}/>
        </div>
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
          <div className="sidebar-user"><div className="avatar">{initials}</div><div className="user-meta"><strong>{displayName}</strong><span>{roleLabel}</span></div><button className="icon-button" aria-label="Settings" onClick={() => selectPage('Settings')}><Settings size={17}/></button></div>
          <button className="auth-signout" onClick={signOut}>Sign out</button>
        </div>
      </aside>
      {sidebarOpen && <button className="scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}/>}
    </>
  );
}
