import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import CandidateCard from '../CandidateCard/CandidateCard';
import styles from './CandidateColumn.module.css';

export default function CandidateColumn({ stage, candidates, onCandidateClick }) {
  const getStageClass = (st) => {
    switch (st) {
      case "Applying Period": return styles.applying;
      case "Screening": return styles.screening;
      case "Interview": return styles.interview;
      case "Test": return styles.test;
      default: return "";
    }
  };

  return (
    <div className={`${styles.column} ${getStageClass(stage)}`}>
      <div className={styles.header}>
        <div className={styles.stageBadge}>
          {stage} <span className={styles.count}>{candidates.length}</span>
        </div>
        <div className={styles.detail}>Detail &gt;</div>
      </div>
      
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div 
            className={`${styles.cardList} ${snapshot.isDraggingOver ? styles.draggingOver : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {candidates.map((candidate, index) => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate} 
                index={index} 
                onCandidateClick={onCandidateClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
