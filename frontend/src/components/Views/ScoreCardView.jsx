import React, { useState } from 'react';
import styles from './Views.module.css';
import { CheckCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import EditScoreCardModal from '../Modals/EditScoreCardModal';

export default function ScoreCardView() {
  const { scoreCard, scoreCardLoading, currentJob } = useAppContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (scoreCardLoading) {
    return <div className={styles.loading}>Loading Score Card...</div>;
  }

  return (
    <div className={styles.viewContainer}>
      <div className={styles.cardHeader}>
        <h2>Evaluation Score Card Template</h2>
        <button 
          className={styles.primaryBtn}
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit Score Card
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Criteria</th>
            <th>Weight</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {scoreCard.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                No criteria defined for this job.
              </td>
            </tr>
          ) : (
            scoreCard.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.title}</strong></td>
                <td>{item.weight}</td>
                <td style={{color: 'var(--text-secondary)'}}>{item.description}</td>
                <td><StatusBadge active={true} /></td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <EditScoreCardModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        jobId={currentJob?.id}
      />
    </div>
  );
}

function StatusBadge({ active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: active ? 'var(--color-success)' : 'var(--text-secondary)', fontSize: '14px' }}>
      <CheckCircle size={18} />
      <span>{active ? 'Active' : 'Inactive'}</span>
    </div>
  );
}
