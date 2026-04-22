import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useAppContext } from '../../context/AppContext';
import CandidateColumn from './CandidateColumn';
import styles from './KanbanBoard.module.css';

export default function KanbanBoard({ candidates, setCandidates, onStageChange, onCandidateClick, onDetailClick }) {
  const { stages } = useAppContext();


  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStage = destination.droppableId;
    const oldStage = source.droppableId;
    
    // Optimistic Update
    setCandidates(prev => prev.map(c => 
      c.id === draggableId ? { ...c, stage: newStage } : c
    ));

    // API Call
    try {
      await onStageChange(draggableId, newStage);
    } catch (error) {
      // Revert local state if parent stage change fails
      setCandidates(prev => prev.map(c => 
        c.id === draggableId ? { ...c, stage: oldStage } : c
      ));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.board}>
        {stages.map((stage) => {
          const columnCandidates = candidates.filter(c => c.stage === stage);
          return (
            <CandidateColumn
              key={stage}
              stage={stage}
              candidates={columnCandidates}
              onCandidateClick={onCandidateClick}
              onDetailClick={onDetailClick}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
}
