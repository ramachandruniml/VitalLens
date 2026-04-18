import { useEffect, useState, type CSSProperties } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

type MotionStyle = CSSProperties & {
  '--orb-rotation': string
  '--dot-top-shift-x': string
  '--dot-top-shift-y': string
  '--dot-mid-shift-x': string
  '--dot-mid-shift-y': string
  '--dot-left-shift-x': string
  '--dot-left-shift-y': string
  '--dot-right-shift-x': string
  '--dot-right-shift-y': string
  '--dot-low-shift-x': string
  '--dot-low-shift-y': string
  '--orb-mini-left-shift-y': string
  '--orb-mini-right-shift-y': string
}

type NavItem = {
  label: string
  path: string
}

const navItems: NavItem[] = [
  { label: 'Upload', path: '/upload' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Trends', path: '/trends' },
  { label: 'Doctor Prep', path: '/doctor-prep' },
]

export function AppShell() {
  const [scrollOffset, setScrollOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(window.scrollY)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const shellStyle: MotionStyle = {
    '--orb-rotation': `${scrollOffset * 0.04}deg`,
    '--dot-top-shift-x': `${scrollOffset * 0.02}px`,
    '--dot-top-shift-y': `${scrollOffset * 0.035}px`,
    '--dot-mid-shift-x': `${scrollOffset * -0.025}px`,
    '--dot-mid-shift-y': `${scrollOffset * 0.03}px`,
    '--dot-left-shift-x': `${scrollOffset * 0.015}px`,
    '--dot-left-shift-y': `${scrollOffset * 0.022}px`,
    '--dot-right-shift-x': `${scrollOffset * -0.018}px`,
    '--dot-right-shift-y': `${scrollOffset * 0.026}px`,
    '--dot-low-shift-x': `${scrollOffset * 0.012}px`,
    '--dot-low-shift-y': `${scrollOffset * -0.016}px`,
    '--orb-mini-left-shift-y': `${scrollOffset * 0.028}px`,
    '--orb-mini-right-shift-y': `${scrollOffset * -0.02}px`,
  }

  return (
    <div className="app-shell" style={shellStyle}>
      <div className="ambient-orb ambient-orb-primary" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-secondary" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-mini ambient-orb-mini-left" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-mini ambient-orb-mini-right" aria-hidden="true" />
      <div className="ambient-dot ambient-dot-top" aria-hidden="true" />
      <div className="ambient-dot ambient-dot-mid" aria-hidden="true" />
      <div className="ambient-dot ambient-dot-left" aria-hidden="true" />
      <div className="ambient-dot ambient-dot-right" aria-hidden="true" />
      <div className="ambient-dot ambient-dot-low" aria-hidden="true" />

      <header className="site-header">
        <NavLink to="/upload" className="brand-mark">
          VitalLens
        </NavLink>

        <nav className="site-nav" aria-label="Primary">
          {navItems.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `site-nav-link${isActive ? ' site-nav-link-active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <span className="header-language">EN</span>
        </div>
      </header>

      <main className="content-area">
        <div className="content-topbar">
          <div>
            <p className="eyebrow">Workspace</p>
            <strong>Clinical review interface</strong>
          </div>

        </div>
        <Outlet />
      </main>
    </div>
  )
}
