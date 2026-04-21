import React from 'react';
import styles from './Views.module.css';

export default function AutomationView() {
  const rules = [
    { title: "Send rejection email", condition: "When candidate is moved to Archiving", active: true },
    { title: "Send assessment link", condition: "When candidate is moved to Screening", active: true },
    { title: "Notify Hiring Manager", condition: "When candidate completes Test", active: false },
    { title: "Send offer letter template", condition: "When candidate is moved to Offered", active: true }
  ];

  return (
    <div className={styles.viewContainer}>
      <div className={styles.cardHeader}>
        <h2>Workflow Rule Automation</h2>
        <button className={styles.primaryBtn}>+ New Rule</button>
      </div>

      <div className={styles.rulesList}>
        {rules.map((rule, idx) => (
          <div key={idx} className={styles.ruleCard}>
            <div className={styles.ruleInfo}>
              <h4>{rule.title}</h4>
              <p>{rule.condition}</p>
            </div>
            <div className={styles.toggleSwitch}>
              <input type="checkbox" checked={rule.active} readOnly />
              <span className={styles.slider}></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
