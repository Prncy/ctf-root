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
  { title: 'Introduction to Cybersecurity', creator: 'Root Academy', progress: 72, lessons: '8 of 11 lessons', color: 'green', tag: 'Beginner' },
  { title: 'Web Exploitation Fundamentals', creator: 'NullByte', progress: 35, lessons: '5 of 14 lessons', color: 'blue', tag: 'Intermediate' },
  { title: 'Cryptography: The Essentials', creator: 'CipherLab', progress: 18, lessons: '2 of 10 lessons', color: 'purple', tag: 'Beginner' },
];

export const challenges = [
  { title: 'Cookie Crumble', category: 'Web', difficulty: 'Easy', points: 150, solves: 284, icon: '◈', color: 'blue' },
  { title: 'A Very Strange Letter', category: 'Cryptography', difficulty: 'Medium', points: 250, solves: 126, icon: '⌘', color: 'purple' },
  { title: 'Shadows in the Logs', category: 'Forensics', difficulty: 'Medium', points: 300, solves: 89, icon: '⌕', color: 'orange' },
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