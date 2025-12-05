// ===== HEADER =====
// Header generico para paginas

import { Icons } from '@constants/icons';
import styles from './Header.module.css';

const Header = ({ title, subtitle, showBack, onBack, actions }) => (
  <header className={styles.header}>
    <div className={styles.left}>
      {showBack && (
        <button className={`btn-hover ${styles.backButton}`} onClick={onBack}>
          <div className={styles.backIcon}><Icons.Back /></div>
        </button>
      )}
      <div>
        <h1 className={`${styles.title} ${subtitle ? styles.withSubtitle : styles.noSubtitle}`}>
          {title}
        </h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </div>
    {actions && <div className={styles.actions}>{actions}</div>}
  </header>
);

export default Header;
