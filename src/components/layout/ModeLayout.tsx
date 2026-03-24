import { ReactNode } from 'react'
import styles from './ModeLayout.module.css'

interface ModeLayoutProps {
  controls: ReactNode
  canvas: ReactNode
}

export function ModeLayout({ controls, canvas }: ModeLayoutProps) {
  return (
    <main className={styles.main}>
      <aside className={styles.sidebar}>{controls}</aside>
      <section className={styles.canvasSection}>{canvas}</section>
    </main>
  )
}
