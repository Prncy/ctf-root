import { useState } from 'react';
import { ShieldCheck, CreditCard, BookOpen, Users, Bell, Lock, Check, Sparkles } from 'lucide-react';

function PageHeader({ eyebrow, title, description }) {
  return <div className="page-title-row"><div><div className="eyebrow">CTF ROOT / {eyebrow}</div><h1>{title}</h1><p className="subheading">{description}</p></div></div>;
}

export function InfoPage({ page, role = 'player', onNotice = () => {} }) {
  const [displayName, setDisplayName] = useState('CyberScythe');
  const [bio, setBio] = useState('Curious mind. Learning by breaking things and putting them back together.');
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [saved, setSaved] = useState(false);

  if (page === 'About') return <div className="page-enter">
    <PageHeader eyebrow="ABOUT" title="About CTF Root" description="A place to learn, practise and compete in cybersecurity."/>
    <section className="panel info-hero"><span className="info-icon"><ShieldCheck size={24}/></span><h2>Learn by doing. Grow by sharing.</h2><p>CTF Root is a community-driven cybersecurity learning platform designed to make practical security education more accessible. It brings hands-on challenges, guided learning paths, creators and competitions into one place.</p></section>
    <div className="info-card-grid"><article className="panel"><BookOpen/><h3>Learn</h3><p>Follow structured learning paths and build skills one concept at a time.</p></article><article className="panel"><ShieldCheck/><h3>Practise</h3><p>Explore challenges across cybersecurity topics and test what you know.</p></article><article className="panel"><Users/><h3>Compete together</h3><p>Join events, work with teams and learn from the community.</p></article></div>
    <section className="panel info-section"><h2>Our principles</h2><ul><li>Practical, accessible cybersecurity education.</li><li>Respectful collaboration and fair competition.</li><li>Responsible security research in authorised environments.</li><li>Recognition for learning, creativity and contribution.</li></ul></section>
  </div>;

  if (page === 'Guidelines') return <div className="page-enter">
    <PageHeader eyebrow="COMMUNITY" title="Community guidelines" description="Help keep CTF Root useful, safe and welcoming."/>
    <div className="guideline-list">
      <section className="panel"><h2>1. Learn and compete fairly</h2><p>Do not share flags, answers or private challenge materials while an event or challenge is active unless its rules explicitly allow it.</p></section>
      <section className="panel"><h2>2. Stay within authorised environments</h2><p>Only test systems you own or have explicit permission to assess. Never use CTF Root activities as permission to attack real services, campus systems or other users.</p></section>
      <section className="panel"><h2>3. Respect the community</h2><p>No harassment, discrimination, threats, impersonation, spam or deliberate disruption. Keep discussions constructive and focused on learning.</p></section>
      <section className="panel"><h2>4. Creator responsibilities</h2><p>Submit original or properly authorised content. Provide accurate descriptions, working flags, fair hints and clear difficulty levels. Do not include malware or expose real credentials and personal data.</p></section>
      <section className="panel"><h2>5. Event conduct</h2><p>Follow event-specific rules, team limits and deadlines. Do not interfere with other participants or attempt to manipulate scores or submissions.</p></section>
      <section className="panel"><h2>6. Reporting concerns</h2><p>Report unsafe content, suspected abuse or platform issues to the CTF Root administrators. Admins may review, restrict or remove content that violates these guidelines.</p></section>
    </div>
    <p className="info-footnote">These are prototype guidelines and may be expanded as platform policies are finalised.</p>
  </div>;

  if (page === 'Settings') return <div className="page-enter">
    <PageHeader eyebrow="PREFERENCES" title="Settings" description="Manage your profile and how CTF Root communicates with you."/>
    <section className="panel settings-section"><div className="settings-heading"><div><h2>Profile information</h2><p>Update the details shown on your profile.</p></div><Users/></div><label className="creator-field">Display name<input value={displayName} onChange={e=>setDisplayName(e.target.value)} /></label><label className="creator-field">Short bio<textarea value={bio} onChange={e=>setBio(e.target.value)} /></label><label className="settings-toggle"><span><strong>Public profile</strong><small>Allow other members to view your profile.</small></span><input type="checkbox" checked={publicProfile} onChange={e=>setPublicProfile(e.target.checked)}/></label></section>
    <section className="panel settings-section"><div className="settings-heading"><div><h2>Notifications</h2><p>Choose whether to receive platform updates by email.</p></div><Bell/></div><label className="settings-toggle"><span><strong>Email updates</strong><small>Receive important announcements and account updates.</small></span><input type="checkbox" checked={emailUpdates} onChange={e=>setEmailUpdates(e.target.checked)}/></label></section>
    <section className="panel settings-section"><div className="settings-heading"><div><h2>Security</h2><p>Account security controls will be connected when authentication is implemented.</p></div><Lock/></div><p className="info-footnote">Password changes, active sessions and two-factor authentication are not available in this frontend prototype.</p></section>
    <button className="primary-button" onClick={()=>{setSaved(true);onNotice('Settings saved in this demo session only. Backend persistence is not connected.');}}>Save settings</button>{saved&&<span className="info-footnote">Your changes are reflected in this demo session.</span>}
  </div>;

  if (page === 'Subscriptions' && role !== 'admin') return <div className="page-enter">
    <PageHeader eyebrow="MEMBERSHIP" title="Subscriptions" description="Choose how you access premium learning content on CTF Root."/>
    <div className="subscription-current panel"><div><span className="eyebrow">CURRENT PLAN</span><h2>Free</h2><p>You currently have access to all Free challenges and learning resources.</p></div><span className="free-label">ACTIVE</span></div>
    <div className="subscription-grid"><article className="panel plan-card"><span className="eyebrow">START HERE</span><h2>Free</h2><div className="plan-price">K0 <small>/ forever</small></div><ul><li><Check/> Access Free challenges</li><li><Check/> Explore learning paths</li><li><Check/> Join eligible events</li></ul><button className="secondary-button" disabled>Current plan</button></article><article className="panel plan-card featured-plan"><span className="premium-label">PREMIUM</span><h2>Premium</h2><div className="plan-price">Coming soon</div><p>Unlock published Premium challenges with an active subscription.</p><ul><li><Check/> Everything in Free</li><li><Check/> Premium challenge access</li><li><Check/> New premium content as it is released</li></ul><button className="primary-button" onClick={()=>onNotice('Premium subscriptions are not available yet. No payment has been taken.')}>Notify me when available <Sparkles size={15}/></button></article></div>
    <p className="info-footnote">Prices, payment methods, renewals and cancellation controls will be introduced with the subscription backend. This page does not process payments.</p>
  </div>;

  if (page === 'Subscriptions' && role === 'admin') return <AdminSubscriptions onNotice={onNotice}/>;
  return null;
}

function AdminSubscriptions({ onNotice }) {
  const [premiumPrice, setPremiumPrice] = useState(''); 
  const [premiumEnabled, setPremiumEnabled] = useState(false);
  const [annualEnabled, setAnnualEnabled] = useState(false);
  return <div className="page-enter">
    <PageHeader eyebrow="ADMINISTRATION" title="Subscription management" description="Configure plans and review subscription activity."/>
    <div className="admin-metric-grid"><div className="panel"><span>ACTIVE SUBSCRIPTIONS</span><strong>0</strong><small>Demo data only</small></div><div className="panel"><span>PREMIUM REVENUE</span><strong>—</strong><small>Payments not connected</small></div><div className="panel"><span>AVAILABLE PLANS</span><strong>{premiumEnabled?2:1}</strong><small>Free plan is always available</small></div></div>
    <section className="panel settings-section"><div className="settings-heading"><div><h2>Premium plan</h2><p>Set the platform-wide price and availability. Creators cannot set individual challenge prices.</p></div><CreditCard/></div><label className="creator-field">Monthly price (ZMW)<input type="number" min="0" step="1" placeholder="e.g. 50" value={premiumPrice} onChange={e=>setPremiumPrice(e.target.value)}/></label><label className="settings-toggle"><span><strong>Enable Premium subscriptions</strong><small>Allow players to subscribe once billing is connected.</small></span><input type="checkbox" checked={premiumEnabled} onChange={e=>setPremiumEnabled(e.target.checked)}/></label><label className="settings-toggle"><span><strong>Offer annual billing</strong><small>Annual pricing and discounts can be configured later.</small></span><input type="checkbox" checked={annualEnabled} onChange={e=>setAnnualEnabled(e.target.checked)}/></label><button className="primary-button" onClick={()=>onNotice('Plan settings updated in this demo session only. No real subscriptions or payments were changed.')}>Save plan settings</button></section>
    <section className="panel settings-section"><h2>Subscription records</h2><p>No real subscription records are available yet. Once authentication and billing are connected, this area will list members, plan, status, renewal date and payment reference.</p><div className="empty-inline">No subscription records to display.</div></section>
    <p className="info-footnote">Only admins with subscription-management permission should be able to change plan settings or view member billing records. Payment integration is not implemented.</p>
  </div>;
}
