import React from 'react';
import { X, Mail, Phone, Calendar, Briefcase } from 'lucide-react';
import styles from './CandidateDrawer.module.css';
import { useAppContext } from '../../context/AppContext';

const STAGES = ["Applying Period", "Screening", "Interview", "Test"];

export default function CandidateDrawer({ candidate, onClose }) {
  const { updateCandidateStage, addNotification } = useAppContext();
  if (!candidate) return null;

  const handleNextStage = async () => {
    // Reverse logic requested: Test -> Interview -> Screening -> Applying Period
    const currentIndex = STAGES.indexOf(candidate.stage);
    let nextIndex;
    
    if (currentIndex === -1) {
      // If candidate is in "Rejected" or other non-standard stage, bring back to start
      nextIndex = 3; // Start at Test
    } else {
      // Move backwards: index 3 -> 2 -> 1 -> 0 -> 3
      nextIndex = (currentIndex - 1 + STAGES.length) % STAGES.length;
    }
    
    const newStage = STAGES[nextIndex];
    try {
      await updateCandidateStage(candidate.id, newStage);
      addNotification(`${candidate.name} moved to ${newStage}`, 'status');
      onClose(); // Optional: close drawer after action
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async () => {
    try {
      await updateCandidateStage(candidate.id, "Rejected");
      addNotification(`${candidate.name} has been rejected`, 'error');
      onClose();
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={`${styles.drawer} ${candidate ? styles.open : ''}`}>
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <div className={styles.avatarLarge}>
              {candidate.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div>
              <h2>{candidate.name}</h2>
              <span className={styles.stageTag}>{candidate.stage}</span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
        </div>

        <div className={styles.content}>
          <div className={styles.sectionCard}>
            <h3>Contact Info</h3>
            <div className={styles.infoRow}><Mail size={16}/> {candidate.email}</div>
            <div className={styles.infoRow}><Phone size={16}/> {candidate.phone}</div>
          </div>

          <div className={styles.sectionCard}>
            <h3>Experience & Education</h3>
            <div className={styles.infoRow}><Briefcase size={16}/> {candidate.experience}</div>
            <div className={styles.infoRow}><Calendar size={16}/> {candidate.education}</div>
          </div>

          <div className={styles.sectionCard}>
            <h3>Candidate Timeline</h3>
            <div className={styles.timeline}>
              {candidate.timeline.map((event, idx) => (
                <div key={idx} className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineContent}>
                    <strong>{event.event}</strong>
                    <span className={styles.timelineDate}>{event.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sectionCard}>
            <h3>Score Details</h3>
            <div className={styles.scoreDetails}>
              {Object.entries(candidate.scoreDetails).map(([key, val]) => (
                <div key={key} className={styles.scoreRow}>
                  <span>{key}</span>
                  <div className={styles.scoreBarBg}>
                    <div className={styles.scoreBarFill} style={{width: `${(val/5)*100}%`}}></div>
                  </div>
                  <span>{val}/5</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className={styles.footer}>
          <button className={styles.outlineBtn} onClick={handleReject}>Reject</button>
          <button className={styles.primaryBtn} onClick={handleNextStage}>Next Stage</button>
        </div>
      </div>
    </>
  );
}

