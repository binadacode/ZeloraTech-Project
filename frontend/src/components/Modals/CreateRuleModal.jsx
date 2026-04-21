import React, { useState } from 'react';
import { X, Mail, Bell, MessageSquare } from 'lucide-react';
import styles from './ScheduleInterviewModal.module.css'; 
import { useAppContext } from '../../context/AppContext';

export default function CreateRuleModal({ isOpen, onClose }) {
  const { addAutomationRule, stages } = useAppContext();
  const [ruleData, setRuleData] = useState({
    description: '',
    triggerStage: stages[0] || 'Applying Period',
    action: 'email'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addAutomationRule(ruleData);
    onClose();
    setRuleData({ description: '', triggerStage: stages[0], action: 'email' });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Create Automation Rule</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            <div className={styles.formGroup}>
              <label>Rule Description</label>
              <input 
                className={styles.input}
                placeholder="e.g. Send welcome email"
                value={ruleData.description}
                onChange={e => setRuleData({...ruleData, description: e.target.value})}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>When candidate reaches stage:</label>
              <select 
                className={styles.select}
                value={ruleData.triggerStage}
                onChange={e => setRuleData({...ruleData, triggerStage: e.target.value})}
              >
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Perform Action:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button 
                  type="button"
                  onClick={() => setRuleData({...ruleData, action: 'email'})}
                  style={{ 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid',
                    borderColor: ruleData.action === 'email' ? 'var(--color-primary)' : 'var(--border-color)',
                    background: ruleData.action === 'email' ? 'var(--color-primary-light)' : 'var(--bg-main)',
                    color: ruleData.action === 'email' ? 'var(--color-primary)' : 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                  }}
                >
                  <Mail size={16} /> Email
                </button>
                <button 
                  type="button"
                  onClick={() => setRuleData({...ruleData, action: 'notify'})}
                  style={{ 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid',
                    borderColor: ruleData.action === 'notify' ? 'var(--color-primary)' : 'var(--border-color)',
                    background: ruleData.action === 'notify' ? 'var(--color-primary-light)' : 'var(--bg-main)',
                    color: ruleData.action === 'notify' ? 'var(--color-primary)' : 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                  }}
                >
                  <Bell size={16} /> Notify
                </button>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>Create Rule</button>
          </div>
        </form>
      </div>
    </div>
  );
}
