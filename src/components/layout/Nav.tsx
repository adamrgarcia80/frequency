import { NavLink } from 'react-router-dom'
import styles from './Nav.module.css'

const MODES = [
  { path: '/', label: 'Signal' },
  { path: '/strata', label: 'Strata' },
  { path: '/filament', label: 'Filament' },
]

export function Nav() {
  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.logo} end>
        FREQUENCY
      </NavLink>
      <div className={styles.links}>
        {MODES.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
