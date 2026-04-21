import React from 'react';
import { Search, Bell, Plus } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logoGroup}>
        <div className={styles.logoDot}></div>
        <span className={styles.brand}>tiimi</span>
        <span className={styles.title}>Recruitment</span>
      </div>
      
      <div className={styles.navLinks}>
         <div className={styles.navLink}>Jobs <span className={styles.badge}>8</span></div>
         <div className={`${styles.navLink} ${styles.active}`}>Candidate <span className={styles.badgeOrange}>551</span></div>
         <div className={styles.navLink}>Career Site</div>
      </div>
      
      <div className={styles.actions}>
         <div className={styles.actionBtn} style={{backgroundColor: '#fbbf24', color: '#000'}}><Plus size={18} /></div>
         <div className={styles.actionBtn}><Search size={18} /></div>
         <div className={styles.actionBtn}><Bell size={18} /></div>

         <div className={styles.avatar}>
           <img src="https://i.pravatar.cc/150?img=11" alt="User Avatar" />
         </div>
      </div>
    </nav>
  );
}
