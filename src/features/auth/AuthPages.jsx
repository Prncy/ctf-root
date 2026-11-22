import { useState } from 'react';
import { Shield, ArrowRight, Code2, Users, Flag, Trophy, BookOpen } from 'lucide-react';

export function PublicHome({ onLogin, onRegister }) {
  return <div className="public-home">
    <header className="public-nav"><a className="public-brand" href="#top"><span className="brand-mark"><Shield size={20}/></span><span className="brand-name">ctf<span>root</span></span></a><nav><a href="#features">Explore</a><a href="#how-it-works">How it works</a></nav><div className="public-nav-actions"><button className="public-login" onClick={onLogin}>Log in</button><button className="primary-button" onClick={onRegister}>Create account <ArrowRight size={15}/></button></div></header>
    <main id="top"><section className="public-hero"><div className="public-hero-copy"><div className="eyebrow"><span className="live-dot"/> YOUR CYBERSECURITY JOURNEY STARTS HERE</div><h1>Learn. Hack.<br/><em>Grow your skills.</em></h1><p>Build practical cybersecurity skills through hands-on challenges, guided learning paths and community competitions.</p><div className="public-hero-actions"><button className="primary-button" onClick={onRegister}>Get started for free <ArrowRight size={16}/></button><button className="public-secondary" onClick={onLogin}>I already have an account</button></div><div className="public-trust"><span><Shield size={14}/> Learn ethically</span><span><Code2 size={14}/> Practice hands-on</span><span><Users size={14}/> Grow together</span></div></div><div className="public-hero-art"><div className="public-orbit public-orbit-one"/><div className="public-orbit public-orbit-two"/><div className="public-terminal"><div className="terminal-dots"><i/><i/><i/></div><span className="terminal-muted">root@ctfroot:~$</span><strong>Ready to explore?</strong><code><b>01</b> Learn the fundamentals</code><code><b>02</b> Solve real challenges</code><code><b>03</b> Level up your skills</code><div className="terminal-cursor">_</div></div><div className="public-float public-float-one"><Flag size={15}/> Challenges</div><div className="public-float public-float-two"><Trophy size={15}/> Community events</div></div></section>
    <section className="public-features" id="features"><div className="eyebrow">BUILT FOR CURIOUS MINDS</div><h2>Everything you need to keep learning.</h2><div className="public-feature-grid"><article><span><Flag size={19}/></span><h3>Hands-on challenges</h3><p>Put your knowledge into practice with challenges across different cybersecurity domains.</p></article><article><span><BookOpen size={19}/></span><h3>Guided learning</h3><p>Follow structured learning paths, build confidence and track your progress.</p></article><article><span><Trophy size={19}/></span><h3>Events & community</h3><p>Take part in competitions, collaborate with others and celebrate your progress.</p></article></div></section>
    <section className="public-cta" id="how-it-works"><div><div className="eyebrow">YOUR NEXT STEP</div><h2>Curiosity is a good place to start.</h2><p>Create an account and begin your cybersecurity journey with CTF Root.</p></div><button className="primary-button" onClick={onRegister}>Join CTF Root <ArrowRight size={15}/></button></section></main><footer className="public-footer"><span>© 2026 CTF Root</span><span>Built for curious minds <b>♥</b></span></footer>
  </div>;
}

import { useState } from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import { clearAuthToken, getCurrentUser, loginAccount, registerAccount, storeAuthToken } from '../../services/authApi.js';

export function AuthPage({ initialMode = 'login', onSuccess, onSwitch }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (mode === 'register' && password !== confirm) {
      setError('Your passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const tokenResponse = mode === 'register'
        ? await registerAccount({ email: email.trim(), displayName: displayName.trim(), password })
        : await loginAccount({ email: email.trim(), password });
      if (!tokenResponse?.accessToken) {
        throw new Error('The server returned an unexpected authentication response.');
      }
      storeAuthToken(tokenResponse.accessToken);
      try {
        const user = await getCurrentUser(tokenResponse.accessToken);
        onSuccess(user);
      } catch (profileError) {
        clearAuthToken();
        throw profileError;
      }
    } catch (requestError) {
      setError(requestError.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const changeMode = (next) => {
    setMode(next);
    setError('');
    setPassword('');
    setConfirm('');
    onSwitch(next);
  };

  return <div className="auth-screen">
    <div className="auth-card">
      <div className="auth-brand"><span className="brand-mark"><Shield size={20}/></span><span className="brand-name">ctf<span>root</span></span></div>
      <div className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'JOIN THE COMMUNITY'}</div>
      <h1>{mode === 'login' ? 'Sign in to CTF Root' : 'Create your account'}</h1>
      <p>{mode === 'login' ? 'Continue your cybersecurity learning journey.' : 'Start learning, solving challenges and tracking your progress.'}</p>
      <form onSubmit={submit}>
        {mode === 'register' && <label>Display name<input value={displayName} onChange={event => setDisplayName(event.target.value)} placeholder="How should we address you?" minLength={2} maxLength={100} autoComplete="name" required/></label>}
        <label>Email address<input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" maxLength={254} autoComplete="email" required/></label>
        <label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" minLength={mode === 'register' ? 12 : 1} maxLength={128} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required/></label>
        {mode === 'register' && <>
          <small className="auth-password-hint">Use at least 12 characters, including uppercase, lowercase, a number and a symbol.</small>
          <label>Confirm password<input type="password" value={confirm} onChange={event => setConfirm(event.target.value)} placeholder="Repeat your password" minLength={12} maxLength={128} autoComplete="new-password" required/></label>
        </>}
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'} {!loading && <ArrowRight size={15}/>}</button>
      </form>
      <div className="auth-switch">{mode === 'login' ? "Don't have an account?" : 'Already have an account?'} <button type="button" onClick={() => changeMode(mode === 'login' ? 'register' : 'login')} disabled={loading}>{mode === 'login' ? 'Register' : 'Sign in'}</button></div>
      <small className="auth-demo-note">Your account is managed by ASP.NET Core Identity. Sign-in sessions currently last for this browser tab.</small>
    </div>
  </div>;
}
