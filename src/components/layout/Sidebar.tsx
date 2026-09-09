import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  key: string;
  label: string;
  icon: string;
  to: string | null;
}

const NAV_ITEMS: NavItem[] = [
  {
    key: "sales",
    label: "إحصائيات المبيعات",
    icon: "📊",
    to: "/cpanel/dashboard/sales",
  },
  {
    key: "monthly",
    label: "إحصائيات المبيعات الشهرية",
    icon: "📅",
    to: "/cpanel/dashboard/sales/monthly",
  },
  {
    key: "employee-collections",
    label: "إحصائيات تحصيل البائعين",
    icon: "💵",
    to: "/cpanel/dashboard/employee-collections",
  },
  {
    key: "financial-balances",
    label: "الأرصدة المالية",
    icon: "💳",
    to: "/cpanel/dashboard/financial-balances",
  },
];

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps): JSX.Element {
  const location = useLocation();
  const footerSubtitle = localStorage.getItem("auth_user_name") ?? "";

  return (
    <>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.brand}>
          <div className={styles.brandMark}>YAS</div>
          <span className={styles.brandName}>نظام المبيعات</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.to !== null && location.pathname === item.to;
            const commonProps = {
              className: `${styles.navItem} ${
                isActive ? styles.navItemActive : ""
              }`,
            };

            if (item.to) {
              return (
                <Link
                  key={item.key}
                  to={item.to}
                  {...commonProps}
                  onClick={onClose}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <a
                key={item.key}
                href="#"
                {...commonProps}
                onClick={(e) => e.preventDefault()}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <div className={styles.footerCard}>
            <div className={styles.footerTitle}>مدير النظام</div>
            <div className={styles.footerSubtitle}>{footerSubtitle}</div>
          </div>
        </div>
      </aside>
    </>
  );
}
