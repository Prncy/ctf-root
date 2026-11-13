import { Bell, ChevronRight, Menu, Moon, Search, Sun } from 'lucide-react';

export default function Topbar({ active, query, setQuery, dark, setDark, setSidebarOpen, setNotice }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={20}/></button>
        <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14}/><strong>{active}</strong></div>
      </div>
      <div className="topbar-actions">
        <label className="global-search"><Search size={16}/><input placeholder="Search CTF Root..." value={query} onChange={event => setQuery(event.target.value)}/><kbd>⌘ K</kbd></label>
        <button className="icon-button notification" aria-label="Notifications" onClick={() => setNotice('You’re all caught up!')}><Bell size={18}/><i/></button>
        <button className="icon-button" aria-label="Toggle theme" onClick={() => setDark(!dark)}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
        <div className="avatar top-avatar">CS</div>
      </div>
    </header>
  );
}
