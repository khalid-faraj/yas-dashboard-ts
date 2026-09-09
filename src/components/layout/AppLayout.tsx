import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import styles from './AppLayout.module.css';

export interface AppLayoutProps {
  children?: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps): JSX.Element {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Belt-and-suspenders: close the mobile drawer on every navigation,
  // regardless of whether it was triggered by a nav Link click, the
  // browser's back/forward buttons, or anything else.
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Prevent the page behind the drawer from scrolling while it's open on
  // mobile — this also avoids any edge-swipe/overscroll interaction with
  // the off-canvas sidebar while it's mid-transition.
  useEffect(() => {
    if (isSidebarOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }

    return undefined;
  }, [isSidebarOpen]);

  return (
    <div className={styles.shell}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.main}>
        <button
          type="button"
          className={styles.mobileMenuButton}
          onClick={() => setSidebarOpen(true)}
          aria-label="فتح القائمة"
        >
          ☰
        </button>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
