import React from 'react';
import styles from './Views.module.css';
import { CheckCircle } from 'lucide-react';

export default function ScoreCardView() {
  const criteria = [
    { title: "Technical Skills", weight: "40%", description: "Proficiency in required tech stack and architecture design." },
    { title: "Communication", weight: "20%", description: "Ability to articulate ideas and collaborate." },
    { title: "Culture Fit", weight: "20%", description: "Alignment with company values and team dynamics." },
    { title: "Problem Solving", weight: "20%", description: "Critical thinking and approach to novel challenges." }
  ];

  return (
    <div className={styles.viewContainer}>
      <div className={styles.cardHeader}>
        <h2>Evaluation Score Card Template</h2>
        <button className={styles.primaryBtn}>Edit Score Card</button>
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
          {criteria.map((item, idx) => (
            <tr key={idx}>
              <td><strong>{item.title}</strong></td>
              <td>{item.weight}</td>
              <td style={{color: 'var(--text-secondary)'}}>{item.description}</td>
              <td><CheckCircle size={18} color="var(--color-success)" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
