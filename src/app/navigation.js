import {
  Activity, Award, BookOpen, Boxes, Code2, Compass, Flag, FolderKanban,
  LayoutDashboard, Sparkles, Trophy, Users, Shield, Settings, CreditCard
} from 'lucide-react';

export const navGroups = [
  { title: 'WORKSPACE', items: [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'My Progress', icon: Activity },
    { label: 'Challenges', icon: Flag, count: 'New' },
    { label: 'Learning Paths', icon: BookOpen },
    { label: 'Events', icon: Trophy },
  ]},
  { title: 'DISCOVER', items: [
    { label: 'Creators', icon: Users },
    { label: 'Leaderboard', icon: Award },
    { label: 'Vaults', icon: Boxes },
    { label: 'Bookmarks', icon: FolderKanban },
  ]},
  { title: 'YOUR SPACE', items: [
    { label: 'My Profile', icon: Compass },
    { label: 'Creator Studio', icon: Code2 },
    { label: 'Subscriptions', icon: Sparkles },
    { label: 'Settings', icon: Settings },
  ]},
];

export function getVisibleNavGroups(role) {
  if (role === 'creator') return [{
    title: 'CREATOR WORKSPACE',
    items: [
      { label: 'Creator Dashboard', icon: LayoutDashboard },
      { label: 'Creator Studio', icon: Code2 },
      { label: 'My Profile', icon: Compass },
      { label: 'Settings', icon: Settings },
    ],
  }];

  if (role === 'admin') return [{
    title: 'ADMINISTRATION',
    items: [
      { label: 'Admin Dashboard', icon: Shield },
      { label: 'Events', icon: Trophy },
      { label: 'Creators', icon: Users },
      { label: 'Subscriptions', icon: CreditCard },
      { label: 'Settings', icon: Settings },
    ],
  }];

  return navGroups.map(group => ({
    ...group,
    items: group.items.filter(item => item.label !== 'Creator Studio'),
  }));
}
