import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Star, UserPlus, Plus } from 'lucide-react';
import styles from './CandidateCard.module.css';

export default function CandidateCard({ candidate, index, onCandidateClick }) {
  const colors = ['#f43f5e', '#a855f7', '#3b82f6', '#10b981', '#f59e0b'];
  const bgColor = colors[candidate.name.length % colors.length];
  
  const initials = candidate.name.split(' ').map(n => n[0]).join('').substring(0, 2);
  const useAvatar = parseInt(candidate.id) % 3 === 0;

  return (
    <Draggable draggableId={candidate.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`${styles.card} ${snapshot.isDragging ? styles.isDragging : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onCandidateClick && onCandidateClick(candidate)}
        >
          <div className={styles.mainInfo}>
            {!useAvatar ? (
               <div className={styles.avatarPlaceholder} style={{backgroundColor: bgColor}}>
                 {initials}
               </div>
            ) : (
               <img 
                 src={`https://i.pravatar.cc/150?u=${candidate.id}`} 
                 alt={candidate.name} 
                 className={styles.avatar} 
               />
            )}
            <div className={styles.nameGroup}>
              <div className={styles.name}>{candidate.name}</div>
              <div className={styles.date}>Applied at {candidate.applicationDate}</div>
            </div>
          </div>
          
          <div className={styles.footer}>
            {candidate.overallScore > 0 ? (
              <div className={styles.score}>
                <Star size={14} fill="var(--color-star)" color="var(--color-star)" />
                <span className={styles.scoreValue}>{candidate.overallScore}</span>
                <span className={styles.scoreLabel}>Overall</span>
              </div>
            ) : (
              <div className={styles.assessmentBadge} style={{color: 'var(--text-secondary)'}}>
                {candidate.assessmentAdded ? (
                  <span style={{color: 'var(--color-assessment)', display: 'flex', alignItems: 'center', gap: '4px'}}>
                     <Plus size={14} /> Add Assessment
                  </span>
                ) : (
                   "No Score"
                )}
              </div>
            )}
            
            <div className={styles.badges}>
              {candidate.isReferred && (
                <div className={styles.referredBadge}>
                  <UserPlus size={14} /> Referred
                </div>
              )}
              {candidate.assessmentAdded && candidate.overallScore > 0 && (
                 <div className={styles.assessmentBadge}>
                   <Plus size={14} /> Add Assessment
                </div>
              )}
              <button className={styles.moreBtn}>...</button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
