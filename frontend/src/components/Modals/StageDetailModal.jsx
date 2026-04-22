import React from 'react';
import { X, Users, BarChart3, Clock, Star, ArrowRight } from 'lucide-react';
import styles from './StageDetailModal.module.css';

export default function StageDetailModal({ stage, candidates, onClose, onCandidateClick, onSettingsClick }) {
  if (!stage) return null;

  const stageColors = {
    "Applying Period": "#FFAB00",
    "Screening": "#904EE2",
    "Interview": "#2684FF",
    "Test": "#36B37E"
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Mock metrics based on stage
  const metrics = {
    "Applying Period": { avgTime: "1.2 Days", conversion: "68%", trend: "+12%" },
    "Screening": { avgTime: "3.5 Days", conversion: "42%", trend: "-5%" },
    "Interview": { avgTime: "5.2 Days", conversion: "24%", trend: "+8%" },
    "Test": { avgTime: "4.1 Days", conversion: "15%", trend: "0%" }
  }[stage] || { avgTime: "2.4 Days", conversion: "30%", trend: "+2%" };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div 
              className={styles.stageBadge} 
              style={{ backgroundColor: stageColors[stage] || '#64748b' }}
            >
              {stage}
            </div>
            <h2 className={styles.title}>Stage Overview</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>
                <Users size={12} style={{marginRight: 4}} /> Total Candidates
              </div>
              <div className={styles.metricValue}>{candidates.length}</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>
                <Clock size={12} style={{marginRight: 4}} /> Avg. Time in Stage
              </div>
              <div className={styles.metricValue}>{metrics.avgTime}</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>
                <BarChart3 size={12} style={{marginRight: 4}} /> Conversion Rate
              </div>
              <div className={styles.metricValue}>{metrics.conversion}</div>
            </div>
          </div>

          <div className={styles.sectionTitle}>
            <Users size={18} /> Active Candidates ({candidates.length})
          </div>

          <div className={styles.candidateList}>
            {candidates.length > 0 ? (
              candidates.map(cand => (
                <div 
                  key={cand.id} 
                  className={styles.candidateItem}
                  onClick={() => {
                    onCandidateClick(cand);
                    onClose();
                  }}
                >
                  <div className={styles.avatar}>
                    {getInitials(cand.name)}
                  </div>
                  <div className={styles.candInfo}>
                    <div className={styles.candName}>{cand.name}</div>
                    <div className={styles.candMeta}>Applied {cand.applicationDate} • {cand.email || 'No email'}</div>
                  </div>
                  {cand.overallScore > 0 && (
                    <div className={styles.candScore}>
                      <Star size={14} fill="currentColor" /> {cand.overallScore}
                    </div>
                  )}
                  <ArrowRight size={16} style={{marginLeft: 16, opacity: 0.3}} />
                </div>
              ))
            ) : (
              <div style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>
                No candidates currently in this stage.
              </div>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.secondaryBtn} onClick={onClose}>Close</button>
          <button className={styles.primaryBtn} onClick={() => onSettingsClick(stage)}>
            Stage Settings
          </button>
        </div>
      </div>
    </div>
  );
}
