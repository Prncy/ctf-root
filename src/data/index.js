export const currentUser = {
  name: 'CyberScythe',
  handle: '@cyberscythe',
  avatar: 'CS',
  level: 'Intermediate',
  joined: 'Aug 2026',
};

export const stats = [
  { label: 'Challenge points', value: '4,909', change: '+240 this month', tone: 'green' },
  { label: 'Challenges solved', value: '38', change: '12 in the last 30 days', tone: 'blue' },
  { label: 'Learning points', value: '1,240', change: '4 paths in progress', tone: 'purple' },
  { label: 'Event points', value: '860', change: 'Top 15% this season', tone: 'orange' },
];

export const paths = [
  { title: 'Introduction to Cybersecurity', creator: 'Root Academy', progress: 72, lessons: '8 of 11 lessons', color: 'green', tag: 'Beginner', hasLab: false, files: [{ name: 'intro_security_notes.pdf', type: 'PDF', size: '1.2 MB' }] },
  { title: 'Web Exploitation Fundamentals', creator: 'NullByte', progress: 35, lessons: '5 of 14 lessons', color: 'blue', tag: 'Intermediate', hasLab: false, files: [] },
  { title: 'Cryptography: The Essentials', creator: 'CipherLab', progress: 18, lessons: '2 of 10 lessons', color: 'purple', tag: 'Beginner', hasLab: false, files: [{ name: 'cipher_reference.txt', type: 'TXT', size: '8 KB' }] },
];

export const challenges = [
  { title: 'Cookie Crumble', category: 'Web', tags: ['XOR', 'Cryptography'], difficulty: 'Easy', points: 150, solves: 284, icon: '◈', color: 'blue', maxAttempts: 5, banOnExhaustion: true, hasLab: false, files: [{ name: 'cookie_capture.pcap', type: 'PCAP', size: '284 KB' }, { name: 'challenge_notes.txt', type: 'TXT', size: '4 KB' }], modules: [{ title: 'Level 1 · Inspect the cookie', description: 'Inspect the supplied request and identify the interesting cookie value.', points: 50, demoFlag: 'CTFROOT{cookie_level_one}' }, { title: 'Level 2 · Crumble the protection', description: 'Investigate how the cookie is protected and recover the hidden value.', points: 100, demoFlag: 'CTFROOT{cookie_crumble}' }] },
  { title: 'A Very Strange Letter', category: 'Cryptography', difficulty: 'Medium', points: 250, solves: 126, icon: '⌘', color: 'purple', maxAttempts: null, banOnExhaustion: false, hasLab: false, files: [], modules: [{ title: 'Level 1 · The unusual message', description: 'Identify the transformation used to encode the message.', points: 100, demoFlag: 'CTFROOT{strange_letter_one}' }, { title: 'Level 2 · Decode the letter', description: 'Recover the final plaintext and submit its flag.', points: 150, demoFlag: 'CTFROOT{strange_letter}' }] },
  { title: 'Shadows in the Logs', category: 'Forensics', tags: ['Steganography'], difficulty: 'Medium', points: 300, solves: 89, icon: '⌕', color: 'orange', maxAttempts: 3, banOnExhaustion: true, hasLab: false, files: [{ name: 'server_access.log', type: 'LOG', size: '96 KB' }], modules: [{ title: 'Level 1 · Find the trace', description: 'Locate the suspicious activity in the server access log.', points: 100, demoFlag: 'CTFROOT{trace_found}' }, { title: 'Level 2 · Follow the shadows', description: 'Correlate the evidence and identify the final flag.', points: 200, demoFlag: 'CTFROOT{shadows_in_logs}' }] },
];

export const leaderboard = [
  { rank: 1, name: 'bytebandit', points: '8,293', change: '+320', avatar: 'BB' },
  { rank: 2, name: 'cr1sis', points: '8,221', change: '+180', avatar: 'CR' },
  { rank: 3, name: 'CyberScythe', points: '4,909', change: '+240', avatar: 'CS', you: true },
  { rank: 4, name: 'rootkitten', points: '4,650', change: '+90', avatar: 'RK' },
];

export const events = [
  { title: 'Rooted CTF: Autumn Edition', type: 'Team event', date: 'Nov 14 – Nov 16, 2026', status: 'Registration open', participants: '42 teams' },
  { title: 'Web Sprint #04', type: 'Individual event', date: 'Nov 08, 2026', status: 'Upcoming', participants: '186 players' },
];