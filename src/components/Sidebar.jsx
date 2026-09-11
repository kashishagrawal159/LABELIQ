import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Camera, 
  History, 
  BookmarkCheck, 
  Award, 
  UserCircle,
  FileSearch,
  Briefcase,
  AlertOctagon,
  Image as ImageIcon,
  MapPin,
  Building,
  Scale,
  FileCheck2,
  ListTree,
  Boxes,
  RefreshCw,
  Clock,
  BellRing
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const getNavLinks = () => {
    if (user.role === 'consumer') {
      return [
        { label: 'Dashboard', path: '/consumer/dashboard', icon: LayoutDashboard },
        { label: 'Check Product', path: '/consumer/check', icon: Camera },
        { label: 'My Checks', path: '/consumer/history', icon: History },
        { label: 'Saved Products', path: '/consumer/saved', icon: BookmarkCheck },
        { label: 'Compliance Passport', path: '/consumer/passport', icon: Award },
        { label: 'Profile', path: '/consumer/profile', icon: UserCircle },
      ];
    }

    if (user.role === 'inspector') {
      return [
        { label: 'Command Center', path: '/inspector/dashboard', icon: LayoutDashboard },
        { label: 'Cross-Source Triangulation', path: '/inspector/triangulation', icon: Scale },
        { label: 'Inspections', path: '/inspector/inspections', icon: FileSearch },
        { label: 'Cases', path: '/inspector/cases', icon: Briefcase },
        { label: 'Violations', path: '/inspector/violations', icon: AlertOctagon },
        { label: 'Evidence', path: '/inspector/evidence', icon: ImageIcon },
        { label: 'Risk Map', path: '/inspector/risk-map', icon: MapPin },
        { label: 'Manufacturers', path: '/inspector/manufacturers', icon: Building },
        { label: 'Rule Matrix', path: '/rules', icon: Scale },
        { label: 'Reports', path: '/inspector/reports', icon: FileCheck2 },
        { label: 'Audit Trail', path: '/inspector/audit', icon: ListTree },
      ];
    }

    if (user.role === 'manufacturer') {
      return [
        { label: 'Dashboard', path: '/manufacturer/dashboard', icon: LayoutDashboard },
        { label: 'Products', path: '/manufacturer/products', icon: Boxes },
        { label: 'Pre-Publish Check', path: '/manufacturer/pre-publish', icon: Camera },
        { label: 'Issues', path: '/manufacturer/issues', icon: AlertOctagon },
        { label: 'Fix & Recheck', path: '/manufacturer/fix-recheck', icon: RefreshCw },
        { label: 'Compliance Passport', path: '/manufacturer/passport', icon: Award },
        { label: 'Version History', path: '/manufacturer/versions', icon: Clock },
        { label: 'Regulatory Alerts', path: '/manufacturer/regulatory-alerts', icon: BellRing },
        { label: 'Reports', path: '/manufacturer/reports', icon: FileCheck2 },
        { label: 'Profile', path: '/manufacturer/profile', icon: UserCircle },
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Role Context Bar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Current Portal
        </div>
        <div className="font-semibold text-sm text-slate-800 capitalize mt-0.5 flex items-center justify-between">
          <span>{user.role} Portal</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" title="System Connected"></span>
        </div>
        <div className="text-xs text-slate-500 truncate mt-0.5">
          {user.name || user.email}
        </div>
      </div>

      {/* Nav links */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path !== '/rules'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold border-l-4 border-brand-600 pl-2 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 text-slate-500" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom info link to Rule Matrix */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-500">
        <Link 
          to="/rules" 
          className="flex items-center gap-2 p-2 text-slate-600 hover:text-brand-600 rounded-md hover:bg-white transition"
        >
          <Scale className="w-3.5 h-3.5 text-brand-600" />
          <span>Active Legal Metrology Rules</span>
        </Link>
      </div>
    </aside>
  );
}
