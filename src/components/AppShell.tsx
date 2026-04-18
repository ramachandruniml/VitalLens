import {
  Activity,
  LayoutDashboard,
  ShieldCheck,
  Upload,
  type LucideIcon,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

type NavItem = {
  label: string
  path: string
  icon: LucideIcon
  description: string
}

const navItems: NavItem[] = [
  {
    label: 'Upload',
    path: '/upload',
    icon: Upload,
    description: 'Intake and processing flow',
  },
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    description: 'Summary cards and status',
  },
  {
    label: 'Trends',
    path: '/trends',
    icon: Activity,
    description: 'Longitudinal view and charts',
  },
]

export function AppShell() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-panel">
          <p className="eyebrow">VitalLens</p>
          <h1>Clinical vision workspace</h1>
          <p className="brand-copy">
            A calmer interface for intake, summary insights, and patient trend review.
          </p>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          {navItems.map(({ label, path, icon: Icon, description }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `nav-card${isActive ? ' nav-card-active' : ''}`
              }
            >
              <div className="nav-icon-wrap">
                <Icon size={18} />
              </div>
              <div>
                <span className="nav-label">{label}</span>
                <p>{description}</p>
              </div>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer-card">
          <div className="sidebar-footer-label">
            <ShieldCheck size={16} />
            <span>System health</span>
          </div>
          <strong>Ready for clinician review</strong>
          <p>Core upload, dashboard, and trend surfaces are connected and ready for feature work.</p>
        </div>
      </aside>

      <main className="content-area">
        <div className="content-topbar">
          <div>
            <p className="eyebrow">Workspace</p>
            <strong>Diagnostic intake console</strong>
          </div>
          <div className="topbar-badge">
            <span className="live-dot" />
            Prototype online
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
