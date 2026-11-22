import { useEffect, useMemo, useState } from 'react';
import AdminEvents from '../features/admin/AdminEvents.jsx';
import { PublicHome, AuthPage } from '../features/auth/AuthPages.jsx';
import { PageView } from '../features/player/PlayerPages.jsx';
import { InfoPage } from '../features/shared/InfoPages.jsx';
import { getVisibleNavGroups } from './navigation.js';
import Sidebar from '../components/layout/Sidebar.jsx';
import Topbar from '../components/layout/Topbar.jsx';
import Dashboard from '../features/player/Dashboard.jsx';
import CreatorDashboard from '../features/creator/CreatorDashboard.jsx';
import { Sparkles, X } from 'lucide-react';
import { challenges } from '../data/index.js';
import { initialManagedEvents } from '../data/managedEvents.js';
import { clearAuthToken, getCurrentUser, getStoredAuthToken } from '../services/authApi.js';
import Toast from '../components/ui/Toast.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';

function App() {
  const [active, setActive] = useState('Overview');
  const [authScreen, setAuthScreen] = useState(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [bookmarks, setBookmarks] = useState({ challenges: ['Cookie Crumble', 'A Very Strange Letter'], paths: ['Introduction to Cybersecurity'] });
  const toggleBookmark = (type, item) => setBookmarks(prev => { const key = type === 'challenge' ? 'challenges' : 'paths'; const saved = prev[key].includes(item.title); return { ...prev, [key]: saved ? prev[key].filter(x => x !== item.title) : [...prev[key], item.title] }; });
  const [role, setRole] = useState('player');
  const [managedEvents, setManagedEvents] = useState(initialManagedEvents);
  const [creatorItems, setCreatorItems] = useState([
    { id: 1, kind: 'Challenge', title: 'Cookie Crumble', status: 'Published', points: 150, moduleCount: 2, modules: [], eventName: 'Independent', creatorUsername: 'cyberscythe', difficulty: 'Easy', category: 'Web', isPremium: false, tags: [] },
    { id: 2, kind: 'Learning Path', title: 'Web Security Foundations', status: 'Draft', points: 250, moduleCount: 5, modules: [], eventName: 'Independent', creatorUsername: 'cyberscythe', difficulty: 'Medium', category: 'Web', tags: [] },
  ]);
  const [eventChallenges, setEventChallenges] = useState([]);
  const creatorUsername = 'cyberscythe';
  const assignedEvents = managedEvents.filter(event => (event.assignedCreators || []).includes(creatorUsername));
  const submitEventChallenge = item => {
    const questionCount = (item.modules || []).reduce((count, module) => count + (module.questions || []).length, 0);
    const submission = { ...item, questionCount, submittedAt: new Date().toISOString(), status: 'Pending review', reviewFeedback: '' };
    setEventChallenges(prev => [submission, ...prev.filter(existing => existing.id !== item.id)]);
  };
  const reviewEventChallenge = (id, status, feedback) => {
    setEventChallenges(prev => prev.map(item => item.id === id ? { ...item, status, reviewFeedback: feedback } : item));
    setCreatorItems(prev => prev.map(item => item.id === id ? { ...item, status, reviewFeedback: feedback } : item));
  };
  const visibleNavGroups = getVisibleNavGroups(role);
  const [dark, setDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [detail, setDetail] = useState(null);
  const filteredChallenges = useMemo(() => challenges.filter(c => c.title.toLowerCase().includes(query.toLowerCase())), [query]);

  useEffect(() => {
    let active = true;
    const restoreSession = async () => {
      const token = getStoredAuthToken();
      if (!token) { if (active) setAuthChecking(false); return; }
      try {
        const user = await getCurrentUser(token);
        if (active) {
          setAuthUser(user);
          const roles = (user.roles || []).map(value => value.toLowerCase());
          setRole(roles.includes('admin') ? 'admin' : roles.includes('creator') ? 'creator' : 'player');
          setHasEntered(true);
        }
      } catch { clearAuthToken(); }
      finally { if (active) setAuthChecking(false); }
    };
    restoreSession();
    return () => { active = false; };
  }, []);

  const completeSignIn = (user, authMode = 'login') => {
    setAuthUser(user);
    const roles = (user.roles || []).map(value => value.toLowerCase());
    setRole(roles.includes('admin') ? 'admin' : roles.includes('creator') ? 'creator' : 'player');
    setHasEntered(true);
    setAuthScreen(null);
    setActive('Overview');
    setNotice(authMode === 'register' ? 'Your account was created successfully. Welcome to CTF Root!' : 'Signed in successfully. Welcome back.');
  };

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
    setDetail(null);
    setSidebarOpen(false);
    setNotice('');
  };

  if (authChecking) return <div className="auth-screen"><div className="auth-card"><p>Checking your CTF Root session…</p></div></div>;

  if (!hasEntered) return <>
    {authScreen ? <AuthPage initialMode={authScreen} onSuccess={completeSignIn} onSwitch={setAuthScreen}/> : <PublicHome onLogin={() => setAuthScreen('login')} onRegister={() => setAuthScreen('register')}/>}
    <Toast message={notice} onClose={() => setNotice('')} />
  </>;

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <Sidebar
        visibleNavGroups={visibleNavGroups}
        active={active}
        role={role}
        user={authUser}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectPage={selectPage}
        setNotice={setNotice}
        signOut={() => setConfirmation({ title: 'Sign out of CTF Root?', description: 'You will be signed out of this browser tab. You can sign in again at any time.', confirmLabel: 'Sign out', tone: 'danger', onConfirm: () => { clearAuthToken(); setAuthUser(null); setHasEntered(false); setAuthScreen(null); setRole('player'); setActive('Overview'); setConfirmation(null); setNotice('You have been signed out.'); } })}
      />
      {authScreen ? <AuthPage initialMode={authScreen} onSuccess={completeSignIn} onSwitch={setAuthScreen}/> : <main className="main">
        <Topbar active={active} query={query} setQuery={setQuery} dark={dark} setDark={setDark} setSidebarOpen={setSidebarOpen} setNotice={setNotice}/>

        <div className="content">
          <Toast message={notice} onClose={() => setNotice('')} />
          {role === 'admin' && active === 'Events' ? <AdminEvents events={managedEvents} onEventsChange={setManagedEvents} eventChallenges={eventChallenges} onReviewEventChallenge={reviewEventChallenge} /> :
            ['About','Guidelines','Settings','Subscriptions'].includes(active) ? <InfoPage page={active} role={role} onNotice={setNotice}/> :
            active === 'Overview' && role === 'player' ? <Dashboard onNavigate={selectPage} bookmarks={bookmarks} onToggleBookmark={toggleBookmark}/> :
            active === 'Creator Dashboard' ? <CreatorDashboard items={creatorItems} assignedEvents={assignedEvents} eventChallenges={eventChallenges} onNavigate={selectPage} /> :
            active === 'Admin Dashboard' ? <div className="panel"><h1>Admin dashboard</h1><p>Manage events, assign creators, review content and configure subscriptions. Admin tools are prototype placeholders.</p><div className="admin-dashboard-links"><button className="secondary-button" onClick={()=>selectPage('Events')}>Manage events</button><button className="secondary-button" onClick={()=>selectPage('Subscriptions')}>Manage subscriptions</button><button className="secondary-button" onClick={()=>selectPage('Creators')}>Manage creators</button></div></div> :
            <PageView page={active} onNavigate={selectPage} filteredChallenges={filteredChallenges} detail={detail} creatorItems={creatorItems} setCreatorItems={setCreatorItems} assignedEvents={assignedEvents} creatorUsername={creatorUsername} onSubmitEventChallenge={submitEventChallenge} managedEvents={managedEvents} eventChallenges={eventChallenges} onOpenDetail={(type, item) => { window.history.pushState({ ctfRoot: true, page: active, detail: true }, '', window.location.pathname + window.location.search); setDetail({ type, item }); }} onCloseDetail={() => setDetail(null)} bookmarks={bookmarks} onToggleBookmark={toggleBookmark}/>}
          <footer className="footer"><span>© 2026 CTF Root</span><span><button onClick={()=>selectPage('About')}>About</button><button onClick={()=>selectPage('Guidelines')}>Guidelines</button><a href="#status">System status <i className="status-dot"/></a></span><span>Built for curious minds <span className="footer-heart">♥</span></span></footer>
        </div>
      </main>}
    </div>
    <ConfirmDialog open={!!confirmation} title={confirmation?.title} description={confirmation?.description} confirmLabel={confirmation?.confirmLabel} tone={confirmation?.tone} onCancel={() => setConfirmation(null)} onConfirm={() => confirmation?.onConfirm?.()} />
  );
}

export default App;
